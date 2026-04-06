"use client";

import type { ContactTrackingSnapshot, TrackingAttribution } from "@/types/tracking";
import {
  appendTrackingPageHistory,
  getBrowserCookie,
  readStoredContactTracking,
  writeStoredContactTracking,
} from "@/lib/tracking/storage";

const TRACKING_QUERY_KEYS = [
  "click_id",
  "fbclid",
  "gclid",
  "msclkid",
  "ttclid",
  "utm_campaign",
  "utm_content",
  "utm_medium",
  "utm_source",
  "utm_term",
] as const;

function makeSessionId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function emptyAttribution(): TrackingAttribution {
  return {
    clickId: "",
    fbclid: "",
    gclid: "",
    msclkid: "",
    ttclid: "",
    utmCampaign: "",
    utmContent: "",
    utmMedium: "",
    utmSource: "",
    utmTerm: "",
  };
}

function toTrackingAttribution(query: URLSearchParams, existing?: TrackingAttribution | null) {
  const current = existing ?? emptyAttribution();

  return {
    clickId: current.clickId || query.get("click_id")?.trim() || "",
    fbclid: current.fbclid || query.get("fbclid")?.trim() || "",
    gclid: current.gclid || query.get("gclid")?.trim() || "",
    msclkid: current.msclkid || query.get("msclkid")?.trim() || "",
    ttclid: current.ttclid || query.get("ttclid")?.trim() || "",
    utmCampaign: current.utmCampaign || query.get("utm_campaign")?.trim() || "",
    utmContent: current.utmContent || query.get("utm_content")?.trim() || "",
    utmMedium: current.utmMedium || query.get("utm_medium")?.trim() || "",
    utmSource: current.utmSource || query.get("utm_source")?.trim() || "",
    utmTerm: current.utmTerm || query.get("utm_term")?.trim() || "",
  };
}

function extractCurrentLocation() {
  const currentUrl = new URL(window.location.href);
  return {
    pagePath: `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`,
    pageUrl: currentUrl.href,
    query: currentUrl.searchParams,
  };
}

function getPageHistoryFromSnapshot(snapshot: ContactTrackingSnapshot | null) {
  if (!snapshot?.pageHistory) {
    return [];
  }

  try {
    const parsed = JSON.parse(snapshot.pageHistory) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((entry): entry is string => typeof entry === "string" && entry.length > 0);
  } catch {
    return [];
  }
}

function normalizeSnapshot(snapshot: ContactTrackingSnapshot) {
  const history = getPageHistoryFromSnapshot(snapshot);
  return {
    ...snapshot,
    pageHistory: JSON.stringify(history),
  };
}

function readReferrer(existing: ContactTrackingSnapshot | null) {
  return existing?.referrer || document.referrer || "";
}

function readLandingPage(existing: ContactTrackingSnapshot | null, pageUrl: string, pagePath: string) {
  return {
    landingPage: existing?.landingPage || pageUrl,
    landingPagePath: existing?.landingPagePath || pagePath,
  };
}

export function captureContactTrackingSnapshot(): ContactTrackingSnapshot {
  const existing = readStoredContactTracking();
  const { pagePath, pageUrl, query } = extractCurrentLocation();
  const attribution = toTrackingAttribution(query, existing);
  const sessionId =
    existing?.sessionId ||
    existing?.trackingSessionId ||
    getBrowserCookie("kapten_batik_tracking_session") ||
    makeSessionId();
  const { landingPage, landingPagePath } = readLandingPage(existing, pageUrl, pagePath);
  const history = appendTrackingPageHistory(
    normalizeSnapshot(
      existing ?? {
        capturedAt: new Date().toISOString(),
        clickId: "",
        fbclid: "",
        gclid: "",
        landingPage,
        landingPagePath,
        msclkid: "",
        pageHistory: JSON.stringify([]),
        pagePath,
        pageUrl,
        referrer: readReferrer(existing),
        sessionId,
        trackingSessionId: sessionId,
        ttclid: "",
        utmCampaign: "",
        utmContent: "",
        utmMedium: "",
        utmSource: "",
        utmTerm: "",
      },
    ),
    pageUrl,
  );

  const snapshot: ContactTrackingSnapshot = {
    ...history,
    capturedAt: existing?.capturedAt || new Date().toISOString(),
    clickId: attribution.clickId,
    fbclid: attribution.fbclid,
    gclid: attribution.gclid,
    landingPage,
    landingPagePath,
    msclkid: attribution.msclkid,
    pageHistory: history.pageHistory,
    pagePath,
    pageUrl,
    referrer: readReferrer(existing),
    sessionId,
    trackingSessionId: existing?.trackingSessionId || sessionId,
    ttclid: attribution.ttclid,
    utmCampaign: attribution.utmCampaign,
    utmContent: attribution.utmContent,
    utmMedium: attribution.utmMedium,
    utmSource: attribution.utmSource,
    utmTerm: attribution.utmTerm,
  };

  writeStoredContactTracking(snapshot);
  return snapshot;
}

export function getOrCreateContactTrackingSnapshot() {
  return captureContactTrackingSnapshot();
}

export function getTrackingQueryKeys() {
  return [...TRACKING_QUERY_KEYS];
}
