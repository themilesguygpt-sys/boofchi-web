"use client";

import type { Product, Universe } from "@boofchi/contracts";

import { useCommerce } from "@/components/commerce/commerce-provider";
import { ProductGrid } from "@/components/commerce/product-grid";

export function WishlistView({
  products,
  universes,
}: {
  products: readonly Product[];
  universes: readonly Universe[];
}) {
  const { hydrated, wishlistProductIds } = useCommerce();
  const selected = new Set(wishlistProductIds);
  const savedProducts = products.filter((product) => selected.has(product.id));

  if (!hydrated) {
    return <div className="commerce-state-loading" role="status">داریم ذخیره‌هات رو آماده می‌کنیم…</div>;
  }

  if (!savedProducts.length) {
    return (
      <div className="commerce-empty-state">
        <span dir="ltr">WISHLIST / EMPTY</span>
        <h2>هنوز چیزی ذخیره نکردی.</h2>
        <p>هر چیزی رو خواستی، با قلب روی کارت نگهش دار.</p>
        <a className="button button--primary" href="/shop">دیدن محصولات</a>
      </div>
    );
  }

  return (
    <section className="wishlist-results" aria-labelledby="wishlist-results-title">
      <div className="wishlist-results__heading">
        <h2 id="wishlist-results-title">ذخیره‌شده‌ها</h2>
        <p><strong>{savedProducts.length.toLocaleString("fa-IR")}</strong> محصول</p>
      </div>
      <ProductGrid products={savedProducts} universes={universes} />
    </section>
  );
}
