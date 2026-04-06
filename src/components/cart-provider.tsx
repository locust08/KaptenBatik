"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  addAccountRewardPoints,
  calculateRewardPointsFromAmount,
  readAccountState,
} from "@/lib/account-state";
import { recordPurchasedProducts } from "@/lib/review-state";
import type {
  DeliveryOptionId,
  PaymentOptionId,
  ShippingRegion,
} from "@/data/order-flow-content";

export type ProductCollection = "men" | "women" | "junior";

export type CartItem = {
  category: string;
  collection: ProductCollection;
  href: string;
  image: string;
  name: string;
  price: string;
  quantity: number;
  size: string;
  slug: string;
  unitPrice: number;
};

export type CompletedOrder = {
  cardLast4?: string;
  deliveryId: DeliveryOptionId;
  items: CartItem[];
  orderNumber: string;
  discountAmount?: number;
  discountLabel?: string;
  orderNote?: string;
  paymentId: PaymentOptionId;
  paymentLabel: string;
  pointsEarned: number;
  shippingCost: number;
  shippingLabel: string;
  shippingRegion: ShippingRegion;
  status: string;
  total: number;
};

type CartContextValue = {
  cartCount: number;
  cartItems: CartItem[];
  cartSubtotal: number;
  checkoutItems: CartItem[];
  completedOrder: CompletedOrder | null;
  cartNotice: string;
  addItem: (item: CartItem) => void;
  clearCompletedOrder: () => void;
  clearCart: () => void;
  completeCheckout: (order: CompletedOrder) => void;
  prepareCheckout: (items: CartItem[]) => void;
  removeItem: (item: Pick<CartItem, "size" | "slug">) => void;
  updateItemQuantity: (item: Pick<CartItem, "size" | "slug">, quantity: number) => void;
  toggleCheckoutFromCart: (item: Pick<CartItem, "size" | "slug">) => void;
};

const STORAGE_KEY = "kapten-batik-cart-state";

const CartContext = createContext<CartContextValue | null>(null);

type PersistedCartState = {
  cartItems: CartItem[];
  checkoutItems: CartItem[];
  checkoutItem?: CartItem | null;
  completedOrder: CompletedOrder | null;
};

function parseStoredState(value: string | null): PersistedCartState | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as PersistedCartState & {
      completedOrder?: (CompletedOrder & { item?: CartItem }) | null;
    };

    if (parsed.completedOrder && !parsed.completedOrder.items && parsed.completedOrder.item) {
      parsed.completedOrder = {
        ...parsed.completedOrder,
        items: [parsed.completedOrder.item],
      };
    }

    if (parsed.completedOrder && typeof parsed.completedOrder.pointsEarned !== "number") {
      parsed.completedOrder = {
        ...parsed.completedOrder,
        pointsEarned: 0,
      };
    }

    return parsed;
  } catch {
    return null;
  }
}

function isSameLineItem(current: Pick<CartItem, "size" | "slug">, incoming: Pick<CartItem, "size" | "slug">) {
  return current.slug === incoming.slug && current.size === incoming.size;
}

function mergeLineItems(items: CartItem[], incoming: CartItem) {
  const matchIndex = items.findIndex((entry) => isSameLineItem(entry, incoming));

  if (matchIndex === -1) {
    return [...items, incoming];
  }

  const nextItems = [...items];
  const matchedItem = nextItems[matchIndex];
  nextItems[matchIndex] = {
    ...matchedItem,
    quantity: matchedItem.quantity + incoming.quantity,
  };

  return nextItems;
}

function normalizeLineItems(items: CartItem[]) {
  const normalized = new Map<string, CartItem>();

  for (const item of items) {
    normalized.set(`${item.slug}:${item.size}`, item);
  }

  return Array.from(normalized.values());
}

function buildOrderNumber() {
  const now = new Date();
  const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate(),
  ).padStart(2, "0")}${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(
    2,
    "0",
  )}`;
  const suffix = Math.floor(Math.random() * 900 + 100);
  return `#KB${timestamp}${suffix}`;
}

export function parsePrice(price: string) {
  const digits = Number.parseFloat(price.replace(/[^\d.]/g, ""));
  return Number.isFinite(digits) ? digits : 0;
}

