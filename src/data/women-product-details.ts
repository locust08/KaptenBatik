export type WomenProductSlug =
  | "kapten-batik-x-saarat-kaftan-set-kamala"
  | "kb-x-saarat-mahira-long-dress-wau"
  | "kurung-kedah-set-forest-melody-campanula"
  | "kurung-kedah-set-melody-heritage-rio-red"
  | "maharani-egypt-dress-tea-plantation-oyster-mushroom";

export type WomenProductDetail = {
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
    slug: WomenProductSlug;
  }>;
  selectedSize?: string;
  sizeGuideHref?: string | string[];
  sizes?: string[];
  slug: WomenProductSlug;
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
  campanula: {
    image: "/figma-assets/women-products/campanula/main.png",
    label: "Kurung Kedah Set Forest Melody in Campanula",
    price: "RM359",
    slug: "kurung-kedah-set-forest-melody-campanula",
  },
  kamala: {
    image: "/figma-assets/women-products/kamala/main.png",
    label: "Kapten Batik x Saarat Kaftan Set - Kamala",
    price: "RM625",
    slug: "kapten-batik-x-saarat-kaftan-set-kamala",
  },
  oyster: {
    image: "/figma-assets/women-products/oyster-mushroom/main.png",
    label: "Maharani Egypt Dress Tea Plantation in Oyster Mushroom",
    price: "RM319",
    slug: "maharani-egypt-dress-tea-plantation-oyster-mushroom",
  },
  rioRed: {
    image: "/figma-assets/women-products/rio-red/main.png",
    label: "Kurung Kedah Set Melody Heritage in Rio Red",
    price: "RM359",
    slug: "kurung-kedah-set-melody-heritage-rio-red",
  },
  wau: {
    image: "/figma-assets/women-products/wau/main.png",
    label: "KB X Saarat Mahira Long Dress in Wau",
    price: "RM499",
    slug: "kb-x-saarat-mahira-long-dress-wau",
  },
} as const;

export const womenProductSlugs: WomenProductSlug[] = [
  "kapten-batik-x-saarat-kaftan-set-kamala",
  "kb-x-saarat-mahira-long-dress-wau",
  "kurung-kedah-set-forest-melody-campanula",
  "kurung-kedah-set-melody-heritage-rio-red",
  "maharani-egypt-dress-tea-plantation-oyster-mushroom",
];

