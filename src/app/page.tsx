"use client";

import Link from "next/link";
import { FormEvent, MouseEvent, TouchEvent, WheelEvent, useEffect, useRef, useState } from "react";
import {
  collectionOrder,
  collections,
  ctaContent,
  footerColumns,
  footerCopy,
  homeBrandPillars,
  type CollectionKey,
} from "@/data/collection-content";
import { SiteHeader } from "@/components/site-header";
import { BrandLogo } from "@/components/brand-logo";
import { ACCOUNT_STATE_CHANGE_EVENT, readAccountState } from "@/lib/account-state";
import { rememberCollectionTransition } from "@/lib/collection-transition";
import { setupScrollReveal } from "@/lib/setup-scroll-reveal";

const slotOffsets = [-2, -1, 0, 1, 2] as const;
const slotClasses = [
  "slot-outer-left is-outer",
  "slot-inner-left is-inner",
  "slot-center is-center",
  "slot-inner-right is-inner",
  "slot-outer-right is-outer",
] as const;
const initialCarouselIndex = Object.fromEntries(
  collectionOrder.map((key) => [key, collections[key].defaultActiveIndex]),
) as Record<CollectionKey, number>;
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
    href: "http://wa.me/01161745814",
    iconClassName: "sprite-whatsapp",
    label: "WhatsApp",
    src: "/figma-assets/footer/social-whatsapp.png",
  },
] as const;

