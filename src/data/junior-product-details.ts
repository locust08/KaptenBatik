export type JuniorProductSlug =
  | "maharaja-junior-gamelan-golden-cream"
  | "nusantara-junior-saxosoul-blue-glow"
  | "maharaja-junior-ilham-muse-picasso-lily"
  | "nusantara-junior-chepor-waterfall-blue-topaz"
  | "nusantara-junior-capri-mount-kinabalu-windsurfer";

export type JuniorProductDetail = {
  accent: string;
  accentSoft: string;
  addToCartTextColor?: string;
  buyNowTextColor?: string;
  careNotes: string[];
  description: string[];
  featureImage: string;
  heroBackgroundColor?: string;
  heroLabelColor?: string;
  heroPanelTextColor?: string;
  introTitle: string;
  mainImage: string;
  noteColor: string;
  noteText: string;
  price: string;
  related: Array<{
    image: string;
    label: string;
    price: string;
    slug: JuniorProductSlug;
  }>;
  selectedSize?: string;
  sizeGuideHref?: string | string[];
  sizes: string[];
  slug: JuniorProductSlug;
  thumbnails: string[];
  title: string;
  trustBadges: Array<{
    description: string;
    title: string;
  }>;
  whyLove: Array<{
    description: string;
    title: string;
  }>;
};

const juniorSizeGuideHref =
  "https://cdn.shopify.com/s/files/1/0770/5503/3633/files/kids.jpg?v=1707903537";

const trustBadges = [
  {
    description: "SSL encrypted payment processing",
    title: "Secure Checkout",
  },
  {
    description: "Track your order in real-time",
    title: "Easy Order Review",
  },
  {
    description: "Authentic hand-blocked heritage",
    title: "Curated Premium Selection",
  },
] as const;

const noteText =
  "Please note that colors may vary slightly due to lighting. Any imperfections are part of the natural characteristics of Kapten Batik's handmade garments, adding to their unique appeal.";

const relatedCards = {
  capri: {
    image: "/figma-assets/junior-products/capri-windsurfer/main.png",
    label: "Nusantara Junior Capri Mount Kinabalu in Windsurfer",
    price: "RM159",
    slug: "nusantara-junior-capri-mount-kinabalu-windsurfer",
  },
  chepor: {
    image: "/figma-assets/junior-products/chepor-blue-topaz/main.png",
    label: "Nusantara Junior Chepor Waterfall in Blue Topaz",
    price: "RM139",
    slug: "nusantara-junior-chepor-waterfall-blue-topaz",
  },
  gamelan: {
    image: "/figma-assets/junior-products/gamelan-golden-cream/main.png",
    label: "Maharaja Junior Gamelan in Golden Cream",
    price: "RM189",
    slug: "maharaja-junior-gamelan-golden-cream",
  },
  ilham: {
    image: "/figma-assets/junior-products/ilham-picasso-lily/main.png",
    label: "Maharaja Junior Ilham Muse in Picasso Lily",
    price: "RM189",
    slug: "maharaja-junior-ilham-muse-picasso-lily",
  },
  saxosoul: {
    image: "/figma-assets/junior-products/saxosoul-blue-glow/main.png",
    label: "Nusantara Junior Saxosoul in Blue Glow",
    price: "RM139",
    slug: "nusantara-junior-saxosoul-blue-glow",
  },
} as const;

export const juniorProductSlugs: JuniorProductSlug[] = [
  "maharaja-junior-gamelan-golden-cream",
  "nusantara-junior-saxosoul-blue-glow",
  "maharaja-junior-ilham-muse-picasso-lily",
  "nusantara-junior-chepor-waterfall-blue-topaz",
  "nusantara-junior-capri-mount-kinabalu-windsurfer",
];

