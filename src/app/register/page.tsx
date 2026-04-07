import type { Metadata } from "next";
import { RegisterPage } from "@/components/register-page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Register | Kapten Batik",
  description: "Create your Kapten Batik profile and join the atelier.",
};

export default function RegisterRoute() {
  return <RegisterPage />;
}
