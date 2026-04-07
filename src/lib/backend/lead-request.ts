import type { NextRequest } from "next/server";
import { z } from "zod";

import {
  normalizeLeadPageHistory,
  normalizeLeadString,
  normalizeLeadStringArray,
  normalizeLeadUrl,
} from "@/lib/utils/leads";

const leadRequestSchema = z.object({
  clickId: z.string().trim().optional().default(""),
  email: z.string().trim().email(),
  enquiryCategory: z.string().trim().min(1).optional().default(""),
  fbclid: z.string().trim().optional().default(""),
  formName: z.string().trim().min(1).optional().default("contact_us"),
  gclid: z.string().trim().optional().default(""),
  landingPage: z.string().trim().min(1),
  landingPagePath: z.string().trim().optional().default(""),
  message: z.string().trim().min(10),
  msclkid: z.string().trim().optional().default(""),
  name: z.string().trim().min(2),
  pageHistory: z.array(z.string().trim()).default([]),
  pagePath: z.string().trim().optional().default(""),
  pageUrl: z.string().trim().optional().default(""),
  phone: z.string().trim().optional().default(""),
  referrer: z.string().trim().optional().default(""),
  selectedProductIds: z.array(z.string().trim()).default([]),
  selectedProductNames: z.array(z.string().trim()).default([]),
  selectedService: z.string().trim().optional().default(""),
  trackingSessionId: z.string().trim().min(1),
  ttclid: z.string().trim().optional().default(""),
  utmCampaign: z.string().trim().optional().default(""),
  utmContent: z.string().trim().optional().default(""),
  utmMedium: z.string().trim().optional().default(""),
  utmSource: z.string().trim().optional().default(""),
  utmTerm: z.string().trim().optional().default(""),
});

export type LeadRequestBody = z.infer<typeof leadRequestSchema>;

function normalizeFormDataEntries(formData: FormData) {
  const normalized: Record<string, unknown> = {};

  for (const [key, value] of formData.entries()) {
    const current = normalized[key];

    if (current === undefined) {
      normalized[key] = value;
      continue;
    }

    if (Array.isArray(current)) {
      current.push(value);
      continue;
    }

    normalized[key] = [current, value];
  }

  return normalized;
}

function makeFallbackSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function canonicalizeLeadRequest(rawInput: Record<string, unknown>, fallbackUrl = "") {
  const selectedProductIds =
    rawInput.selectedProductIds ?? rawInput.selected_product_ids ?? rawInput.selectedProductId ?? rawInput.selected_product_id;
  const selectedProductNames =
    rawInput.selectedProductNames ?? rawInput.selected_product_names ?? rawInput.selectedProductName ?? rawInput.selected_product_name;
  const enquiryCategory =
    normalizeLeadString(rawInput.enquiryCategory ?? rawInput.enquiry_category ?? rawInput.type) ||
    normalizeLeadString(rawInput.selectedService ?? rawInput.selected_service) ||
    "general";
  const pageUrl = normalizeLeadUrl(rawInput.pageUrl ?? rawInput.page_url) || normalizeLeadUrl(fallbackUrl);
  const trackingSessionId =
    normalizeLeadString(rawInput.trackingSessionId ?? rawInput.tracking_session_id ?? rawInput.sessionId) ||
    normalizeLeadString(rawInput.sessionId) ||
    makeFallbackSessionId();
  const fallbackLandingPage = normalizeLeadUrl(fallbackUrl);

  return {
    clickId: normalizeLeadString(rawInput.clickId ?? rawInput.click_id),
    email: normalizeLeadString(rawInput.email),
    enquiryCategory,
    fbclid: normalizeLeadString(rawInput.fbclid),
    formName: normalizeLeadString(rawInput.formName ?? rawInput.form_name) || "contact_us",
    gclid: normalizeLeadString(rawInput.gclid),
    landingPage:
      normalizeLeadUrl(rawInput.landingPage ?? rawInput.landing_page ?? rawInput.page_url ?? rawInput.pageUrl) ||
      pageUrl ||
      fallbackLandingPage,
    landingPagePath: normalizeLeadString(rawInput.landingPagePath ?? rawInput.landing_page_path),
    message: normalizeLeadString(rawInput.message),
    msclkid: normalizeLeadString(rawInput.msclkid),
    name: normalizeLeadString(rawInput.name ?? rawInput.fullName),
    pageHistory: normalizeLeadPageHistory(rawInput.pageHistory ?? rawInput.page_history),
    pagePath: normalizeLeadString(rawInput.pagePath ?? rawInput.page_path),
    pageUrl: normalizeLeadUrl(rawInput.pageUrl ?? rawInput.page_url),
    phone: normalizeLeadString(rawInput.phone),
    referrer: normalizeLeadString(rawInput.referrer),
    selectedProductIds: normalizeLeadStringArray(selectedProductIds),
    selectedProductNames: normalizeLeadStringArray(selectedProductNames),
    selectedService: normalizeLeadString(rawInput.selectedService ?? rawInput.selected_service),
    trackingSessionId,
    ttclid: normalizeLeadString(rawInput.ttclid),
    utmCampaign: normalizeLeadString(rawInput.utmCampaign ?? rawInput.utm_campaign),
    utmContent: normalizeLeadString(rawInput.utmContent ?? rawInput.utm_content),
    utmMedium: normalizeLeadString(rawInput.utmMedium ?? rawInput.utm_medium),
    utmSource: normalizeLeadString(rawInput.utmSource ?? rawInput.utm_source),
    utmTerm: normalizeLeadString(rawInput.utmTerm ?? rawInput.utm_term),
  };
}

export async function readLeadRequestBody(request: NextRequest): Promise<LeadRequestBody> {
  const contentType = request.headers.get("content-type") ?? "";

  const rawInput =
    contentType.includes("application/json")
      ? await request.json()
      : normalizeFormDataEntries(await request.formData());

  return leadRequestSchema.parse(
    canonicalizeLeadRequest(rawInput as Record<string, unknown>, request.headers.get("referer") ?? request.url),
  );
}

export function readLeadRequestMeta(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "";

  return {
    ipAddress: forwardedFor.split(",")[0]?.trim() ?? "",
    userAgent: request.headers.get("user-agent") ?? "",
  };
}
