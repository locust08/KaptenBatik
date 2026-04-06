export type SupportFaq = {
  answer: string;
  id: string;
  keywords: string[];
  question: string;
};

export const supportContact = {
  email: "customerservice@kaptenbatik.com.my",
  whatsapp: "010-3605321",
  whatsappHref: "https://api.whatsapp.com/send/?phone=60103605321",
  customerServiceHours: "9 am to 5 pm, Monday to Friday",
  boutiqueLocation:
    "The Gardens Mall - Flagship Store, Lot F-215B Level 1, The Gardens Mall, Lingkaran Syed Putra, Mid Valley City, 59200 Kuala Lumpur",
  boutiqueHours: "Daily, 10AM - 10PM",
  boutiqueLocationsHref: "https://www.kaptenbatik.com.my/pages/boutique-locations",
  shippingHref: "https://www.kaptenbatik.com.my/pages/shipping-information-policy",
  returnsHref: "https://www.kaptenbatik.com.my/pages/return-exchange-policy",
  saleHref: "https://www.kaptenbatik.com.my/collections/sale",
};

export const supportFaqs: SupportFaq[] = [
  {
    id: "shipping-details",
    question: "What are your shipping details?",
    keywords: ["shipping", "ship", "delivery options", "shipping details", "shipping info"],
    answer:
      "We offer several delivery options, including standard courier delivery and same-day Lalamove for eligible areas. Orders above RM200 qualify for free shipping in West Malaysia, while orders above RM300 qualify in East Malaysia. For the full shipping policy, open our shipping details page.",
  },
  {
    id: "boutique-location",
    question: "Where is your boutique's location?",
    keywords: ["boutique", "location", "store", "outlet", "shop", "flagship"],
    answer:
      "Our flagship boutique is at The Gardens Mall - Flagship Store, Lot F-215B Level 1, The Gardens Mall, Lingkaran Syed Putra, Mid Valley City, 59200 Kuala Lumpur. It is open daily from 10AM to 10PM. You can also browse all outlet locations from our boutique locations page.",
  },
  {
    id: "contact-customer-service",
    question: "How can I contact customer service?",
    keywords: ["contact", "customer service", "support", "whatsapp", "email", "help"],
    answer:
      "You can reach our customer care team on WhatsApp at 010-3605321 or by email at customerservice@kaptenbatik.com.my. Support hours are 9 am to 5 pm, Monday to Friday, excluding weekends and public holidays.",
  },
  {
    id: "return-policy",
    question: "What is your return policy?",
    keywords: ["return", "exchange", "refund policy", "return policy"],
    answer:
      "For returns, exchanges, and refunds, please review the full Return & Exchange policy first. Once you have checked the policy, our customer service team can guide you through the next step if you still need help.",
  },
  {
    id: "standard-delivery",
    question: "How long does standard delivery take?",
    keywords: ["standard delivery", "standard shipping", "delivery take", "delivery time", "courier"],
    answer:
      "Standard delivery usually takes 2 to 3 working days after your order is processed and shipped. Delivery timing may vary slightly depending on your location, and you will receive a tracking number once the parcel is on the way.",
  },
  {
    id: "international-delivery",
    question: "How long does international delivery take?",
    keywords: ["international", "overseas", "worldwide", "global shipping"],
    answer:
      "International deliveries typically take around 4 to 5 working days. Final timing can vary a little depending on customs processing and the destination country.",
  },
  {
    id: "lalamove",
    question: "Do you offer same-day delivery with Lalamove?",
    keywords: ["lalamove", "same-day", "same day", "express delivery"],
    answer:
      "Yes. We offer same-day delivery through Lalamove for eligible areas. To use it, select the Lalamove delivery option during checkout when it is available for your address.",
  },
  {
    id: "payment-methods",
    question: "What payment methods do you accept?",
    keywords: ["payment", "pay", "visa", "mastercard", "grabpay", "fpx", "tng", "atome", "boost", "unionpay"],
    answer:
      "We accept several payment methods, including Mastercard, FPX, Atome, Visa, UnionPay, GrabPay, Boost, and Touch 'n Go. Availability can vary slightly depending on checkout context and region.",
  },
  {
    id: "change-cancel-order",
    question: "Can I change or cancel my order?",
    keywords: ["change order", "cancel order", "edit order", "modify order"],
    answer:
      "Yes, if you have not received a shipping confirmation email yet. Please contact customer service immediately and we will do our best to accommodate any change or cancellation request before dispatch.",
  },
  {
    id: "incorrect-items",
    question: "What should I do if I receive incorrect items?",
    keywords: ["incorrect item", "wrong item", "wrong order", "received wrong", "incorrect items"],
    answer:
      "If you receive an incorrect item, contact customer service on WhatsApp at 010-3605321 and include your order number plus a short description of the issue. The team will help arrange the next steps quickly.",
  },
  {
    id: "refund-time",
    question: "How long it will take to get my refund?",
    keywords: ["refund", "refund time", "money back", "return money"],
    answer:
      "Refunds are typically processed within 7 working days. Processing time can vary a little based on your payment provider, but our team will help if anything seems delayed.",
  },
  {
    id: "discount-codes",
    question: "Can I use multiple discount codes on one order?",
    keywords: ["discount code", "promo code", "coupon", "multiple discounts", "stack code"],
    answer:
      "No. The system only allows one discount code per order, so it is best to choose the code that gives you the strongest value for that purchase.",
  },
  {
    id: "promotions",
    question: "Are there any current promotions or discounts?",
    keywords: ["promotion", "promotions", "discount", "sale", "offer", "offers"],
    answer:
      "Kapten Batik frequently runs promotions and seasonal offers. The quickest way to stay updated is to check the sale page or sign up for the newsletter for new releases and special campaigns.",
  },
  {
    id: "gift-message",
    question: "Can I include a gift message with my order?",
    keywords: ["gift", "gift message", "note", "greeting card"],
    answer:
      "Yes. You can include a personalized gift message in the order remarks, and it can be written on a gift card for your order.",
  },
  {
    id: "care-maintenance",
    question: "How do I care for and maintain your products?",
    keywords: ["care", "wash", "washing", "maintain", "maintenance", "batik care", "dryer", "hand wash"],
    answer:
      "To keep your batik pieces looking their best: wash them separately to avoid color transfer, avoid using a dryer, and hand wash them gently whenever possible.",
  },
];

export const supportFallbackAnswer =
  "I can help with shipping, returns, boutique locations, payment methods, gift messages, refunds, and delivery timing. If you need a human, tap the WhatsApp shortcut and the Kapten Batik customer care team can take over.";
