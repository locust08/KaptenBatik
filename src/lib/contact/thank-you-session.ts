export const CONTACT_THANK_YOU_SESSION_KEY = "kapten-batik-contact-thank-you";

export type ContactThankYouSessionPayload = {
  leadId: string;
  submittedAt: string;
  whatsappRedirectReady: boolean;
  whatsappUrl: string | null;
};

export function readContactThankYouSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.sessionStorage.getItem(CONTACT_THANK_YOU_SESSION_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<ContactThankYouSessionPayload>;

    if (typeof parsed.leadId !== "string" || typeof parsed.submittedAt !== "string") {
      return null;
    }

    return {
      leadId: parsed.leadId,
      submittedAt: parsed.submittedAt,
      whatsappRedirectReady: parsed.whatsappRedirectReady === true,
      whatsappUrl: typeof parsed.whatsappUrl === "string" ? parsed.whatsappUrl : null,
    } satisfies ContactThankYouSessionPayload;
  } catch {
    return null;
  }
}

export function writeContactThankYouSession(payload: ContactThankYouSessionPayload) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(CONTACT_THANK_YOU_SESSION_KEY, JSON.stringify(payload));
}
