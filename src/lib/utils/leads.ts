import type { LeadRecord } from "@/types/leads";

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeText(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return normalizeWhitespace(value);
}

export function normalizeLeadString(value: unknown): string {
  return normalizeText(value);
}

export function normalizeLeadStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .flatMap((entry) => normalizeLeadStringArray(entry))
      .map((entry) => normalizeWhitespace(entry))
      .filter((entry) => entry.length > 0);
  }

  const text = normalizeText(value);

  if (!text) {
    return [];
  }

  if (text.startsWith("[") && text.endsWith("]")) {
    try {
      const parsed = JSON.parse(text);
      return normalizeLeadStringArray(parsed);
    } catch {
      return [text];
    }
  }

  if (text.includes("\n")) {
    return text
      .split(/\r?\n+/)
      .map((entry) => normalizeWhitespace(entry))
      .filter((entry) => entry.length > 0);
  }

  if (text.includes("|")) {
    return text
      .split("|")
      .map((entry) => normalizeWhitespace(entry))
      .filter((entry) => entry.length > 0);
  }

  if (text.includes(",")) {
    return text
      .split(",")
      .map((entry) => normalizeWhitespace(entry))
      .filter((entry) => entry.length > 0);
  }

  return [text];
}

export function normalizeLeadPageHistory(value: unknown): string[] {
  return normalizeLeadStringArray(value);
}

export function normalizeLeadUrl(value: unknown): string {
  const text = normalizeText(value);

  if (!text) {
    return "";
  }

  try {
    return new URL(text).toString();
  } catch {
    return text;
  }
}

export function buildLeadWhatsAppMessage(lead: LeadRecord): string {
  const pageHistory = lead.pageHistory.length > 0 ? lead.pageHistory.join(" -> ") : "N/A";
  const productSummary = lead.selectedProductNames.length > 0
    ? lead.selectedProductNames.join(", ")
    : "N/A";

  return [
    "New Kapten Batik lead received",
    `Lead ID: ${lead.id}`,
    `Form: ${lead.formName || "contact_us"}`,
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone || "N/A"}`,
    `Category: ${lead.enquiryCategory || "N/A"}`,
    `Selected Service: ${lead.selectedService || "N/A"}`,
    `Products: ${productSummary}`,
    `Landing Page: ${lead.landingPage || "N/A"}`,
    `Landing Page Path: ${lead.landingPagePath || "N/A"}`,
    `Current Page: ${lead.pageUrl || "N/A"}`,
    `Current Path: ${lead.pagePath || "N/A"}`,
    `Page History: ${pageHistory}`,
    `Referrer: ${lead.referrer || "N/A"}`,
    `Tracking Session ID: ${lead.trackingSessionId || "N/A"}`,
    `UTM: ${lead.utmSource || "direct"} / ${lead.utmMedium || "none"} / ${lead.utmCampaign || "none"}`,
    `GCLID: ${lead.gclid || "N/A"}`,
    `FBCLID: ${lead.fbclid || "N/A"}`,
    `MSCLKID: ${lead.msclkid || "N/A"}`,
    `TTCLID: ${lead.ttclid || "N/A"}`,
    `Click ID: ${lead.clickId || "N/A"}`,
    "Message:",
    lead.message,
  ].join("\n");
}

export function buildLeadWhatsAppHref(lead: LeadRecord, whatsappPhoneNumber: string | null): string {
  const phoneNumber = whatsappPhoneNumber ?? "";

  if (!phoneNumber) {
    return "";
  }

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(buildLeadWhatsAppMessage(lead))}`;
}
