import type { Metadata } from "next";
import { LoginPage } from "@/components/login-page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Login | Kapten Batik",
  description: "Sign in to access your Kapten Batik atelier.",
};

export default function LoginRoute() {
  return <LoginPage />;
}
