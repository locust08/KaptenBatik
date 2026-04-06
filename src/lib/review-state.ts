import type { CartItem } from "@/components/cart-provider";

export const SITE_REVIEW_KEY = "kapten-batik-site-reviews";
export const PRODUCT_REVIEW_KEY = "kapten-batik-product-reviews";
export const PURCHASED_PRODUCTS_KEY = "kapten-batik-purchased-products";
export const REVIEW_STATE_CHANGE_EVENT = "kapten-batik-review-state-change";

export type ReviewRating = 1 | 2 | 3 | 4 | 5;

export type SiteReviewEntry = {
  message: string;
  rating: ReviewRating;
  reviewerName: string;
  submittedAt: number;
  title: string;
};

export type ProductReviewEntry = {
  message: string;
  productHref: string;
  productName: string;
  productSlug: string;
  productSize: string;
  rating: ReviewRating;
  reviewerName: string;
  submittedAt: number;
  title: string;
};

export type PurchasedProduct = {
  href: string;
  image: string;
  name: string;
  slug: string;
};

export const DEFAULT_SITE_REVIEWS: SiteReviewEntry[] = [
  {
    message:
      "The site feels polished and easy to browse, and the collections are presented beautifully.",
    rating: 5,
    reviewerName: "Aisyah Noor",
    submittedAt: Date.parse("2026-03-28T10:00:00.000Z"),
    title: "Beautiful shopping experience",
  },
  {
    message:
      "I liked how quickly I could find the styles I wanted. The layout is clean and premium.",
    rating: 5,
    reviewerName: "Farid Hakim",
    submittedAt: Date.parse("2026-03-26T10:00:00.000Z"),
    title: "Easy to explore",
  },
  {
    message:
      "Great visuals and the batik pieces look even better on the page than I expected.",
    rating: 4,
    reviewerName: "Nadia Zulkifli",
    submittedAt: Date.parse("2026-03-23T10:00:00.000Z"),
    title: "Premium feel",
  },
  {
    message:
      "I came back to compare colors a few times and the product pages made it very easy to decide.",
    rating: 5,
    reviewerName: "Hafiz Rahman",
    submittedAt: Date.parse("2026-03-21T10:00:00.000Z"),
    title: "Helpful before checkout",
  },
  {
    message:
      "The checkout flow was smooth, and I liked seeing the boutique and support options in one place.",
    rating: 4,
    reviewerName: "Siti Aina",
    submittedAt: Date.parse("2026-03-19T10:00:00.000Z"),
    title: "Clear and convenient",
  },
  {
    message:
      "I used the review rail to decide between two pieces, and it helped me feel more confident buying.",
    rating: 5,
    reviewerName: "Daniel Wong",
    submittedAt: Date.parse("2026-03-17T10:00:00.000Z"),
    title: "Good social proof",
  },
  {
    message:
      "The store info and product styling felt thoughtful. I’d love to see even more customer stories here.",
    rating: 4,
    reviewerName: "Farhana Isa",
    submittedAt: Date.parse("2026-03-15T10:00:00.000Z"),
    title: "Would read more",
  },
] as const;

export const DEFAULT_PRODUCT_REVIEWS: ProductReviewEntry[] = [
  {
    message:
      "The fit was true to size and the fabric felt premium right away. I would buy this again in another color.",
    productHref: "/women/kb-x-saarat-mahira-long-dress-wau",
    productName: "KB x Saarat Mahira Long Dress Wau",
    productSlug: "kb-x-saarat-mahira-long-dress-wau",
    productSize: "M",
    rating: 5,
    reviewerName: "Aina Malik",
    submittedAt: Date.parse("2026-03-27T10:00:00.000Z"),
    title: "Lovely fit",
  },
  {
    message:
      "The stitching and finishing are beautiful. It feels special enough for events but still comfortable for all-day wear.",
    productHref: "/men/maharaja-linen-syandana-aquamarine",
    productName: "Maharaja Linen Syandana Aquamarine",
    productSlug: "maharaja-linen-syandana-aquamarine",
    productSize: "L",
    rating: 5,
    reviewerName: "Imran Syah",
    submittedAt: Date.parse("2026-03-25T10:00:00.000Z"),
    title: "Great craftsmanship",
  },
  {
    message:
      "The color looked exactly like the photos and the drape was elegant. Delivery was also quick and tidy.",
    productHref: "/women/kurung-kedah-set-forest-melody-campanula",
    productName: "Kurung Kedah Set Forest Melody Campanula",
    productSlug: "kurung-kedah-set-forest-melody-campanula",
    productSize: "S",
    rating: 4,
    reviewerName: "Nurul Hana",
    submittedAt: Date.parse("2026-03-22T10:00:00.000Z"),
    title: "Beautiful color",
  },
  {
    message:
      "Very comfortable and easy to style. I liked that the cut stayed sharp even after a long day out.",
    productHref: "/men/endura-canvas-jacket-forest-heart",
    productName: "Endura Canvas Jacket Forest Heart",
    productSlug: "endura-canvas-jacket-forest-heart",
    productSize: "XL",
    rating: 5,
    reviewerName: "Daniel Tan",
    submittedAt: Date.parse("2026-03-20T10:00:00.000Z"),
    title: "Comfortable and sharp",
  },
] as const;

