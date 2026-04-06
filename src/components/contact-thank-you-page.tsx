"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { StandardFooter } from "@/components/standard-footer";
import {
  buildContactWhatsAppHref,
  CONTACT_INQUIRY_STORAGE_KEY,
  CONTACT_WHATSAPP_PHONE,
  type ContactInquiry,
} from "@/lib/contact-inquiry";
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
  const [inquiry, setInquiry] = useState<ContactInquiry | null>(null);
  const [redirectTarget, setRedirectTarget] = useState("");
  const [redirectInSeconds, setRedirectInSeconds] = useState(3);

  useEffect(() => {
    const storedInquiry = window.sessionStorage.getItem(CONTACT_INQUIRY_STORAGE_KEY);

    if (!storedInquiry) {
      setInquiry(null);
      setRedirectTarget(`https://wa.me/${CONTACT_WHATSAPP_PHONE}`);
      return;
    }

    try {
      const parsedInquiry = JSON.parse(storedInquiry) as Partial<ContactInquiry>;

      if (
        typeof parsedInquiry.fullName === "string" &&
        typeof parsedInquiry.email === "string" &&
        typeof parsedInquiry.message === "string" &&
        typeof parsedInquiry.type === "string" &&
        typeof parsedInquiry.submittedAt === "string"
      ) {
        const contactInquiry = parsedInquiry as ContactInquiry;
        setInquiry(contactInquiry);
        setRedirectTarget(buildContactWhatsAppHref(contactInquiry));
        window.sessionStorage.removeItem(CONTACT_INQUIRY_STORAGE_KEY);
        return;
      }
    } catch {
      // Fall through to the fallback view.
    }

    setInquiry(null);
    setRedirectTarget(`https://wa.me/${CONTACT_WHATSAPP_PHONE}`);
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
    }, 3000);

    return () => {
      window.clearInterval(countdownInterval);
      window.clearTimeout(redirectTimeout);
    };
  }, [redirectTarget]);

  const formattedSubmittedAt = useMemo(() => {
    if (!inquiry) {
      return "";
    }

    return formatSubmittedAt(inquiry.submittedAt);
  }, [inquiry]);

  return (
    <main className={styles.page}>
      <SiteHeader contactHref="/contact-us" logoHref="/" />

      <div className={styles.main}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>Contact Request Received</p>
          <h1>Thank you for reaching out.</h1>
          <p className={styles.heroLead}>
            We&apos;ve captured your inquiry and are opening WhatsApp so you can continue the conversation
            with the message you just shared.
          </p>
          <p className={styles.heroNote}>
            You&apos;ll be redirected automatically in a few seconds. If the redirect does not happen,
            use the WhatsApp button below.
          </p>
        </section>

        <section className={styles.content}>
          <div className={styles.panel}>
            <div className={styles.panelTitle}>
              <h2>Your submitted message</h2>
              <p>
                We&apos;ll send your message to WhatsApp so the customer care team can respond faster.
              </p>
            </div>

            {inquiry ? (
              <div className={styles.inquiryCard}>
                <div className={styles.inquiryRow}>
                  <span>Name</span>
                  <strong>{inquiry.fullName}</strong>
                </div>
                <div className={styles.inquiryRow}>
                  <span>Email</span>
                  <strong>{inquiry.email}</strong>
                </div>
                <div className={styles.inquiryRow}>
                  <span>Inquiry Type</span>
                  <strong>{inquiry.type}</strong>
                </div>
                <div className={styles.inquiryRow}>
                  <span>Message</span>
                  <p className={styles.inquiryMessage}>{inquiry.message}</p>
                </div>
                <div className={styles.inquiryRow}>
                  <span>Submitted</span>
                  <strong>{formattedSubmittedAt}</strong>
                </div>
              </div>
            ) : (
              <div className={styles.fallback}>
                <span>Fallback mode</span>
                <p>
                  We could not find your saved inquiry, so WhatsApp will open without the prefilled
                  message. You can still continue the conversation from there.
                </p>
              </div>
            )}
          </div>

          <div className={styles.panel}>
            <div className={styles.panelTitle}>
              <h2>Continue on WhatsApp</h2>
              <p>
                Tap the button below if you want to go straight there now, or wait for the automatic
                handoff.
              </p>
            </div>

            <div className={styles.actionStack}>
              <a
                className={styles.primaryButton}
                href={redirectTarget || `https://wa.me/${CONTACT_WHATSAPP_PHONE}`}
              >
                <WhatsAppIcon />
                Open WhatsApp
              </a>
              <Link className={styles.secondaryButton} href="/contact-us">
                Back to Contact Form
              </Link>
            </div>

            <p className={styles.countdown}>
              Redirecting in {redirectInSeconds} second{redirectInSeconds === 1 ? "" : "s"}.
            </p>
          </div>
        </section>

        <p className={styles.closing}>&quot;Traditional Soul. Contemporary Spirit.&quot;</p>
      </div>

      <StandardFooter brandHref="/" contactHref="/contact-us" />
    </main>
  );
}
