import type { PublicTrackingEnv } from "@/types/env";
import { readOptionalEnvValue } from "@/lib/utils/env";

let cachedPublicEnv: PublicTrackingEnv | null = null;

export function getPublicTrackingEnv() {
  if (cachedPublicEnv) {
    return cachedPublicEnv;
  }

  const env: PublicTrackingEnv = {
    ga4MeasurementId: readOptionalEnvValue([
      "NEXT_PUBLIC_GA4_MEASUREMENT_ID",
      "PUBLIC_GA4_MEASUREMENT_ID",
    ]),
    gtmId: readOptionalEnvValue([
      "NEXT_PUBLIC_GTM_ID",
      "PUBLIC_GTM_CONTAINER_ID",
      "GTM_CONTAINER_ID",
    ]),
    siteUrl: readOptionalEnvValue(["NEXT_PUBLIC_SITE_URL"]),
    supabasePublishableKey: readOptionalEnvValue(["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"]),
    supabaseUrl: readOptionalEnvValue(["NEXT_PUBLIC_SUPABASE_URL"]),
    whatsappPhoneNumber: readOptionalEnvValue([
      "NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER",
      "WHATSAPP_PHONE_NUMBER",
    ]),
  };

  cachedPublicEnv = env;
  return env;
}

export function resolveWhatsAppPhoneNumber() {
  return getPublicTrackingEnv().whatsappPhoneNumber;
}

export function resolveGtmId() {
  return getPublicTrackingEnv().gtmId;
}

export function resolveGa4MeasurementId() {
  return getPublicTrackingEnv().ga4MeasurementId;
}
