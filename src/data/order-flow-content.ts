export type DeliveryOptionId = "standard" | "express";
export type PaymentOptionId = "card" | "fpx";
export type ShippingRegion = "west-malaysia" | "east-malaysia" | "international";

export const orderFlowProduct = {
  category: "Baju Kurung Kedah Set",
  image: "/figma-assets/women-products/rio-red/main.png",
  name: "Kurung Kedah Set Melody Heritage in Rio Red",
  price: "RM359.00",
  priceCompact: "RM359",
  quantity: 1,
  size: "M/L",
  thankYouSize: "L",
} as const;

export const orderFlowSummary = {
  orderNumber: "#KB10248",
  status: "Processing",
} as const;

export const deliveryOptions = [
  {
    description: "3-5 business days",
    id: "standard" as const,
    label: "Standard Courier",
  },
  {
    description: "Next day delivery",
    id: "express" as const,
    label: "Express Atelier",
  },
];

export const paymentOptions = [
  {
    id: "card" as const,
    label: "Credit/Debit Card",
  },
  {
    id: "fpx" as const,
    label: "Online Banking (FPX)",
  },
];

export const bankOptions = [
  "Maybank2u",
  "CIMB Clicks",
  "Public Bank",
  "RHB Bank",
  "Hong Leong Bank",
  "AmBank",
  "Bank Islam",
  "Bank Rakyat",
  "HSBC Malaysia",
  "OCBC Malaysia",
] as const;

export const malaysiaStates = [
  "Johor",
  "Kedah",
  "Kelantan",
  "Kuala Lumpur",
  "Labuan",
  "Melaka",
  "Negeri Sembilan",
  "Pahang",
  "Perak",
  "Perlis",
  "Pulau Pinang",
  "Putrajaya",
  "Sabah",
  "Sarawak",
  "Selangor",
  "Terengganu",
] as const;

const eastMalaysiaStates = new Set(["Labuan", "Sabah", "Sarawak"]);

const standardShippingByRegion: Record<ShippingRegion, number> = {
  "east-malaysia": 18,
  international: 25,
  "west-malaysia": 12,
};

const expressShippingByRegion: Record<ShippingRegion, number> = {
  "east-malaysia": 15,
  international: 35,
  "west-malaysia": 15,
};

export const checkoutReassurance = [
  {
    description: "Your data is protected with 256-bit SSL encryption.",
    id: "secure",
    title: "Secure Payment",
  },
  {
    description: "Check your details carefully before confirming.",
    id: "review",
    title: "Review Before Order",
  },
  {
    description: "Each piece is hand-blocked by master artisans.",
    id: "premium",
    title: "Premium Collection",
  },
] as const;

export const thankYouSteps = [
  {
    description:
      "An order receipt has been sent to your registered email address with all the details.",
    id: "email",
    title: "Confirmation Email",
  },
  {
    description:
      "Once your item leaves our atelier, you will receive a tracking number via SMS and email.",
    id: "shipping",
    title: "Shipping Update",
  },
  {
    description:
      "Need adjustments? Our concierge is available for size exchanges within 7 days.",
    id: "support",
    title: "Personal Support",
  },
] as const;

export function getShippingRegion(country: string, state: string): ShippingRegion {
  if (country !== "Malaysia") {
    return "international";
  }

  return eastMalaysiaStates.has(state) ? "east-malaysia" : "west-malaysia";
}

export function getStandardShippingCost(subtotal: number, region: ShippingRegion) {
  if (region === "west-malaysia" && subtotal >= 200) {
    return 0;
  }

  if (region === "east-malaysia" && subtotal >= 300) {
    return 0;
  }

  return standardShippingByRegion[region];
}

export function getShippingCost(deliveryId: DeliveryOptionId, subtotal: number, region: ShippingRegion) {
  if (deliveryId === "express") {
    return expressShippingByRegion[region];
  }

  return getStandardShippingCost(subtotal, region);
}

export function getShippingLabel(cost: number) {
  return cost === 0 ? "FREE" : `RM${cost.toFixed(2)}`;
}

export function getDeliveryDescription(
  deliveryId: DeliveryOptionId,
  subtotal: number,
  region: ShippingRegion,
) {
  const cost = getShippingCost(deliveryId, subtotal, region);
  const priceText = cost === 0 ? "Free" : `RM${cost.toFixed(2)}`;

  if (deliveryId === "express") {
    return `Next day delivery \u2022 ${priceText}`;
  }

  if (region === "east-malaysia") {
    return `3-5 business days \u2022 Free above RM300 (${priceText})`;
  }

  if (region === "international") {
    return `5-9 business days \u2022 ${priceText}`;
  }

  return `3-5 business days \u2022 Free above RM200 (${priceText})`;
}
