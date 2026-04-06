import { google } from "googleapis";

import { getServerTrackingEnv, resolveGoogleServiceAccount } from "@/lib/tracking/server-env";
import { normalizeLeadPageHistory } from "@/lib/utils/leads";
import type { LeadDatabaseRow, LeadGoogleSheetsSyncStatus, LeadRecord } from "@/types/leads";

const DEFAULT_LEADS_SHEET_ID = "13ihBhitA3yUc5I_IC9Bi58AxLaY88LRLOjnxH6AAQJQ";
const LEADS_SHEET_TAB_NAME = "leads_kaptenbatik";
const LEADS_SHEET_HEADERS: Array<keyof LeadDatabaseRow> = [
  "id",
  "created_at",
  "name",
  "phone",
  "email",
  "message",
  "form_name",
  "enquiry_category",
  "selected_service",
  "selected_product_ids",
  "selected_product_names",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
  "msclkid",
  "ttclid",
  "click_id",
  "tracking_session_id",
  "landing_page_url",
  "landing_page_path",
  "page_url",
  "page_path",
  "page_history",
  "referrer",
  "user_agent",
  "sheet_synced",
  "email_sent",
  "whatsapp_redirected",
];

type GoogleSheetsClient = ReturnType<typeof google.sheets>;

function resolveLeadsSpreadsheetId() {
  return getServerTrackingEnv().googleSheetsId?.trim() || DEFAULT_LEADS_SHEET_ID;
}

function createGoogleAuthClient() {
  const env = getServerTrackingEnv();
  const { email, privateKey } = resolveGoogleServiceAccount();
  const spreadsheetId = resolveLeadsSpreadsheetId();

  if (email && privateKey && spreadsheetId) {
    return new google.auth.JWT({
      email,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
  }

  if (!env.googleOAuthClientId || !env.googleOAuthClientSecret || !spreadsheetId) {
    return null;
  }

  const oauth2Client = new google.auth.OAuth2(
    env.googleOAuthClientId,
    env.googleOAuthClientSecret,
    "urn:ietf:wg:oauth:2.0:oob",
  );

  oauth2Client.setCredentials({
    access_token: env.googleOAuthAccessToken ?? undefined,
    refresh_token: env.googleWorkspaceOAuthRefreshToken ?? undefined,
    scope: ["https://www.googleapis.com/auth/spreadsheets"].join(" "),
  });

  return oauth2Client;
}

function createGoogleSheetsClient(): GoogleSheetsClient | null {
  const auth = createGoogleAuthClient();

  if (!auth) {
    return null;
  }

  return google.sheets({ auth, version: "v4" });
}

function serializeLeadValue(value: unknown) {
  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

export function mapLeadRecordToGoogleSheetRow(lead: LeadRecord): Array<string | boolean> {
  const row: LeadDatabaseRow = {
    click_id: lead.clickId,
    created_at: lead.createdAt,
    email: lead.email,
    email_sent: false,
    enquiry_category: lead.enquiryCategory,
    fbclid: lead.fbclid,
    form_name: lead.formName,
    gclid: lead.gclid,
    id: lead.id,
    ip_address: lead.ipAddress,
    landing_page_path: lead.landingPagePath,
    landing_page_url: lead.landingPage,
    message: lead.message,
    msclkid: lead.msclkid,
    name: lead.name,
    page_history: normalizeLeadPageHistory(lead.pageHistory),
    page_path: lead.pagePath,
    page_url: lead.pageUrl,
    phone: lead.phone,
    raw_payload: lead.rawPayload,
    referrer: lead.referrer,
    selected_product_ids: [...lead.selectedProductIds],
    selected_product_names: [...lead.selectedProductNames],
    selected_service: lead.selectedService,
    sheet_synced: true,
    tracking_session_id: lead.trackingSessionId,
    ttclid: lead.ttclid,
    user_agent: lead.userAgent,
    utm_campaign: lead.utmCampaign,
    utm_content: lead.utmContent,
    utm_medium: lead.utmMedium,
    utm_source: lead.utmSource,
    utm_term: lead.utmTerm,
    whatsapp_redirected: false,
  };

  return LEADS_SHEET_HEADERS.map((header) => serializeLeadValue(row[header]));
}

async function ensureLeadsSheetTab(sheets: GoogleSheetsClient) {
  const spreadsheetId = resolveLeadsSpreadsheetId();
  const spreadsheet = await sheets.spreadsheets.get({
    fields: "sheets.properties(sheetId,title)",
    spreadsheetId,
  });

  const existingSheet = spreadsheet.data.sheets?.find((sheet) => sheet.properties?.title === LEADS_SHEET_TAB_NAME);

  if (!existingSheet) {
    await sheets.spreadsheets.batchUpdate({
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: LEADS_SHEET_TAB_NAME,
              },
            },
          },
        ],
      },
      spreadsheetId,
    });

    return { tabCreated: true };
  }

  return { tabCreated: false };
}