export function formatPrice(value: number, { compact = false }: { compact?: boolean } = {}) {
  const formatted = new Intl.NumberFormat("en-MY", {
    minimumFractionDigits: compact ? 0 : 2,
    maximumFractionDigits: compact ? 0 : 2,
  }).format(value);

  return `RM${formatted}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);
  const [cartNotice, setCartNotice] = useState("");
  const [hasHydrated, setHasHydrated] = useState(false);
  const cartNoticeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const storedState = parseStoredState(window.localStorage.getItem(STORAGE_KEY));

    if (storedState) {
      setCartItems((storedState.cartItems ?? []).reduce<CartItem[]>(mergeLineItems, []));
      setCheckoutItems(
        normalizeLineItems(
          storedState.checkoutItems ?? (storedState.checkoutItem ? [storedState.checkoutItem] : []),
        ),
      );
      setCompletedOrder(storedState.completedOrder ?? null);
    }

    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        cartItems,
        checkoutItems,
        completedOrder,
      }),
    );
  }, [cartItems, checkoutItems, completedOrder, hasHydrated]);

  useEffect(() => {
    return () => {
      if (cartNoticeTimeoutRef.current !== null) {
        window.clearTimeout(cartNoticeTimeoutRef.current);
      }
    };
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const showCartNotice = (message: string) => {
      setCartNotice(message);

      if (cartNoticeTimeoutRef.current !== null) {
        window.clearTimeout(cartNoticeTimeoutRef.current);
      }

      cartNoticeTimeoutRef.current = window.setTimeout(() => {
        setCartNotice("");
        cartNoticeTimeoutRef.current = null;
      }, 2200);
    };

    const addItem = (item: CartItem) => {
      setCartItems((current) => {
        const hasMatch = current.some((entry) => isSameLineItem(entry, item));
        const nextItems = mergeLineItems(current, item);

        showCartNotice(
          hasMatch
            ? `${item.quantity} more ${item.name} added to cart.`
            : `${item.quantity > 1 ? `${item.quantity} ${item.name}` : item.name} added to cart.`,
        );

        return nextItems;
      });
    };

    const removeItem = (item: Pick<CartItem, "size" | "slug">) => {
      setCartItems((current) => current.filter((entry) => !isSameLineItem(entry, item)));
      setCheckoutItems((current) => current.filter((entry) => !isSameLineItem(entry, item)));
    };

    const updateItemQuantity = (item: Pick<CartItem, "size" | "slug">, quantity: number) => {
      const nextQuantity = Math.max(0, Math.floor(quantity));

      setCartItems((current) => {
        const matchIndex = current.findIndex((entry) => isSameLineItem(entry, item));

        if (matchIndex === -1) {
          return current;
        }

        if (nextQuantity === 0) {
          setCheckoutItems((existing) => existing.filter((entry) => !isSameLineItem(entry, item)));
          return current.filter((entry) => !isSameLineItem(entry, item));
        }

        const nextItems = [...current];
        const nextItem = {
          ...nextItems[matchIndex],
          quantity: nextQuantity,
        };

        nextItems[matchIndex] = nextItem;

        setCheckoutItems((existing) => {
          const existingIndex = existing.findIndex((entry) => isSameLineItem(entry, item));

          if (existingIndex === -1) {
            return existing;
          }

          const nextCheckoutItems = [...existing];
          nextCheckoutItems[existingIndex] = nextItem;
          return nextCheckoutItems;
        });

        return nextItems;
      });

      setCompletedOrder(null);
    };

    const prepareCheckout = (items: CartItem[]) => {
      setCheckoutItems(normalizeLineItems(items.map((item) => ({ ...item }))));
      setCompletedOrder(null);
    };

    const toggleCheckoutFromCart = (item: Pick<CartItem, "size" | "slug">) => {
      const matchedItem = cartItems.find((entry) => isSameLineItem(entry, item));

      if (matchedItem) {
        setCheckoutItems((current) => {
          const exists = current.some((entry) => isSameLineItem(entry, matchedItem));

          if (exists) {
            return current.filter((entry) => !isSameLineItem(entry, matchedItem));
          }

          return [...current, matchedItem];
        });
      }
    };

    const completeCheckout = (order: CompletedOrder) => {
      const pointsEarned =
        readAccountState() === "logged-in"
          ? addAccountRewardPoints(calculateRewardPointsFromAmount(order.total))
          : 0;

      setCartItems((current) =>
        current.filter(
          (entry) => !order.items.some((checkedOutItem) => isSameLineItem(entry, checkedOutItem)),
        ),
      );
      setCheckoutItems([]);
      setCompletedOrder({
        ...order,
        orderNumber: order.orderNumber || buildOrderNumber(),
        pointsEarned,
        status: order.status || "Processing",
      });
      recordPurchasedProducts(order.items);
    };

    const clearCompletedOrder = () => {
      setCompletedOrder(null);
    };

    const clearCart = () => {
      setCartItems([]);
      setCheckoutItems([]);
      setCompletedOrder(null);
    };

    return {
      addItem,
      cartCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      cartItems,
      cartSubtotal: cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
      checkoutItems,
      cartNotice,
      clearCart,
      clearCompletedOrder,
      completeCheckout,
      completedOrder,
      prepareCheckout,
      removeItem,
      updateItemQuantity,
      toggleCheckoutFromCart,
    };
  }, [cartItems, cartNotice, checkoutItems, completedOrder]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function createOrderNumber() {
  return buildOrderNumber();
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
