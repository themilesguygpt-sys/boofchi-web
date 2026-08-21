"use client";

import type { ProductAvailability } from "@boofchi/contracts";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useCommerce } from "@/components/commerce/commerce-provider";
import { BagIcon, HeartIcon } from "@/components/ui/icons";

export function ProductActions({
  productId,
  productTitle,
  availability,
}: {
  productId: string;
  productTitle: string;
  availability: ProductAvailability;
}) {
  const { hydrated, addToCart, cartQuantity, isWishlisted, toggleWishlist } = useCommerce();
  const [added, setAdded] = useState(false);
  const wished = hydrated && isWishlisted(productId);
  const quantity = hydrated ? cartQuantity(productId) : 0;

  useEffect(() => {
    if (!added) return;
    const timeout = window.setTimeout(() => setAdded(false), 1400);
    return () => window.clearTimeout(timeout);
  }, [added]);

  return (
    <div className="product-action">
      {availability === "in-stock" ? (
        <div className="product-action__buttons">
          <button
            type="button"
            className="button button--primary"
            onClick={() => {
              addToCart(productId);
              setAdded(true);
            }}
          >
            <BagIcon />
            {added ? "اضافه شد" : "افزودن به سبد"}
          </button>
          <button
            type="button"
            className={`button button--secondary product-wishlist${wished ? " is-active" : ""}`}
            aria-pressed={wished}
            aria-label={`${wished ? "حذف" : "افزودن"} ${productTitle} ${wished ? "از" : "به"} علاقه‌مندی‌ها`}
            onClick={() => toggleWishlist(productId)}
          >
            <HeartIcon />
            {wished ? "ذخیره شده" : "علاقه‌مندی"}
          </button>
        </div>
      ) : (
        <div className="product-action--unavailable" role="status">
          <strong>فعلاً موجود نیست.</strong>
          <p>محصولات مشابه رو پایین صفحه ببین.</p>
          <button
            type="button"
            className={`button button--secondary product-wishlist${wished ? " is-active" : ""}`}
            aria-pressed={wished}
            onClick={() => toggleWishlist(productId)}
          >
            <HeartIcon />
            {wished ? "ذخیره شده" : "علاقه‌مندی"}
          </button>
        </div>
      )}
      {quantity ? (
        <p className="product-action__status">
          <span>{quantity.toLocaleString("fa-IR")} عدد توی سبدته.</span>
          <Link href="/cart">دیدن سبد</Link>
        </p>
      ) : null}
    </div>
  );
}
