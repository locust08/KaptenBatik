const assert = require("node:assert/strict");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const { test } = require("node:test");

const projectRoot = path.resolve(__dirname, "..");
const srcRoot = path.join(projectRoot, "src");

const originalResolveFilename = Module._resolveFilename;
const originalExtensions = {
  ".ts": Module._extensions[".ts"],
  ".tsx": Module._extensions[".tsx"],
};
const originalLoad = Module._load;

const mockModules = new Map();

function resolveSourceFile(basePath) {
  const candidates = [
    `${basePath}.ts`,
    `${basePath}.tsx`,
    path.join(basePath, "index.ts"),
    path.join(basePath, "index.tsx"),
  ];

  for (const candidate of candidates) {
    if (require("node:fs").existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

Module._resolveFilename = function patchedResolveFilename(request, parent, isMain, options) {
  if (request.startsWith("@/")) {
    const resolved = resolveSourceFile(path.join(srcRoot, request.slice(2)));
    if (resolved) {
      return resolved;
    }
  }

  return originalResolveFilename.call(this, request, parent, isMain, options);
};

function transpileTs(module, filename) {
  const source = require("node:fs").readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      moduleResolution: ts.ModuleResolutionKind.Node10,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: filename,
    reportDiagnostics: false,
  });

  module._compile(output.outputText, filename);
}

Module._extensions[".ts"] = transpileTs;
Module._extensions[".tsx"] = transpileTs;

Module._load = function patchedLoad(request, parent, isMain) {
  const resolved = Module._resolveFilename(request, parent, isMain);
  if (mockModules.has(resolved)) {
    return mockModules.get(resolved);
  }

  return originalLoad.call(this, request, parent, isMain);
};

function setMock(relativeSourcePath, exports) {
  mockModules.set(path.join(srcRoot, relativeSourcePath), exports);
}

function resetMock(relativeSourcePath) {
  mockModules.delete(path.join(srcRoot, relativeSourcePath));
}

function baseServerEnv(overrides = {}) {
  return {
    ga4MeasurementId: null,
    googleOAuthAccessToken: null,
    googleOAuthClientId: null,
    googleOAuthClientSecret: null,
    gtmId: null,
    googleServiceAccountEmail: null,
    googleServiceAccountPrivateKey: null,
    googleWorkspaceOAuthRefreshToken: null,
    googleSheetsId: null,
    resendApiKey: null,
    resendFromEmailDev: null,
    resendFromEmailProd: null,
    resendToEmailDev: null,
    resendToEmailProd: null,
    siteUrl: "http://localhost:3000",
    supabaseServiceRoleKey: "supabase-service-role-key",
    supabaseUrl: "http://supabase.local",
    whatsappPhoneNumber: "01161745814",
    ...overrides,
  };
}

test("lead request parsing fills missing tracking state", async () => {
  const { readLeadRequestBody } = require(path.join(srcRoot, "lib/backend/lead-request.ts"));

  const request = new Request("http://localhost:3000/contact-us", {
    body: JSON.stringify({
      email: "julian@example.com",
      fullName: "Julian Tan",
      message: "Hello, I would like help with my inquiry.",
      type: "Personal Styling",
    }),
    headers: {
      "content-type": "application/json",
      referer: "http://localhost:3000/contact-us",
    },
    method: "POST",
  });

  const parsed = await readLeadRequestBody(request);

  assert.equal(parsed.email, "julian@example.com");
  assert.equal(parsed.formName, "contact_us");
  assert.equal(parsed.landingPage, "http://localhost:3000/contact-us");
  assert.equal(parsed.pageUrl, "");
  assert.equal(parsed.pagePath, "");
  assert.equal(parsed.name, "Julian Tan");
  assert.equal(parsed.trackingSessionId.length > 0, true);
  assert.equal(parsed.enquiryCategory, "Personal Styling");
});

test("lead workflow saves, syncs, emails, and prepares WhatsApp redirect", async () => {
  const updateLeadSyncFlagsCalls = [];

  setMock("lib/supabase/leads.ts", {
    insertLeadRecord: async (lead) => ({
      error: null,
      inserted: {
        createdAt: lead.createdAt,
        id: "lead-123",
      },
    }),
    updateLeadSyncFlags: async (leadId, flags) => {
      updateLeadSyncFlagsCalls.push({ flags, leadId });
      return { error: null };
    },
  });

  setMock("lib/sheets/leads.ts", {
    syncLeadRecordToGoogleSheet: async () => ({
      attempted: true,
      headersCreated: true,
      rowMode: "append",
      rowNumber: 7,
      synced: true,
      tabCreated: false,
      warnings: [],
    }),
  });

  setMock("lib/email/leads.ts", {
    sendLeadAdminEmail: async () => ({
      attempted: true,
      configured: true,
      sent: true,
      warnings: [],
    }),
  });

  setMock("lib/whatsapp/leads.ts", {
    resolveLeadWhatsAppContext: () => ({
      message: "prefilled whatsapp message",
      ready: true,
      url: "https://wa.me/01161745814?text=prefilled%20whatsapp%20message",
    }),
  });

  setMock("lib/tracking/server-env.ts", {
    getServerTrackingEnv: () => baseServerEnv(),
  });

  const { processLeadSubmission } = require(path.join(srcRoot, "lib/backend/lead-workflow.ts"));

  const result = await processLeadSubmission(
    {
      clickId: "",
      email: "julian@example.com",
      enquiryCategory: "Personal Styling",
      fbclid: "",
      formName: "contact_us",
      gclid: "",
      landingPage: "http://localhost:3000/contact-us",
      landingPagePath: "/contact-us",
      message: "Hello, I would like help with my inquiry.",
      msclkid: "",
      name: "Julian Tan",
      pageHistory: ["http://localhost:3000/"],
      pagePath: "/contact-us",
      pageUrl: "http://localhost:3000/contact-us",
      phone: "0123456789",
      referrer: "http://localhost:3000/",
      selectedProductIds: [],
      selectedProductNames: [],
      selectedService: "",
      trackingSessionId: "session-123",
      ttclid: "",
      utmCampaign: "",
      utmContent: "",
      utmMedium: "",
      utmSource: "",
      utmTerm: "",
    },
    {
      ipAddress: "127.0.0.1",
      userAgent: "node-test",
    },
  );

  assert.equal(result.success, true);
  assert.equal(result.leadSaved, true);
  assert.equal(result.sheetSynced, true);
  assert.equal(result.emailSent, true);
  assert.equal(result.emailConfigured, true);
  assert.equal(result.whatsappRedirectReady, true);
  assert.equal(result.whatsappUrl, "https://wa.me/01161745814?text=prefilled%20whatsapp%20message");
  assert.equal(result.leadId, "lead-123");
  assert.deepEqual(updateLeadSyncFlagsCalls, [
    { leadId: "lead-123", flags: { sheetSynced: true } },
    { leadId: "lead-123", flags: { emailSent: true } },
  ]);
});

test("email fallback resolves to Ava when resend recipients are unset", () => {
  resetMock("lib/tracking/server-env.ts");

  const snapshot = {
    NODE_ENV: process.env.NODE_ENV,
    RESEND_TO_EMAIL_DEV: process.env.RESEND_TO_EMAIL_DEV,
    RESEND_TO_EMAIL_PROD: process.env.RESEND_TO_EMAIL_PROD,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_URL: process.env.SUPABASE_URL,
  };

  try {
    process.env.NODE_ENV = "development";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "supabase-service-role-key";
    process.env.SUPABASE_URL = "http://supabase.local";
    delete process.env.RESEND_TO_EMAIL_DEV;
    delete process.env.RESEND_TO_EMAIL_PROD;

    delete require.cache[path.join(srcRoot, "lib/tracking/server-env.ts")];
    const { resolveResendToEmail } = require(path.join(srcRoot, "lib/tracking/server-env.ts"));

    assert.equal(resolveResendToEmail(), "ava@locus-t.com.my");
  } finally {
    if (snapshot.NODE_ENV === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = snapshot.NODE_ENV;
    }

    if (snapshot.RESEND_TO_EMAIL_DEV === undefined) {
      delete process.env.RESEND_TO_EMAIL_DEV;
    } else {
      process.env.RESEND_TO_EMAIL_DEV = snapshot.RESEND_TO_EMAIL_DEV;
    }

    if (snapshot.RESEND_TO_EMAIL_PROD === undefined) {
      delete process.env.RESEND_TO_EMAIL_PROD;
    } else {
      process.env.RESEND_TO_EMAIL_PROD = snapshot.RESEND_TO_EMAIL_PROD;
    }

    if (snapshot.SUPABASE_SERVICE_ROLE_KEY === undefined) {
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    } else {
      process.env.SUPABASE_SERVICE_ROLE_KEY = snapshot.SUPABASE_SERVICE_ROLE_KEY;
    }

    if (snapshot.SUPABASE_URL === undefined) {
      delete process.env.SUPABASE_URL;
    } else {
      process.env.SUPABASE_URL = snapshot.SUPABASE_URL;
    }

    delete require.cache[path.join(srcRoot, "lib/tracking/server-env.ts")];
  }
});

process.on("exit", () => {
  Module._resolveFilename = originalResolveFilename;
  Module._extensions[".ts"] = originalExtensions[".ts"];
  Module._extensions[".tsx"] = originalExtensions[".tsx"];
  Module._load = originalLoad;
  mockModules.clear();
});
