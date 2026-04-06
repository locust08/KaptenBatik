export type ContactInquiry = {
  email: string;
  fullName: string;
  landingPage: string;
  phone: string;
  sessionId: string;
  message: string;
  submittedAt: string;
  type: string;
  utmCampaign: string;
  utmMedium: string;
  utmSource: string;
};

export const CONTACT_INQUIRY_STORAGE_KEY = "kapten-batik-contact-inquiry";
export const CONTACT_WHATSAPP_PHONE = "60183814392";

export function buildContactWhatsAppHref(inquiry: ContactInquiry) {
  const messageLines = [
    "New Kapten Batik lead received",
    "Form: contact_us",
    `Name: ${inquiry.fullName}`,
    `Email: ${inquiry.email}`,
    `Phone: ${inquiry.phone}`,
    `Inquiry: ${inquiry.type}`,
    `Landing Page: ${inquiry.landingPage}`,
    `UTM: ${inquiry.utmSource} / ${inquiry.utmMedium} / ${inquiry.utmCampaign}`,
    `Tracking Session ID: ${inquiry.sessionId}`,
    "Message:",
    inquiry.message,
  ];

  return `https://wa.me/${CONTACT_WHATSAPP_PHONE}?text=${encodeURIComponent(messageLines.join("\n"))}`;
}
