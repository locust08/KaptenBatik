import { Resend } from "resend";

import { renderKaptenBatikAdminEmail } from "@/lib/email/brand-template";
import { escapeHtml } from "@/lib/utils/html";
import { getServerTrackingEnv, resolveResendFromEmail, resolveResendToEmail } from "@/lib/tracking/server-env";
import type { ContactInquiryRecord } from "@/types/contact-automation";

let resendClient: Resend | null = null;

function getResendClient() {
  const config = getServerTrackingEnv();

  if (!config.resendApiKey || !resolveResendFromEmail() || !resolveResendToEmail()) {
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(config.resendApiKey);
  }

  return resendClient;
}

export async function sendAdminContactInquiryEmail(inquiry: ContactInquiryRecord) {
  const config = getServerTrackingEnv();
  const client = getResendClient();
  const from = resolveResendFromEmail();
  const to = resolveResendToEmail();

  if (!client || !from || !to) {
    return { skipped: true as const };
  }

  await client.emails.send({
    from,
    replyTo: inquiry.email,
    subject: `Kapten Batik contact inquiry from ${inquiry.fullName}`,
    text: [
      "A new Kapten Batik contact inquiry has been submitted.",
      `Lead ID: ${inquiry.id}`,
      `Name: ${inquiry.fullName}`,
      `Email: ${inquiry.email}`,
      `Phone: ${inquiry.phone || "N/A"}`,
      `Inquiry: ${inquiry.type}`,
      `Landing Page: ${inquiry.landingPage}`,
      `Referrer: ${inquiry.referrer || "N/A"}`,
      `Session ID: ${inquiry.sessionId}`,
      `UTM: ${inquiry.utmSource || "direct"} / ${inquiry.utmMedium || "none"} / ${
        inquiry.utmCampaign || "none"
      }`,
      `Submitted At: ${inquiry.submittedAt}`,
      "",
      "Message:",
      inquiry.message,
    ].join("\n"),
    to,
    html: renderKaptenBatikAdminEmail({
      badge: "Contact Inquiry",
      intro: "A new inquiry came in through the Kapten Batik contact page. The message below is ready for follow-up.",
      message: escapeHtml(inquiry.message),
      sections: [
        {
          rows: [
            { label: "Lead ID", value: escapeHtml(inquiry.id) },
            { label: "Name", value: escapeHtml(inquiry.fullName) },
            { label: "Email", value: escapeHtml(inquiry.email) },
            { label: "Phone", value: escapeHtml(inquiry.phone || "N/A") },
            { label: "Inquiry Type", value: escapeHtml(inquiry.type) },
            { label: "Submitted At", value: escapeHtml(inquiry.submittedAt) },
          ],
          title: "Customer Details",
        },
        {
          rows: [
            { label: "Landing Page", value: escapeHtml(inquiry.landingPage) },
            { label: "Referrer", value: escapeHtml(inquiry.referrer || "N/A") },
            { label: "Session ID", value: escapeHtml(inquiry.sessionId) },
            { label: "UTM", value: escapeHtml(`${inquiry.utmSource || "direct"} / ${inquiry.utmMedium || "none"} / ${inquiry.utmCampaign || "none"}`) },
          ],
          title: "Journey Context",
        },
      ],
      summary: [
        { label: "From", value: escapeHtml(inquiry.fullName) },
        { label: "Inquiry", value: escapeHtml(inquiry.type) },
        { label: "Reply To", value: escapeHtml(inquiry.email) },
      ],
      title: "Kapten Batik Contact Inquiry",
    }),
  });

  return { skipped: false as const };
}
