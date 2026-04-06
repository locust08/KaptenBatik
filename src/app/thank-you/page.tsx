import type { Metadata } from "next";
import { ThankYouPage } from "@/components/thank-you-page";

export const metadata: Metadata = {
  title: "Thank You | Kapten Batik",
  description: "Order confirmation for Kapten Batik purchases.",
};

export default function Page() {
  return <ThankYouPage />;
}
