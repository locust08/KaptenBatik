"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, startTransition, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { SIGN_UP_BONUS_POINTS, setAccountState } from "@/lib/account-state";
import styles from "./auth-pages.module.css";

const interests = ["MEN", "WOMEN", "JUNIOR"] as const;

export function RegisterPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [selectedInterest, setSelectedInterest] = useState<(typeof interests)[number]>("MEN");
  const [isAgreed, setAgreed] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const submitRegistration = (formData: FormData) => {
    const fullName = String(formData.get("fullName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const birthDate = String(formData.get("birthDate") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();
    const hasAgreement = formData.get("agreement") === "on";

    if (!fullName || !email || !birthDate || !password) {
      setStatusMessage("Please complete every field before joining.");
      return;
    }

    if (!hasAgreement) {
      setStatusMessage("Please accept the Privacy Policy and Terms of Service.");
      return;
    }

    setAccountState("logged-in", SIGN_UP_BONUS_POINTS);
    setStatusMessage(`Welcome, ${fullName}. You received ${SIGN_UP_BONUS_POINTS} sign-up points.`);
    startTransition(() => router.push("/"));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitRegistration(new FormData(event.currentTarget));
  };

  const handlePrimaryClick = () => {
    if (!formRef.current) {
      return;
    }

    submitRegistration(new FormData(formRef.current));
  };

  return (
    <main className={styles.registerPage}>
      <section className={styles.registerShell}>
        <header className={styles.registerHeader}>
          <Link aria-label="Kapten Batik" className="brand-mark" href="/">
            <BrandLogo />
          </Link>

          <Link className={styles.registerHeaderAction} href="/">
            <span className={styles.registerHeaderClose} aria-hidden="true">
              ×
            </span>
            Exit
          </Link>
        </header>

        <div className={styles.registerMain}>
          <div className={`${styles.visualPanel} ${styles.registerVisual}`}>
            <div className={styles.registerVisualOverlay} />
            <div className={styles.registerVisualContent}>
              <span className={styles.registerBadge}>Kapten Batik</span>
              <h2 className={styles.registerVisualTitle}>
                Crafting
                <br />
                Modern
                <br />
                Heritage
              </h2>
              <p className={styles.registerVisualCopy}>
                Join an exclusive circle where traditional Malaysian craftsmanship
                meets contemporary luxury silhouettes.
              </p>
            </div>
          </div>

          <div className={styles.registerFormPanel}>
            <span aria-hidden="true" className={styles.registerMonogram}>
              B
            </span>

            <div className={styles.registerFormWrap}>
              <header className={styles.authHeader}>
                <h1>Create Your Profile</h1>
                <p>
                  Enter the world of Kapten Batik. Exclusive collections and bespoke
                  experiences await.
                </p>
              </header>

              <form className={styles.authForm} onSubmit={handleSubmit} ref={formRef}>
                <div className={styles.fieldGrid}>
                  <div className={styles.field}>
                    <label htmlFor="register-full-name">Full Name</label>
                    <input
                      autoComplete="name"
                      id="register-full-name"
                      name="fullName"
                      placeholder="Enter Your Full Name"
                      required
                      type="text"
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="register-email">Email Address</label>
                    <input
                      autoComplete="email"
                      id="register-email"
                      name="email"
                      placeholder="Enter Your Email Address"
                      required
                      type="email"
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="register-birth-date">Birth Date</label>
                    <input
                      autoComplete="bday"
                      id="register-birth-date"
                      name="birthDate"
                      placeholder="Enter Your Birth Date"
                      required
                      type="date"
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="register-password">Password</label>
                    <input
                      autoComplete="new-password"
                      id="register-password"
                      minLength={8}
                      name="password"
                      placeholder="Enter Your Password"
                      required
                      type="password"
                    />
                  </div>

                  <fieldset className={styles.field}>
                    <legend className={styles.fieldLegend}>Interested In</legend>
                    <div className={styles.choiceGroup}>
                      {interests.map((interest) => (
                        <button
                          className={`${styles.choiceButton} ${selectedInterest === interest ? styles.activeChoice : ""}`}
                          key={interest}
                          onClick={(event) => {
                            event.preventDefault();
                            setSelectedInterest(interest);
                          }}
                          type="button"
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                    <input name="interest" type="hidden" value={selectedInterest} />
                  </fieldset>
                </div>

                <button className={styles.primaryCta} onClick={handlePrimaryClick} type="button">
                  Join The Kapten Batik
                  <span aria-hidden="true" className={styles.ctaArrow}>
                    →
                  </span>
                </button>

                <div className={styles.secondaryStack}>
                  <label className={styles.agreementRow}>
                    <input
                      checked={isAgreed}
                      name="agreement"
                      onChange={(event) => setAgreed(event.target.checked)}
                      type="checkbox"
                    />
                    <span>
                      I agree to the <a href="/contact-us">Privacy Policy</a> and{" "}
                      <a href="/contact-us">Terms of Service</a>.
                    </span>
                  </label>

                  <p className={styles.authFooterText}>
                    Already a member? <Link className={styles.authInlineLink} href="/login">Sign In</Link>
                  </p>

                  {statusMessage ? <p className={styles.statusMessage}>{statusMessage}</p> : null}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
