import type { ContactInquiryRecord } from "@/types/contact-automation";
import { resolveWhatsAppPhoneNumber } from "@/lib/tracking/public-env";

export function buildContactWhatsAppMessage(inquiry: ContactInquiryRecord) {
  const pageHistory = (() => {
    try {
      const parsed = JSON.parse(inquiry.pageHistory) as unknown;
      return Array.isArray(parsed) ? parsed.filter((entry): entry is string => typeof entry === "string") : [];
    } catch {
      return [];
    }
  })();

  return [
    "New Kapten Batik inquiry received",
    `Lead ID: ${inquiry.id}`,
    "Form: contact_us",
    `Name: ${inquiry.fullName}`,
    `Email: ${inquiry.email}`,
    `Phone: ${inquiry.phone || "N/A"}`,
    `Inquiry: ${inquiry.type}`,
    `Landing Page: ${inquiry.landingPage}`,
    `Landing Page Path: ${inquiry.landingPagePath || "N/A"}`,
    `Current Page: ${inquiry.pageUrl || "N/A"}`,
    `Current Path: ${inquiry.pagePath || "N/A"}`,
    `Page History: ${pageHistory.length > 0 ? pageHistory.join(" -> ") : "N/A"}`,
    `Referrer: ${inquiry.referrer || "N/A"}`,
    `Tracking Session ID: ${inquiry.trackingSessionId || inquiry.sessionId}`,
    `UTM: ${inquiry.utmSource || "direct"} / ${inquiry.utmMedium || "none"} / ${
      inquiry.utmCampaign || "none"
    }`,
    `GCLID: ${inquiry.gclid || "N/A"}`,
    `FBCLID: ${inquiry.fbclid || "N/A"}`,
    `MSCLKID: ${inquiry.msclkid || "N/A"}`,
    `TTCLID: ${inquiry.ttclid || "N/A"}`,
    `Click ID: ${inquiry.clickId || "N/A"}`,
    "Message:",
    inquiry.message,
  ].join("\n");
}

export function buildContactWhatsAppHref(
  inquiry: ContactInquiryRecord,
  whatsappPhone = resolveWhatsAppPhoneNumber(),
) {
  const phoneNumber = whatsappPhone ?? "";
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(buildContactWhatsAppMessage(inquiry))}`;
}

export function getContactWhatsAppPhoneNumber() {
  return resolveWhatsAppPhoneNumber() ?? "";
}