async function ensureLeadsSheetHeaders(sheets: GoogleSheetsClient) {
  const spreadsheetId = resolveLeadsSpreadsheetId();
  const existingHeader = await sheets.spreadsheets.values.get({
    majorDimension: "ROWS",
    range: `${LEADS_SHEET_TAB_NAME}!1:1`,
    spreadsheetId,
  });

  const currentHeaders = (existingHeader.data.values?.[0] ?? []).map((value) => String(value ?? "").trim());
  const expectedHeaders = [...LEADS_SHEET_HEADERS];
  const headersNeedWrite =
    currentHeaders.length !== expectedHeaders.length ||
    expectedHeaders.some((header, index) => currentHeaders[index] !== header);

  if (headersNeedWrite) {
    await sheets.spreadsheets.values.update({
      range: `${LEADS_SHEET_TAB_NAME}!A1:AF1`,
      requestBody: {
        values: [expectedHeaders],
      },
      spreadsheetId,
      valueInputOption: "RAW",
    });

    return { headersCreated: true };
  }

  return { headersCreated: false };
}

async function findLeadSheetRowNumber(sheets: GoogleSheetsClient, leadId: string) {
  const spreadsheetId = resolveLeadsSpreadsheetId();
  const response = await sheets.spreadsheets.values.get({
    majorDimension: "ROWS",
    range: `${LEADS_SHEET_TAB_NAME}!A2:A`,
    spreadsheetId,
  });

  const rows = response.data.values ?? [];

  for (let index = 0; index < rows.length; index += 1) {
    if (String(rows[index]?.[0] ?? "") === leadId) {
      return index + 2;
    }
  }

  return null;
}

async function appendLeadSheetRow(sheets: GoogleSheetsClient, row: Array<string | boolean>) {
  const spreadsheetId = resolveLeadsSpreadsheetId();

  await sheets.spreadsheets.values.append({
    insertDataOption: "INSERT_ROWS",
    range: `${LEADS_SHEET_TAB_NAME}!A:AF`,
    requestBody: {
      values: [row],
    },
    spreadsheetId,
    valueInputOption: "RAW",
  });
}

async function updateLeadSheetRow(sheets: GoogleSheetsClient, rowNumber: number, row: Array<string | boolean>) {
  const spreadsheetId = resolveLeadsSpreadsheetId();

  await sheets.spreadsheets.values.update({
    range: `${LEADS_SHEET_TAB_NAME}!A${rowNumber}:AF${rowNumber}`,
    requestBody: {
      values: [row],
    },
    spreadsheetId,
    valueInputOption: "RAW",
  });
}

export async function syncLeadRecordToGoogleSheet(lead: LeadRecord): Promise<LeadGoogleSheetsSyncStatus> {
  const sheets = createGoogleSheetsClient();

  if (!sheets) {
    return {
      attempted: false,
      headersCreated: false,
      rowMode: "skipped",
      rowNumber: null,
      synced: false,
      tabCreated: false,
      warnings: ["Google Sheets sync is not configured."],
    };
  }

  const warnings: string[] = [];
  const row = mapLeadRecordToGoogleSheetRow(lead);

  try {
    const tabResult = await ensureLeadsSheetTab(sheets);
    const headerResult = await ensureLeadsSheetHeaders(sheets);
    const existingRowNumber = await findLeadSheetRowNumber(sheets, lead.id);

    if (existingRowNumber) {
      await updateLeadSheetRow(sheets, existingRowNumber, row);
      return {
        attempted: true,
        headersCreated: headerResult.headersCreated,
        rowMode: "upsert",
        rowNumber: existingRowNumber,
        synced: true,
        tabCreated: tabResult.tabCreated,
        warnings,
      };
    }

    await appendLeadSheetRow(sheets, row);

    return {
      attempted: true,
      headersCreated: headerResult.headersCreated,
      rowMode: "append",
      rowNumber: null,
      synced: true,
      tabCreated: tabResult.tabCreated,
      warnings,
    };
  } catch (error) {
    warnings.push(error instanceof Error ? error.message : "Google Sheets sync failed.");

    return {
      attempted: true,
      headersCreated: false,
      rowMode: "skipped",
      rowNumber: null,
      synced: false,
      tabCreated: false,
      warnings,
    };
  }
}

export async function provisionLeadGoogleSheet() {
  const sheets = createGoogleSheetsClient();

  if (!sheets) {
    return {
      headersCreated: false,
      tabCreated: false,
    };
  }

  const tabResult = await ensureLeadsSheetTab(sheets);
  const headerResult = await ensureLeadsSheetHeaders(sheets);

  return {
    headersCreated: headerResult.headersCreated,
    tabCreated: tabResult.tabCreated,
  };
}
