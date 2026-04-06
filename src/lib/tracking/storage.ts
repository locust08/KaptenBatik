"use client";

import type { ContactTrackingSnapshot } from "@/types/tracking";

export const CONTACT_TRACKING_STORAGE_KEY = "kapten-batik-contact-tracking";
export const CONTACT_TRACKING_COOKIE_KEY = "kapten_batik_tracking_state";
export const CONTACT_TRACKING_SESSION_COOKIE = "kapten_batik_tracking_session";
const CONTACT_TRACKING_MAX_HISTORY = 12;

export function getBrowserCookie(name: string) {
  if (typeof document === "undefined") {
    return "";
  }

  const match = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`));
  return match ? decodeURIComponent(match[1] ?? "") : "";
}

export function setBrowserCookie(name: string, value: string, maxAgeSeconds = 60 * 60 * 24 * 30) {
  if (typeof document === "undefined") {
    return;
  }

  const secureFlag = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secureFlag}`;
}

export function removeBrowserCookie(name: string) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

function safeParseTracking(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as ContactTrackingSnapshot;
  } catch {
    return null;
  }
}

function normalizeTrackingSnapshot(snapshot: ContactTrackingSnapshot) {
  return {
    ...snapshot,
    pageHistory: trimPageHistory(snapshot.pageHistory),
  };
}

function trimPageHistory(pageHistory: string) {
  if (!pageHistory) {
    return "";
  }

  try {
    const parsed = JSON.parse(pageHistory) as unknown;
    if (!Array.isArray(parsed)) {
      return pageHistory;
    }

    return JSON.stringify(parsed.slice(-CONTACT_TRACKING_MAX_HISTORY));
  } catch {
    return pageHistory;
  }
}

export function readStoredContactTracking() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const sessionValue = safeParseTracking(window.sessionStorage.getItem(CONTACT_TRACKING_STORAGE_KEY));
    if (sessionValue) {
      return normalizeTrackingSnapshot(sessionValue);
    }

    const cookieValue =
      safeParseTracking(getBrowserCookie(CONTACT_TRACKING_COOKIE_KEY)) ??
      safeParseTracking(getBrowserCookie(CONTACT_TRACKING_SESSION_COOKIE));

    return cookieValue ? normalizeTrackingSnapshot(cookieValue) : null;
  } catch {
    return null;
  }
}

export function writeStoredContactTracking(snapshot: ContactTrackingSnapshot) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const normalizedSnapshot = normalizeTrackingSnapshot(snapshot);
    const serializedSnapshot = JSON.stringify(normalizedSnapshot);
    window.sessionStorage.setItem(CONTACT_TRACKING_STORAGE_KEY, serializedSnapshot);
    setBrowserCookie(CONTACT_TRACKING_COOKIE_KEY, serializedSnapshot);
    setBrowserCookie(CONTACT_TRACKING_SESSION_COOKIE, normalizedSnapshot.sessionId);
  } catch {
    // Session storage is best-effort only.
  }
}

export function appendTrackingPageHistory(snapshot: ContactTrackingSnapshot, pageUrl: string) {
  let history: string[] = [];

  try {
    const parsed = JSON.parse(snapshot.pageHistory) as unknown;
    if (Array.isArray(parsed)) {
      history = parsed.filter((entry): entry is string => typeof entry === "string" && entry.length > 0);
    }
  } catch {
    history = [];
  }

  if (history.at(-1) !== pageUrl) {
    history = [...history, pageUrl].slice(-CONTACT_TRACKING_MAX_HISTORY);
  }

  return {
    ...snapshot,
    pageHistory: JSON.stringify(history),
  };
}
