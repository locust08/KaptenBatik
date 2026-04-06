import { Resend } from "resend";

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
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
        <h2 style="margin: 0 0 16px;">Kapten Batik contact inquiry</h2>
        <p style="margin: 0 0 12px;">A new inquiry has been submitted through the website.</p>
        <table style="border-collapse: collapse; width: 100%; max-width: 720px;">
          <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>Lead ID</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(inquiry.id)}</td></tr>
          <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>Name</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(inquiry.fullName)}</td></tr>
          <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>Email</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(inquiry.email)}</td></tr>
          <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>Phone</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(inquiry.phone || "N/A")}</td></tr>
          <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>Inquiry</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(inquiry.type)}</td></tr>
          <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>Landing Page</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(inquiry.landingPage)}</td></tr>
          <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>Referrer</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(inquiry.referrer || "N/A")}</td></tr>
          <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>Session ID</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(inquiry.sessionId)}</td></tr>
          <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>Submitted At</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(inquiry.submittedAt)}</td></tr>
        </table>
        <div style="margin-top: 16px; padding: 16px; background: #f7f7f7; border-radius: 8px;">
          <strong>Message</strong>
          <p style="white-space: pre-wrap; margin: 8px 0 0;">${escapeHtml(inquiry.message)}</p>
        </div>
      </div>
    `,
  });

  return { skipped: false as const };
}
