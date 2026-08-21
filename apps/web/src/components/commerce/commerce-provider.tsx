"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

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

interface PersistedCommerceState extends CommerceState {
  version: typeof SCHEMA_VERSION;
}

interface CommerceContextValue extends CommerceState {
  hydrated: boolean;
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

const emptyState: CommerceState = { wishlistProductIds: [], cartLines: [] };
const CommerceContext = createContext<CommerceContextValue | null>(null);

function cleanState(value: unknown, validProductIds: ReadonlySet<string>): CommerceState {
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

export function CommerceProvider({
  validProductIds,
  children,
}: {
  validProductIds: readonly string[];
  children: ReactNode;
}) {
  const validIds = useMemo(() => new Set(validProductIds), [validProductIds]);
  const [state, setState] = useState<CommerceState>(emptyState);
  const [hydrated, setHydrated] = useState(false);
  const [feedback, setFeedback] = useState("");

  const announce = useCallback((message: string) => {
    setFeedback("");
    window.setTimeout(() => setFeedback(message), 0);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        setState(raw ? cleanState(JSON.parse(raw), validIds) : emptyState);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
        setState(emptyState);
      } finally {
        setHydrated(true);
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [validIds]);

  useEffect(() => {
    if (!hydrated) return;
    const persisted: PersistedCommerceState = { version: SCHEMA_VERSION, ...state };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
  }, [hydrated, state]);

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key !== STORAGE_KEY) return;
      try {
        setState(event.newValue ? cleanState(JSON.parse(event.newValue), validIds) : emptyState);
      } catch {
        setState(emptyState);
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [validIds]);

  const toggleWishlist = useCallback((productId: string) => {
    if (!validIds.has(productId)) return;
    const exists = state.wishlistProductIds.includes(productId);
    setState((current) => {
      return {
        ...current,
        wishlistProductIds: exists
          ? current.wishlistProductIds.filter((id) => id !== productId)
          : [...current.wishlistProductIds, productId],
      };
    });
    announce(exists ? "از علاقه‌مندی‌ها حذف شد." : "ذخیره شد.");
  }, [announce, state.wishlistProductIds, validIds]);

  const addToCart = useCallback((productId: string) => {
    if (!validIds.has(productId)) return;
    setState((current) => {
      const existing = current.cartLines.find((line) => line.productId === productId);
      const cartLines = existing
        ? current.cartLines.map((line) =>
            line.productId === productId
              ? { ...line, quantity: Math.min(line.quantity + 1, DEMO_MAX_QUANTITY) }
              : line,
          )
        : [...current.cartLines, { productId, quantity: 1 }];
      return { ...current, cartLines };
    });
    announce("به سبد اضافه شد.");
  }, [announce, validIds]);

  const removeFromCart = useCallback((productId: string) => {
    setState((current) => ({
      ...current,
      cartLines: current.cartLines.filter((line) => line.productId !== productId),
    }));
    announce("از سبد حذف شد.");
  }, [announce]);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    if (!Number.isSafeInteger(quantity)) return;
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setState((current) => ({
      ...current,
      cartLines: current.cartLines.map((line) =>
        line.productId === productId
          ? { ...line, quantity: Math.min(quantity, DEMO_MAX_QUANTITY) }
          : line,
      ),
    }));
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setState((current) => ({ ...current, cartLines: [] }));
    announce("سبد خالی شد.");
  }, [announce]);

  const value = useMemo<CommerceContextValue>(() => ({
    ...state,
    hydrated,
    wishlistCount: state.wishlistProductIds.length,
    cartCount: state.cartLines.reduce((total, line) => total + line.quantity, 0),
    isWishlisted: (productId) => state.wishlistProductIds.includes(productId),
    cartQuantity: (productId) =>
      state.cartLines.find((line) => line.productId === productId)?.quantity ?? 0,
    toggleWishlist,
    addToCart,
    removeFromCart,
    setQuantity,
    clearCart,
  }), [
    addToCart,
    clearCart,
    hydrated,
    removeFromCart,
    setQuantity,
    state,
    toggleWishlist,
  ]);

  return (
    <CommerceContext.Provider value={value}>
      {children}
      <div className="commerce-live-region" aria-live="polite" aria-atomic="true">
        {feedback}
      </div>
    </CommerceContext.Provider>
  );
}

export function useCommerce(): CommerceContextValue {
  const value = useContext(CommerceContext);
  if (!value) throw new Error("useCommerce must be used within CommerceProvider");
  return value;
}