export const juniorProductDetails: Record<JuniorProductSlug, JuniorProductDetail> = {
  "maharaja-junior-gamelan-golden-cream": {
    accent: "#fcb76e",
    accentSoft: "#fff0e0",
    addToCartTextColor: "#ffffff",
    buyNowTextColor: "#fcb76e",
    careNotes: [
      "Without Pocket",
      "100% Lightweight Cotton",
      "Breathable & comfortable, suitable for hot & humid Asian weather",
      "3.5mm Washed Kapten Batik Button",
      "Hand wash, wash separately, do not dry clean, do not bleach, do not tumble dry",
    ],
    description: [
      "Maharaja Series is made from 100% lightweight cotton with a traditional hand block printing using Teak Wood Block.",
      "The cambric structure undergoes calendaring which provides a glossy appearance that retains for years regardless of fabric ageing.",
      "It has the perfect fabric for warm days and nights as the cotton used is a type of natural fibre known for its comfortable and breathable properties.",
    ],
    featureImage: "/figma-assets/junior-products/gamelan-golden-cream/feature.png",
    heroLabelColor: "#fcb76e",
    heroPanelTextColor: "#0c0b0b",
    introTitle: "Why You'll Love It",
    mainImage: "/figma-assets/junior-products/gamelan-golden-cream/main.png",
    noteColor: "#cf6e07",
    noteText,
    price: "RM189.00",
    related: [relatedCards.capri, relatedCards.saxosoul, relatedCards.chepor],
    selectedSize: "M",
    sizeGuideHref: juniorSizeGuideHref,
    sizes: ["S", "M", "L", "XL", "2XL"],
    slug: "maharaja-junior-gamelan-golden-cream",
    thumbnails: [
      "/figma-assets/junior-products/gamelan-golden-cream/thumb-1.png",
      "/figma-assets/junior-products/gamelan-golden-cream/thumb-2.png",
      "/figma-assets/junior-products/gamelan-golden-cream/thumb-3.png",
    ],
    title: "Maharaja Junior Gamelan in Golden Cream",
    trustBadges: [...trustBadges],
    whyLove: [
      {
        description:
          "Printed using a Teak Wood Block technique, each piece reflects the beauty of authentic handmade batik.",
        title: "Traditional Hand Block Craftsmanship",
      },
      {
        description:
          "Made from 100% lightweight cotton, it feels breathable and comfortable for warm days and humid weather.",
        title: "Cool & Comfortable to Wear",
      },
      {
        description:
          "The calendared cambric fabric creates a glossy appearance that stays refined as the garment ages.",
        title: "Elegant Finish That Lasts",
      },
    ],
  },
  "nusantara-junior-saxosoul-blue-glow": {
    accent: "#97b5bf",
    accentSoft: "#eef5f7",
    addToCartTextColor: "#ffffff",
    buyNowTextColor: "#97b5bf",
    careNotes: [
      "Button Down Collar",
      "100% cotton",
      "High fabric durability with lower fabric shrinkage",
      "3.5mm Washed Kapten Batik Button",
      "Machine wash: delicate/gentle cycle, cold water",
    ],
    description: [
      "This premium batik shirt is inspired by the spirit of Nusantara, with every detail thoughtfully designed by Kapten Batik's in-house designer.",
      "Made from 100% cotton, it features high-quality rotary screen printed batik on the front and back.",
      "The fabric offers a silk-like lustre, durability, excellent absorbency, and natural mildew resistance for premium comfort. Certified STANDARD 100 by OEKO-TEX®, every component is tested safe for human use.",
    ],
    featureImage: "/figma-assets/junior-products/saxosoul-blue-glow/feature.png",
    heroLabelColor: "#97b5bf",
    heroPanelTextColor: "#ffffff",
    introTitle: "Why You'll Love It",
    mainImage: "/figma-assets/junior-products/saxosoul-blue-glow/main.png",
    noteColor: "#4d999f",
    noteText,
    price: "RM139.00",
    related: [relatedCards.gamelan, relatedCards.ilham, relatedCards.capri],
    selectedSize: "M",
    sizeGuideHref: juniorSizeGuideHref,
    sizes: ["S", "M", "L", "XL", "2XL"],
    slug: "nusantara-junior-saxosoul-blue-glow",
    thumbnails: [
      "/figma-assets/junior-products/saxosoul-blue-glow/thumb-1.png",
      "/figma-assets/junior-products/saxosoul-blue-glow/thumb-2.png",
      "/figma-assets/junior-products/saxosoul-blue-glow/thumb-3.png",
    ],
    title: "Nusantara Junior Saxosoul in Blue Glow",
    trustBadges: [...trustBadges],
    whyLove: [
      {
        description:
          "Made from 100% cotton, it features a vivid high-quality printed batik with detailed front and back motifs.",
        title: "High-Quality Printed Batik",
      },
      {
        description:
          "A smooth finish, durable fabric, good absorbency, and mildew resistance combine for breathable everyday comfort.",
        title: "Soft Feel, Strong Comfort",
      },
      {
        description:
          "Certified STANDARD 100 by OEKO-TEX®, every component has been tested and proven safe for human use.",
        title: "Tested Safe for Everyday Wear",
      },
    ],
  },
  "maharaja-junior-ilham-muse-picasso-lily": {
    accent: "#887896",
    accentSoft: "#f1edf5",
    addToCartTextColor: "#ffffff",
    buyNowTextColor: "#887896",
    careNotes: [
      "Without Pocket",
      "100% Lightweight Cotton",
      "Breathable & comfortable, suitable for hot & humid Asian weather",
      "3.5mm Washed Kapten Batik Button",
      "Hand wash, wash separately, do not dry clean, do not bleach, do not tumble dry",
    ],
    description: [
      "Maharaja Series is made from 100% lightweight cotton with a traditional hand block printing using Teak Wood Block.",
      "The cambric structure undergoes calendaring which provides a glossy appearance that retains for years regardless of fabric ageing.",
      "It has the perfect fabric for warm days and nights as the cotton used is a type of natural fibre known for its comfortable and breathable properties.",
    ],
    featureImage: "/figma-assets/junior-products/ilham-picasso-lily/feature.png",
    heroLabelColor: "#887896",
    heroPanelTextColor: "#0c0b0b",
    introTitle: "Why You'll Love It",
    mainImage: "/figma-assets/junior-products/ilham-picasso-lily/main.png",
    noteColor: "#887996",
    noteText,
    price: "RM189.00",
    related: [relatedCards.gamelan, relatedCards.saxosoul, relatedCards.chepor],
    selectedSize: "M",
    sizeGuideHref: juniorSizeGuideHref,
    sizes: ["S", "M", "L", "XL", "2XL"],
    slug: "maharaja-junior-ilham-muse-picasso-lily",
    thumbnails: [
      "/figma-assets/junior-products/ilham-picasso-lily/thumb-1.png",
      "/figma-assets/junior-products/ilham-picasso-lily/thumb-2.png",
      "/figma-assets/junior-products/ilham-picasso-lily/thumb-3.png",
    ],
    title: "Maharaja Junior Ilham Muse in Picasso Lily",
    trustBadges: [...trustBadges],
    whyLove: [
      {
        description:
          "Traditional hand block printing using Teak Wood Block gives each piece a distinctive handmade character.",
        title: "Authentic Handcrafted Batik",
      },
      {
        description:
          "Made from 100% lightweight cotton, it feels breathable and comfortable for warm days and humid weather.",
        title: "Cool, Lightweight Comfort",
      },
      {
        description:
          "The calendared cambric fabric creates a glossy look that remains beautiful over time.",
        title: "Elegant Finish, Made to Last",
      },
    ],
  },
  "nusantara-junior-chepor-waterfall-blue-topaz": {
    accent: "#78b4bc",
    accentSoft: "#edf7f8",
    addToCartTextColor: "#ffffff",
    buyNowTextColor: "#78b4bc",
    careNotes: [
      "Button Down Collar",
      "100% cotton",
      "High fabric durability with lower fabric shrinkage",
      "3.5mm Washed Kapten Batik Button",
      "Machine wash: delicate/gentle cycle, cold water",
    ],
    description: [
      "This premium batik shirt is inspired by the spirit of Nusantara, with every detail, formation, and finishing exquisitely sketched by Kapten Batik's in-house designer.",
      "Made from 100% cotton, it features high-quality rotary screen printed batik on the front and back.",
      "The fabric offers a silk-like lustre, lasting durability, excellent absorbency, and natural mildew resistance for premium comfort. It is also certified STANDARD 100 by OEKO-TEX®, with every thread, button, and accessory tested safe for human use.",
    ],
    featureImage: "/figma-assets/junior-products/chepor-waterfall-blue-topaz/feature.png",
    heroLabelColor: "#78b4bc",
    heroPanelTextColor: "#ffffff",
    introTitle: "Why You'll Love It",
    mainImage: "/figma-assets/junior-products/chepor-blue-topaz/main.png",
    noteColor: "#0e8797",
    noteText,
    price: "RM139.00",
    related: [relatedCards.ilham, relatedCards.gamelan, relatedCards.capri],
    selectedSize: "M",
    sizeGuideHref: juniorSizeGuideHref,
    sizes: ["S", "M", "L", "XL", "2XL"],
    slug: "nusantara-junior-chepor-waterfall-blue-topaz",
    thumbnails: [
      "/figma-assets/junior-products/chepor-blue-topaz/thumb-1.png",
      "/figma-assets/junior-products/chepor-blue-topaz/thumb-2.png",
      "/figma-assets/junior-products/chepor-blue-topaz/thumb-3.png",
    ],
    title: "Nusantara Junior Chepor Waterfall in Blue Topaz",
    trustBadges: [...trustBadges],
    whyLove: [
      {
        description:
          "Crafted from 100% cotton, this piece features a high-quality printed batik design with vibrant, consistent front and back prints.",
        title: "Premium Printed Batik",
      },
      {
        description:
          "With a silk-like lustre, durable finish, and breathable comfort, the fabric is designed for easy all-day wear.",
        title: "Comfort with Lasting Quality",
      },
      {
        description:
          "Certified STANDARD 100 by OEKO-TEX®, every component has been tested and proven safe for human use.",
        title: "Certified Safe to Wear",
      },
    ],
  },
  "nusantara-junior-capri-mount-kinabalu-windsurfer": {
    accent: "#9eb4c1",
    accentSoft: "#eef4f7",
    addToCartTextColor: "#ffffff",
    buyNowTextColor: "#9eb4c1",
    careNotes: [
      "Button Down Collar",
      "100% cotton",
      "High fabric durability with lower fabric shrinkage",
      "3.5mm Washed Kapten Batik Button",
      "Machine wash: delicate/gentle cycle, cold water",
    ],
    description: [
      "Inspired by the spirit of Nusantara, this premium batik shirt is made from 100% cotton with high-quality rotary screen printed batik on the front and back.",
      "It offers a silk-like lustre, lasting durability, and premium comfort, finished with a soft CAPRI collar for effortless style.",
      "Certified STANDARD 100 by OEKO-TEX®, every component is tested safe for human use.",
    ],
    featureImage: "/figma-assets/junior-products/capri-windsurfer/feature.png",
    heroLabelColor: "#9eb4c1",
    heroPanelTextColor: "#0c0b0b",
    introTitle: "Why You'll Love It",
    mainImage: "/figma-assets/junior-products/capri-windsurfer/main.png",
    noteColor: "#4a7086",
    noteText,
    price: "RM159.00",
    related: [relatedCards.ilham, relatedCards.gamelan, relatedCards.chepor],
    selectedSize: "M",
    sizeGuideHref: juniorSizeGuideHref,
    sizes: ["S", "M", "L", "XL", "2XL"],
    slug: "nusantara-junior-capri-mount-kinabalu-windsurfer",
    thumbnails: [
      "/figma-assets/junior-products/capri-windsurfer/thumb-1.png",
      "/figma-assets/junior-products/capri-windsurfer/thumb-2.png",
      "/figma-assets/junior-products/capri-windsurfer/thumb-3.png",
    ],
    title: "Nusantara Junior Capri Mount Kinabalu in Windsurfer",
    trustBadges: [...trustBadges],
    whyLove: [
      {
        description:
          "Crafted from 100% cotton, this piece features a high-quality printed batik design with vibrant, consistent front and back prints using rotary screen printing.",
        title: "Premium Printed Batik",
      },
      {
        description:
          "The fabric offers a silk-like lustre, excellent absorbency, mildew resistance, and durable quality for premium everyday comfort.",
        title: "Comfort with Lasting Quality",
      },
      {
        description:
          "Certified STANDARD 100 by OEKO-TEX®, every component has been tested and proven safe for human use.",
        title: "Certified Safe to Wear",
      },
    ],
  },
};

export function getJuniorProductDetail(slug: string) {
  if (!juniorProductSlugs.includes(slug as JuniorProductSlug)) {
    return null;
  }

  return juniorProductDetails[slug as JuniorProductSlug];
}