export const womenProductDetails: Record<WomenProductSlug, WomenProductDetail> = {
  "kapten-batik-x-saarat-kaftan-set-kamala": {
    accent: "#e0ced2",
    accentSoft: "#f7f0f3",
    addToCartTextColor: "#ffffff",
    buyNowTextColor: "#cfb7bc",
    careNotes: [
      "First Wash - Dry Clean recommended.",
      "Second Wash - Hand or Machine.",
    ],
    description: [
      "A set of free-size modern Kaftan Top and Sarong made from cotton handblocked Batik.",
      "This is an exclusive Kapten Batik X Saarat collaboration garment. All imperfections are a natural characteristic of the hand-blocked Batik fabric.",
    ],
    featureImage: "/figma-assets/women-products/kamala/feature.png",
    heroLabelColor: "#cfb7bc",
    heroPanelTextColor: "#120e10",
    introTitle: "Why You'll Love It",
    mainImage: "/figma-assets/women-products/kamala/main.png",
    noteColor: "#9e878c",
    noteText,
    price: "RM625.00",
    related: [relatedCards.wau, relatedCards.oyster, relatedCards.campanula],
    slug: "kapten-batik-x-saarat-kaftan-set-kamala",
    thumbnails: [
      "/figma-assets/women-products/kamala/thumb-1.png",
      "/figma-assets/women-products/kamala/thumb-4.png",
      "/figma-assets/women-products/kamala/thumb-3.png",
      "/figma-assets/women-products/kamala/thumb-2.png",
    ],
    title: "Kapten Batik x Saarat Kaftan Set - Kamala",
    trustBadges: [...trustBadges],
    whyLove: [
      {
        description:
          "Crafted from cotton handblocked Batik, each piece carries a unique handmade character with natural variations in the fabric.",
        title: "Artisanal Handblocked Batik",
      },
      {
        description:
          "The modern free-size Kaftan Top and Sarong set is designed for easy comfort with a graceful silhouette.",
        title: "Relaxed, Elegant Fit",
      },
      {
        description:
          "Part of the exclusive Kapten Batik x Saarat collection, this design feels distinctive, elevated, and limited.",
        title: "A Special Collaboration",
      },
    ],
  },
  "kb-x-saarat-mahira-long-dress-wau": {
    accent: "#829393",
    accentSoft: "#eef2f2",
    addToCartTextColor: "#ffffff",
    buyNowTextColor: "#829393",
    careNotes: [
      "Hand wash or gentle machine wash in cold water",
      "Use mild detergent",
      "Do not bleach",
      "Line dry in shade",
      "Warm iron on reverse side if needed",
      "Dry clean recommended for longer wear",
    ],
    description: [
      "Step into confidence and grace with the Saarat Kapten Batik Dress, where timeless batik artistry meets a modern, empowering silhouette.",
      "Made from premium breathable fabric, it drapes beautifully for all-day comfort and sophistication.",
      "Intricate batik motifs honour Nusantara heritage, while refined tailoring adds a contemporary touch. Perfect for formal occasions, cultural events, or elegant everyday wear.",
    ],
    featureImage: "/figma-assets/women-products/wau/feature.png",
    heroLabelColor: "#829393",
    heroPanelTextColor: "#ffffff",
    introTitle: "Why You'll Love It",
    mainImage: "/figma-assets/women-products/wau/main.png",
    noteColor: "#829393",
    noteText,
    price: "RM499.00",
    related: [relatedCards.rioRed, relatedCards.oyster, relatedCards.kamala],
    slug: "kb-x-saarat-mahira-long-dress-wau",
    thumbnails: [
      "/figma-assets/women-products/wau/thumb-1.png",
      "/figma-assets/women-products/wau/thumb-2.png",
      "/figma-assets/women-products/wau/thumb-3.png",
      "/figma-assets/women-products/wau/thumb-4.png",
    ],
    title: "KB X Saarat Mahira Long Dress in Wau",
    trustBadges: [...trustBadges],
    whyLove: [
      {
        description:
          "A modern batik silhouette that balances expressive heritage motifs with an effortlessly elegant presence.",
        title: "Modern Elegance in Batik",
      },
      {
        description:
          "Made from premium breathable fabric, it feels soft, easy, and comfortable to wear through the day.",
        title: "Comfortably Breathable",
      },
      {
        description:
          "The motifs honour Nusantara craft traditions while refined tailoring keeps the piece polished and contemporary.",
        title: "Inspired by Heritage",
      },
    ],
  },
  "kurung-kedah-set-forest-melody-campanula": {
    accent: "#df7044",
    accentSoft: "#fbf0eb",
    addToCartTextColor: "#ffffff",
    buyNowTextColor: "#df7044",
    careNotes: [
      "High fabric durability with lower fabric shrinkage",
      "3.5mm Washed Kapten Batik Button",
      "Machine wash: delicate/gentle cycle, cold water",
    ],
    description: [
      "Baju Kurung Kedah Set from the Nusantara Series is made from 100% cotton with a high-quality printed batik design. Using rotary screen printing, our in-house designer creates vibrant, consistent prints on both the front and back.",
      "The fabric offers a silk-like lustre, lasting durability, and premium comfort with excellent absorbency and natural mildew resistance.",
      "It is also certified STANDARD 100 by OEKO-TEX®, with every component tested safe for human use.",
    ],
    featureImage: "/figma-assets/women-products/campanula/feature.png",
    heroLabelColor: "#df7044",
    heroPanelTextColor: "#ffffff",
    introTitle: "Why You'll Love It",
    mainImage: "/figma-assets/women-products/campanula/main.png",
    noteColor: "#df7044",
    noteText,
    price: "RM359.00",
    related: [relatedCards.rioRed, relatedCards.oyster, relatedCards.kamala],
    selectedSize: "M/L",
    sizeGuideHref: [
      "https://cdn.shopify.com/s/files/1/0770/5503/3633/files/Baju_Kurung_Kedah-01.jpg?v=1764037459",
      "https://cdn.shopify.com/s/files/1/0770/5503/3633/files/Baju_Kurung_Kedah-02.jpg?v=1764037484",
    ],
    sizes: ["XS/S", "M/L", "XL/2XL"],
    slug: "kurung-kedah-set-forest-melody-campanula",
    thumbnails: [
      "/figma-assets/women-products/campanula/thumb-1.png",
      "/figma-assets/women-products/campanula/thumb-2.png",
      "/figma-assets/women-products/campanula/thumb-3.png",
      "/figma-assets/women-products/campanula/thumb-4.png",
    ],
    title: "Kurung Kedah Set Forest Melody in Campanula",
    trustBadges: [...trustBadges],
    whyLove: [
      {
        description:
          "Our printed batik technique creates vibrant, consistent artwork across the front and back of the set.",
        title: "Premium Printed Batik",
      },
      {
        description:
          "Made from 100% cotton, the fabric balances comfort, breathability, and a lasting premium feel.",
        title: "Comfort with Lasting Quality",
      },
      {
        description:
          "Every component is tested and certified STANDARD 100 by OEKO-TEX® for peace of mind when worn.",
        title: "Certified Safe to Wear",
      },
    ],
  },
  "kurung-kedah-set-melody-heritage-rio-red": {
    accent: "#562644",
    accentSoft: "#f7edf2",
    addToCartTextColor: "#ffffff",
    buyNowTextColor: "#562644",
    careNotes: [
      "High fabric durability with lower fabric shrinkage",
      "3.5mm Washed Kapten Batik Button",
      "Machine wash: delicate/gentle cycle, cold water",
    ],
    description: [
      "Baju Kurung Kedah Set from the Nusantara Series is made from 100% cotton with a high-quality printed batik design. Using rotary screen printing, our in-house designer ensures vibrant, consistent prints on both the front and back.",
      "The fabric offers a silk-like lustre, lasting durability, and premium comfort with excellent absorbency and natural mildew resistance.",
      "It is also certified STANDARD 100 by OEKO-TEX®, with every component tested and proven safe for human use.",
    ],
    featureImage: "/figma-assets/women-products/rio-red/feature.png",
    heroLabelColor: "#562644",
    heroPanelTextColor: "#ffffff",
    introTitle: "Why You'll Love It",
    mainImage: "/figma-assets/women-products/rio-red/main.png",
    noteColor: "#8d5c74",
    noteText,
    price: "RM359.00",
    related: [relatedCards.campanula, relatedCards.oyster, relatedCards.wau],
    selectedSize: "M/L",
    sizeGuideHref: [
      "https://cdn.shopify.com/s/files/1/0770/5503/3633/files/Baju_Kurung_Kedah-01.jpg?v=1764037459",
      "https://cdn.shopify.com/s/files/1/0770/5503/3633/files/Baju_Kurung_Kedah-02.jpg?v=1764037484",
    ],
    sizes: ["XS/S", "M/L", "XL/2XL"],
    slug: "kurung-kedah-set-melody-heritage-rio-red",
    thumbnails: [
      "/figma-assets/women-products/rio-red/thumb-1.png",
      "/figma-assets/women-products/rio-red/thumb-2.png",
      "/figma-assets/women-products/rio-red/thumb-3.png",
      "/figma-assets/women-products/rio-red/thumb-4.png",
    ],
    title: "Kurung Kedah Set Melody Heritage in Rio Red",
    trustBadges: [...trustBadges],
    whyLove: [
      {
        description:
          "Crafted from 100% cotton, this Kurung Kedah Set features a high-quality printed batik design with vibrant, consistent prints on both the front and back using rotary screen printing.",
        title: "Premium Printed Batik",
      },
      {
        description:
          "The fabric offers a silk-like lustre, excellent absorbency, natural mildew resistance, and long-lasting durability for premium everyday comfort.",
        title: "Comfort with Lasting Quality",
      },
      {
        description:
          "Certified STANDARD 100 by OEKO-TEX®, every component of the garment has been tested and proven safe for human use.",
        title: "Certified Safe to Wear",
      },
    ],
  },
  "maharani-egypt-dress-tea-plantation-oyster-mushroom": {
    accent: "#e0d6b7",
    accentSoft: "#f8f4e7",
    addToCartTextColor: "#ffffff",
    buyNowTextColor: "#b4ac92",
    careNotes: [],
    description: [
      "Maharani is from Maharaja Series which is made from 100% lightweight cotton with a traditional hand block printing using Teak Wood Block.",
      "The cambric structure undergoes calendaring which provides a glossy appearance that retains for years regardless of fabric ageing. It has the perfect fabric for warm days and nights as the cotton used is a type of natural fibre known for its comfortable and breathable properties.",
    ],
    featureImage: "/figma-assets/women-products/oyster-mushroom/feature.png",
    heroLabelColor: "#b4ac92",
    heroPanelTextColor: "#11100c",
    introTitle: "Why You'll Love It",
    mainImage: "/figma-assets/women-products/oyster-mushroom/main.png",
    noteColor: "#b4ac92",
    noteText,
    price: "RM319.00",
    related: [relatedCards.rioRed, relatedCards.kamala, relatedCards.campanula],
    selectedSize: "S",
    sizeGuideHref:
      "https://cdn.shopify.com/s/files/1/0770/5503/3633/files/Measurements_EGYPT-07_51d96a3c-fb3f-4889-aa7d-1aebd5c6880b.jpg?v=1759887005",
    sizes: ["XS", "S", "M", "L", "XL"],
    slug: "maharani-egypt-dress-tea-plantation-oyster-mushroom",
    thumbnails: [
      "/figma-assets/women-products/oyster-mushroom/thumb-1.png",
      "/figma-assets/women-products/oyster-mushroom/thumb-2.png",
      "/figma-assets/women-products/oyster-mushroom/thumb-3.png",
      "/figma-assets/women-products/oyster-mushroom/thumb-4.png",
    ],
    title: "Maharani Egypt Dress Tea Plantation in Oyster Mushroom",
    trustBadges: [...trustBadges],
    whyLove: [
      {
        description:
          "Traditional hand block printing using Teak Wood Block gives this piece a refined artisanal character.",
        title: "Handcrafted Batik Detail",
      },
      {
        description:
          "Made from 100% lightweight cotton, it feels cool, soft, and comfortable for all-day wear in warm weather.",
        title: "Lightweight & Breathable Comfort",
      },
      {
        description:
          "The calendared cambric fabric creates a glossy look that remains beautiful over time.",
        title: "Elegant Finish That Lasts",
      },
    ],
  },
};

export function getWomenProductDetail(slug: string) {
  if (!womenProductSlugs.includes(slug as WomenProductSlug)) {
    return null;
  }

  return womenProductDetails[slug as WomenProductSlug];
}
