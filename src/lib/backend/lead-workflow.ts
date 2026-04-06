import type { LeadRequestBody } from "@/lib/backend/lead-request";
import { getServerTrackingEnv } from "@/lib/tracking/server-env";
import { syncLeadRecordToGoogleSheet } from "@/lib/sheets/leads";
import { insertLeadRecord, updateLeadSyncFlags } from "@/lib/supabase/leads";
import { sendLeadAdminEmail } from "@/lib/email/leads";
import { resolveLeadWhatsAppContext } from "@/lib/whatsapp/leads";
import type { LeadRecord, LeadWorkflowResponse } from "@/types/leads";

export async function processLeadSubmission(
  parsedInput: LeadRequestBody,
  requestMeta: { ipAddress: string; userAgent: string },
): Promise<LeadWorkflowResponse> {
  const errors: string[] = [];
  const warnings: string[] = [];

  const now = new Date().toISOString();
  const leadId = crypto.randomUUID();
  const lead: LeadRecord = {
    ...parsedInput,
    createdAt: now,
    id: leadId,
    ipAddress: requestMeta.ipAddress,
    rawPayload: {
      ...parsedInput,
    },
    userAgent: requestMeta.userAgent,
  };

  const insertResult = await insertLeadRecord(lead);

  if (insertResult.error) {
    return {
      emailSent: false,
      errors: ["We could not save your lead right now. Please try again."],
      leadId: null,
      leadSaved: false,
      processingComplete: false,
      sheetSynced: false,
      sheetSyncStatus: {
        attempted: false,
        headersCreated: false,
        rowMode: "skipped",
        rowNumber: null,
        synced: false,
        tabCreated: false,
        warnings: [],
      },
      emailConfigured: false,
      emailStatus: {
        attempted: false,
        configured: false,
        sent: false,
        warnings: [],
      },
      success: false,
      trackingReady: false,
      whatsappMessage: null,
      whatsappUrl: null,
      warnings: [],
      whatsappRedirectReady: false,
    };
  }

  const config = getServerTrackingEnv();
  const sheetSyncStatus = await syncLeadRecordToGoogleSheet(lead);
  const sheetWarnings = [...sheetSyncStatus.warnings];
  const syncFlagsResult = sheetSyncStatus.synced
    ? await updateLeadSyncFlags(insertResult.inserted?.id ?? leadId, { sheetSynced: true })
    : { error: null };

  if (syncFlagsResult.error) {
    warnings.push("Lead sync flag update failed.");
  }

  const emailResult = await sendLeadAdminEmail(lead);
  const emailWarnings = [...emailResult.warnings];

  if (emailResult.sent) {
    await updateLeadSyncFlags(insertResult.inserted?.id ?? leadId, { emailSent: true });
  }

  const whatsappContext = resolveLeadWhatsAppContext(lead);
  const trackingReady = Boolean(lead.trackingSessionId && lead.landingPage && lead.pageUrl);

  const response: LeadWorkflowResponse = {
    emailConfigured: emailResult.configured,
    emailSent: emailResult.sent,
    emailStatus: {
      attempted: emailResult.attempted,
      configured: emailResult.configured,
      sent: emailResult.sent,
      warnings: emailWarnings,
    },
    errors,
    leadId: insertResult.inserted?.id ?? leadId,
    leadSaved: true,
    processingComplete: true,
    sheetSynced: sheetSyncStatus.synced,
    sheetSyncStatus,
    success: true,
    trackingReady,
    whatsappMessage: whatsappContext.message,
    whatsappUrl: whatsappContext.ready ? whatsappContext.url : null,
    warnings: [...warnings, ...sheetWarnings, ...emailWarnings],
    whatsappRedirectReady: whatsappContext.ready,
  };

  if (!config.whatsappPhoneNumber) {
    response.warnings.push("WhatsApp redirect is not configured.");
    response.whatsappRedirectReady = false;
    response.whatsappUrl = null;
  }

  return response;
}

export { processLeadSubmission as processContactInquirySubmission };
