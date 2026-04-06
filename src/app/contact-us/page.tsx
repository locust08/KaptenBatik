import type { Metadata } from "next";
import { ContactPage } from "@/components/contact-page";

export const metadata: Metadata = {
  title: "Contact Us | Kapten Batik",
  description:
    "Reach the Kapten Batik concierge for tailoring appointments, private viewings, and heritage consultations.",
};

export default function ContactUsRoute() {
  return <ContactPage />;
}
