import { google } from "googleapis";

const PROJECT_NAME = "KaptenBatik";
const GTM_ACCOUNT_ID = "6346744109";
const GA4_ACCOUNT_ID = "389036374";
const DEFAULT_TIME_ZONE = "Asia/Kuala_Lumpur";
const DEFAULT_CURRENCY = "MYR";
const REQUIRED_ANALYTICS_SCOPE = "https://www.googleapis.com/auth/analytics.edit";
const REQUIRED_GTM_SCOPE = "https://www.googleapis.com/auth/tagmanager.edit.containers";

function readEnv(names, fallback = "") {
  for (const name of names) {
    const value = process.env[name];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return fallback;
}

function requireEnv(names, label) {
  const value = readEnv(names);
  if (!value) {
    throw new Error(`Missing required environment variable: ${label}`);
  }

  return value;
}

function buildOAuthClient() {
  const clientId = requireEnv(["GOOGLE_OAUTH_CLIENT_ID"], "GOOGLE_OAUTH_CLIENT_ID");
  const clientSecret = requireEnv(["GOOGLE_OAUTH_CLIENT_SECRET"], "GOOGLE_OAUTH_CLIENT_SECRET");
  const refreshToken = readEnv(["GOOGLE_WORKSPACE_OAUTH_REFRESH_TOKEN", "GOOGLE_OAUTH_REFRESH_TOKEN"]);
  const accessToken = readEnv(["GOOGLE_WORKSPACE_OAUTH_ACCESS_TOKEN"]);

  if (!refreshToken && !accessToken) {
    throw new Error(
      "Missing Google OAuth credentials. Set GOOGLE_WORKSPACE_OAUTH_REFRESH_TOKEN or GOOGLE_OAUTH_REFRESH_TOKEN, or provide GOOGLE_WORKSPACE_OAUTH_ACCESS_TOKEN.",
    );
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, "urn:ietf:wg:oauth:2.0:oob");
  oauth2Client.setCredentials({
    access_token: accessToken || undefined,
    refresh_token: refreshToken || undefined,
    scope: [REQUIRED_ANALYTICS_SCOPE, REQUIRED_GTM_SCOPE].join(" "),
  });

  return oauth2Client;
}

async function createGtmContainer(auth) {
  const tagmanager = google.tagmanager({ auth, version: "v2" });
  const parent = `accounts/${GTM_ACCOUNT_ID}`;
  const listed = await tagmanager.accounts.containers.list({ parent });
  const existing = listed.data.container?.find((container) => container.name === PROJECT_NAME);

  if (existing) {
    return existing;
  }

  const response = await tagmanager.accounts.containers.create({
    parent,
    requestBody: {
      name: PROJECT_NAME,
      usageContext: ["web"],
    },
  });

  return response.data;
}

async function createGa4Property(auth) {
  const analyticsadmin = google.analyticsadmin({ auth, version: "v1beta" });
  const listed = await analyticsadmin.properties.list({
    filter: `parent:accounts/${GA4_ACCOUNT_ID}`,
  });
  const existing = listed.data.properties?.find((property) => property.displayName === PROJECT_NAME);

  if (existing) {
    return existing;
  }

  const response = await analyticsadmin.properties.create({
    requestBody: {
      currencyCode: DEFAULT_CURRENCY,
      displayName: PROJECT_NAME,
      parent: `accounts/${GA4_ACCOUNT_ID}`,
      timeZone: DEFAULT_TIME_ZONE,
    },
  });

  return response.data;
}

async function createGa4WebStream(auth, propertyName, siteUrl) {
  const analyticsadmin = google.analyticsadmin({ auth, version: "v1beta" });
  const listed = await analyticsadmin.properties.dataStreams.list({
    parent: propertyName,
  });
  const existing = listed.data.dataStreams?.find((stream) => stream.displayName === `${PROJECT_NAME} Web Stream`);

  if (existing) {
    return existing;
  }

  const response = await analyticsadmin.properties.dataStreams.create({
    parent: propertyName,
    requestBody: {
      displayName: `${PROJECT_NAME} Web Stream`,
      type: "WEB_DATA_STREAM",
      webStreamData: {
        defaultUri: siteUrl,
      },
    },
  });

  return response.data;
}

function getPropertyId(propertyName) {
  return propertyName?.split("/")?.at(-1) ?? "";
}

async function main() {
  const siteUrl = readEnv(["SITE_URL", "NEXT_PUBLIC_SITE_URL"], "http://localhost:3000");
  const auth = buildOAuthClient();

  console.log(`Ensuring GTM container for ${PROJECT_NAME} under account ${GTM_ACCOUNT_ID}...`);
  const container = await createGtmContainer(auth);

  console.log(`Ensuring GA4 property for ${PROJECT_NAME} under account ${GA4_ACCOUNT_ID}...`);
  const property = await createGa4Property(auth);

  console.log(`Ensuring GA4 web stream for ${PROJECT_NAME}...`);
  const stream = await createGa4WebStream(auth, property.name, siteUrl);

  const gtmContainerId = container.publicId || "";
  const ga4PropertyId = getPropertyId(property.name);
  const ga4MeasurementId = stream.measurementId || stream.webStreamData?.measurementId || "";

  console.log(JSON.stringify({
    ga4MeasurementId,
    ga4PropertyId,
    gtmContainerId,
    propertyName: property.name,
    streamName: stream.name,
    siteUrl,
  }, null, 2));

  console.log("\nRecommended Doppler updates:");
  console.log(`- GTM container: PUBLIC_GTM_CONTAINER_ID=${gtmContainerId}`);
  console.log(`- GTM container: NEXT_PUBLIC_GTM_ID=${gtmContainerId}`);
  console.log(`- GA4 property: GA4_PROPERTY_ID=${ga4PropertyId}`);
  console.log(`- GA4 measurement: PUBLIC_GA4_MEASUREMENT_ID=${ga4MeasurementId}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
