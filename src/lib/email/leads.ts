import { Resend } from "resend";

import { renderKaptenBatikAdminEmail } from "@/lib/email/brand-template";
import { escapeHtml } from "@/lib/utils/html";
import { getServerTrackingEnv, resolveResendFromEmail, resolveResendToEmail } from "@/lib/tracking/server-env";
import type { LeadRecord } from "@/types/leads";

let resendClient: Resend | null = null;

function getResendClient() {
  const config = getServerTrackingEnv();

  if (!config.resendApiKey) {
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(config.resendApiKey);
  }

  return resendClient;
}

function formatList(values: string[]) {
  return values.length > 0 ? values.join(", ") : "N/A";
}

function formatPageHistory(values: string[]) {
  return values.filter((entry) => entry.trim().length > 0);
}

export async function sendLeadAdminEmail(lead: LeadRecord) {
  const client = getResendClient();
  const to = resolveResendToEmail();
  const from = resolveResendFromEmail();

  if (!client) {
    return {
      attempted: false,
      configured: false,
      sent: false,
      warnings: ["Admin email is not configured."],
    };
  }

  const pageHistory = formatPageHistory(lead.pageHistory);
  const pageHistoryText = pageHistory.length > 0 ? pageHistory.join(" -> ") : "N/A";

  try {
    await client.emails.send({
      from,
      replyTo: lead.email,
      subject: `New Kapten Batik lead from ${lead.name}`,
      to,
      text: [
        "A new Kapten Batik lead has been captured.",
        "",
        "Lead Summary",
        `Lead ID: ${lead.id}`,
        `Created At: ${lead.createdAt}`,
        `Name: ${lead.name}`,
        `Email: ${lead.email}`,
        `Phone: ${lead.phone || "N/A"}`,
        `Message: ${lead.message}`,
        "",
        "Form Details",
        `Form Name: ${lead.formName}`,
        `Enquiry Category: ${lead.enquiryCategory || "N/A"}`,
        `Selected Service: ${lead.selectedService || "N/A"}`,
        `Selected Product IDs: ${formatList(lead.selectedProductIds)}`,
        `Selected Product Names: ${formatList(lead.selectedProductNames)}`,
        "",
        "Tracking",
        `UTM Source: ${lead.utmSource || "N/A"}`,
        `UTM Medium: ${lead.utmMedium || "N/A"}`,
        `UTM Campaign: ${lead.utmCampaign || "N/A"}`,
        `UTM Content: ${lead.utmContent || "N/A"}`,
        `UTM Term: ${lead.utmTerm || "N/A"}`,
        `GCLID: ${lead.gclid || "N/A"}`,
        `FBCLID: ${lead.fbclid || "N/A"}`,
        `MSCLKID: ${lead.msclkid || "N/A"}`,
        `TTCLID: ${lead.ttclid || "N/A"}`,
        `Click ID: ${lead.clickId || "N/A"}`,
        `Tracking Session ID: ${lead.trackingSessionId || "N/A"}`,
        "",
        "Context",
        `Landing Page URL: ${lead.landingPage || "N/A"}`,
        `Landing Page Path: ${lead.landingPagePath || "N/A"}`,
        `Page URL: ${lead.pageUrl || "N/A"}`,
        `Page Path: ${lead.pagePath || "N/A"}`,
        `Page History: ${pageHistoryText}`,
        `Referrer: ${lead.referrer || "N/A"}`,
        `User Agent: ${lead.userAgent || "N/A"}`,
      ].join("\n"),
      html: renderKaptenBatikAdminEmail({
        badge: "Lead Notification",
        intro: "A new Kapten Batik lead was captured and passed through the website workflow. Review the details below and reply directly if needed.",
        message: escapeHtml(lead.message),
        sections: [
          {
            rows: [
              { label: "Lead ID", value: escapeHtml(lead.id) },
              { label: "Created At", value: escapeHtml(lead.createdAt) },
              { label: "Name", value: escapeHtml(lead.name) },
              { label: "Email", value: escapeHtml(lead.email) },
              { label: "Phone", value: escapeHtml(lead.phone || "N/A") },
            ],
            title: "Lead Summary",
          },
          {
            rows: [
              { label: "Form Name", value: escapeHtml(lead.formName) },
              { label: "Enquiry Category", value: escapeHtml(lead.enquiryCategory || "N/A") },
              { label: "Selected Service", value: escapeHtml(lead.selectedService || "N/A") },
              { label: "Selected Product IDs", value: escapeHtml(formatList(lead.selectedProductIds)) },
              { label: "Selected Product Names", value: escapeHtml(formatList(lead.selectedProductNames)) },
            ],
            title: "Form Details",
          },
          {
            rows: [
              { label: "UTM Source", value: escapeHtml(lead.utmSource || "N/A") },
              { label: "UTM Medium", value: escapeHtml(lead.utmMedium || "N/A") },
              { label: "UTM Campaign", value: escapeHtml(lead.utmCampaign || "N/A") },
              { label: "UTM Content", value: escapeHtml(lead.utmContent || "N/A") },
              { label: "UTM Term", value: escapeHtml(lead.utmTerm || "N/A") },
              { label: "GCLID", value: escapeHtml(lead.gclid || "N/A") },
              { label: "FBCLID", value: escapeHtml(lead.fbclid || "N/A") },
              { label: "MSCLKID", value: escapeHtml(lead.msclkid || "N/A") },
              { label: "TTCLID", value: escapeHtml(lead.ttclid || "N/A") },
              { label: "Click ID", value: escapeHtml(lead.clickId || "N/A") },
              { label: "Tracking Session ID", value: escapeHtml(lead.trackingSessionId || "N/A") },
            ],
            title: "Tracking",
          },
          {
            rows: [
              { label: "Landing Page URL", value: escapeHtml(lead.landingPage || "N/A") },
              { label: "Landing Page Path", value: escapeHtml(lead.landingPagePath || "N/A") },
              { label: "Page URL", value: escapeHtml(lead.pageUrl || "N/A") },
              { label: "Page Path", value: escapeHtml(lead.pagePath || "N/A") },
              { label: "Page History", value: escapeHtml(pageHistoryText) },
              { label: "Referrer", value: escapeHtml(lead.referrer || "N/A") },
              { label: "User Agent", value: escapeHtml(lead.userAgent || "N/A") },
            ],
            title: "Context",
          },
        ],
        summary: [
          { label: "From", value: escapeHtml(lead.name) },
          { label: "Form", value: escapeHtml(lead.formName) },
          { label: "Reply To", value: escapeHtml(lead.email) },
        ],
        title: "New Kapten Batik Lead",
      }),
    });

    return {
      attempted: true,
      configured: true,
      sent: true,
      warnings: [],
    };
  } catch (error) {
    return {
      attempted: true,
      configured: true,
      sent: false,
      warnings: [error instanceof Error ? error.message : "Admin email failed to send."],
    };
  }
}