const REMOVED_SITE_REVIEW_SIGNATURE = {
  message: "asrtyh",
  rating: 5 as ReviewRating,
  reviewerName: "Guest visitor",
  title: "234567",
};

function parseStoredArray<T>(value: string | null) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as T[];
  } catch {
    return [];
  }
}

function normalizeReviewRating(rating: number): ReviewRating {
  return Math.min(5, Math.max(1, Math.round(rating))) as ReviewRating;
}

function isRemovedSiteReview(review: SiteReviewEntry) {
  return (
    review.message === REMOVED_SITE_REVIEW_SIGNATURE.message &&
    review.rating === REMOVED_SITE_REVIEW_SIGNATURE.rating &&
    review.reviewerName === REMOVED_SITE_REVIEW_SIGNATURE.reviewerName &&
    review.title === REMOVED_SITE_REVIEW_SIGNATURE.title
  );
}

export function readSiteReviews(): SiteReviewEntry[] {
  if (typeof window === "undefined") {
    return [...DEFAULT_SITE_REVIEWS];
  }

  const storedReviews = parseStoredArray<SiteReviewEntry>(window.localStorage.getItem(SITE_REVIEW_KEY)).filter(
    (review) =>
      review &&
      typeof review.message === "string" &&
      typeof review.reviewerName === "string" &&
      typeof review.submittedAt === "number" &&
      typeof review.title === "string" &&
      Number.isFinite(review.rating),
  );

  const filteredReviews = storedReviews.filter((review) => !isRemovedSiteReview(review));

  if (filteredReviews.length !== storedReviews.length) {
    window.localStorage.setItem(SITE_REVIEW_KEY, JSON.stringify(filteredReviews));
  }

  return filteredReviews.length ? filteredReviews : [...DEFAULT_SITE_REVIEWS];
}

export function readVisibleSiteReviews() {
  return [...readSiteReviews()].sort((left, right) => right.submittedAt - left.submittedAt);
}

export function readProductReviews(): ProductReviewEntry[] {
  if (typeof window === "undefined") {
    return [...DEFAULT_PRODUCT_REVIEWS];
  }

  const storedReviews = parseStoredArray<ProductReviewEntry>(window.localStorage.getItem(PRODUCT_REVIEW_KEY)).filter(
    (review) =>
      review &&
      typeof review.message === "string" &&
      typeof review.productHref === "string" &&
      typeof review.productName === "string" &&
      typeof review.productSlug === "string" &&
      typeof review.productSize === "string" &&
      typeof review.reviewerName === "string" &&
      typeof review.submittedAt === "number" &&
      typeof review.title === "string" &&
      Number.isFinite(review.rating),
  );

  return storedReviews.length ? storedReviews : [...DEFAULT_PRODUCT_REVIEWS];
}

export function readVisibleProductReviews() {
  return [...readProductReviews()].sort((left, right) => right.submittedAt - left.submittedAt);
}

export function readPurchasedProducts(): PurchasedProduct[] {
  if (typeof window === "undefined") {
    return [];
  }

  return parseStoredArray<PurchasedProduct>(window.localStorage.getItem(PURCHASED_PRODUCTS_KEY)).filter(
    (product) =>
      product &&
      typeof product.href === "string" &&
      typeof product.image === "string" &&
      typeof product.name === "string" &&
      typeof product.slug === "string",
  );
}

export function saveSiteReview(review: Omit<SiteReviewEntry, "submittedAt">) {
  if (typeof window === "undefined") {
    return [];
  }

  const nextReview: SiteReviewEntry = {
    ...review,
    rating: normalizeReviewRating(review.rating),
    submittedAt: Date.now(),
  };
  const nextReviews = [nextReview, ...readSiteReviews()];

  window.localStorage.setItem(SITE_REVIEW_KEY, JSON.stringify(nextReviews));
  window.dispatchEvent(new Event(REVIEW_STATE_CHANGE_EVENT));
  return nextReviews;
}

export function saveProductReview(review: Omit<ProductReviewEntry, "submittedAt">) {
  if (typeof window === "undefined") {
    return [];
  }

  const nextReview: ProductReviewEntry = {
    ...review,
    rating: normalizeReviewRating(review.rating),
    submittedAt: Date.now(),
  };
  const nextReviews = [nextReview, ...readProductReviews()];

  window.localStorage.setItem(PRODUCT_REVIEW_KEY, JSON.stringify(nextReviews));
  window.dispatchEvent(new Event(REVIEW_STATE_CHANGE_EVENT));
  return nextReviews;
}

export function recordPurchasedProducts(items: CartItem[]) {
  if (typeof window === "undefined") {
    return [];
  }

  const currentProducts = readPurchasedProducts();
  const seen = new Set(currentProducts.map((product) => product.slug));
  const nextProducts = [...currentProducts];

  for (const item of items) {
    if (seen.has(item.slug)) {
      continue;
    }

    seen.add(item.slug);
    nextProducts.push({
      href: item.href,
      image: item.image,
      name: item.name,
      slug: item.slug,
    });
  }

  window.localStorage.setItem(PURCHASED_PRODUCTS_KEY, JSON.stringify(nextProducts));
  window.dispatchEvent(new Event(REVIEW_STATE_CHANGE_EVENT));
  return nextProducts;
}
