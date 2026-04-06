"use client";

const COLLECTION_TRANSITION_KEY = "kapten-batik-collection-transition";

type CollectionTransitionPayload = {
  path: string;
  timestamp: number;
};

export function rememberCollectionTransition(path: string) {
  if (typeof window === "undefined") {
    return;
  }

  const payload: CollectionTransitionPayload = {
    path,
    timestamp: Date.now(),
  };

  window.sessionStorage.setItem(COLLECTION_TRANSITION_KEY, JSON.stringify(payload));
}

export function consumeCollectionTransition(path: string) {
  if (typeof window === "undefined") {
    return false;
  }

  const rawPayload = window.sessionStorage.getItem(COLLECTION_TRANSITION_KEY);

  if (!rawPayload) {
    return false;
  }

  window.sessionStorage.removeItem(COLLECTION_TRANSITION_KEY);

  try {
    const payload = JSON.parse(rawPayload) as CollectionTransitionPayload;
    return payload.path === path;
  } catch {
    return false;
  }
}
