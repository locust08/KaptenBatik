import { createClient } from "@supabase/supabase-js";

import { ensureLeadsKaptenBatikTable } from "@/lib/supabase/provision";
import { getServerTrackingEnv } from "@/lib/tracking/server-env";
import { normalizeLeadPageHistory } from "@/lib/utils/leads";
import type { LeadDatabaseRow, LeadRecord } from "@/types/leads";

export const LEADS_TABLE_NAME = "leads_kaptenbatik";

function getSupabaseAdminClient() {
  const config = getServerTrackingEnv();

  return createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function mapLeadRecordToSupabaseRow(lead: LeadRecord): LeadDatabaseRow {
  return {
    click_id: lead.clickId,
    created_at: lead.createdAt,
    email: lead.email,
    email_sent: false,
    enquiry_category: lead.enquiryCategory,
    fbclid: lead.fbclid,
    form_name: lead.formName,
    gclid: lead.gclid,
    id: lead.id,
    ip_address: lead.ipAddress,
    landing_page_path: lead.landingPagePath,
    landing_page_url: lead.landingPage,
    message: lead.message,
    msclkid: lead.msclkid,
    name: lead.name,
    page_history: normalizeLeadPageHistory(lead.pageHistory),
    page_path: lead.pagePath,
    page_url: lead.pageUrl,
    phone: lead.phone,
    raw_payload: lead.rawPayload,
    referrer: lead.referrer,
    selected_product_ids: [...lead.selectedProductIds],
    selected_product_names: [...lead.selectedProductNames],
    selected_service: lead.selectedService,
    sheet_synced: false,
    tracking_session_id: lead.trackingSessionId,
    ttclid: lead.ttclid,
    user_agent: lead.userAgent,
    utm_campaign: lead.utmCampaign,
    utm_content: lead.utmContent,
    utm_medium: lead.utmMedium,
    utm_source: lead.utmSource,
    utm_term: lead.utmTerm,
    whatsapp_redirected: false,
  };
}

export async function insertLeadRecord(lead: LeadRecord) {
  await ensureLeadsKaptenBatikTable();

  const supabase = getSupabaseAdminClient();
  const row = mapLeadRecordToSupabaseRow(lead);

  const { data, error } = await supabase
    .from(LEADS_TABLE_NAME)
    .insert(row)
    .select("id, created_at")
    .single();

  if (error) {
    return { error, inserted: null };
  }

  return {
    error: null,
    inserted: {
      createdAt: data.created_at as string,
      id: data.id as string,
    },
  };
}

export async function updateLeadSyncFlags(
  leadId: string,
  flags: { sheetSynced?: boolean; emailSent?: boolean; whatsappRedirected?: boolean },
) {
  await ensureLeadsKaptenBatikTable();

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from(LEADS_TABLE_NAME)
    .update({
      ...(typeof flags.sheetSynced === "boolean" ? { sheet_synced: flags.sheetSynced } : {}),
      ...(typeof flags.emailSent === "boolean" ? { email_sent: flags.emailSent } : {}),
      ...(typeof flags.whatsappRedirected === "boolean"
        ? { whatsapp_redirected: flags.whatsappRedirected }
        : {}),
    })
    .eq("id", leadId);

  return { error };
}
