"use client";

import type { Money, Product } from "@boofchi/contracts";
import Image from "next/image";
import Link from "next/link";

import { DEMO_MAX_QUANTITY, useCommerce } from "@/components/commerce/commerce-provider";
import { MixedTitleText } from "@/components/mixed-title-text";
import { formatMoney } from "@/lib/format-money";

export function CartView({ products }: { products: readonly Product[] }) {
  const {
    hydrated,
    cartLines,
    removeFromCart,
    setQuantity,
    clearCart,
  } = useCommerce();
  const productsById = new Map(products.map((product) => [product.id, product]));
  const resolved = cartLines.flatMap((line) => {
    const product = productsById.get(line.productId);
    return product ? [{ line, product }] : [];
  });
  const subtotalAmount = resolved.reduce(
    (total, entry) => total + entry.product.price.amount * entry.line.quantity,
    0,
  );
  const subtotal: Money = { amount: subtotalAmount, unit: "TOMAN" };

  if (!hydrated) {
    return <div className="commerce-state-loading" role="status">داریم سبدت رو آماده می‌کنیم…</div>;
  }

  if (!resolved.length) {
    return (
      <div className="commerce-empty-state">
        <span dir="ltr">CART / EMPTY</span>
        <h2>سبدت خالیه.</h2>
        <p>یه دور توی محصولات بزن.</p>
        <Link className="button button--primary" href="/shop">دیدن محصولات</Link>
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <section className="cart-lines" aria-labelledby="cart-lines-title">
        <div className="cart-lines__heading">
          <h2 id="cart-lines-title">محصولات سبد</h2>
          <button type="button" onClick={clearCart}>خالی کردن سبد</button>
        </div>
        <ul>
          {resolved.map(({ line, product }) => {
            const image = product.images.find((item) => item.primary) ?? product.images[0];
            const lineSubtotal: Money = {
              amount: product.price.amount * line.quantity,
              unit: product.price.unit,
            };
            return (
              <li key={product.id} className="cart-line">
                <Link className="cart-line__image" href={`/product/${product.slug}`}>
                  {image ? <Image src={image.path} alt={image.alt || product.title.fa} fill sizes="8rem" /> : null}
                </Link>
                <div className="cart-line__details">
                  <Link href={`/product/${product.slug}`}>
                    <h3><MixedTitleText>{product.title.fa}</MixedTitleText></h3>
                  </Link>
                  <p className={product.availability === "in-stock" ? "is-available" : "is-unavailable"}>
                    {product.availability === "in-stock" ? "موجود" : "فعلاً ناموجود"}
                  </p>
                  <span>قیمت واحد: <bdi dir="rtl">{formatMoney(product.price)}</bdi></span>
                </div>
                <div className="cart-line__actions">
                  <div className="quantity-control" aria-label={`تعداد ${product.title.fa}`}>
                    <button
                      type="button"
                      aria-label={`کم کردن تعداد ${product.title.fa}`}
                      disabled={line.quantity <= 1}
                      onClick={() => setQuantity(product.id, line.quantity - 1)}
                    >−</button>
                    <output aria-live="polite">{line.quantity.toLocaleString("fa-IR")}</output>
                    <button
                      type="button"
                      aria-label={`زیاد کردن تعداد ${product.title.fa}`}
                      disabled={line.quantity >= DEMO_MAX_QUANTITY}
                      onClick={() => setQuantity(product.id, line.quantity + 1)}
                    >+</button>
                  </div>
                  <button
                    type="button"
                    className="cart-line__remove"
                    aria-label={`حذف ${product.title.fa} از سبد`}
                    onClick={() => removeFromCart(product.id)}
                  >حذف</button>
                </div>
                <strong className="cart-line__subtotal"><bdi dir="rtl">{formatMoney(lineSubtotal)}</bdi></strong>
              </li>
            );
          })}
        </ul>
      </section>

      <aside className="cart-summary" aria-labelledby="cart-summary-title">
        <p className="eyebrow" dir="ltr">CART / SUMMARY</p>
        <h2 id="cart-summary-title">جمع سبد</h2>
        <div><span>جمع محصولات</span><strong><bdi dir="rtl">{formatMoney(subtotal)}</bdi></strong></div>
        <button type="button" className="button button--primary" disabled>تکمیل خرید</button>
        <p>پرداخت در نسخه نهایی فروشگاه فعال می‌شه.</p>
        <Link href="/shop">ادامه خرید</Link>
      </aside>
    </div>
  );
}
