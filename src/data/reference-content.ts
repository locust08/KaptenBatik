export type NavGroup = {
  label: string;
  image: string;
  items: Array<{
    eyebrow: string;
    title: string;
    href: string;
    description: string;
  }>;
};

export type DropdownSection = {
  title: string;
  items: Array<{
    label: string;
    href: string;
  }>;
};

export type Product = {
  badge?: string;
  category: string;
  comparePrice?: string;
  href: string;
  image: string;
  name: string;
  price: string;
};

export type LookbookSlide = {
  subtitle: string;
  title: string;
  image: string;
};

export const referenceAssets = {
  logo: "/reference-assets/images/6805d17d680e3d11f92a5db5_Logo.avif",
  navPreview: "/reference-assets/images/6805db6220e2aad6e557d547_0247798b6127adb2cc1237bae1894ef6_Header-Nav-Image.avif",
  heroBackground:
    "/reference-assets/images/68086e597247de72c53d69bb_fbe082b0c8f8d61f6de9a92166593487_Elegance-in-Modesty.avif",
  heroPoster:
    "/reference-assets/images/6800bdb10604a7b147f8464a-6808709b78f46f49ce77d21a_Home-Hero-Video-poster-00001.jpg",
  heroCurve:
    "/reference-assets/images/680872da382a5b04b45197a5_16461baed8d7b8cd1a445bfb5e26d54c_Explore-Collection.avif",
  searchIcon: "/reference-assets/images/680b5fc3b63884c0c9fa183c_Search.svg",
  bagIcon: "/reference-assets/images/6808bb437d7f023db71fa9bd_Bag.svg",
  scribble:
    "/reference-assets/images/68071873d1bb97dfbb86e6bd_3148554caddabab88f3dd978c0631004_Rectangle-724.svg",
  trendingButtons: [
    "/reference-assets/images/68088758b7c225025ec9bfb5_f5648db6859d17c9d30244adaa5fc008_Explore-Trending-Hijab-Collections.avif",
    "/reference-assets/images/6808878564351d77458ff082_5b4c6cdb8ca186b8e0215c857efe58ca_Explore-Trending-Abaya-Collections.avif",
    "/reference-assets/images/680887a300af2997f8e2cbb2_d4e8155d273818cf21e69b638725fb0d_Explore-Trending-Dresses-Collections.avif",
  ],
  instagram: [
    "/reference-assets/images/68071dbea7562a602a703a1e_ModestWearStyle-on-Instagram-01.avif",
    "/reference-assets/images/68071dc3457ccd3f6ae838e2_ModestWearStyle-on-Instagram-02.avif",
    "/reference-assets/images/68071dc4b07b6de506370e9f_ModestWearStyle-on-Instagram-03.avif",
    "/reference-assets/images/68071dc6d4db9106a36dc6c6_ModestWearStyle-on-Instagram-04.avif",
    "/reference-assets/images/68071dcc9894f03e252bdc6d_ModestWearStyle-on-Instagram-05.avif",
  ],
  logos: [
    "/reference-assets/images/68076326e172d20be609f479_Theo.svg",
    "/reference-assets/images/68076316756fbaa8f5afeffe_Snowflake.svg",
    "/reference-assets/images/68076316084a2a5237184536_Network.svg",
    "/reference-assets/images/680763262d70dec45ff9262e_Venice.svg",
    "/reference-assets/images/6807631622edcc8cf7313864_Delaware.svg",
    "/reference-assets/images/68076326eb67b22cec1ad6d0_California.svg",
  ],
};

export const shopNav: NavGroup = {
  label: "Shop",
  image: referenceAssets.navPreview,
  items: [
    {
      eyebrow: "Trending",
      title: "Hijab Collections",
      href: "#collections",
      description:
        "Explore our latest hijab styles crafted for elegance, comfort, and timeless modest fashion.",
    },
    {
      eyebrow: "Trending",
      title: "Abaya Collections",
      href: "#collections",
      description:
        "Discover elegant abayas designed for modern modesty, grace, and everyday sophistication.",
    },
    {
      eyebrow: "Trending",
      title: "Dress Collections",
      href: "#collections",
      description:
        "Explore stylish modest dresses perfect for every occasion, season, and personal style.",
    },
  ],
};

export const pageDropdownSections: DropdownSection[] = [
  {
    title: "Main Pages",
    items: [
      { label: "About us", href: "#footer" },
      { label: "Shop", href: "#collections" },
      { label: "Blog", href: "#footer" },
      { label: "Contact us", href: "#footer" },
      { label: "404", href: "#footer" },
    ],
  },
  {
    title: "Utility Pages",
    items: [
      { label: "Style Guides", href: "#footer" },
      { label: "Change-Log", href: "#footer" },
      { label: "License", href: "#footer" },
    ],
  },
];

