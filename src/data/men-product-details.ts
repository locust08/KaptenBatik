export type MenProductSlug =
  | "endura-canvas-jacket-forest-heart"
  | "maharaja-linen-embroidered-mount-kinabalu-turbulance"
  | "maharaja-linen-syandana-aquamarine"
  | "maharaja-slim-fit-bloomcycle-crystal-pink"
  | "maharaja-slim-fit-ilham-muse-lime-blue";

export type MenProductDetail = {
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
    slug: MenProductSlug;
  }>;
  selectedSize: string;
  sizeGuideHref?: string | string[];
  sizes: string[];
  slug: MenProductSlug;
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

const relatedCards = {
  blue: {
    image: "/figma-assets/men-products/syandana-blue/main.png",
    label: "Maharaja Linen Syandana - Aquamarine",
    price: "RM569",
    slug: "maharaja-linen-syandana-aquamarine",
  },
  gray: {
    image: "/figma-assets/men-products/embroidered-gray/main.png",
    label: "Maharaja Linen Embroidered Mount Kinabalu Turbulance",
    price: "RM699",
    slug: "maharaja-linen-embroidered-mount-kinabalu-turbulance",
  },
  pinkJacket: {
    image: "/figma-assets/men-products/endura/main.png",
    label: "Endura Canvas Jacket - Forest Heart",
    price: "RM529",
    slug: "endura-canvas-jacket-forest-heart",
  },
  pinkShirt: {
    image: "/figma-assets/men-products/ilham-lime/main.png",
    label: "Maharaja Slim Fit Bloomcycle in Crystal Pink",
    price: "RM249",
    slug: "maharaja-slim-fit-bloomcycle-crystal-pink",
  },
  yellow: {
    image: "/figma-assets/men-products/bloomcycle-pink/main.png",
    label: "Maharaja Slim Fit Ilham Muse in Lime Blue",
    price: "RM249",
    slug: "maharaja-slim-fit-ilham-muse-lime-blue",
  },
} as const;

export const menProductSlugs: MenProductSlug[] = [
  "endura-canvas-jacket-forest-heart",
  "maharaja-linen-embroidered-mount-kinabalu-turbulance",
  "maharaja-linen-syandana-aquamarine",
  "maharaja-slim-fit-bloomcycle-crystal-pink",
  "maharaja-slim-fit-ilham-muse-lime-blue",
];

