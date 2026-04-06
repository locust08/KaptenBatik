import type { ServerTrackingEnv } from "@/types/env";
import { readOptionalEnvValue, readRequiredEnvValue } from "@/lib/utils/env";

let cachedServerEnv: ServerTrackingEnv | null = null;

export function getServerTrackingEnv() {
  if (cachedServerEnv) {
    return cachedServerEnv;
  }

  const env: ServerTrackingEnv = {
    ga4MeasurementId: readOptionalEnvValue([
      "NEXT_PUBLIC_GA4_MEASUREMENT_ID",
      "PUBLIC_GA4_MEASUREMENT_ID",
    ]),
    googleOAuthAccessToken: readOptionalEnvValue(["GOOGLE_WORKSPACE_OAUTH_ACCESS_TOKEN"]),
    googleOAuthClientId: readOptionalEnvValue(["GOOGLE_OAUTH_CLIENT_ID"]),
    googleOAuthClientSecret: readOptionalEnvValue(["GOOGLE_OAUTH_CLIENT_SECRET"]),
    gtmId: readOptionalEnvValue([
      "NEXT_PUBLIC_GTM_ID",
      "PUBLIC_GTM_CONTAINER_ID",
      "GTM_CONTAINER_ID",
    ]),
    googleServiceAccountEmail: readOptionalEnvValue(["GOOGLE_SERVICE_ACCOUNT_EMAIL"]),
    googleServiceAccountPrivateKey: readOptionalEnvValue(["GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY"]),
    googleWorkspaceOAuthRefreshToken: readOptionalEnvValue([
      "GOOGLE_WORKSPACE_OAUTH_REFRESH_TOKEN",
      "GOOGLE_OAUTH_REFRESH_TOKEN",
    ]),
    googleSheetsId: readOptionalEnvValue(["GOOGLE_SHEETS_ID"]),
    resendApiKey: readOptionalEnvValue(["RESEND_API_KEY"]),
    resendFromEmailDev: readOptionalEnvValue(["RESEND_FROM_EMAIL_DEV"]),
    resendFromEmailProd: readOptionalEnvValue(["RESEND_FROM_EMAIL_PROD"]),
    resendToEmailDev: readOptionalEnvValue(["RESEND_TO_EMAIL_DEV"]),
    resendToEmailProd: readOptionalEnvValue(["RESEND_TO_EMAIL_PROD"]),
    siteUrl: readFirstServerUrl(),
    supabaseServiceRoleKey: readRequiredEnvValue(["SUPABASE_SERVICE_ROLE_KEY"], "SUPABASE_SERVICE_ROLE_KEY"),
    supabaseUrl: readRequiredEnvValue(["SUPABASE_URL"], "SUPABASE_URL"),
    whatsappPhoneNumber: resolveWhatsAppServerPhoneNumber(),
  };

  cachedServerEnv = env;
  return env;
}

function readFirstServerUrl() {
  return readOptionalEnvValue(["SITE_URL", "NEXT_PUBLIC_SITE_URL"]);
}

function resolveWhatsAppServerPhoneNumber() {
  return readOptionalEnvValue(["NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER", "WHATSAPP_PHONE_NUMBER"]);
}

export function resolveSiteUrl() {
  return getServerTrackingEnv().siteUrl;
}

export function resolveWhatsAppPhoneNumber() {
  return getServerTrackingEnv().whatsappPhoneNumber;
}

export function resolveResendFromEmail() {
  const env = getServerTrackingEnv();
  const candidate = process.env.NODE_ENV === "production" ? env.resendFromEmailProd : env.resendFromEmailDev;
  return candidate || "No-Reply <demo@mail.alphaonlineclass.com>";
}

export function resolveResendToEmail() {
  const env = getServerTrackingEnv();
  const candidate = process.env.NODE_ENV === "production" ? env.resendToEmailProd : env.resendToEmailDev;
  return candidate || "ava@locus-t.com.my";
}

export function resolveGoogleSheetsId() {
  return getServerTrackingEnv().googleSheetsId;
}

export function resolveGoogleServiceAccount() {
  const env = getServerTrackingEnv();
  return {
    email: env.googleServiceAccountEmail,
    privateKey: env.googleServiceAccountPrivateKey,
  };
}

export function resolveGtmId() {
  return getServerTrackingEnv().gtmId;
}

export function resolveGa4MeasurementId() {
  return getServerTrackingEnv().ga4MeasurementId;
}
