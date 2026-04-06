import type { ContactTrackingSnapshot } from "@/types/tracking";

export type ContactInquirySubmission = ContactTrackingSnapshot & {
  email: string;
  message: string;
  phone: string;
  type: string;
  fullName: string;
};

export type ContactInquiryRecord = ContactInquirySubmission & {
  id: string;
  ipAddress: string;
  rawPayload: Record<string, unknown>;
  submittedAt: string;
  userAgent: string;
  whatsappHref: string;
  whatsappMessage: string;
};

export type ContactInquiryWorkflowSuccess = {
  leadId: string;
  success: true;
  warnings: string[];
  whatsappHref: string;
};

export type ContactInquiryWorkflowFailure = {
  error: string;
  success: false;
};

export type ContactInquiryWorkflowResult =
  | ContactInquiryWorkflowSuccess
  | ContactInquiryWorkflowFailure;

export type ContactAutomationConfig = {
  adminEmailFrom?: string;
  adminEmailTo?: string;
  googlePrivateKey?: string;
  googleServiceAccountEmail?: string;
  googleSheetsSpreadsheetId?: string;
  googleSheetsTabName: string;
  resendApiKey?: string;
  supabaseServiceRoleKey: string;
  supabaseTable: string;
  supabaseUrl: string;
  whatsappPhone: string;
};

export type ContactInquiryRequestMeta = {
  ipAddress: string;
  userAgent: string;
};

export type ContactInquiryDbRow = {
  admin_email_sent_at: string | null;
  created_at: string;
  click_id: string;
  email: string;
  fbclid: string;
  full_name: string;
  gclid: string;
  google_sheets_synced_at: string | null;
  id: string;
  inquiry_type: string;
  ip_address: string;
  landing_page: string;
  landing_page_path: string;
  page_history: string;
  page_path: string;
  page_url: string;
  message: string;
  msclkid: string;
  phone: string;
  raw_payload: Record<string, unknown>;
  referrer: string;
  session_id: string;
  status: "pending" | "partial" | "completed";
  sync_status: "pending" | "partial" | "completed";
  sync_warning: string;
  submitted_at: string;
  tracking_captured_at: string;
  tracking_session_id: string;
  ttclid: string;
  updated_at: string;
  user_agent: string;
  utm_campaign: string;
  utm_content: string;
  utm_medium: string;
  utm_source: string;
  utm_term: string;
  whatsapp_href: string;
  whatsapp_message: string;
};
