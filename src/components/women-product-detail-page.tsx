"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { parsePrice, useCart } from "@/components/cart-provider";
import {
  footerCollectionHrefs,
  footerColumns,
  footerCopy,
} from "@/data/collection-content";
import {
  womenProductDetails,
  womenProductSlugs,
  WomenProductDetail,
} from "@/data/women-product-details";
import { ProductDetailTrustIcon } from "@/components/product-detail-trust-icon";
import { SiteHeader } from "@/components/site-header";
import { BrandLogo } from "@/components/brand-logo";
import {
  consumeCollectionTransition,
  rememberCollectionTransition,
} from "@/lib/collection-transition";
import { buildProductReviewCards } from "@/lib/product-detail-reviews";
import { setupScrollReveal } from "@/lib/setup-scroll-reveal";
import styles from "./men-product-detail-page.module.css";

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

export function WomenProductDetailPage({ product }: { product: WomenProductDetail }) {
  const isRioRedPage = product.slug === "kurung-kedah-set-melody-heritage-rio-red";
  const isWauPage = product.slug === "kb-x-saarat-mahira-long-dress-wau";
  const hasLiftedModel =
    product.slug === "kurung-kedah-set-forest-melody-campanula" ||
    product.slug === "kb-x-saarat-mahira-long-dress-wau";
  const router = useRouter();
  const { addItem, prepareCheckout } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.selectedSize ?? product.sizes?.[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [hasCollectionTransition, setHasCollectionTransition] = useState(false);
  const [transitioningPath, setTransitioningPath] = useState<string | null>(null);
  const mainRef = useRef<HTMLElement | null>(null);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const reviewGridRef = useRef<HTMLDivElement | null>(null);
  const [isHeaderPinned, setHeaderPinned] = useState(false);
  const previewImages = [product.mainImage, ...product.thumbnails].slice(0, 4);
  const [previewImageIndex, setPreviewImageIndex] = useState<number | null>(null);
  const sizeGuideImages = Array.isArray(product.sizeGuideHref)
    ? product.sizeGuideHref
    : product.sizeGuideHref
      ? [product.sizeGuideHref]
      : [];
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const reviewCards = buildProductReviewCards("women", product.whyLove);
  const currentProductIndex = womenProductSlugs.indexOf(product.slug);
  const previousProduct =
    womenProductDetails[
      womenProductSlugs[
        (currentProductIndex - 1 + womenProductSlugs.length) % womenProductSlugs.length
      ]
    ];
  const nextProduct =
    womenProductDetails[womenProductSlugs[(currentProductIndex + 1) % womenProductSlugs.length]];

  const buildCartItem = () => ({
    category: "Women's Batik",
    collection: "women" as const,
    href: `/women/${product.slug}`,
    image: product.mainImage,
    name: product.title,
    price: product.price,
    quantity,
    size: selectedSize || "Free Size",
    slug: product.slug,
    unitPrice: parsePrice(product.price),
  });

  useEffect(() => {
    if (previewImageIndex === null && !sizeGuideOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPreviewImageIndex(null);
        setSizeGuideOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewImageIndex, sizeGuideOpen]);

  useEffect(() => {
    setHasCollectionTransition(consumeCollectionTransition(`/women/${product.slug}`));
  }, [product.slug]);

  useEffect(() => setupScrollReveal(mainRef.current), []);

  useEffect(() => {
    const container = reviewGridRef.current;

    if (!container) {
      return;
    }

    const updateActiveReview = () => {
      const cards = Array.from(container.children) as HTMLElement[];

      if (!cards.length) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const targetCenter = containerRect.left + containerRect.width / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distance = Math.abs(cardCenter - targetCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveReviewIndex(closestIndex);
    };

    updateActiveReview();
    container.addEventListener("scroll", updateActiveReview, { passive: true });
    window.addEventListener("resize", updateActiveReview);

    return () => {
      container.removeEventListener("scroll", updateActiveReview);
      window.removeEventListener("resize", updateActiveReview);
    };
  }, []);

  useEffect(() => {
    const heroSection = heroSectionRef.current;

    if (!heroSection) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeaderPinned(!entry.isIntersecting);
      },
      {
        threshold: 0,
      },
    );

    observer.observe(heroSection);

    return () => observer.disconnect();
  }, []);

  const handleAddToCart = () => {
    addItem(buildCartItem());
  };

  const handleBuyNow = () => {
    prepareCheckout([buildCartItem()]);
    router.push("/checkout");
  };

  const handleDetailSelect = (detailPath: string) => {
    if (transitioningPath) {
      return;
    }

    setTransitioningPath(detailPath);
    rememberCollectionTransition(detailPath);

    window.setTimeout(() => {
      window.location.assign(`${detailPath}#product-detail`);
    }, 280);
  };

  return (
    <main
      ref={mainRef}
      className={`${styles.page} ${isRioRedPage ? styles.loweredModelPage : ""} ${
        isWauPage ? styles.wauPage : ""
      } ${
        hasLiftedModel ? styles.liftedModelPage : ""
      } ${
        hasCollectionTransition ? styles.hasCollectionTransition : ""
      }`}
      style={
        {
          "--product-accent": product.accent,
          "--product-hero-bg": product.heroBackgroundColor ?? product.accent,
          "--product-label": product.heroLabelColor ?? product.accent,
          "--note-color": product.noteColor,
          "--hero-text": product.heroPanelTextColor ?? "#ffffff",
          "--primary-text": product.addToCartTextColor ?? "#ffffff",
          "--secondary-text": product.buyNowTextColor ?? product.accent,
        } as CSSProperties
      }
    >
      <SiteHeader
        activeCollection="women"
        contactHref="/contact-us"
        isPinned={isHeaderPinned}
        logoHref="/"
        variant="product"
      />

      <section className={styles.heroSection} id="product-detail" ref={heroSectionRef}>
        <div className={styles.heroWrap}>
          <div className={styles.heroVisual}>
            <Link className={styles.backLink} href="/?collection=women#collection">
              &lt; Back
            </Link>

            <div className={styles.heroDescription}>
              {product.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <button
              aria-label="Open product image gallery"
              className={styles.heroImageButton}
              onClick={() => setPreviewImageIndex(0)}
              type="button"
            >
              <img alt={product.title} className={styles.heroImage} src={product.mainImage} />
            </button>
            <h1 className={styles.heroTitle}>{product.title}</h1>
          </div>

          <button
            aria-label={`Show previous cloth: ${previousProduct.title}`}
            className={`${styles.heroNavButton} ${styles.heroNavPrev}`}
            onClick={() => handleDetailSelect(`/women/${previousProduct.slug}`)}
            type="button"
          >
            <span aria-hidden="true" className={styles.heroNavArrow}>
              &larr;
            </span>
            <span className={styles.heroNavCopy}>
              <span className={styles.heroNavLabel}>Previous Cloth</span>
              <span className={styles.heroNavTitle}>{previousProduct.title}</span>
            </span>
          </button>

          <button
            aria-label={`Show next cloth: ${nextProduct.title}`}
            className={`${styles.heroNavButton} ${styles.heroNavNext}`}
            onClick={() => handleDetailSelect(`/women/${nextProduct.slug}`)}
            type="button"
          >
            <span className={styles.heroNavCopy}>
              <span className={styles.heroNavLabel}>Next Cloth</span>
              <span className={styles.heroNavTitle}>{nextProduct.title}</span>
            </span>
            <span aria-hidden="true" className={styles.heroNavArrow}>
              &rarr;
            </span>
          </button>

          <aside className={styles.heroSidebar}>
            <p className={styles.price}>{product.price}</p>
            <div className={styles.ratingSummary}>
              <span aria-label={`${reviewCards[0]?.rating ?? 5} out of 5 stars`} className={styles.ratingStars}>
                {"★".repeat(reviewCards[0]?.rating ?? 5)}
              </span>
              <span className={styles.ratingValue}>
                {(
                  reviewCards.reduce((total, review) => total + review.rating, 0) / reviewCards.length
                ).toFixed(1)}
              </span>
              <span className={styles.ratingCount}>{reviewCards.length} Reviews</span>
            </div>

            {product.sizes?.length ? (
              <div className={styles.controlGroup}>
                <div className={styles.controlLabelRow}>
                <div className={styles.controlLabel}>Select Size</div>
                  {sizeGuideImages.length ? (
                    <button
                      className={styles.sizeGuide}
                      onClick={() => setSizeGuideOpen(true)}
                      type="button"
                    >
                      Size Guide
                    </button>
                  ) : null}
                </div>
                <div className={styles.sizeOptions}>
                  {product.sizes.map((size) => (
                    <button
                      className={`${styles.sizeButton} ${
                        selectedSize === size ? styles.sizeButtonActive : ""
                      }`}
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      type="button"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className={styles.controlGroup}>
              <div className={styles.controlLabel}>Quantity</div>
              <div className={styles.quantity}>
                <button
                  aria-label="Decrease quantity"
                  className={styles.quantityButton}
                  disabled={quantity === 1}
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  type="button"
                >
                  <span aria-hidden="true">-</span>
                </button>
                <span className={styles.quantityValueWrap}>
                  <span className={styles.quantityValue}>{quantity}</span>
                  <span className={styles.quantityMeta}>pcs</span>
                </span>
                <button
                  aria-label="Increase quantity"
                  className={styles.quantityButton}
                  onClick={() => setQuantity((current) => current + 1)}
                  type="button"
                >
                  <span aria-hidden="true">+</span>
                </button>
              </div>
            </div>

            <div className={styles.actionsColumn}>
              <button className={styles.primaryButton} onClick={handleAddToCart} type="button">
                Add to Cart
              </button>
              <button className={styles.secondaryButton} onClick={handleBuyNow} type="button">
                Buy Now
              </button>
            </div>

            <div className={styles.thumbnails}>
              {previewImages.map((thumbnail, index) => (
                <button
                  aria-label={`Preview product image ${index + 1}`}
                  className={styles.thumbnailButton}
                  key={`${thumbnail}-${index}`}
                  onClick={() => setPreviewImageIndex(index)}
                  type="button"
                >
                  <img alt="" src={thumbnail} />
                </button>
              ))}
            </div>

            {product.careNotes.length ? (
              <ul className={styles.careNotes}>
                {product.careNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            ) : null}
          </aside>
        </div>
      </section>

      {sizeGuideOpen ? (
        <div
          aria-modal="true"
          className={styles.previewModal}
          onClick={() => setSizeGuideOpen(false)}
          role="dialog"
        >
          <div
            className={`${styles.previewPanel} ${styles.sizeGuidePanel}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.previewHeader}>
              <div>
                <p className={styles.previewEyebrow}>Size Guide</p>
                <h2 className={styles.previewTitle}>{product.title}</h2>
              </div>
              <span className={styles.previewCount}>
                {sizeGuideImages.length} {sizeGuideImages.length === 1 ? "Guide" : "Guides"}
              </span>
            </div>
            <button
              aria-label="Close size guide"
              className={styles.previewClose}
              onClick={() => setSizeGuideOpen(false)}
              type="button"
            >
              Close
            </button>
            <div className={styles.sizeGuideBody}>
              {sizeGuideImages.map((image, index) => (
                <div className={styles.sizeGuideFrame} key={`${image}-${index}`}>
                  <img
                    alt={`${product.title} size guide ${index + 1}`}
                    className={styles.sizeGuideImage}
                    src={image}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {previewImageIndex !== null ? (
        <div
          aria-modal="true"
          className={styles.previewModal}
          onClick={() => setPreviewImageIndex(null)}
          role="dialog"
        >
          <div className={styles.previewPanel} onClick={(event) => event.stopPropagation()}>
            <div className={styles.previewHeader}>
              <div>
                <p className={styles.previewEyebrow}>Image Gallery</p>
                <h2 className={styles.previewTitle}>{product.title}</h2>
              </div>
              <span className={styles.previewCount}>
                {previewImageIndex + 1} / {previewImages.length}
              </span>
            </div>
            <button
              aria-label="Close image preview"
              className={styles.previewClose}
              onClick={() => setPreviewImageIndex(null)}
              type="button"
            >
              Close
            </button>
            <div className={styles.previewBody}>
              <div className={styles.previewImageFrame}>
                <img
                  alt={product.title}
                  className={styles.previewImage}
                  src={previewImages[previewImageIndex]}
                />
              </div>
              <div className={styles.previewRail}>
                <p className={styles.previewRailLabel}>Set featured image</p>
                <div className={styles.previewThumbnails}>
                  {previewImages.map((thumbnail, index) => (
                    <button
                      aria-label={`Show preview image ${index + 1}`}
                      className={`${styles.previewThumbButton} ${
                        previewImageIndex === index ? styles.previewThumbActive : ""
                      }`}
                      key={`${thumbnail}-preview-${index}`}
                      onClick={() => setPreviewImageIndex(index)}
                      type="button"
                    >
                      <img alt="" src={thumbnail} />
                    </button>
                  ))}
                </div>
                <p className={styles.previewHelp}>
                  Browse every angle here while the main hero image stays anchored on the page.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className={`${styles.warning} ${styles.scrollRevealRoot}`} data-reveal-root="">
        <span className={styles.revealItem} data-reveal-item="">
          {product.noteText}
        </span>
      </div>

      <section className={styles.trustSection}>
        <div className={`${styles.trustRow} ${styles.scrollRevealRoot}`} data-reveal-root="">
          {product.trustBadges.map((badge) => (
            <div
              className={`${styles.trustItem} ${styles.revealItem}`}
              data-reveal-item=""
              key={badge.title}
            >
              <span aria-hidden="true" className={styles.trustIcon}>
                <ProductDetailTrustIcon title={badge.title} />
              </span>
              <div>
                <h3>{badge.title}</h3>
                <p>{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.whyLove}>
        <div className={`${styles.whyCopy} ${styles.scrollRevealRoot}`} data-reveal-root="">
          <h2 className={styles.revealItem} data-reveal-item="">
            {product.introTitle}
          </h2>
          <div className={styles.whyList}>
            {product.whyLove.map((item, index) => (
              <div
                className={`${styles.whyItem} ${styles.revealItem}`}
                data-reveal-item=""
                key={item.title}
              >
                <span className={styles.whyIndex}>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.whyMedia}>
          <img alt="" src={product.featureImage} />
        </div>
      </section>

      <section className={`${styles.reviewSection} ${styles.scrollRevealRoot}`} data-reveal-root="">
        <div className={styles.reviewHeader}>
          <div className={styles.revealItem} data-reveal-item="">
            <div className={styles.relatedEyebrow}>Reviews</div>
            <h2>What People Notice First</h2>
          </div>
          <p className={`${styles.reviewSummary} ${styles.revealItem}`} data-reveal-item="">
            A quick read on drape, comfort, and the details that shape the look.
          </p>
        </div>

        <div className={styles.reviewGrid} ref={reviewGridRef}>
          {reviewCards.map((review) => (
            <article
              className={`${styles.reviewCard} ${styles.revealItem}`}
              data-reveal-item=""
              key={review.label}
            >
              <div className={styles.reviewCardTop}>
                <span className={styles.reviewTag}>{review.label}</span>
                <span aria-label={`${review.rating} out of 5 stars`} className={styles.reviewStars}>
                  {"★".repeat(review.rating)}
                </span>
              </div>
              <h3>{review.focus}</h3>
              <p>{review.quote}</p>
            </article>
          ))}
        </div>

        <div className={styles.reviewDots}>
          {reviewCards.map((review, index) => (
            <button
              className={`${styles.reviewDot} ${activeReviewIndex === index ? "is-active" : ""}`}
              key={`${review.label}-dot`}
              onClick={() => {
                const container = reviewGridRef.current;
                const card = container?.children.item(index) as HTMLElement | null;

                card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
              }}
              type="button"
            />
          ))}
        </div>
      </section>

      <section className={`${styles.related} ${styles.scrollRevealRoot}`} data-reveal-root="">
        <div className={styles.relatedHeader}>
          <div className={styles.revealItem} data-reveal-item="">
            <div className={styles.relatedEyebrow}>The Collection</div>
            <h2>You May Also Like</h2>
          </div>
          <Link
            className={`${styles.relatedMore} ${styles.revealItem}`}
            data-reveal-item=""
            href="/?collection=women#collection"
          >
            View All
          </Link>
        </div>

        <div className={styles.relatedGrid}>
          {product.related.map((item) => (
            <Link
              className={`${styles.relatedCard} ${styles.revealItem}`}
              data-reveal-item=""
              href={`/women/${item.slug}`}
              key={item.slug}
              onClick={(event) => {
                event.preventDefault();
                handleDetailSelect(`/women/${item.slug}`);
              }}
            >
              <img alt={item.label} src={item.image} />
              <h3>{item.label}</h3>
              <p>{item.price}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <div className={`${styles.ctaPanel} ${styles.scrollRevealRoot}`} data-reveal-root="">
          <h2 className={styles.revealItem} data-reveal-item="">
            Ready to Make It Yours?
          </h2>
          <div className={`${styles.ctaButtons} ${styles.revealItem}`} data-reveal-item="">
            <button className={styles.ctaPrimary} onClick={handleBuyNow} type="button">
              Proceed to Checkout
            </button>
            <Link className={styles.ctaSecondary} href="/?collection=women#collection">
              Browse More
            </Link>
          </div>
        </div>
      </section>

      <footer className={styles.footer} id="footer">
        <div className={`${styles.footerGrid} ${styles.scrollRevealRoot}`} data-reveal-root="">
          <div className={`${styles.footerBrand} ${styles.revealItem}`} data-reveal-item="">
            <Link aria-label="Kapten Batik" className={`brand-mark ${styles.footerLogo}`} href="/">
              <BrandLogo />
            </Link>
            <p>{footerCopy.brandDescription}</p>
          </div>

          {footerColumns.map((column) => (
            <div
              className={`${styles.footerColumn} ${styles.revealItem}`}
              data-reveal-item=""
              key={column.title}
            >
              <h3>{column.title}</h3>
              <ul>
                {column.items.map((item) => (
                  <li key={item}>
                    {item.toLowerCase().includes("contact") ? (
                      <Link href="/contact-us">{item}</Link>
                    ) : (
                      <Link
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

          <div className={`${styles.footerColumn} ${styles.revealItem}`} data-reveal-item="">
            <h3>Newsletter</h3>
            <p>{footerCopy.newsletterBlurb}</p>

            <form className={styles.newsletterForm}>
              <div className={styles.newsletterRow}>
                <input
                  aria-label="Email address"
                  name="email"
                  placeholder="EMAIL ADDRESS"
                  required
                  type="email"
                />
                <button type="submit">JOIN</button>
              </div>
              <span className={styles.newsletterMessage}>
                Stay tuned for new batik arrivals.
              </span>
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

        <div className={`${styles.footerLegal} ${styles.scrollRevealRoot}`} data-reveal-root="">
          <span className={styles.revealItem} data-reveal-item="">
            {footerCopy.copyright}
          </span>
        </div>
      </footer>
    </main>
  );
}