export const trendingPosts = [
  {
    buttonImage: referenceAssets.trendingButtons[0],
    href: "#collections",
    image: "/reference-assets/images/6808810a8519d61739ff3e0e_Hijabs-Thumbnail.avif",
    name: "Hijabs",
    tag: "Trending",
  },
  {
    buttonImage: referenceAssets.trendingButtons[1],
    href: "#collections",
    image: "/reference-assets/images/68088d3daec0c110e06674e0_Abayas-Thumbnail.avif",
    name: "Abayas",
    tag: "Trending",
  },
  {
    buttonImage: referenceAssets.trendingButtons[2],
    href: "#collections",
    image: "/reference-assets/images/680881d595a820f0d0950c5c_Dress-Thumbnail.avif",
    name: "Dresses",
    tag: "Trending",
  },
];

export const categories = [
  { key: "all", label: "All" },
  { key: "hijabs", label: "Hijabs" },
  { key: "abayas", label: "Abayas" },
  { key: "dresses", label: "Dresses" },
  { key: "kimonos", label: "Kimonos" },
  { key: "skirts", label: "Skirts" },
  { key: "accessories", label: "Accessories" },
] as const;

export const productsByCategory: Record<string, Product[]> = {
  all: [
    {
      badge: "Best Selling",
      category: "Hijabs",
      href: "#collections",
      image: "/reference-assets/images/6808a88349c80268712a0382_Cherry-Hijab.png",
      name: "Cherry Hijab",
      price: "$99.00",
    },
    {
      badge: "Best Selling",
      category: "Hijabs",
      href: "#collections",
      image: "/reference-assets/images/6808a8acf7ec8300bb710cea_Shrug-Hijab.png",
      name: "Shrug Hijab",
      price: "$99.00",
    },
    {
      category: "Hijabs",
      href: "#collections",
      image: "/reference-assets/images/6808a83f7a266df94c178d56_Printed-Hijab.png",
      name: "Printed Hijab",
      price: "$99.00",
    },
    {
      badge: "On Sale",
      category: "Hijabs",
      comparePrice: "$129.00",
      href: "#collections",
      image: "/reference-assets/images/6808a8fb8e72cf62fdd0b4a7_Cotton-Hijab.png",
      name: "Cotton Hijab",
      price: "$99.00",
    },
    {
      category: "Hijabs",
      href: "#collections",
      image: "/reference-assets/images/6808a93e0a1284ec9bef8e2c_Party-Hijab.png",
      name: "Party Hijab",
      price: "$99.00",
    },
    {
      badge: "New Collection",
      category: "Hijabs",
      href: "#collections",
      image: "/reference-assets/images/6808a7c04cfaa79f8c0578aa_Shiny-Hijab.png",
      name: "Shiny Hijab",
      price: "$99.00",
    },
  ],
  hijabs: [
    {
      badge: "Best Selling",
      category: "Hijabs",
      href: "#collections",
      image: "/reference-assets/images/6808a88349c80268712a0382_Cherry-Hijab.png",
      name: "Cherry Hijab",
      price: "$99.00",
    },
    {
      badge: "Best Selling",
      category: "Hijabs",
      href: "#collections",
      image: "/reference-assets/images/6808a8acf7ec8300bb710cea_Shrug-Hijab.png",
      name: "Shrug Hijab",
      price: "$99.00",
    },
    {
      category: "Hijabs",
      href: "#collections",
      image: "/reference-assets/images/6808a83f7a266df94c178d56_Printed-Hijab.png",
      name: "Printed Hijab",
      price: "$99.00",
    },
  ],
  abayas: [
    {
      category: "Abayas",
      href: "#collections",
      image: "/reference-assets/images/680a19eb900a0443d6795733_Shrug-Abaya.avif",
      name: "Shrug Abaya",
      price: "$99.00",
    },
    {
      category: "Abayas",
      href: "#collections",
      image: "/reference-assets/images/6808a782e429ac10391e9972_Koti-Abaya.png",
      name: "Koti Abaya",
      price: "$99.00",
    },
    {
      category: "Abayas",
      href: "#collections",
      image: "/reference-assets/images/68089e15d6c545889f73ac58_Short-Abaya.png",
      name: "Short Abaya",
      price: "$99.00",
    },
  ],
  dresses: [
    {
      category: "Dresses",
      href: "#collections",
      image: "/reference-assets/images/680a19a32114cec457bc5e54_Stoned-Dress.avif",
      name: "Stoned Dress",
      price: "$99.00",
    },
    {
      category: "Dresses",
      href: "#collections",
      image: "/reference-assets/images/68089c21d183c32d48234c5c_Cape-Dress.png",
      name: "Cape Dress",
      price: "$99.00",
    },
    {
      category: "Dresses",
      href: "#collections",
      image: "/reference-assets/images/68089b460224c2e3eeceeb34_Printed-Dress.png",
      name: "Printed Dress",
      price: "$99.00",
    },
  ],
  kimonos: [
    {
      category: "Kimonos",
      href: "#collections",
      image: "/reference-assets/images/68108303fa2871c71829b6b2_Floral-Kimono-Cardigan.avif",
      name: "Floral Kimono Cardigan",
      price: "$99.00",
    },
    {
      category: "Kimonos",
      href: "#collections",
      image: "/reference-assets/images/681082e67311f9be23941f26_Floral-Resort-Kimono.avif",
      name: "Floral Resort Kimono",
      price: "$99.00",
    },
    {
      category: "Kimonos",
      href: "#collections",
      image: "/reference-assets/images/681082c58fd3e438919d41fa_Boho-Crochet-Cardigan.avif",
      name: "Boho Crochet Cardigan",
      price: "$99.00",
    },
  ],
  skirts: [
    {
      category: "Skirts",
      href: "#collections",
      image: "/reference-assets/images/68108284cc930f07d1480bb1_Jersey-Midi-Skirt.avif",
      name: "Jersey Midi Skirt",
      price: "$99.00",
    },
    {
      category: "Skirts",
      href: "#collections",
      image: "/reference-assets/images/681082620d3eef41582d487d_Boho-Maxi-Skirt.avif",
      name: "Boho Maxi Skirt",
      price: "$99.00",
    },
    {
      category: "Skirts",
      href: "#collections",
      image: "/reference-assets/images/681082444f2fe7e7d9e29d1d_Flowy-Midi-Skirt.avif",
      name: "Flowy Midi Skirt",
      price: "$99.00",
    },
  ],
  accessories: [
    {
      category: "Accessories",
      href: "#collections",
      image: "/reference-assets/images/681084c759ebc50fbfafd3dd_Mint-Maternity-Kaftan.avif",
      name: "Mint Maternity Kaftan",
      price: "$99.00",
    },
    {
      category: "Accessories",
      href: "#collections",
      image: "/reference-assets/images/68108219805f1796b46eec9f_Maternity-Kaftan-Mint.avif",
      name: "Maternity Kaftan Mint",
      price: "$99.00",
    },
    {
      badge: "On Sale",
      category: "Accessories",
      comparePrice: "$129.00",
      href: "#collections",
      image: "/reference-assets/images/681081b7cb477259c664462a_Short-Kaftan-Mint.avif",
      name: "Short Kaftan Mint",
      price: "$99.00",
    },
  ],
};

