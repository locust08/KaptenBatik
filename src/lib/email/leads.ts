import { Resend } from "resend";

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
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
          <h2 style="margin: 0 0 16px;">New Kapten Batik lead</h2>
          <p style="margin: 0 0 20px;">A new lead was saved to Supabase and synced to the secondary workflow.</p>

          <h3 style="margin: 24px 0 8px;">Lead Summary</h3>
          <table style="border-collapse: collapse; width: 100%; max-width: 760px;">
            <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>Lead ID</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(lead.id)}</td></tr>
            <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>Created At</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(lead.createdAt)}</td></tr>
            <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>Name</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(lead.name)}</td></tr>
            <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>Email</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(lead.email)}</td></tr>
            <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>Phone</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(lead.phone || "N/A")}</td></tr>
            <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>Message</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(lead.message)}</td></tr>
          </table>

          <h3 style="margin: 24px 0 8px;">Form Details</h3>
          <table style="border-collapse: collapse; width: 100%; max-width: 760px;">
            <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>Form Name</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(lead.formName)}</td></tr>
            <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>Enquiry Category</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(lead.enquiryCategory || "N/A")}</td></tr>
            <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>Selected Service</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(lead.selectedService || "N/A")}</td></tr>
            <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>Selected Product IDs</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(formatList(lead.selectedProductIds))}</td></tr>
            <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>Selected Product Names</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(formatList(lead.selectedProductNames))}</td></tr>
          </table>

          <h3 style="margin: 24px 0 8px;">Tracking</h3>
          <table style="border-collapse: collapse; width: 100%; max-width: 760px;">
            <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>UTM Source</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(lead.utmSource || "N/A")}</td></tr>
            <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>UTM Medium</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(lead.utmMedium || "N/A")}</td></tr>
            <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>UTM Campaign</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(lead.utmCampaign || "N/A")}</td></tr>
            <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>UTM Content</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(lead.utmContent || "N/A")}</td></tr>
            <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>UTM Term</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(lead.utmTerm || "N/A")}</td></tr>
            <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>GCLID</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(lead.gclid || "N/A")}</td></tr>
            <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>FBCLID</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(lead.fbclid || "N/A")}</td></tr>
            <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>MSCLKID</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(lead.msclkid || "N/A")}</td></tr>
            <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>TTCLID</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(lead.ttclid || "N/A")}</td></tr>
            <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>Click ID</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(lead.clickId || "N/A")}</td></tr>
            <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>Tracking Session ID</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(lead.trackingSessionId || "N/A")}</td></tr>
          </table>

          <h3 style="margin: 24px 0 8px;">Context</h3>
          <table style="border-collapse: collapse; width: 100%; max-width: 760px;">
            <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>Landing Page URL</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(lead.landingPage || "N/A")}</td></tr>
            <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>Landing Page Path</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(lead.landingPagePath || "N/A")}</td></tr>
            <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>Page URL</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(lead.pageUrl || "N/A")}</td></tr>
            <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>Page Path</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(lead.pagePath || "N/A")}</td></tr>
            <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>Page History</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(pageHistoryText)}</td></tr>
            <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>Referrer</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(lead.referrer || "N/A")}</td></tr>
            <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><strong>User Agent</strong></td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(lead.userAgent || "N/A")}</td></tr>
          </table>
        </div>
      `,
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
