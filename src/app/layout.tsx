import type { Metadata } from "next";
import type { Viewport } from "next";
import { CartProvider } from "@/components/cart-provider";
import { CustomCursor } from "@/components/custom-cursor";
import { SupportChat } from "@/components/support-chat";
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
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <CustomCursor />
          <SupportChat />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
