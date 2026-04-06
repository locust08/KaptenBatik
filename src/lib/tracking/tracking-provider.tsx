"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { getOrCreateContactTrackingSnapshot } from "@/lib/tracking/capture";
import { pushTrackingPageView } from "@/lib/tracking/analytics";

export function TrackingProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const snapshot = getOrCreateContactTrackingSnapshot();
    pushTrackingPageView({ tracking: snapshot });
  }, [pathname]);

  return children;
}
