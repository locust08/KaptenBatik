import type { Metadata } from "next";
import type { Viewport } from "next";
import type { ReactNode } from "react";
import { CartProvider } from "@/components/cart-provider";
import { CustomCursor } from "@/components/custom-cursor";
import { SupportChat } from "@/components/support-chat";
import { GoogleTagManager } from "@/lib/tracking/gtm";
import { TrackingProvider } from "@/lib/tracking/tracking-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kapten Batik | The Collection",
  description:
    "A Next.js landing page for Kapten Batik featuring men, women, and junior collections translated from the provided Figma reference.",
};

export const viewport: Viewport = {
  initialScale: 1,
  viewportFit: "cover",
  width: "device-width",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GoogleTagManager />
        <CartProvider>
          <CustomCursor />
          <SupportChat />
          <TrackingProvider>{children}</TrackingProvider>
        </CartProvider>
      </body>
    </html>
  );
}
