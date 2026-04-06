"use client";

import type { ContactTrackingSnapshot } from "@/types/tracking";

export type ContactInquiryAnalyticsPayload = {
  leadId: string;
  formName: string;
  tracking: ContactTrackingSnapshot;
};

export type TrackingPageViewPayload = {
  tracking: ContactTrackingSnapshot;
};

const TRACKING_SUCCESS_STORAGE_PREFIX = "kapten-batik-success:";
let lastPageViewUrl = "";

function getTrackingWindow() {
  return window as Window & {
    dataLayer?: Array<Record<string, unknown>>;
  };
}

function getDataLayer() {
  const analyticsWindow = getTrackingWindow();
  return analyticsWindow.dataLayer ?? (analyticsWindow.dataLayer = []);
}

function pushDataLayer(event: Record<string, unknown>) {
  getDataLayer().push(event);
}

function hasSuccessEventFired(leadId: string) {
  try {
    return window.sessionStorage.getItem(`${TRACKING_SUCCESS_STORAGE_PREFIX}${leadId}`) === "1";
  } catch {
    return false;
  }
}

function markSuccessEventFired(leadId: string) {
  try {
    window.sessionStorage.setItem(`${TRACKING_SUCCESS_STORAGE_PREFIX}${leadId}`, "1");
  } catch {
    // Best-effort dedupe only.
  }
}

function getTrackingAttribution(tracking: ContactTrackingSnapshot) {
  return {
    click_id: tracking.clickId || "direct",
    fbclid: tracking.fbclid || "",
    gclid: tracking.gclid || "",
    msclkid: tracking.msclkid || "",
    ttclid: tracking.ttclid || "",
    utm_campaign: tracking.utmCampaign || "direct",
    utm_content: tracking.utmContent || "",
    utm_medium: tracking.utmMedium || "none",
    utm_source: tracking.utmSource || "direct",
    utm_term: tracking.utmTerm || "",
  };
}

function getTrackingNavigation(tracking: ContactTrackingSnapshot) {
  return {
    landing_page_path: tracking.landingPagePath,
    landing_page_url: tracking.landingPage,
    page_history: tracking.pageHistory,
    page_path: tracking.pagePath,
    page_url: tracking.pageUrl,
    referrer: tracking.referrer,
    tracking_session_id: tracking.trackingSessionId,
  };
}

function hasPageViewBeenEmitted(pageUrl: string) {
  return lastPageViewUrl === pageUrl;
}

function markPageViewEmitted(pageUrl: string) {
  lastPageViewUrl = pageUrl;
}

export function pushTrackingPageView(payload: TrackingPageViewPayload) {
  const { tracking } = payload;

  if (hasPageViewBeenEmitted(tracking.pageUrl)) {
    return;
  }

  pushDataLayer({
    event: "page_view",
    form_name: "global",
    ...getTrackingAttribution(tracking),
    ...getTrackingNavigation(tracking),
  });

  markPageViewEmitted(tracking.pageUrl);
}

export function pushContactInquirySuccessTracking(payload: ContactInquiryAnalyticsPayload) {
  pushLeadFormSubmitSuccessTracking(payload);
}

export function pushLeadFormSubmitSuccessTracking(payload: ContactInquiryAnalyticsPayload) {
  if (hasSuccessEventFired(payload.leadId)) {
    return;
  }

  pushDataLayer({
    event: "lead_form_submit_success",
    event_id: payload.leadId,
    form_name: payload.formName,
    ga4_event_name: "generate_lead",
    lead_id: payload.leadId,
    ...getTrackingAttribution(payload.tracking),
    ...getTrackingNavigation(payload.tracking),
  });

  markSuccessEventFired(payload.leadId);
}
