import type { Metadata } from "next";

import { CartView } from "@/components/cart/cart-view";
import { Breadcrumbs } from "@/components/commerce/breadcrumbs";
import { Container } from "@/components/ui/container";
import { demoCatalogDataSource } from "@/data/demo/catalog";

export const metadata: Metadata = {
  title: "سبد خرید",
  robots: { index: false, follow: false },
};

export default async function CartPage() {
  const { items: products } = await demoCatalogDataSource.listProducts({ limit: 100 });
  return (
    <main id="main-content" className="commerce-page interaction-page cart-page">
      <Container>
        <Breadcrumbs items={[{ label: "خانه", href: "/" }, { label: "سبد خرید" }]} />
        <header className="interaction-page__header interaction-page__header--compact">
          <p className="eyebrow" dir="ltr">BOOFCHI / CART</p>
          <h1>سبد خرید</h1>
          <p>انتخاب‌هات، یک‌جا.</p>
        </header>
        <CartView products={products} />
      </Container>
    </main>
  );
}
