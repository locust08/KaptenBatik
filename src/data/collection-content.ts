export type CollectionKey = "men" | "women" | "junior";

export type CollectionPerson = {
  alt: string;
  detailPath?: string;
  image: string;
  name: string;
};

export type CollectionDescription = {
  after?: string;
  before: string;
  highlight?: string;
  lines?: string[];
};

export type CollectionContent = {
  defaultActiveIndex: number;
  description: CollectionDescription;
  heading: string;
  label: string;
  people: CollectionPerson[];
};

export type HomeBrandPillar = {
  description: string;
  image: string;
  imageAlt: string;
  label: string;
  metric: string;
  title: string;
};

export type FooterColumn = {
  items: string[];
  title: string;
};

export const collectionOrder: CollectionKey[] = ["men", "women", "junior"];

export const heroContent = {
  announcement:
    "FREE SHIPPING WITH ORDERS ABOVE RM200 FOR WEST MALAYSIA & RM300 FOR EAST MALAYSIA",
  description:
    "Browse a curated selection of expressive prints and artisanal techniques, where every thread tells a story of Malaysian heritage reimagined for the contemporary global citizen.",
  subtitle: "Explore standout batik designs shaped for modern wardrobes.",
  title: ["The", "Collection"],
};

export const collections: Record<CollectionKey, CollectionContent> = {
  men: {
    defaultActiveIndex: 2,
    description: {
      before:
        "Discover our refined collection of men's batik wear, featuring timeless shirts designed with authentic craftsmanship. Combining traditional artistry with modern comfort, each piece is made for effortless style, whether for everyday wear or special occasions.",
      lines: [
        "Discover our refined collection of men's batik wear, featuring timeless shirts designed with",
        "authentic craftsmanship. Combining traditional artistry with modern comfort, each piece is",
        "made for effortless style, whether for everyday wear or",
        "special occasions.",
      ],
    },
    heading: "Men Collection",
    label: "Men",
    people: [
      {
        alt: "Maharaja Slim Fit Ilham Muse in Lime Blue",
        detailPath: "/men/maharaja-slim-fit-ilham-muse-lime-blue",
        image: "/figma-assets/collections/men-outer-left.png",
        name: "Maharaja Slim Fit Ilham Muse in Lime Blue",
      },
      {
        alt: "Maharaja Slim Fit Bloomcycle in Crystal Pink",
        detailPath: "/men/maharaja-slim-fit-bloomcycle-crystal-pink",
        image: "/figma-assets/collections/men-inner-left.png",
        name: "Maharaja Slim Fit Bloomcycle in Crystal Pink",
      },
      {
        alt: "Maharaja Linen Syandana in Aquamarine",
        detailPath: "/men/maharaja-linen-syandana-aquamarine",
        image: "/figma-assets/collections/men-center.png",
        name: "Maharaja Linen Syandana - Aquamarine",
      },
      {
        alt: "Maharaja Linen Embroidered Mount Kinabalu Turbulance",
        detailPath: "/men/maharaja-linen-embroidered-mount-kinabalu-turbulance",
        image: "/figma-assets/collections/men-inner-right.png",
        name: "Maharaja Linen Embroidered Mount Kinabalu Turbulance",
      },
      {
        alt: "KB X Saarat Mahira Long Dress in Wau",
        detailPath: "/men/endura-canvas-jacket-forest-heart",
        image: "/figma-assets/collections/men-outer-right.png",
        name: "KB X Saarat Mahira Long Dress in Wau",
      },
    ],
  },
  women: {
    defaultActiveIndex: 2,
    description: {
      before:
        "Discover our elegant collection of women's batik clothing, featuring beautiful dresses, blouses, and kaftans. Explore unique designs crafted with traditional artistry.",
    },
    heading: "Women Collection",
    label: "Women",
    people: [
      {
        alt: "Kapten Batik x Saarat Kaftan Set Kamala",
        detailPath: "/women/kapten-batik-x-saarat-kaftan-set-kamala",
        image: "/figma-assets/collections/women-outer-left.png",
        name: "Kapten Batik x Saarat Kaftan Set - Kamala",
      },
      {
        alt: "Maharani Egypt Dress Tea Plantation in Oyster Mushroom",
        detailPath: "/women/maharani-egypt-dress-tea-plantation-oyster-mushroom",
        image: "/figma-assets/collections/women-inner-left.png",
        name: "Maharani Egypt Dress Tea Plantation in Oyster Mushroom",
      },
      {
        alt: "Kurung Kedah Set Melody Heritage in Rio Red",
        detailPath: "/women/kurung-kedah-set-melody-heritage-rio-red",
        image: "/figma-assets/collections/women-center.png",
        name: "Kurung Kedah Set Melody Heritage in Rio Red",
      },
      {
        alt: "Kurung Kedah Set Forest Melody in Campanula",
        detailPath: "/women/kurung-kedah-set-forest-melody-campanula",
        image: "/figma-assets/collections/women-inner-right.png",
        name: "Kurung Kedah Set Forest Melody in Campanula",
      },
      {
        alt: "KB X Saarat Mahira Long Dress in Wau",
        detailPath: "/women/kb-x-saarat-mahira-long-dress-wau",
        image: "/figma-assets/collections/women-outer-right.png",
        name: "KB X Saarat Mahira Long Dress in Wau",
      },
    ],
  },
  junior: {
    defaultActiveIndex: 2,
    description: {
      after:
        ", it ensures comfort for active children while showcasing authentic batik artistry. The vibrant yet harmonious colors reflect cultural heritage and skilled craftsmanship, perfect for both casual wear and special occasions.",
      before: "Made from ",
      highlight: "soft, breathable fabric",
    },
    heading: "Kapten Batik Junior",
    label: "Junior",
    people: [
      {
        alt: "Nusantara Junior Capri Mount Kinabalu in Windsurfer",
        detailPath: "/junior/nusantara-junior-capri-mount-kinabalu-windsurfer",
        image: "/figma-assets/collections/junior-outer-left.png",
        name: "Nusantara Junior Capri Mount Kinabalu in Windsurfer",
      },
      {
        alt: "Nusantara Junior Chepor Waterfall in Blue Topaz",
        detailPath: "/junior/nusantara-junior-chepor-waterfall-blue-topaz",
        image: "/figma-assets/collections/junior-inner-left.png",
        name: "Nusantara Junior Chepor Waterfall in Blue Topaz",
      },
      {
        alt: "Maharaja Junior Ilham Muse in Picasso Lily",
        detailPath: "/junior/maharaja-junior-ilham-muse-picasso-lily",
        image: "/figma-assets/collections/junior-center.png",
        name: "Maharaja Junior Ilham Muse in Picasso Lily",
      },
      {
        alt: "Nusantara Junior Saxosoul in Blue Glow",
        detailPath: "/junior/nusantara-junior-saxosoul-blue-glow",
        image: "/figma-assets/collections/junior-inner-right.png",
        name: "Nusantara Junior Saxosoul in Blue Glow",
      },
      {
        alt: "Maharaja Junior Gamelan in Golden Cream",
        detailPath: "/junior/maharaja-junior-gamelan-golden-cream",
        image: "/figma-assets/collections/junior-outer-right.png",
        name: "Maharaja Junior Gamelan in Golden Cream",
      },
    ],
  },
};

