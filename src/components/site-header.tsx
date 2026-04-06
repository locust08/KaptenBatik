"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { formatPrice, useCart } from "@/components/cart-provider";
import { collectionOrder, collections, heroContent, type CollectionKey } from "@/data/collection-content";
import { BrandLogo } from "@/components/brand-logo";
import {
  ACCOUNT_STATE_CHANGE_EVENT,
  clearAccountState,
  redeemAccountRewardPoints,
  readPendingRewardOffer,
  readAccountRewardPoints,
  readAccountState,
  setPendingRewardOffer,
} from "@/lib/account-state";
import {
  REVIEW_STATE_CHANGE_EVENT,
  DEFAULT_SITE_REVIEWS,
  readVisibleProductReviews,
  readVisibleSiteReviews,
  readPurchasedProducts,
  saveProductReview,
  saveSiteReview,
  type PurchasedProduct,
  type ProductReviewEntry,
  type SiteReviewEntry,
  type ReviewRating,
} from "@/lib/review-state";

const loyaltyRewardTiers = [
  {
    minimumPurchase: 300,
    points: 5000,
    discountAmount: 175,
    title: "RM175 Off",
  },
  {
    minimumPurchase: 100,
    points: 3000,
    discountAmount: 100,
    title: "RM100 Off",
  },
  {
    minimumPurchase: 100,
    points: 2000,
    discountAmount: 70,
    title: "RM70 Off",
  },
  {
    minimumPurchase: 50,
    points: 1500,
    discountAmount: 50,
    title: "RM50 Off",
  },
  {
    minimumPurchase: 50,
    points: 1000,
    discountAmount: 30,
    title: "RM30 Off",
  },
  {
    minimumPurchase: 0,
    points: 500,
    discountAmount: 15,
    title: "RM15 Off",
  },
  {
    minimumPurchase: 0,
    points: 300,
    discountAmount: 9,
    title: "RM9 Off",
  },
  {
    minimumPurchase: 0,
    points: 100,
    discountAmount: 3,
    title: "RM3 Off",
  },
] as const;

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="site-icon" fill="none" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="6.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 16L21 21" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg aria-hidden="true" className="site-icon" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="7.5" r="3.25" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5.5 18.5C6.9 15.8 9.25 14.4 12 14.4C14.75 14.4 17.1 15.8 18.5 18.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function SignedInUserIcon() {
  return (
    <svg aria-hidden="true" className="site-icon" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="3.6" fill="currentColor" opacity="0.92" />
      <path
        d="M6 18.5C7.4 15.6 9.65 14.1 12 14.1C14.35 14.1 16.6 15.6 18 18.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.1" opacity="0.28" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg aria-hidden="true" className="site-icon" fill="none" viewBox="0 0 24 24">
      <path
        d="M4 5.25H6.15L7.45 13.5H17.7L19.8 7.25H8.1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <circle cx="9.1" cy="18.1" r="1.25" fill="currentColor" />
      <circle cx="16.15" cy="18.1" r="1.25" fill="currentColor" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" className="site-icon" fill="none" viewBox="0 0 24 24">
      <path d="M4.5 7H19.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M4.5 12H19.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M4.5 17H19.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg aria-hidden="true" className="chevron-icon" fill="none" viewBox="0 0 24 24">
      <path
        d="M6.75 9.5L12 14.75L17.25 9.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

type SiteHeaderProps = {
  activeCollection?: CollectionKey;
  contactHref?: string;
  isPinned?: boolean;
  logoHref?: string;
  onCollectionSelect?: (collectionKey: CollectionKey) => void;
  onViewRewards?: () => void;
  variant?: "default" | "product";
};

export function SiteHeader({
  activeCollection,
  contactHref = "/contact-us",
  isPinned = false,
  logoHref = "/",
  onCollectionSelect,
  onViewRewards,
  variant = "default",
}: SiteHeaderProps) {
  const [isCollectionsMenuOpen, setCollectionsMenuOpen] = useState(false);
  const [isAccountMenuOpen, setAccountMenuOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [accountState, setAccountState] = useState<"logged-out" | "logged-in">("logged-out");
  const [rewardPoints, setRewardPoints] = useState(0);
  const [pendingRewardOffer, setPendingRewardOfferState] = useState<ReturnType<
    typeof readPendingRewardOffer
  >>(null);
  const [accountMessage, setAccountMessage] = useState("");
  const [isRewardsPanelOpen, setRewardsPanelOpen] = useState(false);
  const [isReviewPanelOpen, setReviewPanelOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rewardsMessage, setRewardsMessage] = useState("");
  const [reviewMode, setReviewMode] = useState<"site" | "product">("site");
  const [reviewMessage, setReviewMessage] = useState("");
  const [showSiteReviewForm, setShowSiteReviewForm] = useState(false);
  const [siteReviews, setSiteReviews] = useState<SiteReviewEntry[]>(() => DEFAULT_SITE_REVIEWS);
  const [productReviews, setProductReviews] = useState<ProductReviewEntry[]>(() => readVisibleProductReviews());
  const [siteReviewRating, setSiteReviewRating] = useState<ReviewRating>(5);
  const [siteReviewTitle, setSiteReviewTitle] = useState("");
  const [siteReviewBody, setSiteReviewBody] = useState("");
  const [productReviewRating, setProductReviewRating] = useState<ReviewRating>(5);
  const [productReviewTitle, setProductReviewTitle] = useState("");
  const [productReviewBody, setProductReviewBody] = useState("");
  const [purchasedProducts, setPurchasedProducts] = useState<PurchasedProduct[]>([]);
  const [selectedPurchasedSlug, setSelectedPurchasedSlug] = useState("");
  const collectionsMenuRef = useRef<HTMLDivElement | null>(null);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);
  const cartMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const rewardsPanelRef = useRef<HTMLElement | null>(null);
  const reviewPanelRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const {
    cartCount,
    cartItems,
    cartSubtotal,
    checkoutItems,
    cartNotice,
    clearCart,
    prepareCheckout,
    removeItem,
    toggleCheckoutFromCart,
  } = useCart();

  useEffect(() => {
    const syncAccountState = () => {
      setAccountState(readAccountState());
      setRewardPoints(readAccountRewardPoints());
      setPendingRewardOfferState(readPendingRewardOffer());
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
    const syncReviewState = () => {
      setSiteReviews(readVisibleSiteReviews());
      setProductReviews(readVisibleProductReviews());
      const nextPurchasedProducts = readPurchasedProducts();
      setPurchasedProducts(nextPurchasedProducts);
      setSelectedPurchasedSlug((current) => {
        if (nextPurchasedProducts.some((product) => product.slug === current)) {
          return current;
        }

        return nextPurchasedProducts[0]?.slug ?? "";
      });
    };

    syncReviewState();
    window.addEventListener(REVIEW_STATE_CHANGE_EVENT, syncReviewState);
    window.addEventListener("storage", syncReviewState);

    return () => {
      window.removeEventListener(REVIEW_STATE_CHANGE_EVENT, syncReviewState);
      window.removeEventListener("storage", syncReviewState);
    };
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (collectionsMenuRef.current && !collectionsMenuRef.current.contains(target)) {
        setCollectionsMenuOpen(false);
      }

      if (accountMenuRef.current && !accountMenuRef.current.contains(target)) {
        setAccountMenuOpen(false);
      }

      if (cartMenuRef.current && !cartMenuRef.current.contains(target)) {
        setCartOpen(false);
      }

      if (rewardsPanelRef.current && !rewardsPanelRef.current.contains(target)) {
        setRewardsPanelOpen(false);
      }

      if (reviewPanelRef.current && !reviewPanelRef.current.contains(target)) {
        setReviewPanelOpen(false);
      }

      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCollectionsMenuOpen(false);
        setAccountMenuOpen(false);
        setCartOpen(false);
        setRewardsPanelOpen(false);
        setReviewPanelOpen(false);
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    setCollectionsMenuOpen(false);
    setAccountMenuOpen(false);
    setCartOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("view") === "rewards") {
      setRewardsPanelOpen(true);
    }
  }, [pathname]);

  useEffect(() => {
    const headerElement = headerRef.current;

    if (!headerElement) {
      return;
    }

    const updateHeaderHeight = () => {
      setHeaderHeight(headerElement.getBoundingClientRect().height);
    };

    updateHeaderHeight();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(updateHeaderHeight);
    observer.observe(headerElement);

    return () => observer.disconnect();
  }, [isPinned]);

  const handleAccountAction = (action: "logout") => {
    if (action === "logout") {
      setAccountState("logged-out");
      setRewardPoints(0);
      setAccountMessage("You are now logged out.");
      clearAccountState();
      clearCart();
      setCartOpen(false);
      setMobileMenuOpen(false);
    }

    setAccountMenuOpen(false);
  };

  const handleCollectionClick = (collectionKey: CollectionKey) => {
    setCollectionsMenuOpen(false);

    if (onCollectionSelect) {
      onCollectionSelect(collectionKey);
      setMobileMenuOpen(false);
      return;
    }

    setMobileMenuOpen(false);
    window.location.assign(`/?collection=${collectionKey}#collection`);
  };

  const handleCartCheckout = () => {
    const targetItems = checkoutItems.length ? checkoutItems : cartItems;

    if (!targetItems.length) {
      return;
    }

    prepareCheckout(targetItems);
    setCartOpen(false);
    setMobileMenuOpen(false);
    router.push("/checkout");
  };

  const handleRedeemRewardTier = (tier: (typeof loyaltyRewardTiers)[number]) => {
    if (accountState !== "logged-in") {
      setRewardsMessage("Log in to redeem loyalty rewards.");
      return;
    }

    const remainingPoints = redeemAccountRewardPoints(tier.points);

    if (remainingPoints === null) {
      const pointsNeeded = tier.points - rewardPoints;
      setRewardsMessage(
        pointsNeeded > 0
          ? `You need ${pointsNeeded} more points to redeem ${tier.title}.`
          : `You do not have enough points to redeem ${tier.title}.`,
      );
      return;
    }

    setRewardPoints(remainingPoints);
    const nextOffer = {
      discountAmount: tier.discountAmount,
      minimumPurchase: tier.minimumPurchase,
      pointsRedeemed: tier.points,
      redeemedAt: Date.now(),
      title: tier.title,
    };
    setPendingRewardOffer(nextOffer);
    setPendingRewardOfferState(nextOffer);
    setMobileMenuOpen(false);
    setRewardsMessage(
      `Redeemed ${tier.title}. It will be deducted on your next checkout, and you now have ${remainingPoints} points left.`,
    );
  };

  const handleSubmitSiteReview = () => {
    const trimmedMessage = siteReviewBody.trim();

    if (!trimmedMessage) {
      setReviewMessage("Please share a short site review before submitting.");
      return;
    }

    saveSiteReview({
      message: trimmedMessage,
      rating: siteReviewRating,
      reviewerName: accountState === "logged-in" ? "Logged-in customer" : "Guest visitor",
      title: siteReviewTitle.trim() || "Site review",
    });

    setReviewMessage("Thanks for reviewing the site.");
    setSiteReviewTitle("");
    setSiteReviewBody("");
    setSiteReviewRating(5);
    setShowSiteReviewForm(false);
    setReviewMode("site");
  };

  const handleSubmitProductReview = () => {
    if (accountState !== "logged-in") {
      setReviewMessage("Log in first, then review the product you bought.");
      return;
    }

    if (!selectedPurchasedSlug) {
      setReviewMessage("Buy a product first to leave a product review.");
      return;
    }

    const selectedProduct = purchasedProducts.find((product) => product.slug === selectedPurchasedSlug);
    const trimmedMessage = productReviewBody.trim();

    if (!selectedProduct || !trimmedMessage) {
      setReviewMessage("Choose a purchased product and write your review.");
      return;
    }

    saveProductReview({
      message: trimmedMessage,
      productHref: selectedProduct.href,
      productName: selectedProduct.name,
      productSlug: selectedProduct.slug,
      productSize: "Purchased item",
      rating: productReviewRating,
      reviewerName: "Verified buyer",
      title: productReviewTitle.trim() || "Product review",
    });

    setReviewMessage("Thanks for reviewing your purchased product.");
    setProductReviewTitle("");
    setProductReviewBody("");
    setProductReviewRating(5);
    setReviewMode("product");
  };

  const openRewardsPanel = () => {
    setMobileMenuOpen(false);
    setRewardsPanelOpen(true);
  };

  const openReviewPanel = () => {
    setMobileMenuOpen(false);
    setReviewPanelOpen(true);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const isProductVariant = variant === "product";
  const checkoutSelectionCount = checkoutItems.length || cartItems.length;

  return (
    <>
      <header
        className={`site-header ${isPinned ? "is-pinned" : ""}`}
        id="top"
        ref={headerRef}
      >
      <div className="site-header-main">
        <Link aria-label="Kapten Batik" className="brand-mark" href={logoHref}>
          <BrandLogo />
        </Link>

        <nav aria-label="Primary" className="primary-nav">
              {isProductVariant ? (
                <>
                  {collectionOrder.map((collectionKey) => {
                const isActive = activeCollection === collectionKey;
                return (
                  <Link
                    aria-current={isActive ? "page" : undefined}
                    className={`primary-nav-link ${isActive ? "is-active" : ""}`}
                    href={`/?collection=${collectionKey}#collection`}
                    key={collectionKey}
                  >
                    {collections[collectionKey].label.toUpperCase()}
                  </Link>
                );
              })}
              <Link className="primary-nav-link" href={contactHref}>
                Contact Us
              </Link>
            </>
          ) : (
            <>
              <div className="nav-dropdown" ref={collectionsMenuRef}>
                <button
                  aria-expanded={isCollectionsMenuOpen}
                  aria-haspopup="menu"
                  className={`nav-dropdown-trigger ${activeCollection ? "is-active" : ""} ${isCollectionsMenuOpen ? "is-open" : ""}`}
                  onClick={() => setCollectionsMenuOpen((current) => !current)}
                  type="button"
                >
                  Collections
                  <ChevronIcon />
                </button>

                <div className={`nav-dropdown-menu ${isCollectionsMenuOpen ? "is-open" : ""}`} role="menu">
                  {collectionOrder.map((collectionKey) => {
                    const isActive = activeCollection === collectionKey;

                    return (
                      <button
                        aria-current={isActive ? "page" : undefined}
                        className={`nav-dropdown-item ${isActive ? "is-active" : ""}`}
                        key={collectionKey}
                        onClick={() => handleCollectionClick(collectionKey)}
                        role="menuitem"
                        type="button"
                      >
                        {collections[collectionKey].label.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {activeCollection ? (
                <span className="primary-nav-current">{collections[activeCollection].label.toUpperCase()}</span>
              ) : null}

              <Link className="primary-nav-link" href={contactHref}>
                Contact Us
              </Link>
            </>
          )}

          <div className="primary-nav-utility-group" aria-label="Quick panels">
            <button className="primary-nav-utility-button" onClick={openRewardsPanel} type="button">
              Rewards
            </button>
            <button className="primary-nav-utility-button" onClick={openReviewPanel} type="button">
              Reviews
            </button>
          </div>
        </nav>

        <div className="header-actions">
          <div className="mobile-menu-wrap" ref={mobileMenuRef}>
            <button
              aria-expanded={isMobileMenuOpen}
              aria-haspopup="menu"
              aria-label="Open menu"
              className={`icon-button mobile-menu-button ${isMobileMenuOpen ? "is-active" : ""}`}
              onClick={() => setMobileMenuOpen((current) => !current)}
              type="button"
            >
              <MenuIcon />
            </button>

            <div className={`mobile-menu-panel ${isMobileMenuOpen ? "is-open" : ""}`} role="menu">
              <div className="mobile-menu-section">
                <p className="mobile-menu-title">Collections</p>
                <div className="mobile-menu-links">
                  {collectionOrder.map((collectionKey) => {
                    const isActive = activeCollection === collectionKey;

                    return (
                      <button
                        aria-current={isActive ? "page" : undefined}
                        className={`mobile-menu-item ${isActive ? "is-active" : ""}`}
                        key={collectionKey}
                        onClick={() => handleCollectionClick(collectionKey)}
                        role="menuitem"
                        type="button"
                      >
                        {collections[collectionKey].label.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mobile-menu-section">
                <p className="mobile-menu-title">Quick Panels</p>
                <div className="mobile-menu-links">
                  <button className="mobile-menu-item" onClick={openRewardsPanel} role="menuitem" type="button">
                    Rewards
                  </button>
                  <button className="mobile-menu-item" onClick={openReviewPanel} role="menuitem" type="button">
                    Reviews
                  </button>
                </div>
              </div>

              <div className="mobile-menu-section">
                <p className="mobile-menu-title">Account</p>
                <div className="mobile-menu-links">
                  <Link className="mobile-menu-item" href={contactHref} role="menuitem" onClick={closeMobileMenu}>
                    Contact Us
                  </Link>
                  {accountState === "logged-out" ? (
                    <Link className="mobile-menu-item" href="/login" role="menuitem" onClick={closeMobileMenu}>
                      Login
                    </Link>
                  ) : (
                    <>
                      <button
                        className="mobile-menu-item"
                        onClick={() => {
                          setAccountMenuOpen(false);
                          closeMobileMenu();
                          openRewardsPanel();
                          onViewRewards?.();
                          setAccountMessage(
                            rewardPoints
                              ? `You currently have ${rewardPoints} reward point${rewardPoints === 1 ? "" : "s"}. Open Rewards to redeem them.`
                              : "You currently have 0 reward points. Earn them through checkout to start redeeming.",
                          );
                        }}
                        role="menuitem"
                        type="button"
                      >
                        View Rewards
                      </button>
                      <button
                        className="mobile-menu-item"
                        onClick={() => handleAccountAction("logout")}
                        role="menuitem"
                        type="button"
                      >
                        Logout
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="nav-dropdown is-cart" ref={cartMenuRef}>
            <button
              aria-expanded={isCartOpen}
              aria-haspopup="dialog"
              aria-label="Open cart"
              className={`icon-button cart-button ${isCartOpen ? "is-active" : ""}`}
              onClick={() => setCartOpen((current) => !current)}
              type="button"
            >
              <CartIcon />
              {cartCount ? <span className="cart-count-badge">{cartCount}</span> : null}
            </button>

            <div className={`cart-panel ${isCartOpen ? "is-open" : ""}`} role="dialog">
              <div className="cart-panel-header">
                <div>
                  <p className="cart-panel-eyebrow">Shopping Cart</p>
                  <h2>{cartCount ? `${cartCount} item${cartCount > 1 ? "s" : ""}` : "Your cart is empty"}</h2>
                </div>
              </div>

              {cartItems.length ? (
                <>
                  <div className="cart-panel-list">
                    {cartItems.map((item) => {
                      const isSelected = checkoutItems.some(
                        (selectedItem) =>
                          selectedItem.slug === item.slug && selectedItem.size === item.size,
                      );

                      return (
                        <article
                          className={`cart-panel-item ${isSelected ? "is-selected" : ""}`}
                          key={`${item.slug}-${item.size}`}
                        >
                          <Link
                            className="cart-panel-media"
                            href={item.href}
                            onClick={() => setCartOpen(false)}
                          >
                            <img alt={item.name} src={item.image} />
                          </Link>

                          <div className="cart-panel-copy">
                            <Link href={item.href} onClick={() => setCartOpen(false)}>
                              <strong>{item.name}</strong>
                            </Link>
                            <p>{`${item.size} | Qty ${item.quantity}`}</p>
                            <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                          </div>

                          <div className="cart-panel-actions">
                            <button
                              className={`cart-panel-select ${isSelected ? "is-selected" : ""}`}
                              onClick={() => toggleCheckoutFromCart(item)}
                              type="button"
                            >
                              {isSelected ? "Selected" : "Select"}
                            </button>
                            <button
                              className="cart-panel-remove"
                              onClick={() => removeItem(item)}
                              type="button"
                            >
                              Remove
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  <div className="cart-panel-footer">
                    <div className="cart-panel-total">
                      <span>Subtotal</span>
                      <strong>{formatPrice(cartSubtotal)}</strong>
                    </div>
                    <div className="cart-panel-footer-actions">
                      <button className="cart-panel-clear" onClick={clearCart} type="button">
                        Delete All
                      </button>
                      <button className="cart-panel-checkout" onClick={handleCartCheckout} type="button">
                        {`Checkout ${checkoutSelectionCount} Item${checkoutSelectionCount === 1 ? "" : "s"}`}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <p className="cart-panel-empty">
                  Add a piece from the collection and it will appear here instantly.
                </p>
              )}
            </div>
          </div>

          {!isProductVariant ? (
            <Link aria-label="Search the collection" className="icon-button header-search-button" href="/search">
              <SearchIcon />
            </Link>
          ) : null}

          {accountState === "logged-out" ? (
            <Link aria-label="Open account" className="icon-button account-button header-account-button" href="/login">
              <UserIcon />
            </Link>
          ) : (
            <div className="nav-dropdown is-account" ref={accountMenuRef}>
              <button
                aria-expanded={isAccountMenuOpen}
                aria-haspopup="menu"
                aria-label="Open account"
                className="icon-button account-button header-account-button is-signed-in"
                onClick={() => setAccountMenuOpen((current) => !current)}
                type="button"
              >
                <SignedInUserIcon />
              </button>

              <div
                className={`nav-dropdown-menu nav-account-menu ${isAccountMenuOpen ? "is-open" : ""}`}
                role="menu"
              >
                <button className="nav-dropdown-item is-active" role="menuitem" type="button">
                  My Account
                </button>
                <button
                  className="nav-dropdown-item"
                  onClick={() => {
                    openRewardsPanel();
                    onViewRewards?.();
                    setAccountMessage(
                      rewardPoints
                        ? `You currently have ${rewardPoints} reward point${rewardPoints === 1 ? "" : "s"}. Open Rewards to redeem them.`
                        : "You currently have 0 reward points. Earn them through checkout to start redeeming.",
                    );
                  }}
                  role="menuitem"
                  type="button"
                >
                  View Rewards
                </button>
                <button
                  className="nav-dropdown-item"
                  onClick={() => handleAccountAction("logout")}
                  role="menuitem"
                  type="button"
                >
                  Logout
                </button>

                {accountMessage ? <p className="account-menu-message">{accountMessage}</p> : null}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="announcement-bar">
        <div className="announcement-track">
          {Array.from({ length: 4 }).map((_, index) => (
            <span key={index}>
              {heroContent.announcement}
              <strong aria-hidden="true"> / </strong>
            </span>
          ))}
        </div>
      </div>

      </header>

      <button
        aria-controls="rewards-panel"
        aria-expanded={isRewardsPanelOpen}
        className={`rewards-fab ${isRewardsPanelOpen ? "is-hidden" : ""}`}
        onClick={openRewardsPanel}
        type="button"
      >
        <span aria-hidden="true" className="rewards-fab-icon">
          <svg fill="none" viewBox="0 0 24 24">
            <path
              d="M4.5 9H19.5V20.5H4.5V9Z"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d="M12 9V20.5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.5"
            />
            <path
              d="M4.5 12.5H19.5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.5"
            />
            <path
              d="M9.1 9C7.9 9 6.9 8.05 6.9 6.85C6.9 5.65 7.9 4.7 9.1 4.7C10.9 4.7 12 8.2 12 9H9.1Z"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d="M14.9 9C16.1 9 17.1 8.05 17.1 6.85C17.1 5.65 16.1 4.7 14.9 4.7C13.1 4.7 12 8.2 12 9H14.9Z"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </span>
        <span className="rewards-fab-label rewards-fab-label-vertical">Rewards</span>
      </button>

      <aside
        aria-hidden={!isRewardsPanelOpen}
        className={`rewards-panel ${isRewardsPanelOpen ? "is-open" : ""}`}
        id="rewards-panel"
        ref={rewardsPanelRef}
      >
        <div className="rewards-panel-header">
          <div>
            <p className="rewards-eyebrow">Loyalty Program</p>
            <h3>Redeem points on the store to get rewards</h3>
          </div>
          <button
            aria-label="Close rewards panel"
            className="rewards-panel-close"
            onClick={() => setRewardsPanelOpen(false)}
            type="button"
          >
            Close
          </button>
        </div>

        <div className="rewards-panel-body">
          <div className="rewards-panel-status">
            <div className="rewards-balance">
              <span>Your balance</span>
              <strong>{rewardPoints} points</strong>
            </div>
            <p className="rewards-panel-message">
              {rewardsMessage ||
                (pendingRewardOffer
                  ? `${pendingRewardOffer.title} is ready and will be deducted on your next checkout.`
                  : accountState === "logged-in"
                  ? "Earn 1 point for every RM1 spent at checkout, then redeem your balance here."
                  : "Log in or register to start earning and redeeming loyalty points.")}
            </p>
          </div>

          <section className="rewards-block">
            <p className="rewards-block-title">Earn points when you complete activities</p>
            <ul className="rewards-list">
              <li>
                <strong>Create an account</strong>
                <span>Earn 50 reward points for creating an account</span>
              </li>
              <li>
                <strong>Happy Birthday</strong>
                <span>Celebrate your birthday!</span>
              </li>
              <li>
                <strong>Make a purchase</strong>
                <span>You will earn 1 reward point for every RM1 spent</span>
              </li>
              <li>
                <strong>Leave a review for us</strong>
                <span>Earn 50 reward points for giving a review.</span>
              </li>
              <li>
                <strong>Follow on Instagram</strong>
                <span>Earn extra 25 reward points when you follow us on Instagram.</span>
              </li>
              <li>
                <strong>Follow &amp; Like Us On Facebook</strong>
                <span>Earn extra 25 reward points when you follow and like us on Facebook.</span>
              </li>
              <li>
                <strong>Facebook share</strong>
                <span>Earn 25 reward points when you share us on Facebook.</span>
              </li>
            </ul>
          </section>

          <section className="rewards-block">
            <p className="rewards-block-title">Redeem points on the store to get rewards</p>
            <ul className="rewards-list rewards-redemption-list">
              {loyaltyRewardTiers.map((tier) => {
                const pointsNeeded = Math.max(0, tier.points - rewardPoints);
                const canRedeemNow = accountState === "logged-in" && pointsNeeded === 0;

                return (
                  <li key={tier.points}>
                    <div className="rewards-redemption-copy">
                      <strong>{tier.title}</strong>
                      <span>Redeem {tier.points} points</span>
                      <em>With minimum purchase</em>
                      <em>{`of RM${tier.minimumPurchase}`}</em>
                    </div>
                    <div className="rewards-redemption-action">
                      <button
                        className={`rewards-redeem-button ${canRedeemNow ? "is-ready" : ""}`}
                        onClick={() => handleRedeemRewardTier(tier)}
                        type="button"
                      >
                        {canRedeemNow ? "Redeem Now" : `${pointsNeeded} pts short`}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="rewards-block review-block is-hidden">
            <p className="rewards-block-title">Review</p>
            <div className="review-tabs" role="tablist" aria-label="Review types">
              <button
                aria-selected={reviewMode === "site"}
                className={`review-tab ${reviewMode === "site" ? "is-active" : ""}`}
                onClick={() => setReviewMode("site")}
                role="tab"
                type="button"
              >
                Site review
              </button>
              <button
                aria-selected={reviewMode === "product"}
                className={`review-tab ${reviewMode === "product" ? "is-active" : ""}`}
                onClick={() => setReviewMode("product")}
                role="tab"
                type="button"
              >
                Product review
              </button>
            </div>

            {reviewMessage ? <p className="review-message">{reviewMessage}</p> : null}

            {reviewMode === "site" ? (
              <div className="review-panel" role="tabpanel">
                <p className="review-panel-copy">
                  Share a quick experience about the brand, the store, or the overall shopping flow.
                </p>
                <div className="review-stars-picker" aria-label="Site review rating">
                  {([5, 4, 3, 2, 1] as ReviewRating[]).map((rating) => (
                    <button
                      aria-pressed={siteReviewRating === rating}
                      className={`review-star ${siteReviewRating >= rating ? "is-selected" : ""}`}
                      key={`site-star-${rating}`}
                      onClick={() => setSiteReviewRating(rating)}
                      type="button"
                    >
                      ★
                    </button>
                  ))}
                </div>
                <label className="review-field">
                  <span>Review title</span>
                  <input
                    onChange={(event) => setSiteReviewTitle(event.target.value)}
                    placeholder="Great store experience"
                    type="text"
                    value={siteReviewTitle}
                  />
                </label>
                <label className="review-field">
                  <span>Your review</span>
                  <textarea
                    onChange={(event) => setSiteReviewBody(event.target.value)}
                    placeholder="Tell us what you liked about the site, service, or shopping experience."
                    rows={4}
                    value={siteReviewBody}
                  />
                </label>
                <button className="review-submit" onClick={handleSubmitSiteReview} type="button">
                  Submit Site Review
                </button>
              </div>
            ) : (
              <div className="review-panel" role="tabpanel">
                <p className="review-panel-copy">
                  Only buyers can review the products they purchased. Choose one of your purchased
                  items below.
                </p>
                {accountState !== "logged-in" ? (
                  <p className="review-empty">
                    Log in first to see your purchased products and leave a product review.
                  </p>
                ) : purchasedProducts.length ? (
                  <>
                    <label className="review-field">
                      <span>Purchased product</span>
                      <select
                        onChange={(event) => setSelectedPurchasedSlug(event.target.value)}
                        value={selectedPurchasedSlug}
                      >
                        {purchasedProducts.map((product) => (
                          <option key={product.slug} value={product.slug}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="review-stars-picker" aria-label="Product review rating">
                      {([5, 4, 3, 2, 1] as ReviewRating[]).map((rating) => (
                        <button
                          aria-pressed={productReviewRating === rating}
                          className={`review-star ${productReviewRating >= rating ? "is-selected" : ""}`}
                          key={`product-star-${rating}`}
                          onClick={() => setProductReviewRating(rating)}
                          type="button"
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <label className="review-field">
                      <span>Review title</span>
                      <input
                        onChange={(event) => setProductReviewTitle(event.target.value)}
                        placeholder="Fits beautifully"
                        type="text"
                        value={productReviewTitle}
                      />
                    </label>
                    <label className="review-field">
                      <span>Your review</span>
                      <textarea
                        onChange={(event) => setProductReviewBody(event.target.value)}
                        placeholder="Share how the product fit, felt, and performed."
                        rows={4}
                        value={productReviewBody}
                      />
                    </label>
                    <button className="review-submit" onClick={handleSubmitProductReview} type="button">
                      Submit Product Review
                    </button>
                  </>
                ) : (
                  <p className="review-empty">
                    No purchased products found yet. Buy an item first, then return here to review it.
                  </p>
                )}
              </div>
            )}
          </section>

          <div className="rewards-panel-actions">
            <Link className="cta-button rewards-panel-action" href="/login">
              Login
            </Link>
            <Link className="cta-button cta-button-secondary rewards-panel-action" href="/register">
              Register
            </Link>
          </div>
        </div>
      </aside>

      <button
        aria-controls="review-panel"
        aria-expanded={isReviewPanelOpen}
        className={`review-fab ${isReviewPanelOpen ? "is-hidden" : ""}`}
        onClick={openReviewPanel}
        type="button"
      >
        <span aria-hidden="true" className="review-fab-icon">
          <svg fill="none" viewBox="0 0 24 24">
            <path
              d="M5 5.75H19C19.69 5.75 20.25 6.31 20.25 7V14.5C20.25 15.19 19.69 15.75 19 15.75H12.7L8.8 19.25V15.75H5C4.31 15.75 3.75 15.19 3.75 14.5V7C3.75 6.31 4.31 5.75 5 5.75Z"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d="M8 9.5H16M8 12H13.25"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.5"
            />
          </svg>
        </span>
        <span className="rewards-fab-label rewards-fab-label-vertical">REVIEWS</span>
      </button>

      <aside
        aria-hidden={!isReviewPanelOpen}
        className={`review-panel-shell ${isReviewPanelOpen ? "is-open" : ""}`}
        id="review-panel"
        ref={reviewPanelRef}
      >
          <div className="review-panel-header">
          <div>
            <p className="review-eyebrow">Customer Review</p>
            <h3>Site review and product review</h3>
          </div>
          <button
            aria-label="Close review panel"
            className="review-panel-close"
            onClick={() => setReviewPanelOpen(false)}
            type="button"
          >
            Close
          </button>
        </div>

        <div className="review-panel-body">
          <p className="review-panel-message">
            {reviewMessage ||
              (reviewMode === "product" && accountState !== "logged-in"
                ? "Log in first to review a product you purchased."
                : reviewMode === "product" && !purchasedProducts.length
                ? "Buy a product first, then come back here to leave a review."
                : "Share a site review directly, or switch to product review if you are a buyer.")}
          </p>

          <div className="review-tabs" role="tablist" aria-label="Review types">
            <button
              aria-selected={reviewMode === "site"}
              className={`review-tab ${reviewMode === "site" ? "is-active" : ""}`}
              onClick={() => setReviewMode("site")}
              role="tab"
              type="button"
            >
              Site review
            </button>
            <button
              aria-selected={reviewMode === "product"}
              className={`review-tab ${reviewMode === "product" ? "is-active" : ""}`}
              onClick={() => setReviewMode("product")}
              role="tab"
              type="button"
            >
              Product review
            </button>
          </div>

          {reviewMode === "site" ? (
            <div className="review-panel" role="tabpanel">
              <p className="review-panel-copy">
                Read what other shoppers thought, then add your own take on the brand, store, or
                overall shopping flow.
              </p>
              <button
                className="review-compose-trigger"
                onClick={() => setShowSiteReviewForm((current) => !current)}
                type="button"
              >
                {showSiteReviewForm ? "Hide Your Review" : "Write Your Review"}
              </button>
              {showSiteReviewForm ? (
                <>
                  <div className="review-stars-picker" aria-label="Site review rating">
                    {([5, 4, 3, 2, 1] as ReviewRating[]).map((rating) => (
                      <button
                        aria-pressed={siteReviewRating === rating}
                        className={`review-star ${siteReviewRating >= rating ? "is-selected" : ""}`}
                        key={`site-star-${rating}`}
                        onClick={() => setSiteReviewRating(rating)}
                        type="button"
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <label className="review-field">
                    <span>Review title</span>
                    <input
                      onChange={(event) => setSiteReviewTitle(event.target.value)}
                      placeholder="Great store experience"
                      type="text"
                      value={siteReviewTitle}
                    />
                  </label>
                  <label className="review-field">
                    <span>Your review</span>
                    <textarea
                      onChange={(event) => setSiteReviewBody(event.target.value)}
                      placeholder="Tell us what you liked about the site, service, or shopping experience."
                      rows={4}
                      value={siteReviewBody}
                    />
                  </label>
                  <button className="review-submit" onClick={handleSubmitSiteReview} type="button">
                    Submit Site Review
                  </button>
                </>
              ) : null}
              <div className="review-list" aria-label="Site reviews from other users">
                {siteReviews.slice(0, 6).map((review) => (
                  <article className="review-card" key={`${review.reviewerName}-${review.submittedAt}`}>
                    <div className="review-card-top">
                      <strong>{review.title}</strong>
                      <span aria-label={`${review.rating} out of 5 stars`} className="review-card-stars">
                        {"★".repeat(review.rating)}
                      </span>
                    </div>
                    <p className="review-card-meta">{review.reviewerName}</p>
                    <p className="review-card-body">{review.message}</p>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <div className="review-panel" role="tabpanel">
              <p className="review-panel-copy">
                Read what other buyers thought about the products, then choose one of your purchased
                items below to leave your own review.
              </p>
              <div className="review-list" aria-label="Product reviews from other users">
                {productReviews.slice(0, 4).map((review) => (
                  <article className="review-card" key={`${review.reviewerName}-${review.submittedAt}`}>
                    <div className="review-card-top">
                      <strong>{review.title}</strong>
                      <span aria-label={`${review.rating} out of 5 stars`} className="review-card-stars">
                        {"★".repeat(review.rating)}
                      </span>
                    </div>
                    <p className="review-card-meta">{review.productName}</p>
                    <p className="review-card-meta">{review.reviewerName}</p>
                    <p className="review-card-body">{review.message}</p>
                  </article>
                ))}
              </div>
              {accountState !== "logged-in" ? (
                <p className="review-empty">
                  Log in first to see your purchased products and leave a product review.
                </p>
              ) : purchasedProducts.length ? (
                <>
                  <label className="review-field">
                    <span>Purchased product</span>
                    <select
                      onChange={(event) => setSelectedPurchasedSlug(event.target.value)}
                      value={selectedPurchasedSlug}
                    >
                      {purchasedProducts.map((product) => (
                        <option key={product.slug} value={product.slug}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="review-stars-picker" aria-label="Product review rating">
                    {([5, 4, 3, 2, 1] as ReviewRating[]).map((rating) => (
                      <button
                        aria-pressed={productReviewRating === rating}
                        className={`review-star ${productReviewRating >= rating ? "is-selected" : ""}`}
                        key={`product-star-${rating}`}
                        onClick={() => setProductReviewRating(rating)}
                        type="button"
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <label className="review-field">
                    <span>Review title</span>
                    <input
                      onChange={(event) => setProductReviewTitle(event.target.value)}
                      placeholder="Fits beautifully"
                      type="text"
                      value={productReviewTitle}
                    />
                  </label>
                  <label className="review-field">
                    <span>Your review</span>
                    <textarea
                      onChange={(event) => setProductReviewBody(event.target.value)}
                      placeholder="Share how the product fit, felt, and performed."
                      rows={4}
                      value={productReviewBody}
                    />
                  </label>
                  <button className="review-submit" onClick={handleSubmitProductReview} type="button">
                    Submit Product Review
                  </button>
                </>
              ) : (
                <p className="review-empty">
                  No purchased products found yet. Buy an item first, then return here to review it.
                </p>
              )}
            </div>
          )}
        </div>
      </aside>

      <div aria-live="polite" className={`cart-toast ${cartNotice ? "is-visible" : ""}`}>
        {cartNotice}
      </div>

      {isPinned ? <div aria-hidden="true" className="site-header-spacer" style={{ height: headerHeight }} /> : null}
    </>
  );
}
