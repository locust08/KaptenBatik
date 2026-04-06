"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, startTransition, useRef, useState } from "react";
import { DEFAULT_REWARD_POINTS, setAccountState } from "@/lib/account-state";
import styles from "./auth-pages.module.css";

export function LoginPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const submitLogin = (formData: FormData) => {
    const identification = String(formData.get("identification") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();

    if (!identification || !password) {
      setStatusMessage("Please enter both identification and security key.");
      return;
    }

    setAccountState("logged-in", DEFAULT_REWARD_POINTS);
    setStatusMessage("Welcome back. Your loyalty balance is ready to grow.");
    startTransition(() => router.push("/"));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitLogin(new FormData(event.currentTarget));
  };

  const handlePrimaryClick = () => {
    if (!formRef.current) {
      return;
    }

    submitLogin(new FormData(formRef.current));
  };

  return (
    <main className={styles.loginPage}>
      <section className={styles.loginShell}>
        <div className={styles.loginMain}>
          <div className={`${styles.visualPanel} ${styles.loginVisual}`}>
            <div className={styles.loginVisualOverlay} />
            <div className={styles.loginVisualContent}>
              <h2 className={styles.loginVisualTitle}>Kapten Batik</h2>
              <div className={styles.loginVisualSubline}>
                <span className={styles.loginDivider} aria-hidden="true" />
                The Digital Atelier
              </div>
            </div>
          </div>

          <div className={styles.loginFormPanel}>
            <span aria-hidden="true" className={styles.loginWordmark}>
              Heritage
            </span>

            <div className={styles.loginFormWrap}>
              <header className={`${styles.authHeader} ${styles.loginHeader}`}>
                <h1>Welcome Back</h1>
                <p>
                  Enter your credentials to access your private curation and bespoke
                  orders within the Atelier.
                </p>
              </header>

              <form className={styles.authForm} onSubmit={handleSubmit} ref={formRef}>
                <div className={styles.fieldGrid}>
                  <div className={styles.field}>
                    <label htmlFor="login-identification">Identification</label>
                    <input
                      autoComplete="email"
                      id="login-identification"
                      name="identification"
                      placeholder="Enter Your Email Address"
                      required
                      type="email"
                    />
                  </div>

                  <div className={`${styles.field} ${styles.passwordField}`}>
                    <div className={styles.fieldSplit}>
                      <label htmlFor="login-password">Security Key</label>
                      <Link className={styles.forgotLink} href="/contact-us">
                        Forgotten?
                      </Link>
                    </div>
                    <input
                      autoComplete="current-password"
                      id="login-password"
                      name="password"
                      placeholder="Enter Your Password"
                      required
                      type={showPassword ? "text" : "password"}
                    />
                    <button
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className={styles.passwordToggle}
                      onClick={(event) => {
                        event.preventDefault();
                        setShowPassword((current) => !current);
                      }}
                      type="button"
                    >
                      <span className={styles.eyeball} aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <button className={styles.primaryCta} onClick={handlePrimaryClick} type="button">
                  Enter The Kapten Batik
                </button>

                <div className={styles.dividerRow}>Or Sign In Via</div>

                <button className={styles.secondaryButton} type="button">
                  <span aria-hidden="true" className={styles.googleBadge} />
                  Google
                </button>

                <div className={styles.loginBottomRow}>
                  <span>Not a member of our Heritage program?</span>
                  <Link className={styles.authInlineLink} href="/register">
                    Create Account {"\u2192"}
                  </Link>
                </div>

                {statusMessage ? <p className={styles.statusMessage}>{statusMessage}</p> : null}
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
