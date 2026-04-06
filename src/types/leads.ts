import type { ContactTrackingSnapshot } from "@/types/tracking";

export type LeadTrackingSnapshot = Omit<ContactTrackingSnapshot, "capturedAt" | "pageHistory" | "sessionId"> & {
  pageHistory: string[];
};

export type LeadSubmissionInput = LeadTrackingSnapshot & {
  email: string;
  enquiryCategory: string;
  formName: string;
  message: string;
  name: string;
  phone: string;
  selectedProductIds: string[];
  selectedProductNames: string[];
  selectedService: string;
};

export type LeadRecord = LeadSubmissionInput & {
  createdAt: string;
  id: string;
  ipAddress: string;
  rawPayload: Record<string, unknown>;
  userAgent: string;
};

export type LeadDatabaseRow = {
  click_id: string;
  created_at: string;
  email: string;
  email_sent: boolean;
  enquiry_category: string;
  fbclid: string;
  form_name: string;
  gclid: string;
  id: string;
  ip_address: string;
  landing_page_path: string;
  landing_page_url: string;
  message: string;
  msclkid: string;
  name: string;
  page_history: string[];
  page_path: string;
  page_url: string;
  phone: string;
  raw_payload: Record<string, unknown>;
  referrer: string;
  selected_product_ids: string[];
  selected_product_names: string[];
  selected_service: string;
  sheet_synced: boolean;
  tracking_session_id: string;
  ttclid: string;
  user_agent: string;
  utm_campaign: string;
  utm_content: string;
  utm_medium: string;
  utm_source: string;
  utm_term: string;
  whatsapp_redirected: boolean;
};

export type LeadGoogleSheetsSyncStatus = {
  attempted: boolean;
  headersCreated: boolean;
  rowMode: "append" | "upsert" | "skipped";
  rowNumber: number | null;
  synced: boolean;
  tabCreated: boolean;
  warnings: string[];
};

export type LeadEmailStatus = {
  attempted: boolean;
  configured: boolean;
  sent: boolean;
  warnings: string[];
};

export type LeadWorkflowResponse = {
  emailSent: boolean;
  emailConfigured: boolean;
  emailStatus: LeadEmailStatus;
  errors: string[];
  leadId: string | null;
  leadSaved: boolean;
  processingComplete: boolean;
  sheetSynced: boolean;
  sheetSyncStatus: LeadGoogleSheetsSyncStatus;
  success: boolean;
  trackingReady: boolean;
  whatsappMessage: string | null;
  whatsappUrl: string | null;
  warnings: string[];
  whatsappRedirectReady: boolean;
};