export const lookbookSlides: LookbookSlide[] = [
  {
    title: "Casual Workwear",
    subtitle: "Relaxed tailoring with crisp layering and a soft editorial finish.",
    image: "/reference-assets/images/6808d3813e38a2710e8eab80_Casual-Workwear.avif",
  },
  {
    title: "Wedding & Eid Looks",
    subtitle: "Statement textures and elevated silhouettes for festive evenings.",
    image: "/reference-assets/images/6808d38463be23921b978861_Wedding-Eid-Looks.avif",
  },
  {
    title: "Hajj & Umrah Essentials",
    subtitle: "Serene palettes, lightweight fabrics, and practical modest styling.",
    image: "/reference-assets/images/6808d388e6b8ef1da6e579df_Hajj-Umrah-Essentials.avif",
  },
];

export const buyNowLinks = [
  {
    href: "https://webflow.com/dashboard/marketplace-checkout/redirect?rtype=Template&rid=682bb838c89eb040cc6e65ed&unauthSignup=true",
    icon: "https://cdn.prod.website-files.com/6800bdb10604a7b147f8464a/6926afa2eea3e7d5e7b3c226_Webflow.svg",
    label: "Buy from webflow ($99)",
  },
  {
    href: "https://tncflow.com/checkout/?edd_action=add_to_cart&download_id=247897&edd_options%5Bprice_id%5D=3&discount=TFLP10",
    icon: "https://cdn.prod.website-files.com/6800bdb10604a7b147f8464a/6926afa1eea3e7d5e7b3c224_Group%201437253702.svg",
    label: "Buy from TNCFlow (10% Off)",
  },
  {
    href: "https://tncflow.com/all-access",
    icon: "https://cdn.prod.website-files.com/6800bdb10604a7b147f8464a/6926afa1eea3e7d5e7b3c223_Group.svg",
    label: "Buy All Access (300+ Items)",
  },
  {
    href: "https://tncflow.com/services",
    icon: "https://cdn.prod.website-files.com/6800bdb10604a7b147f8464a/6926afa2eea3e7d5e7b3c225_Group%20(1).svg",
    label: "Request Customization",
  },
  {
    href: "https://tncflow.com/contact-us",
    icon: "https://cdn.prod.website-files.com/6800bdb10604a7b147f8464a/6926afa1eea3e7d5e7b3c222_Group%20(2).svg",
    label: "Questions/Support",
  },
];
