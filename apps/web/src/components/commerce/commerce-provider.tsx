"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";

import demoProductIds from "@/data/demo/product-ids.json";

const STORAGE_KEY = "boofchi:v1:commerce";
const SCHEMA_VERSION = 1;
export const DEMO_MAX_QUANTITY = 10;

interface CartLineState {
  productId: string;
  quantity: number;
}

interface CommerceState {
  wishlistProductIds: string[];
  cartLines: CartLineState[];
}

interface CommerceSnapshot extends CommerceState {
  hydrated: boolean;
  feedback: string;
}

interface PersistedCommerceState extends CommerceState {
  version: typeof SCHEMA_VERSION;
}

interface CommerceContextValue extends CommerceState {
  hydrated: boolean;
  feedback: string;
  wishlistCount: number;
  cartCount: number;
  isWishlisted(productId: string): boolean;
  cartQuantity(productId: string): number;
  toggleWishlist(productId: string): void;
  addToCart(productId: string): void;
  removeFromCart(productId: string): void;
  setQuantity(productId: string, quantity: number): void;
  clearCart(): void;
}

const validProductIds = new Set<string>(demoProductIds);
const emptyState: CommerceState = { wishlistProductIds: [], cartLines: [] };
const serverSnapshot: CommerceSnapshot = { ...emptyState, hydrated: false, feedback: "" };
const listeners = new Set<() => void>();
let snapshot = serverSnapshot;
let initialized = false;
let feedbackTimeout: number | undefined;

function cleanState(value: unknown): CommerceState {
  if (!value || typeof value !== "object") return emptyState;
  const candidate = value as Partial<PersistedCommerceState>;
  if (candidate.version !== SCHEMA_VERSION) return emptyState;

  const wishlistProductIds = Array.isArray(candidate.wishlistProductIds)
    ? [...new Set(candidate.wishlistProductIds.filter(
        (id): id is string => typeof id === "string" && validProductIds.has(id),
      ))]
    : [];
  const quantities = new Map<string, number>();
  if (Array.isArray(candidate.cartLines)) {
    for (const line of candidate.cartLines) {
      if (!line || typeof line !== "object") continue;
      const productId = (line as Partial<CartLineState>).productId;
      const quantity = (line as Partial<CartLineState>).quantity;
      if (
        typeof productId !== "string" ||
        !validProductIds.has(productId) ||
        !Number.isSafeInteger(quantity)
      ) continue;
      quantities.set(productId, Math.min(Math.max(quantity as number, 1), DEMO_MAX_QUANTITY));
    }
  }

  return {
    wishlistProductIds,
    cartLines: [...quantities].map(([productId, quantity]) => ({ productId, quantity })),
  };
}

function notify() {
  listeners.forEach((listener) => listener());
}

function persist(state: CommerceState) {
  const persisted: PersistedCommerceState = { version: SCHEMA_VERSION, ...state };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
}

function replaceState(state: CommerceState, shouldPersist: boolean) {
  snapshot = { ...state, hydrated: true, feedback: "" };
  if (shouldPersist) persist(state);
  notify();
}

function initialize() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    replaceState(raw ? cleanState(JSON.parse(raw)) : emptyState, true);
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    replaceState(emptyState, true);
  }

  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;
    try {
      replaceState(event.newValue ? cleanState(JSON.parse(event.newValue)) : emptyState, false);
    } catch {
      replaceState(emptyState, false);
    }
  });
}

function announce(message: string) {
  if (feedbackTimeout) window.clearTimeout(feedbackTimeout);
  snapshot = { ...snapshot, feedback: "" };
  notify();
  feedbackTimeout = window.setTimeout(() => {
    snapshot = { ...snapshot, feedback: message };
    notify();
  }, 0);
}

function updateState(updater: (current: CommerceState) => CommerceState, message?: string) {
  initialize();
  const next = updater(snapshot);
  snapshot = { ...next, hydrated: true, feedback: "" };
  persist(next);
  notify();
  if (message) announce(message);
}

function toggleWishlist(productId: string) {
  if (!validProductIds.has(productId)) return;
  initialize();
  const exists = snapshot.wishlistProductIds.includes(productId);
  updateState((current) => ({
    ...current,
    wishlistProductIds: exists
      ? current.wishlistProductIds.filter((id) => id !== productId)
      : [...current.wishlistProductIds, productId],
  }), exists ? "از علاقه‌مندی‌ها حذف شد." : "ذخیره شد.");
}

function addToCart(productId: string) {
  if (!validProductIds.has(productId)) return;
  updateState((current) => {
    const existing = current.cartLines.find((line) => line.productId === productId);
    const cartLines = existing
      ? current.cartLines.map((line) =>
          line.productId === productId
            ? { ...line, quantity: Math.min(line.quantity + 1, DEMO_MAX_QUANTITY) }
            : line,
        )
      : [...current.cartLines, { productId, quantity: 1 }];
    return { ...current, cartLines };
  }, "به سبد اضافه شد.");
}

function removeFromCart(productId: string) {
  updateState((current) => ({
    ...current,
    cartLines: current.cartLines.filter((line) => line.productId !== productId),
  }), "از سبد حذف شد.");
}

function setQuantity(productId: string, quantity: number) {
  if (!Number.isSafeInteger(quantity)) return;
  if (quantity < 1) {
    removeFromCart(productId);
    return;
  }
  updateState((current) => ({
    ...current,
    cartLines: current.cartLines.map((line) =>
      line.productId === productId
        ? { ...line, quantity: Math.min(quantity, DEMO_MAX_QUANTITY) }
        : line,
    ),
  }));
}

function clearCart() {
  updateState((current) => ({ ...current, cartLines: [] }), "سبد خالی شد.");
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot() {
  return serverSnapshot;
}

export function useCommerce(): CommerceContextValue {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    initialize();
  }, []);

  return useMemo(() => ({
    ...current,
    wishlistCount: current.wishlistProductIds.length,
    cartCount: current.cartLines.reduce((total, line) => total + line.quantity, 0),
    isWishlisted: (productId) => current.wishlistProductIds.includes(productId),
    cartQuantity: (productId) =>
      current.cartLines.find((line) => line.productId === productId)?.quantity ?? 0,
    toggleWishlist,
    addToCart,
    removeFromCart,
    setQuantity,
    clearCart,
  }), [current]);
}

export function CommerceLiveRegion() {
  const { feedback } = useCommerce();
  return (
    <div className="commerce-live-region" aria-live="polite" aria-atomic="true">
      {feedback}
    </div>
  );
}
