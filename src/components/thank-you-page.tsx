"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { StandardFooter } from "@/components/standard-footer";
import { formatPrice, parsePrice, useCart } from "@/components/cart-provider";
import { orderFlowProduct, orderFlowSummary, thankYouSteps } from "@/data/order-flow-content";
import styles from "./thank-you-page.module.css";

function SuccessIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" fill="currentColor" r="9" />
      <path
        d="M8.3 12.3L10.7 14.7L15.7 9.7"
        stroke="#fafaf5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <rect height="14" rx="2" stroke="currentColor" strokeWidth="1.5" width="18" x="3" y="5" />
      <path
        d="M4.5 7L12 12.5L19.5 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path d="M3.5 6.5H14.5V15.5H3.5V6.5Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14.5 9H18L20.5 11.5V15.5H14.5V9Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="7.5" cy="17.5" r="1.75" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="17.5" r="1.75" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ConciergeIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M4.5 14.5V11.5C4.5 7.91 7.41 5 11 5H13C16.59 5 19.5 7.91 19.5 11.5V14.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path d="M4.5 13.5H6.5C7.05 13.5 7.5 13.95 7.5 14.5V16.5C7.5 17.05 7.05 17.5 6.5 17.5H5.5C4.95 17.5 4.5 17.05 4.5 16.5V13.5Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16.5 14.5C16.5 13.95 16.95 13.5 17.5 13.5H19.5V16.5C19.5 17.05 19.05 17.5 18.5 17.5H17.5C16.95 17.5 16.5 17.05 16.5 16.5V14.5Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function StepIcon({ id }: { id: (typeof thankYouSteps)[number]["id"] }) {
  if (id === "shipping") {
    return <TruckIcon />;
  }

  if (id === "support") {
    return <ConciergeIcon />;
  }

  return <MailIcon />;
}

export function ThankYouPage() {
  const { checkoutItems, completedOrder } = useCart();
  const fallbackItem = {
    category: orderFlowProduct.category,
    collection: "women" as const,
    href: "/women/kurung-kedah-set-melody-heritage-rio-red",
    image: orderFlowProduct.image,
    name: orderFlowProduct.name,
    price: orderFlowProduct.price,
    quantity: orderFlowProduct.quantity,
    size: orderFlowProduct.thankYouSize,
    slug: "kurung-kedah-set-melody-heritage-rio-red",
    unitPrice: parsePrice(orderFlowProduct.price),
  };
  const fallbackOrder = {
    cardLast4: undefined,
    deliveryId: "standard" as const,
    items: completedOrder?.items ?? (checkoutItems.length ? checkoutItems : [fallbackItem]),
    discountAmount: completedOrder?.discountAmount ?? 0,
    discountLabel: completedOrder?.discountLabel,
    orderNumber: orderFlowSummary.orderNumber,
    orderNote: completedOrder?.orderNote,
    paymentId: "card" as const,
    paymentLabel: "Credit/Debit Card",
    pointsEarned: 0,
    shippingCost: 0,
    shippingLabel: "FREE",
    shippingRegion: "west-malaysia" as const,
    status: orderFlowSummary.status,
    total: (completedOrder?.items ?? (checkoutItems.length ? checkoutItems : [fallbackItem])).reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    ),
  };
  const order = completedOrder ?? fallbackOrder;
  const total = order.total;
  const discountAmount = order.discountAmount ?? 0;
  const pointsEarned = order.pointsEarned;
  const orderNote = order.orderNote?.trim();

  return (
    <main className={styles.page}>
      <SiteHeader
        activeCollection={order.items[0]?.collection ?? "women"}
        contactHref="/contact-us"
        logoHref="/#top"
      />

      <section className={styles.heroSection}>
        <div className={styles.heroIconWrap}>
          <SuccessIcon />
        </div>
        <h1>Thank You for Your Order</h1>
        <p className={styles.heroLead}>Your purchase has been received successfully.</p>
        <p className={styles.heroSubcopy}>
          WE&apos;RE PREPARING YOUR ORDER... THANK YOU FOR CHOOSING A DESIGN THAT CELEBRATES
          HERITAGE THROUGH MODERN STYLE.
        </p>
      </section>

      <section className={styles.contentSection}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryHeader}>
            <h2>Order Summary</h2>
            <div className={styles.statusPanel}>
              <span>Order Number</span>
              <strong>{order.orderNumber}</strong>
            </div>
            <div className={styles.statusPanelRight}>
              <span>Status</span>
              <strong>{order.status}</strong>
            </div>
            <div className={styles.summaryWatermark} aria-hidden="true" />
          </div>

          <div className={styles.productList}>
            {order.items.map((orderItem) => (
              <article className={styles.productRow} key={`${orderItem.slug}-${orderItem.size}`}>
                <div className={styles.productImageWrap}>
                  <img alt={orderItem.name} src={orderItem.image} />
                </div>

                <div className={styles.productDetails}>
                  <h3>{orderItem.name}</h3>
                  <p>{orderItem.category}</p>
                  <div className={styles.productTags}>
                    <span>{`Size: ${orderItem.size}`}</span>
                    <span>{`Qty: ${orderItem.quantity}`}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {discountAmount > 0 ? (
            <div className={styles.discountRow}>
              <span>{order.discountLabel ?? "Reward Offer"}</span>
              <strong>-{formatPrice(discountAmount, { compact: true })}</strong>
            </div>
          ) : null}

          <div className={styles.totalRow}>
            <span>Total Amount</span>
            <strong>{formatPrice(total, { compact: true })}</strong>
          </div>

          <div className={styles.pointsRow}>
            <span>Loyalty Points Earned</span>
            <strong>{pointsEarned} pts</strong>
          </div>

          <div className={styles.orderMetaRow}>
            <span>{order.deliveryId === "express" ? "Express Atelier" : "Standard Courier"}</span>
            <span>{order.shippingLabel}</span>
            <span>{order.paymentLabel}</span>
          </div>

          {orderNote ? (
            <div className={styles.orderNoteRow}>
              <span>Order Note</span>
              <p>{orderNote}</p>
            </div>
          ) : null}
        </div>

        <div className={styles.stepsColumn}>
          <div className={styles.stepsCard}>
            <h2>What Happens Next</h2>
            <div className={styles.stepsList}>
              {thankYouSteps.map((step) => (
                <article className={styles.stepItem} key={step.id}>
                  <span className={styles.stepIcon}>
                    <StepIcon id={step.id} />
                  </span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className={styles.buttonStack}>
            <Link className={styles.primaryButton} href="/#collection">
              Continue Shopping
            </Link>
            <Link className={styles.secondaryButton} href="/#top">
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      <p className={styles.closingQuote}>&quot;Timeless expression, modern confidence.&quot;</p>

      <StandardFooter brandHref="/#top" contactHref="/contact-us" />
    </main>
  );
}
