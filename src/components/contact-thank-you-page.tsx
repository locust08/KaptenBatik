"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { StandardFooter } from "@/components/standard-footer";
import {
  readContactThankYouSession,
  type ContactThankYouSessionPayload,
} from "@/lib/contact/thank-you-session";
import { getContactWhatsAppPhoneNumber } from "@/lib/whatsapp/contact-inquiries";
import styles from "./contact-thank-you-page.module.css";

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 4.5C8.1 4.5 5 7.6 5 11.5C5 12.9 5.4 14.2 6.1 15.3L5.3 19L9.1 18.2C10 18.7 10.9 18.9 12 18.9C15.9 18.9 19 15.8 19 11.9C19 8 15.9 4.5 12 4.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
      <path
        d="M9.3 9.4C9.5 8.9 9.9 8.8 10.2 8.8H10.7C10.9 8.8 11.1 9 11.2 9.2L11.8 10.6C11.9 10.8 11.9 11 11.7 11.2L11.2 11.7C11.1 11.8 11.1 12 11.2 12.1C11.6 12.9 12.3 13.6 13.1 14C13.2 14.1 13.4 14.1 13.5 14L14 13.5C14.2 13.3 14.4 13.3 14.6 13.4L16 14C16.2 14.1 16.4 14.3 16.4 14.6V15.1C16.4 15.4 16.2 15.8 15.7 16C15 16.4 13.7 16.4 12.3 15.8C10.8 15.2 9.6 14 9 12.5C8.4 11.2 8.4 9.8 8.8 9.4"
        fill="currentColor"
      />
    </svg>
  );
}

function formatSubmittedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function ContactThankYouPage() {
  const [redirectTarget, setRedirectTarget] = useState("");
  const [redirectInSeconds, setRedirectInSeconds] = useState(5);
  const [submission, setSubmission] = useState<ContactThankYouSessionPayload | null>(null);

  useEffect(() => {
    const savedSubmission = readContactThankYouSession();
    const whatsappPhone = getContactWhatsAppPhoneNumber();

    if (savedSubmission) {
      setSubmission(savedSubmission);
      if (savedSubmission.whatsappRedirectReady && savedSubmission.whatsappUrl) {
        setRedirectTarget(savedSubmission.whatsappUrl);
        return;
      }
    }

    if (whatsappPhone) {
      setRedirectTarget(`https://wa.me/${whatsappPhone}`);
    }
  }, []);

  useEffect(() => {
    if (!redirectTarget) {
      return;
    }

    const countdownInterval = window.setInterval(() => {
      setRedirectInSeconds((current) => (current > 1 ? current - 1 : current));
    }, 1000);

    const redirectTimeout = window.setTimeout(() => {
      window.location.replace(redirectTarget);
    }, 5000);

    return () => {
      window.clearInterval(countdownInterval);
      window.clearTimeout(redirectTimeout);
    };
  }, [redirectTarget]);

  const formattedSubmittedAt = useMemo(
    () => formatSubmittedAt(submission?.submittedAt ?? new Date().toISOString()),
    [submission?.submittedAt],
  );
  const hasPreparedWhatsApp = submission?.whatsappRedirectReady && submission.whatsappUrl;

  return (
    <main className={styles.page}>
      <SiteHeader contactHref="/contact-us" logoHref="/" />

      <div className={styles.main}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>Contact Request Received</p>
          <h1>Thank you for reaching out.</h1>
          <p className={styles.heroLead}>
            We&apos;ve captured your inquiry successfully. Take a moment to review this confirmation
            before we hand you over to WhatsApp.
          </p>
          <p className={styles.heroNote}>
            You&apos;ll be redirected automatically in a few seconds. If the redirect does not happen,
            use the WhatsApp button below to continue manually.
          </p>
        </section>

        <section className={styles.content}>
          <div className={styles.panel}>
            <div className={styles.panelTitle}>
              <h2>Your request is on its way</h2>
              <p>
                Your contact form has already been submitted to Kapten Batik. This confirmation page is
                the final stop before WhatsApp opens for the next step.
              </p>
            </div>

            <div className={styles.fallback}>
              <span>Submission details</span>
              <p>
                {submission?.leadId
                  ? `Reference ID: ${submission.leadId}`
                  : "If you reached this page directly, we can still open WhatsApp for you from here."}
              </p>
              <p>Submitted at {formattedSubmittedAt}</p>
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelTitle}>
              <h2>Continue on WhatsApp</h2>
              <p>
                {hasPreparedWhatsApp
                  ? "We prepared your WhatsApp handoff using the message from your form. You can open it now or wait for the automatic redirect."
                  : "WhatsApp can still be opened manually from here if the prepared handoff is unavailable."}
              </p>
            </div>

            <div className={styles.actionStack}>
              <a
                className={styles.primaryButton}
                href={redirectTarget || "#"}
              >
                <WhatsAppIcon />
                Open WhatsApp
              </a>
              <Link className={styles.secondaryButton} href="/contact-us">
                Back to Contact Form
              </Link>
            </div>

            <p className={styles.countdown}>
              {redirectTarget
                ? `Redirecting in ${redirectInSeconds} second${redirectInSeconds === 1 ? "" : "s"}.`
                : "WhatsApp redirect is not available right now. You can still return to the contact form."}
            </p>
          </div>
        </section>

        <p className={styles.closing}>&quot;Traditional Soul. Contemporary Spirit.&quot;</p>
      </div>

      <StandardFooter brandHref="/" contactHref="/contact-us" />
    </main>
  );
}