export const menProductDetails: Record<MenProductSlug, MenProductDetail> = {
  "endura-canvas-jacket-forest-heart": {
    accent: "#f2a0a2",
    accentSoft: "#fdf0f0",
    addToCartTextColor: "#ffffff",
    buyNowTextColor: "#f2a0a2",
    careNotes: [
      "Hand wash separately in cold water.",
      "Do not bleach or tumble dry.",
      "Iron on low heat inside out.",
      "Avoid direct sunlight for long hours.",
    ],
    description: [
      "Cut from heavyweight cotton canvas and hand-blocked with batik, the Endura Jacket holds a sense of craft and quiet strength. Its dense weave gives structure and shape, softening gradually with wear until it feels unmistakably yours.",
      "With two inner and two outer pockets, it's built for movement - to layer, to travel, to live in. A piece that doesn't chase perfection, only purpose.",
    ],
    featureImage: "/figma-assets/men-products/endura/feature.png",
    heroPanelTextColor: "#fff7f7",
    introTitle: "Why You'll Love It",
    mainImage: "/figma-assets/men-products/endura/main.png",
    noteColor: "#ea7a7c",
    noteText:
      "Please note that colors may vary slightly due to lighting. Any imperfections are part of the natural characteristics of Kapten Batik's handmade garments, adding to their unique appeal.",
    price: "RM529.00",
    related: [relatedCards.blue, relatedCards.gray, relatedCards.pinkShirt],
    selectedSize: "L/XL",
    sizeGuideHref:
      "https://cdn.shopify.com/s/files/1/0770/5503/3633/files/Endura_Jacket.jpg?v=1773296846",
    sizes: ["S/M", "L/XL"],
    slug: "endura-canvas-jacket-forest-heart",
    thumbnails: [
      "/figma-assets/men-products/endura/thumb-1.png",
      "/figma-assets/men-products/endura/thumb-2.png",
      "/figma-assets/men-products/endura/thumb-3.png",
      "/figma-assets/men-products/endura/thumb-4.png",
    ],
    title: "Endura Canvas Jacket - Forest Heart",
    trustBadges: [...trustBadges],
    whyLove: [
      {
        description:
          "Each jacket is hand-blocked with batik, giving it a distinctive crafted look with quiet character.",
        title: "Artisanal Batik Finish",
      },
      {
        description:
          "Made from heavyweight cotton canvas, it holds its shape beautifully and softens gradually with wear.",
        title: "Durable Structure, Evolving Comfort",
      },
      {
        description:
          "With two inner and two outer pockets, it is designed for easy layering, movement, and everyday versatility.",
        title: "Functional by Design",
      },
    ],
  },
  "maharaja-linen-embroidered-mount-kinabalu-turbulance": {
    accent: "#aba8ab",
    accentSoft: "#f0eeee",
    addToCartTextColor: "#ffffff",
    buyNowTextColor: "#aba8ab",
    careNotes: [
      "Spread collar, side slits",
      "100% Pure European linen",
      "3.5mm Washed Kapten Batik Button",
      "Machine wash cold, delicate cycle, wash separately, do not apply dry clean, do not bleach, do not tumble dry",
    ],
    description: [
      "Our Hand Embroidered Series brings tradition and artistry to life through fine linen garments stitched by master artisans.",
      "Each embroidered detail reflects passion, patience, and pride, making every piece a story of culture and craftsmanship.",
      "Lightweight, breathable, and effortlessly elegant, it is designed for those who value authenticity, where slight variations and imperfections are part of its handmade beauty.",
    ],
    featureImage: "/figma-assets/men-products/embroidered-gray/feature.png",
    heroPanelTextColor: "#fbf9fb",
    introTitle: "Why You'll Love It",
    mainImage: "/figma-assets/men-products/embroidered-gray/main.png",
    noteColor: "#706d70",
    noteText:
      "Please note that colors may vary slightly due to lighting. Any imperfections are part of the natural characteristics of Kapten Batik's handmade garments, adding to their unique appeal.",
    price: "RM699.00",
    related: [relatedCards.yellow, relatedCards.pinkJacket, relatedCards.pinkShirt],
    selectedSize: "M",
    sizes: ["S", "M", "L", "XL", "2XL"],
    slug: "maharaja-linen-embroidered-mount-kinabalu-turbulance",
    thumbnails: [
      "/figma-assets/men-products/embroidered-gray/thumb-1.png",
      "/figma-assets/men-products/embroidered-gray/thumb-2.png",
      "/figma-assets/men-products/embroidered-gray/thumb-3.png",
      "/figma-assets/men-products/embroidered-gray/thumb-1.png",
    ],
    title: "Maharaja Linen Embroidered Mount Kinabalu Turbulance",
    trustBadges: [...trustBadges],
    whyLove: [
      {
        description:
          "Meticulously stitched by master artisans, each embroidered detail brings depth, artistry, and character to every piece.",
        title: "Handcrafted Embroidered Detail",
      },
      {
        description:
          "Made from 100% pure European linen, it offers breathable comfort with a refined, effortless feel.",
        title: "Lightweight Linen Elegance",
      },
      {
        description:
          "Natural variations in colour and finish are part of its handmade beauty, making every piece uniquely special.",
        title: "Authentic by Nature",
      },
    ],
  },
  "maharaja-linen-syandana-aquamarine": {
    accent: "#c1e1f9",
    accentSoft: "#eef7fd",
    addToCartTextColor: "#1a1c19",
    buyNowTextColor: "#0c70bc",
    careNotes: [],
    description: [
      "This Linen Series is tailored for modern fit with airy pure linen material which is made from 100% pure European linen. It combines both lightweight and breathable fabric with valiant colours, accompanied by the unique touch of batik artisans that are manufactured with substantially less water than cotton, resulting in a smaller water footprint.",
      "The batik shirt that gives you premium comfort.",
    ],
    featureImage: "/figma-assets/men-products/syandana-blue/feature.png",
    heroLabelColor: "#32a5fd",
    heroPanelTextColor: "#0c0b0b",
    introTitle: "Why You'll Love It",
    mainImage: "/figma-assets/men-products/syandana-blue/main.png",
    noteColor: "#0078d4",
    noteText:
      "Please note that colors may vary slightly due to lighting. Any imperfections are part of the natural characteristics of Kapten Batik's handmade garments, adding to their unique appeal.",
    price: "RM569.00",
    related: [relatedCards.yellow, relatedCards.pinkJacket, relatedCards.gray],
    selectedSize: "M",
    sizes: ["S", "M", "L", "XL", "2XL"],
    slug: "maharaja-linen-syandana-aquamarine",
    thumbnails: [
      "/figma-assets/men-products/syandana-blue/thumb-1.png",
      "/figma-assets/men-products/syandana-blue/thumb-2.png",
      "/figma-assets/men-products/syandana-blue/thumb-3.png",
      "/figma-assets/men-products/syandana-blue/thumb-4.png",
    ],
    title: "Maharaja Linen Syandana - Aquamarine",
    trustBadges: [...trustBadges],
    whyLove: [
      {
        description:
          "Made from 100% pure European linen, it offers an airy and breathable feel that keeps you comfortable throughout the day.",
        title: "Lightweight Pure Linen",
      },
      {
        description:
          "Finished with rich colours and a unique artisan batik touch, every piece reflects the charm of handmade craftsmanship.",
        title: "Distinctive Artisan Batik",
      },
      {
        description:
          "This linen fabric is produced with substantially less water than cotton, combining premium wearability with a more mindful material choice.",
        title: "Comfort with a Lower Water Footprint",
      },
    ],
  },
  "maharaja-slim-fit-bloomcycle-crystal-pink": {
    accent: "#e1bdd4",
    accentSoft: "#fbf3f8",
    addToCartTextColor: "#ffffff",
    buyNowTextColor: "#e1bdd4",
    careNotes: [
      "Button Down Collar",
      "100% Lightweight cotton",
      "3.5mm Washed Kapten Batik Button",
      "Hand wash, wash separately, do not apply dry clean, do not bleach, do not tumble dry",
    ],
    description: [
      "Maharaja Series is made from 100% lightweight cotton with a traditional hand block printing using Teak Wood Block.",
      "The cambric structure undergoes calendaring which provides a glossy appearance that retains for years regardless of fabric ageing. It has the perfect fabric for warm days and nights as the cotton used is a type of natural fibre known for its comfortable and breathable properties.",
    ],
    featureImage: "/figma-assets/men-products/ilham-lime/feature.png",
    heroPanelTextColor: "#fff9fc",
    introTitle: "Why You'll Love It",
    mainImage: "/figma-assets/men-products/ilham-lime/main.png",
    noteColor: "#e266b6",
    noteText:
      "Please note that colors may vary slightly due to lighting. Any imperfections are part of the natural characteristics of Kapten Batik's handmade garments, adding to their unique appeal.",
    price: "RM249.00",
    related: [relatedCards.blue, relatedCards.yellow, relatedCards.gray],
    selectedSize: "M",
    sizeGuideHref:
      "https://cdn.shopify.com/s/files/1/0770/5503/3633/files/Measurement_Maharaja_Custom_Slim_Fit-_Short_sleeve_2f9b14ae-e00c-4359-8dc9-30024d9dcc26.jpg?v=1751596330",
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    slug: "maharaja-slim-fit-bloomcycle-crystal-pink",
    thumbnails: [
      "/figma-assets/men-products/ilham-lime/thumb-1.png",
      "/figma-assets/men-products/ilham-lime/thumb-2.png",
      "/figma-assets/men-products/ilham-lime/thumb-3.png",
      "/figma-assets/men-products/ilham-lime/thumb-1.png",
    ],
    title: "Maharaja Slim Fit Bloomcycle in Crystal Pink",
    trustBadges: [...trustBadges],
    whyLove: [
      {
        description:
          "Traditional hand block printing using Teak Wood Block gives each piece a refined artisanal character.",
        title: "Handcrafted Batik Detail",
      },
      {
        description:
          "Made from 100% lightweight cotton, it feels cool, soft, and comfortable for all-day wear in warm weather.",
        title: "Lightweight & Breathable Comfort",
      },
      {
        description:
          "The calendared cambric fabric creates a glossy look that stays beautiful over time.",
        title: "Elegant Finish That Lasts",
      },
    ],
  },
  "maharaja-slim-fit-ilham-muse-lime-blue": {
    accent: "#a79c54",
    accentSoft: "#f8f6ea",
    addToCartTextColor: "#ffffff",
    buyNowTextColor: "#a79c54",
    careNotes: [
      "Button Down Collar",
      "100% Lightweight cotton",
      "3.5mm Washed Kapten Batik Button",
      "Hand wash, wash separately, do not apply dry clean, do not bleach, do not tumble dry",
    ],
    description: [
      "Maharaja Series is made from 100% lightweight cotton with a traditional hand block printing using Teak Wood Block.",
      "The cambric structure undergoes calendaring which provides a glossy appearance that retains for years regardless of fabric ageing. It has the perfect fabric for warm days and nights as the cotton used is a type of natural fibre known for its comfortable and breathable properties.",
    ],
    featureImage: "/figma-assets/men-products/bloomcycle-pink/feature.png",
    heroPanelTextColor: "#fffdf4",
    introTitle: "Why You'll Love It",
    mainImage: "/figma-assets/men-products/bloomcycle-pink/main.png",
    noteColor: "#a79c54",
    noteText:
      "Please note that colors may vary slightly due to lighting. Any imperfections are part of the natural characteristics of Kapten Batik's handmade garments, adding to their unique appeal.",
    price: "RM249.00",
    related: [relatedCards.blue, relatedCards.pinkJacket, relatedCards.pinkShirt],
    selectedSize: "M",
    sizeGuideHref:
      "https://cdn.shopify.com/s/files/1/0770/5503/3633/files/Measurement_Maharaja_Custom_Slim_Fit-_Short_sleeve_2f9b14ae-e00c-4359-8dc9-30024d9dcc26.jpg?v=1751596330",
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    slug: "maharaja-slim-fit-ilham-muse-lime-blue",
    thumbnails: [
      "/figma-assets/men-products/bloomcycle-pink/thumb-1.png",
      "/figma-assets/men-products/bloomcycle-pink/thumb-2.png",
      "/figma-assets/men-products/bloomcycle-pink/thumb-3.png",
      "/figma-assets/men-products/bloomcycle-pink/thumb-1.png",
    ],
    title: "Maharaja Slim Fit Ilham Muse in Lime Blue",
    trustBadges: [...trustBadges],
    whyLove: [
      {
        description:
          "Traditional hand block printing using Teak Wood Block gives every shirt a unique handmade character.",
        title: "Traditional Handcrafted Batik",
      },
      {
        description:
          "Made from 100% lightweight cotton, it offers breathable comfort that feels easy to wear in warm weather.",
        title: "Breathable Everyday Comfort",
      },
      {
        description:
          "The calendared cambric fabric creates a glossy look that retains its appeal beautifully over the years.",
        title: "Elegant Finish That Lasts",
      },
    ],
  },
};

export function getMenProductDetail(slug: string) {
  if (!menProductSlugs.includes(slug as MenProductSlug)) {
    return null;
  }

  return menProductDetails[slug as MenProductSlug];
}
