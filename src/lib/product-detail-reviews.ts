type ProductHighlight = {
  description: string;
  title: string;
};

export type ProductReviewCard = {
  focus: string;
  label: string;
  quote: string;
  rating: number;
};

type ReviewCollection = "junior" | "men" | "women";

const reviewFocuses: Record<ReviewCollection, string[]> = {
  junior: ["On comfort", "On movement", "On finish"],
  men: ["On fit", "On fabric", "On finish"],
  women: ["On drape", "On comfort", "On details"],
};

function lowerFirst(value: string) {
  return value ? value.toLowerCase() : value;
}

function buildReviewQuote(index: number, highlight: ProductHighlight | undefined) {
  const emphasis = lowerFirst(highlight?.title ?? "overall finish");

  if (index === 0) {
    return `The ${emphasis} is what stands out first. It feels polished in person and easy to wear from the first try-on.`;
  }

  if (index === 1) {
    return `What I noticed most was how balanced it feels. The piece looks elevated without becoming too formal or overworked.`;
  }

  return `Beautiful color, thoughtful proportions, and a premium hand feel. The ${emphasis} gives it that extra bit of character.`;
}

export function buildProductReviewCards(
  collection: ReviewCollection,
  highlights: ProductHighlight[],
): ProductReviewCard[] {
  return reviewFocuses[collection].map((focus, index) => ({
    focus,
    label: `Review ${String(index + 1).padStart(2, "0")}`,
    quote: buildReviewQuote(index, highlights[index] ?? highlights[highlights.length - 1]),
    rating: 5,
  }));
}
