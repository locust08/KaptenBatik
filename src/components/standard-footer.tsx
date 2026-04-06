"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import {
  footerCollectionHrefs,
  footerColumns,
  footerCopy,
} from "@/data/collection-content";

const socialLinks = [
  {
    className: "is-facebook",
    href: "https://www.facebook.com/kapten.batik/",
    iconClassName: "sprite-facebook",
    label: "Facebook",
    src: "/figma-assets/footer/social-sprite-99.png",
  },
  {
    className: "is-instagram",
    href: "https://www.instagram.com/kapten.batik/",
    iconClassName: "sprite-instagram",
    label: "Instagram",
    src: "/figma-assets/footer/social-sprite-99.png",
  },
  {
    className: "is-youtube",
    href: "https://www.youtube.com/@KaptenBatik",
    iconClassName: "sprite-youtube",
    label: "YouTube",
    src: "/figma-assets/footer/social-youtube.png",
  },
  {
    className: "is-tiktok",
    href: "https://www.tiktok.com/@Kapten.Batik",
    iconClassName: "sprite-tiktok",
    label: "TikTok",
    src: "/figma-assets/footer/social-tiktok.png",
  },
  {
    className: "is-whatsapp",
    href: "http://wa.me/60183814392",
    iconClassName: "sprite-whatsapp",
    label: "WhatsApp",
    src: "/figma-assets/footer/social-whatsapp.png",
  },
] as const;

type StandardFooterProps = {
  brandHref?: string;
  contactHref?: string;
};

export function StandardFooter({
  brandHref = "/",
  contactHref = "/contact-us",
}: StandardFooterProps) {
  const [newsletterMessage, setNewsletterMessage] = useState("");

  const handleNewsletterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNewsletterMessage(
      "You're in. We'll share new arrivals and quiet highlights from the collection.",
    );
  };

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link aria-label="Kapten Batik" className="brand-mark brand-mark-footer" href={brandHref}>
            <BrandLogo />
          </Link>
          <p>{footerCopy.brandDescription}</p>
        </div>

        {footerColumns.map((column) => (
          <div className="footer-column" key={column.title}>
            <h3>{column.title}</h3>
            <ul>
              {column.items.map((item) => (
                <li key={item}>
                  {item.toLowerCase().includes("contact") ? (
                    <Link className="footer-link-button" href={contactHref}>
                      {item}
                    </Link>
                  ) : (
                    <Link
                      className="footer-link-button"
                      href={footerCollectionHrefs[item as keyof typeof footerCollectionHrefs]}
                    >
                      {item}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="footer-column footer-newsletter">
          <h3>Newsletter</h3>
          <p>{footerCopy.newsletterBlurb}</p>

          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <div className="newsletter-row">
              <input
                aria-label="Email address"
                name="email"
                placeholder="EMAIL ADDRESS"
                required
                type="email"
              />
              <button type="submit">JOIN</button>
            </div>
            {newsletterMessage ? <span className="newsletter-message">{newsletterMessage}</span> : null}
          </form>

          <div aria-label="Social links" className="social-links">
            {socialLinks.map((link) => (
              <a
                aria-label={link.label}
                className={`social-link ${link.className}`}
                href={link.href}
                key={link.label}
                rel="noreferrer"
                target="_blank"
              >
                <span aria-hidden="true" className={`social-icon-crop ${link.iconClassName}`}>
                  <img alt="" src={link.src} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-legal">{footerCopy.copyright}</div>
    </footer>
  );
}
