import type { ContactInquiryDbRow, ContactInquiryRecord } from "@/types/contact-automation";

export function mapContactInquiryToSupabaseRow(inquiry: ContactInquiryRecord): ContactInquiryDbRow {
  return {
    admin_email_sent_at: null,
    click_id: inquiry.clickId,
    created_at: inquiry.submittedAt,
    email: inquiry.email,
    fbclid: inquiry.fbclid,
    full_name: inquiry.fullName,
    gclid: inquiry.gclid,
    google_sheets_synced_at: null,
    id: inquiry.id,
    inquiry_type: inquiry.type,
    ip_address: inquiry.ipAddress,
    landing_page: inquiry.landingPage,
    landing_page_path: inquiry.landingPagePath,
    message: inquiry.message,
    msclkid: inquiry.msclkid,
    phone: inquiry.phone,
    raw_payload: inquiry.rawPayload,
    referrer: inquiry.referrer,
    page_history: inquiry.pageHistory,
    page_path: inquiry.pagePath,
    page_url: inquiry.pageUrl,
    session_id: inquiry.sessionId,
    status: "pending",
    submitted_at: inquiry.submittedAt,
    sync_status: "pending",
    sync_warning: "",
    tracking_captured_at: inquiry.capturedAt,
    tracking_session_id: inquiry.trackingSessionId,
    ttclid: inquiry.ttclid,
    updated_at: inquiry.submittedAt,
    user_agent: inquiry.userAgent,
    utm_campaign: inquiry.utmCampaign,
    utm_content: inquiry.utmContent,
    utm_medium: inquiry.utmMedium,
    utm_source: inquiry.utmSource,
    utm_term: inquiry.utmTerm,
    whatsapp_href: inquiry.whatsappHref,
    whatsapp_message: inquiry.whatsappMessage,
  };
}

export function buildContactInquiryStatusUpdate(params: {
  adminEmailSentAt: string | null;
  googleSheetsSyncedAt: string | null;
  warnings: string[];
}) {
  return {
    admin_email_sent_at: params.adminEmailSentAt,
    google_sheets_synced_at: params.googleSheetsSyncedAt,
    status: params.warnings.length > 0 ? ("partial" as const) : ("completed" as const),
    sync_status: params.warnings.length > 0 ? ("partial" as const) : ("completed" as const),
    sync_warning: params.warnings.join(" "),
    updated_at: new Date().toISOString(),
  };
}