function ScrollDownIcon() {
  return (
    <svg aria-hidden="true" className="hero-scroll-icon" fill="none" viewBox="0 0 32 32">
      <path
        d="M16 6.25V17.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.85"
      />
      <path
        d="M10.4 14.9L16 20.5L21.6 14.9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.85"
      />
      <path
        d="M11 25.25H21"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      className={`carousel-arrow-icon ${direction === "right" ? "is-right" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M14.5 6.5L9 12L14.5 17.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function MusicOnIcon() {
  return (
    <svg aria-hidden="true" className="hero-sound-icon" fill="none" viewBox="0 0 24 24">
      <path
        d="M5 15V9H8.5L13 5.5V18.5L8.5 15H5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M15.5 8.5C16.6 9.6 17.25 11.1 17.25 12.75C17.25 14.4 16.6 15.9 15.5 17"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path
        d="M18.75 6.25C20.45 7.95 21.5 10.25 21.5 12.75C21.5 15.25 20.45 17.55 18.75 19.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function MusicOffIcon() {
  return (
    <svg aria-hidden="true" className="hero-sound-icon" fill="none" viewBox="0 0 24 24">
      <path
        d="M5 15V9H8.5L13 5.5V18.5L8.5 15H5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M16.5 9.5L21 14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path
        d="M21 9.5L16.5 14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function CollectionDescription({ collectionKey }: { collectionKey: CollectionKey }) {
  const description = collections[collectionKey].description;

  if (description.lines?.length) {
    return (
      <p className="collection-copy">
        {description.lines.map((line) => (
          <span className="collection-copy-line" key={line}>
            {line}
          </span>
        ))}
      </p>
    );
  }

  if (!description.highlight) {
    return <p className="collection-copy">{description.before}</p>;
  }

  return (
    <p className="collection-copy">
      {description.before}
      <span className="collection-copy-highlight">{description.highlight}</span>
      {description.after}
    </p>
  );
}

export default function HomePage() {
  const [activeCollection, setActiveCollection] = useState<CollectionKey>("men");
  const [carouselIndex, setCarouselIndex] = useState(initialCarouselIndex);
  const [activePillarIndex, setActivePillarIndex] = useState(0);
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [isHeroVideoMuted, setHeroVideoMuted] = useState(true);
  const [accountState, setAccountState] = useState<"logged-out" | "logged-in">("logged-out");
  const [transitioningPath, setTransitioningPath] = useState<string | null>(null);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const collectionSectionRef = useRef<HTMLElement | null>(null);
  const peopleTouchStartRef = useRef<{ x: number; y: number } | null>(null);
  const mainRef = useRef<HTMLElement | null>(null);
  const collectionWheelDeltaRef = useRef(0);
  const collectionWheelCooldownRef = useRef<number | null>(null);
  const collectionTransitionTimeoutRef = useRef<number | null>(null);
  const brandPillarGridRef = useRef<HTMLDivElement | null>(null);
  const brandPillarCardRefs = useRef<(HTMLElement | null)[]>([]);

  const activeContent = collections[activeCollection];
  const activePersonIndex = carouselIndex[activeCollection];
  const activePeople = slotOffsets.map((offset, index) => {
    const length = activeContent.people.length;
    const resolvedIndex = (activePersonIndex + offset + length) % length;

    return {
      person: activeContent.people[resolvedIndex],
      slotClass: slotClasses[index],
    };
  });

  const handleCollectionChange = (collectionKey: CollectionKey) => {
    setActiveCollection(collectionKey);
  };

  useEffect(() => {
    return () => {
      if (collectionWheelCooldownRef.current !== null) {
        window.clearTimeout(collectionWheelCooldownRef.current);
      }
      if (collectionTransitionTimeoutRef.current !== null) {
        window.clearTimeout(collectionTransitionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => setupScrollReveal(mainRef.current), []);

  useEffect(() => {
    const grid = brandPillarGridRef.current;

    if (!grid) {
      return;
    }

    const updateActivePillar = () => {
      const cards = brandPillarCardRefs.current.filter(
        (card): card is HTMLElement => card !== null,
      );

      if (!cards.length) {
        return;
      }

      const gridRect = grid.getBoundingClientRect();
      const centerX = gridRect.left + gridRect.width / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distance = Math.abs(cardCenter - centerX);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActivePillarIndex(closestIndex);
    };

    updateActivePillar();
    grid.addEventListener("scroll", updateActivePillar, { passive: true });
    window.addEventListener("resize", updateActivePillar);

    return () => {
      grid.removeEventListener("scroll", updateActivePillar);
      window.removeEventListener("resize", updateActivePillar);
    };
  }, []);

  useEffect(() => {
    const syncAccountState = () => {
      setAccountState(readAccountState());
    };

    syncAccountState();
    window.addEventListener(ACCOUNT_STATE_CHANGE_EVENT, syncAccountState);
    window.addEventListener("storage", syncAccountState);

    return () => {
      window.removeEventListener(ACCOUNT_STATE_CHANGE_EVENT, syncAccountState);
      window.removeEventListener("storage", syncAccountState);
    };
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get("collection");
    if (query === "men" || query === "women" || query === "junior") {
      setActiveCollection(query);
    }

    if (window.location.hash === "#collection") {
      requestAnimationFrame(() => {
        collectionSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, []);

  useEffect(() => {
    const video = heroVideoRef.current;

    if (!video) {
      return;
    }

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.preload = "auto";

    const startPlayback = () => {
      void video.play().catch(() => {
        // If autoplay is blocked, the toggle remains available.
      });
    };

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      startPlayback();
      return;
    }

    video.addEventListener("canplay", startPlayback, { once: true });

    return () => {
      video.removeEventListener("canplay", startPlayback);
    };
  }, []);

  const scrollToCollection = (collectionKey: CollectionKey) => {
    handleCollectionChange(collectionKey);

    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("collection", collectionKey);
    nextUrl.hash = "collection";
    window.history.replaceState({}, "", nextUrl);

    requestAnimationFrame(() => {
      collectionSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const shiftPeople = (direction: "left" | "right") => {
    const step = direction === "right" ? -1 : 1;

    setCarouselIndex((current) => {
      const length = collections[activeCollection].people.length;
      return {
        ...current,
        [activeCollection]: (current[activeCollection] + step + length) % length,
      };
    });
  };

  const shiftCollection = (direction: -1 | 1) => {
    const currentIndex = collectionOrder.indexOf(activeCollection);
    const nextIndex = (currentIndex + direction + collectionOrder.length) % collectionOrder.length;
    const nextCollection = collectionOrder[nextIndex];

    setActiveCollection(nextCollection);

    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("collection", nextCollection);
    window.history.replaceState({}, "", nextUrl);
  };

  const handleCollectionWheel = (event: WheelEvent<HTMLElement>) => {
    const horizontalDelta = event.deltaX;
    const verticalDelta = event.deltaY;
    const isHorizontalSwipe = Math.abs(horizontalDelta) > Math.abs(verticalDelta) + 8;

    if (!isHorizontalSwipe || Math.abs(horizontalDelta) < 14) {
      return;
    }

    collectionWheelDeltaRef.current += horizontalDelta;

    if (Math.abs(collectionWheelDeltaRef.current) < 48) {
      return;
    }

    shiftPeople(collectionWheelDeltaRef.current > 0 ? "right" : "left");
    collectionWheelDeltaRef.current = 0;

    if (collectionWheelCooldownRef.current !== null) {
      window.clearTimeout(collectionWheelCooldownRef.current);
    }

    collectionWheelCooldownRef.current = window.setTimeout(() => {
      collectionWheelDeltaRef.current = 0;
      collectionWheelCooldownRef.current = null;
    }, 220);
  };

  const handleNewsletterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNewsletterMessage(
      "You're in. We'll share new arrivals and quiet highlights from the collection.",
    );
  };

  const toggleHeroVideoSound = async () => {
    const video = heroVideoRef.current;

    if (!video) {
      return;
    }

    const nextMuted = !isHeroVideoMuted;
    video.muted = nextMuted;
    video.volume = nextMuted ? 0 : 0.85;
    setHeroVideoMuted(nextMuted);

    if (!nextMuted) {
      try {
        await video.play();
      } catch {
        // Ignore autoplay rejections; the user can try again via the toggle.
      }
    }
  };

  const handleModelSelect = (detailPath: string) => {
    if (transitioningPath) {
      return;
    }

    setTransitioningPath(detailPath);
    rememberCollectionTransition(detailPath);

    collectionTransitionTimeoutRef.current = window.setTimeout(() => {
      window.location.assign(`${detailPath}#product-detail`);
    }, 280);
  };

  const handleModelClick = (
    event: MouseEvent<HTMLAnchorElement>,
    slotClass: string,
    detailPath?: string,
  ) => {
    const isLeftSide = slotClass.includes("left");
    const isRightSide = slotClass.includes("right");

    if (isLeftSide || isRightSide) {
      event.preventDefault();
      shiftPeople(isLeftSide ? "right" : "left");
      return;
    }

    if (!detailPath) {
      return;
    }

    event.preventDefault();
    handleModelSelect(detailPath);
  };

  const handlePeopleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];

    if (!touch) {
      return;
    }

    peopleTouchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  const handlePeopleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = peopleTouchStartRef.current;
    const touch = event.changedTouches[0];

    peopleTouchStartRef.current = null;

    if (!start || !touch) {
      return;
    }

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    if (Math.abs(deltaX) < 36 || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }

    shiftPeople(deltaX < 0 ? "right" : "left");
  };

  const handlePillarDotClick = (index: number) => {
    setActivePillarIndex(index);
    brandPillarCardRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  return (
    <main className="collection-page" ref={mainRef}>
      <SiteHeader
        activeCollection={activeCollection}
        contactHref="/contact-us"
        isPinned
        logoHref="#top"
        onCollectionSelect={scrollToCollection}
      />

      <section className="hero-section">
        <div className="hero-video-stage" aria-hidden="true">
          <video
            autoPlay
            className="hero-video"
            loop
            muted={isHeroVideoMuted}
            playsInline
            preload="auto"
            ref={heroVideoRef}
          >
            <source src="/kapten-site-assets/home/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="hero-video-overlay" />
        </div>

        <div className="hero-content">
          <div className="hero-copy scroll-reveal-root" data-reveal-root="">
            <p className="hero-eyebrow reveal-item" data-reveal-item="">
              Premium Batik, Refined
            </p>
            <h1 className="hero-title">
              <span className="reveal-item" data-reveal-item="">
                Modern Batik
              </span>
              <span className="reveal-item" data-reveal-item="">
                Made to
              </span>
              <span className="reveal-item" data-reveal-item="">
                Stand Out
              </span>
            </h1>
            <p className="hero-subtitle reveal-item" data-reveal-item="">
              Discover refined batik pieces crafted for modern wardrobes and elevated everyday wear.
            </p>
            <div className="hero-actions reveal-item" data-reveal-item="">
              <button
                className="hero-primary-button"
                onClick={() => scrollToCollection(activeCollection)}
                type="button"
              >
                Explore Collection
              </button>
              {accountState === "logged-out" ? (
                <Link className="hero-secondary-button" href="/register">
                  Join Rewards
                </Link>
              ) : null}
            </div>
            <button
              aria-pressed={!isHeroVideoMuted}
              aria-label={isHeroVideoMuted ? "Turn on music" : "Turn off music"}
              className="hero-sound-toggle reveal-item"
              data-reveal-item=""
              onClick={toggleHeroVideoSound}
              type="button"
            >
              {isHeroVideoMuted ? <MusicOffIcon /> : <MusicOnIcon />}
            </button>
          </div>
        </div>

        <button
          aria-label="Scroll to collection"
          className="hero-scroll-button"
          onClick={() => scrollToCollection(activeCollection)}
          type="button"
        >
          <ScrollDownIcon />
        </button>
      </section>

      <section
        className="collection-section"
        id="collection"
        onWheel={handleCollectionWheel}
        ref={collectionSectionRef}
      >
        <div aria-label="Collection type" className="collection-tabs" role="tablist">
          {collectionOrder.map((collectionKey) => {
            const isActive = activeCollection === collectionKey;

            return (
              <button
                aria-selected={isActive}
                className={`collection-tab ${isActive ? "is-active" : ""}`}
                key={collectionKey}
                onClick={() => handleCollectionChange(collectionKey)}
                role="tab"
                type="button"
              >
                {collections[collectionKey].label.toUpperCase()}
              </button>
            );
          })}
        </div>

        <div className="collection-panel">
          <header className="collection-intro scroll-reveal-root" data-reveal-root="">
            <h2 className="reveal-item" data-reveal-item="">
              {activeContent.heading}
            </h2>
            <div className="reveal-item" data-reveal-item="">
              <CollectionDescription collectionKey={activeCollection} />
            </div>
          </header>

          <div className="people-showcase">
            <button
              aria-label={`Move ${activeContent.label.toLowerCase()} looks left`}
              className="carousel-arrow is-left"
              onClick={() => shiftPeople("left")}
              type="button"
            >
              <ArrowIcon direction="left" />
            </button>

            <div
              aria-live="polite"
              className={`people-grid ${transitioningPath ? "is-transitioning" : ""}`}
              onTouchEnd={handlePeopleTouchEnd}
              onTouchStart={handlePeopleTouchStart}
            >
              {activePeople.map(({ person, slotClass }) => (
                <article
                  className={`person-card ${slotClass} ${
                    transitioningPath === person.detailPath ? "is-transition-selected" : ""
                  }`}
                  key={`${activeCollection}-${slotClass}`}
                >
                  {person.detailPath ? (
                    <Link
                      aria-label={`View ${person.name}`}
                      className="person-card-link"
                      href={person.detailPath}
                      onClick={(event) => handleModelClick(event, slotClass, person.detailPath)}
                    >
                      <div className="person-image-wrap">
                        <img alt={person.alt} className="person-image" src={person.image} />
                      </div>
                      <p className="person-name">{person.name}</p>
                    </Link>
                  ) : (
                    <>
                      <div className="person-image-wrap">
                        <img alt={person.alt} className="person-image" src={person.image} />
                      </div>
                      <p className="person-name">{person.name}</p>
                    </>
                  )}
                </article>
              ))}
            </div>

            <button
              aria-label={`Move ${activeContent.label.toLowerCase()} looks right`}
              className="carousel-arrow is-right"
              onClick={() => shiftPeople("right")}
              type="button"
            >
              <ArrowIcon direction="right" />
            </button>
          </div>
        </div>
      </section>

      <section className="brand-pillars-section scroll-reveal-root" data-reveal-root="" id="brand-story">
        <div className="brand-pillars-header">
          <p className="brand-pillars-eyebrow reveal-item" data-reveal-item="">
            Why Kapten Batik
          </p>
          <h2 className="brand-pillars-title reveal-item" data-reveal-item="">
            Made for modern dressing, grounded in Malaysian batik character.
          </h2>
        </div>

        <div className="brand-pillars-grid">
          {homeBrandPillars.map((pillar, index) => (
            <article
              className="brand-pillar-card reveal-item"
              data-reveal-item=""
              key={pillar.title}
              ref={(node) => {
                brandPillarCardRefs.current[index] = node;
              }}
              tabIndex={0}
            >
              <div className="brand-pillar-card-inner">
                <div className="brand-pillar-face brand-pillar-face-front">
                  <span className="brand-pillar-label">{pillar.label}</span>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.description}</p>
                  <span className="brand-pillar-metric">{pillar.metric}</span>
                </div>

                <div className="brand-pillar-face brand-pillar-face-back">
                  <img alt={pillar.imageAlt} className="brand-pillar-image" src={pillar.image} />
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="brand-pillars-dots" aria-label="Why Kapten Batik cards">
          {homeBrandPillars.map((pillar, index) => (
            <button
              aria-label={`Show ${pillar.title}`}
              aria-pressed={activePillarIndex === index}
              className={`brand-pillars-dot ${activePillarIndex === index ? "is-active" : ""}`}
              key={pillar.title}
              onClick={() => handlePillarDotClick(index)}
              type="button"
            />
          ))}
        </div>
      </section>

      <section className="cta-section" id="rewards-program">
        <div className="cta-background" />
        <div className="cta-frame cta-frame-top" />
        <div className="cta-frame cta-frame-bottom" />
        <div className="cta-shell">
          <div className="cta-content scroll-reveal-root" data-reveal-root="">
            <h2>
              <span className="reveal-item" data-reveal-item="">
                {ctaContent.title[0]}
              </span>
              <span className="reveal-item" data-reveal-item="">
                {ctaContent.title[1]}
              </span>
            </h2>
            <div
              className={`cta-actions reveal-item ${accountState === "logged-in" ? "is-account-logged-in" : ""}`}
              data-reveal-item=""
            >
              <a className="cta-button" href="#collection">
                {ctaContent.buttonLabel}
              </a>
              <div className="cta-rewards-anchor">
                <Link
                  aria-hidden={accountState === "logged-in"}
                  className={`cta-button cta-button-secondary ${accountState === "logged-in" ? "is-hidden" : ""}`}
                  href="/register"
                  tabIndex={accountState === "logged-in" ? -1 : 0}
                >
                  Register To Earn Points
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      <footer className="site-footer" id="footer">
        <div className="footer-grid scroll-reveal-root" data-reveal-root="">
          <div className="footer-brand reveal-item" data-reveal-item="">
            <a aria-label="Kapten Batik" className="brand-mark brand-mark-footer" href="#top">
              <BrandLogo />
            </a>
            <p>{footerCopy.brandDescription}</p>
          </div>

          {footerColumns.map((column) => (
            <div className="footer-column reveal-item" data-reveal-item="" key={column.title}>
              <h3>{column.title}</h3>
              <ul>
                {column.items.map((item) => (
                  <li key={item}>
                    {item.toLowerCase().includes("contact") ? (
                      <Link className="footer-link-button" href="/contact-us">
                        {item}
                      </Link>
                    ) : (
                      <button
                        className="footer-link-button"
                        onClick={() =>
                          scrollToCollection(
                            item.toLowerCase().includes("women")
                              ? "women"
                              : item.toLowerCase().includes("junior")
                                ? "junior"
                                : "men",
                          )
                        }
                        type="button"
                      >
                        {item}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="footer-column footer-newsletter reveal-item" data-reveal-item="">
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
              {newsletterMessage ? (
                <span className="newsletter-message">{newsletterMessage}</span>
              ) : null}
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

        <div className="footer-legal scroll-reveal-root" data-reveal-root="">
          <span className="reveal-item" data-reveal-item="">
            {footerCopy.copyright}
          </span>
        </div>
      </footer>
    </main>
  );
}
