"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  createOrderNumber,
  formatPrice,
  useCart,
} from "@/components/cart-provider";
import {
  ACCOUNT_STATE_CHANGE_EVENT,
  clearPendingRewardOffer,
  readPendingRewardOffer,
  type RewardOffer,
} from "@/lib/account-state";
import {
  bankOptions,
  checkoutReassurance,
  deliveryOptions,
  getDeliveryDescription,
  getShippingCost,
  getShippingLabel,
  getShippingRegion,
  malaysiaStates,
  paymentOptions,
  type DeliveryOptionId,
  type PaymentOptionId,
} from "@/data/order-flow-content";
import { BrandLogo } from "@/components/brand-logo";
import styles from "./checkout-page.module.css";

function BackIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M14.75 4.75L7.5 12L14.75 19.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M8 10V7.75C8 5.68 9.68 4 11.75 4C13.82 4 15.5 5.68 15.5 7.75V10"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <rect
        height="9"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        width="9"
        x="7.25"
        y="10.25"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 3.5L18 6V11C18 15.02 15.55 18.47 12 20C8.45 18.47 6 15.02 6 11V6L12 3.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M2.75 12C4.73 8.41 8.08 6.25 12 6.25C15.92 6.25 19.27 8.41 21.25 12C19.27 15.59 15.92 17.75 12 17.75C8.08 17.75 4.73 15.59 2.75 12Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function GemIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M7.5 5.5H16.5L20 10L12 19.5L4 10L7.5 5.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M7 10H17M10 5.5L8.5 10L12 19.5L15.5 10L14 5.5"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <rect
        height="13"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        width="17"
        x="3.5"
        y="5.5"
      />
      <path d="M3.5 10H20.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M4 9.5L12 5L20 9.5"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M6 10.5V16.5M10 10.5V16.5M14 10.5V16.5M18 10.5V16.5M4 19H20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ReassuranceIcon({ id }: { id: (typeof checkoutReassurance)[number]["id"] }) {
  if (id === "review") {
    return <EyeIcon />;
  }

  if (id === "premium") {
    return <GemIcon />;
  }

  return <ShieldIcon />;
}

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);

  if (digits.length <= 2) {
    return digits;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function CheckoutPage() {
  const router = useRouter();
  const { cartItems, checkoutItems, completeCheckout, updateItemQuantity } = useCart();
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOptionId>("standard");
  const [selectedPayment, setSelectedPayment] = useState<PaymentOptionId>("card");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Kuala Lumpur");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("Malaysia");
  const [internationalState, setInternationalState] = useState("");
  const [notes, setNotes] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [formError, setFormError] = useState("");
  const [pendingRewardOffer, setPendingRewardOfferState] = useState<RewardOffer | null>(null);

  const selectedOrderItems = checkoutItems.length ? checkoutItems : cartItems;
  const subtotal = selectedOrderItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const activeRewardOffer =
    pendingRewardOffer && subtotal >= pendingRewardOffer.minimumPurchase ? pendingRewardOffer : null;
  const shippingState = country === "Malaysia" ? state : internationalState;
  const shippingRegion = getShippingRegion(country, shippingState);
  const shippingCost = getShippingCost(selectedDelivery, subtotal, shippingRegion);
  const discountAmount = activeRewardOffer
    ? Math.min(activeRewardOffer.discountAmount, subtotal + shippingCost)
    : 0;
  const total = Math.max(0, subtotal + shippingCost - discountAmount);
  const shippingLabel = getShippingLabel(shippingCost);

  const selectedPaymentLabel = useMemo(() => {
    if (selectedPayment === "fpx" && selectedBank) {
      return `FPX • ${selectedBank}`;
    }

    if (selectedPayment === "card" && cardNumber.replace(/\D/g, "").length >= 4) {
      return `Card •••• ${cardNumber.replace(/\D/g, "").slice(-4)}`;
    }

    return selectedPayment === "card" ? "Credit/Debit Card" : "Online Banking (FPX)";
  }, [cardNumber, selectedBank, selectedPayment]);

  useEffect(() => {
    const syncRewardOffer = () => {
      setPendingRewardOfferState(readPendingRewardOffer());
    };

    syncRewardOffer();
    window.addEventListener(ACCOUNT_STATE_CHANGE_EVENT, syncRewardOffer);
    window.addEventListener("storage", syncRewardOffer);

    return () => {
      window.removeEventListener(ACCOUNT_STATE_CHANGE_EVENT, syncRewardOffer);
      window.removeEventListener("storage", syncRewardOffer);
    };
  }, []);

  const validateCheckout = () => {
    if (!selectedOrderItems.length) {
      return "Please add at least one item to checkout.";
    }

    if (!fullName || !email || !phone || !addressLine1 || !city || !postcode) {
      return "Please complete your contact information and delivery address.";
    }

    if (country === "Malaysia" && !state) {
      return "Please choose your delivery state.";
    }

    if (country !== "Malaysia" && !internationalState) {
      return "Please enter your state or province.";
    }

    if (selectedPayment === "card") {
      const digits = cardNumber.replace(/\D/g, "");
      if (!cardholderName || digits.length < 16 || expiryDate.length < 5 || cvv.length < 3) {
        return "Please complete your credit or debit card details.";
      }
    }

    if (selectedPayment === "fpx" && !selectedBank) {
      return "Please choose your preferred bank for FPX payment.";
    }

    return "";
  };

  const handlePlaceOrder = () => {
    const nextError = validateCheckout();

    if (nextError) {
      setFormError(nextError);
      return;
    }

    setFormError("");

    completeCheckout({
      cardLast4: selectedPayment === "card" ? cardNumber.replace(/\D/g, "").slice(-4) : undefined,
      deliveryId: selectedDelivery,
      items: selectedOrderItems,
      orderNumber: createOrderNumber(),
      orderNote: notes.trim() || undefined,
      paymentId: selectedPayment,
      paymentLabel: selectedPaymentLabel,
      discountAmount: discountAmount || undefined,
      discountLabel: activeRewardOffer?.title,
      pointsEarned: 0,
      shippingCost,
      shippingLabel,
      shippingRegion,
      status: "Processing",
      total,
    });

    if (discountAmount > 0) {
      clearPendingRewardOffer();
    }

      router.push("/thank-you");
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link aria-label="Kapten Batik" className={styles.logoLink} href="/">
          <BrandLogo />
        </Link>

        <div className={styles.secureLabel}>
          <span>Secure Checkout</span>
          <LockIcon />
        </div>
      </header>

      <div className={styles.main}>
        <Link
          aria-label="Back to collection"
          className={styles.backLink}
          href={selectedOrderItems[0]?.href ?? "/#collection"}
        >
          <BackIcon />
        </Link>

        <section className={styles.pageHeader}>
          <h1>Checkout</h1>
          <p>Complete your order securely.</p>
        </section>

        <section className={styles.mobileCheckoutPreview} aria-label="Selected products for checkout">
          <div className={styles.mobileCheckoutPreviewHeader}>
            <span className={styles.mobileCheckoutPreviewLabel}>Checkout Items</span>
          </div>
          <div className={styles.productList}>
            {selectedOrderItems.map((selectedOrderItem) => (
              <article
                className={styles.productRow}
                key={`mobile-${selectedOrderItem.slug}-${selectedOrderItem.size}`}
              >
                <div className={styles.productImageWrap}>
                  <img alt={selectedOrderItem.name} src={selectedOrderItem.image} />
                </div>

                <div className={styles.productDetails}>
                  <h3>{selectedOrderItem.name}</h3>
                  <p>{`Size ${selectedOrderItem.size}`}</p>
                  <div className={styles.productMeta}>
                    <div className={styles.quantityControl}>
                      <span>Qty</span>
                      <div className={styles.quantityStepper}>
                        <button
                          aria-label={`Decrease quantity for ${selectedOrderItem.name}`}
                          className={styles.quantityButton}
                          disabled={selectedOrderItem.quantity === 1}
                          onClick={() =>
                            updateItemQuantity(selectedOrderItem, selectedOrderItem.quantity - 1)
                          }
                          type="button"
                        >
                          -
                        </button>
                        <strong>{selectedOrderItem.quantity}</strong>
                        <button
                          aria-label={`Increase quantity for ${selectedOrderItem.name}`}
                          className={styles.quantityButton}
                          onClick={() =>
                            updateItemQuantity(selectedOrderItem, selectedOrderItem.quantity + 1)
                          }
                          type="button"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <strong>{formatPrice(selectedOrderItem.unitPrice * selectedOrderItem.quantity)}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className={styles.layout}>
          <section className={styles.formColumn}>
            <section className={styles.sectionBlock}>
              <div className={styles.sectionHeading}>
                <span className={styles.stepBadge}>1</span>
                <h2>Contact Information</h2>
              </div>

              <div className={styles.formGrid}>
                <label className={styles.fieldFull}>
                  <span>Full Name</span>
                  <input
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="e.g. Ahmad Ibrahim"
                    type="text"
                    value={fullName}
                  />
                </label>
                <label>
                  <span>Email Address</span>
                  <input
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="ahmad@example.com"
                    type="email"
                    value={email}
                  />
                </label>
                <label>
                  <span>Phone Number</span>
                  <input
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+60 12 345 6789"
                    type="tel"
                    value={phone}
                  />
                </label>
              </div>
            </section>

            <section className={styles.sectionBlock}>
              <div className={styles.sectionHeading}>
                <span className={styles.stepBadge}>2</span>
                <h2>Shipping Address</h2>
              </div>

              <div className={styles.formGrid}>
                <label className={styles.fieldFull}>
                  <span>Address Line 1</span>
                  <input
                    onChange={(event) => setAddressLine1(event.target.value)}
                    placeholder="Street name and house number"
                    type="text"
                    value={addressLine1}
                  />
                </label>
                <label className={styles.fieldFull}>
                  <span>Address Line 2 (Optional)</span>
                  <input
                    onChange={(event) => setAddressLine2(event.target.value)}
                    placeholder="Apartment, suite, unit, etc."
                    type="text"
                    value={addressLine2}
                  />
                </label>
                <label>
                  <span>City</span>
                  <input onChange={(event) => setCity(event.target.value)} type="text" value={city} />
                </label>
                {country === "Malaysia" ? (
                  <label>
                    <span>State</span>
                    <select onChange={(event) => setState(event.target.value)} value={state}>
                      {malaysiaStates.map((stateOption) => (
                        <option key={stateOption} value={stateOption}>
                          {stateOption}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <label>
                    <span>State / Province</span>
                    <input
                      onChange={(event) => setInternationalState(event.target.value)}
                      type="text"
                      value={internationalState}
                    />
                  </label>
                )}
                <label>
                  <span>Postcode</span>
                  <input
                    onChange={(event) => setPostcode(event.target.value)}
                    type="text"
                    value={postcode}
                  />
                </label>
                <label>
                  <span>Country</span>
                  <select
                    onChange={(event) => {
                      setCountry(event.target.value);
                      setFormError("");
                    }}
                    value={country}
                  >
                    <option>Malaysia</option>
                    <option>Singapore</option>
                    <option>Brunei</option>
                  </select>
                </label>
              </div>
            </section>

            <div className={styles.deliveryPaymentRow}>
              <section className={styles.sectionBlockCompact}>
                <div className={styles.sectionHeading}>
                  <span className={styles.stepBadge}>3</span>
                  <h2>Delivery</h2>
                </div>

                <div className={styles.choiceStack}>
                  {deliveryOptions.map((option) => {
                    const description = getDeliveryDescription(option.id, subtotal, shippingRegion);

                    return (
                      <button
                        className={`${styles.optionCard} ${selectedDelivery === option.id ? styles.optionCardActive : ""}`}
                        key={option.id}
                        onClick={() => setSelectedDelivery(option.id)}
                        type="button"
                      >
                        <span className={styles.optionRadio} aria-hidden="true" />
                        <span className={styles.optionText}>
                          <strong>{option.label}</strong>
                          <small>{description}</small>
                        </span>
                      </button>
                    );
                  })}
                </div>

                <p className={styles.helperText}>
                  Standard shipping is free above RM200 for West Malaysia and RM300 for East
                  Malaysia. Express delivery always carries a shipping charge.
                </p>
              </section>

              <section className={styles.sectionBlockCompact}>
                <div className={styles.sectionHeading}>
                  <span className={styles.stepBadge}>4</span>
                  <h2>Payment</h2>
                </div>

                <div className={styles.choiceStack}>
                  {paymentOptions.map((option) => (
                    <button
                      className={`${styles.optionCard} ${selectedPayment === option.id ? styles.optionCardActive : ""}`}
                      key={option.id}
                      onClick={() => setSelectedPayment(option.id)}
                      type="button"
                    >
                      <span className={styles.optionRadio} aria-hidden="true" />
                      <span className={styles.optionText}>
                        <strong>{option.label}</strong>
                      </span>
                      <span className={styles.optionIcon} aria-hidden="true">
                        {option.id === "card" ? <CardIcon /> : <BankIcon />}
                      </span>
                    </button>
                  ))}
                </div>

                {selectedPayment === "card" ? (
                  <div className={styles.paymentFields}>
                    <label className={styles.fieldFull}>
                      <span>Name on Card</span>
                      <input
                        onChange={(event) => setCardholderName(event.target.value)}
                        placeholder="Cardholder full name"
                        type="text"
                        value={cardholderName}
                      />
                    </label>
                    <label className={styles.fieldFull}>
                      <span>Card Number</span>
                      <input
                        inputMode="numeric"
                        onChange={(event) => setCardNumber(formatCardNumber(event.target.value))}
                        placeholder="1234 5678 9012 3456"
                        type="text"
                        value={cardNumber}
                      />
                    </label>
                    <label>
                      <span>Expiry Date</span>
                      <input
                        inputMode="numeric"
                        onChange={(event) => setExpiryDate(formatExpiry(event.target.value))}
                        placeholder="MM/YY"
                        type="text"
                        value={expiryDate}
                      />
                    </label>
                    <label>
                      <span>CVV</span>
                      <input
                        inputMode="numeric"
                        onChange={(event) => setCvv(event.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="123"
                        type="password"
                        value={cvv}
                      />
                    </label>
                  </div>
                ) : (
                  <div className={styles.paymentFields}>
                    <label className={styles.fieldFull}>
                      <span>Preferred Bank</span>
                      <select onChange={(event) => setSelectedBank(event.target.value)} value={selectedBank}>
                        <option value="">Choose your bank</option>
                        {bankOptions.map((bank) => (
                          <option key={bank} value={bank}>
                            {bank}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                )}
              </section>
            </div>

            <section className={styles.notesSection}>
              <label className={styles.notesField}>
                <span>Order Notes (Optional)</span>
                <textarea
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Instructions for the courier or special requests..."
                  value={notes}
                />
              </label>
            </section>
          </section>

          <aside className={styles.summaryColumn}>
            <div className={styles.summaryCard}>
              <h2>Order Summary</h2>

              <div className={styles.productList}>
                {selectedOrderItems.length ? (
                  selectedOrderItems.map((selectedOrderItem) => (
                    <article
                      className={styles.productRow}
                      key={`${selectedOrderItem.slug}-${selectedOrderItem.size}`}
                    >
                      <div className={styles.productImageWrap}>
                        <img alt={selectedOrderItem.name} src={selectedOrderItem.image} />
                      </div>

                      <div className={styles.productDetails}>
                        <h3>{selectedOrderItem.name}</h3>
                        <p>{`Size ${selectedOrderItem.size}`}</p>
                        <div className={styles.productMeta}>
                          <div className={styles.quantityControl}>
                            <span>Qty</span>
                            <div className={styles.quantityStepper}>
                              <button
                                aria-label={`Decrease quantity for ${selectedOrderItem.name}`}
                                className={styles.quantityButton}
                                disabled={selectedOrderItem.quantity === 1}
                                onClick={() =>
                                  updateItemQuantity(
                                    selectedOrderItem,
                                    selectedOrderItem.quantity - 1,
                                  )
                                }
                                type="button"
                              >
                                -
                              </button>
                              <strong>{selectedOrderItem.quantity}</strong>
                              <button
                                aria-label={`Increase quantity for ${selectedOrderItem.name}`}
                                className={styles.quantityButton}
                                onClick={() =>
                                  updateItemQuantity(
                                    selectedOrderItem,
                                    selectedOrderItem.quantity + 1,
                                  )
                                }
                                type="button"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <strong>
                            {formatPrice(selectedOrderItem.unitPrice * selectedOrderItem.quantity)}
                          </strong>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    <h3>Your checkout is empty</h3>
                    <p>Add a piece from the collection to continue.</p>
                    <Link className={styles.emptyStateButton} href="/#collection">
                      Browse Collection
                    </Link>
                  </div>
                )}
              </div>

              <div className={styles.priceBreakdown}>
                <div>
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 ? (
                  <div className={styles.discountRow}>
                    <span>Reward Offer</span>
                    <strong>-{formatPrice(discountAmount)}</strong>
                  </div>
                ) : pendingRewardOffer ? (
                  <div className={styles.discountHintRow}>
                    <span>Reward Offer</span>
                    <strong>
                      {pendingRewardOffer.minimumPurchase > subtotal
                        ? `Add ${formatPrice(pendingRewardOffer.minimumPurchase - subtotal, { compact: true })} more`
                        : pendingRewardOffer.title}
                    </strong>
                  </div>
                ) : null}
                <div>
                  <span>Shipping</span>
                  <strong>{shippingLabel}</strong>
                </div>
                <div>
                  <span>Delivery</span>
                  <strong>{selectedDelivery === "express" ? "Express Atelier" : "Standard Courier"}</strong>
                </div>
                <div>
                  <span>Payment</span>
                  <strong>{selectedPaymentLabel}</strong>
                </div>
                <div className={styles.totalRow}>
                  <span>Total</span>
                  <strong>{formatPrice(total)}</strong>
                </div>
              </div>

              {formError ? <p className={styles.errorMessage}>{formError}</p> : null}

              <button className={styles.placeOrderButton} onClick={handlePlaceOrder} type="button">
                Place Order
              </button>

              <Link className={styles.addMoreButton} href="/#collection">
                Add More
              </Link>

              <p className={styles.termsCopy}>
                By placing your order, you agree to Kapten Batik&apos;s{" "}
                <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.{" "}
                {notes ? "Your delivery note will be included with the order." : ""}
              </p>
            </div>

            <div className={styles.reassuranceList}>
              {checkoutReassurance.map((item) => (
                <article className={styles.reassuranceCard} key={item.id}>
                  <span className={styles.reassuranceIcon}>
                    <ReassuranceIcon id={item.id} />
                  </span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
