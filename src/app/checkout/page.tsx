import type { Metadata } from "next";
import { CheckoutPage } from "@/components/checkout-page";

export const metadata: Metadata = {
  title: "Checkout | Kapten Batik",
  description: "Secure checkout for Kapten Batik orders.",
};

export default function Page() {
  return <CheckoutPage />;
}
