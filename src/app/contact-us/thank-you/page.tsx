import type { Metadata } from "next";
import { ContactThankYouPage } from "@/components/contact-thank-you-page";

export const metadata: Metadata = {
  title: "Thank You for Reaching Out | Kapten Batik",
  description: "Contact confirmation for Kapten Batik inquiries.",
};

export default function ContactThankYouRoute() {
  return <ContactThankYouPage />;
}
