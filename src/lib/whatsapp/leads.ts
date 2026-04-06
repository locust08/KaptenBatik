import { resolveWhatsAppPhoneNumber } from "@/lib/tracking/server-env";
import type { LeadRecord } from "@/types/leads";

function normalizePhoneNumber(value: string | null | undefined) {
  return (value ?? "").replace(/[^\d]/g, "");
}

function compactText(value: string | null | undefined) {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function formatProductContext(lead: LeadRecord) {
  if (lead.selectedService.trim().length > 0) {
    return lead.selectedService.trim();
  }

  if (lead.selectedProductNames.length > 0) {
    return lead.selectedProductNames.join(", ");
  }

  if (lead.selectedProductIds.length > 0) {
    return lead.selectedProductIds.join(", ");
  }

  return "General enquiry";
}

export function buildLeadWhatsAppMessage(lead: LeadRecord) {
  const sourceContext = compactText(
    [lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(" / "),
  );
  const optionalSourceContext = [
    lead.pagePath ? `Page: ${lead.pagePath}` : "",
    lead.referrer ? `Referrer: ${lead.referrer}` : "",
    lead.trackingSessionId ? `Tracking Session: ${lead.trackingSessionId}` : "",
    sourceContext ? `UTM: ${sourceContext}` : "",
  ]
    .filter((entry) => entry.trim().length > 0)
    .join("\n");

  return [
    "New Kapten Batik lead received",
    `Name: ${lead.name}`,
    `Enquiry Category: ${lead.enquiryCategory || "General"}`,
    `Context: ${formatProductContext(lead)}`,
    optionalSourceContext,
  ]
    .filter((line) => line.trim().length > 0)
    .join("\n");
}

export function buildLeadWhatsAppUrl(lead: LeadRecord, phoneNumber = resolveWhatsAppPhoneNumber()) {
  const normalizedPhone = normalizePhoneNumber(phoneNumber);
  if (!normalizedPhone) {
    return "";
  }

  const message = buildLeadWhatsAppMessage(lead);
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}

export function resolveLeadWhatsAppContext(lead: LeadRecord) {
  const message = buildLeadWhatsAppMessage(lead);
  const url = buildLeadWhatsAppUrl(lead);

  return {
    message,
    url,
    ready: url.length > 0,
  };
}