export const homeBrandPillars: HomeBrandPillar[] = [
  {
    description:
      "Authentic batik language interpreted with silhouettes that feel effortless in everyday life.",
    image: "/kapten-site-assets/home/style-men.png",
    imageAlt: "Kapten Batik men collection campaign image",
    label: "Design Language",
    metric: "Modern Heritage",
    title: "Traditional craft, sharpened for contemporary wardrobes.",
  },
  {
    description:
      "Breathable fabrics, practical tailoring, and wearable comfort built for warm Malaysian days.",
    image: "/kapten-site-assets/home/style-women.png",
    imageAlt: "Kapten Batik women collection campaign image",
    label: "Wearability",
    metric: "Lightweight Comfort",
    title: "Pieces made to move from workdays to special occasions.",
  },
  {
    description:
      "A curated point of view across men, women, and junior so the whole collection feels connected.",
    image: "/kapten-site-assets/home/style-junior.png",
    imageAlt: "Kapten Batik junior collection campaign image",
    label: "Collection Focus",
    metric: "Men, Women, Junior",
    title: "One house, multiple expressions of Kapten Batik.",
  },
];

export const footerColumns: FooterColumn[] = [
  {
    items: ["Men's Batik", "Women's Batik", "Junior's Batik"],
    title: "The Collection",
  },
  {
    items: ["Contact Kapten Batik"],
    title: "Assistance",
  },
];

export const footerCollectionHrefs = {
  "Junior's Batik": "/?collection=junior#collection",
  "Men's Batik": "/?collection=men#collection",
  "Women's Batik": "/?collection=women#collection",
} as const;

export const footerCopy = {
  brandDescription:
    "Preserving the heritage of Malaysian Batik through contemporary designs and artisanal excellence.",
  copyright: "© 2026 KAPTEN BATIK. CRAFTED IN MALAYSIA.",
  newsletterBlurb: "Join the journal for exclusive releases.",
};

export const ctaContent = {
  buttonLabel: "Explore Design Details",
  title: ["Designed to Be Seen,", "Made to Be Worn"],
};
