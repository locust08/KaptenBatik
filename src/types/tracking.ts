export type TrackingAttribution = {
  clickId: string;
  fbclid: string;
  gclid: string;
  msclkid: string;
  ttclid: string;
  utmCampaign: string;
  utmContent: string;
  utmMedium: string;
  utmSource: string;
  utmTerm: string;
};

export type TrackingSnapshot = {
  capturedAt: string;
  landingPage: string;
  landingPagePath: string;
  pageHistory: string;
  pagePath: string;
  pageUrl: string;
  referrer: string;
  sessionId: string;
  trackingSessionId: string;
} & TrackingAttribution;

export type ContactTrackingSnapshot = TrackingSnapshot;

export const TRACKING_ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
  "msclkid",
  "ttclid",
  "click_id",
] as const;
