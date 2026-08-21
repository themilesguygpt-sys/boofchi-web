import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/commerce/breadcrumbs";
import { Container } from "@/components/ui/container";
import { WishlistView } from "@/components/wishlist/wishlist-view";
import { demoCatalogDataSource } from "@/data/demo/catalog";

export const metadata: Metadata = {
  title: "علاقه‌مندی‌ها",
  robots: { index: false, follow: false },
};

export default async function WishlistPage() {
  const [{ items: products }, universes] = await Promise.all([
    demoCatalogDataSource.listProducts({ limit: 100 }),
    demoCatalogDataSource.listUniverses(),
  ]);
  return (
    <main id="main-content" className="commerce-page interaction-page wishlist-page">
      <Container>
        <Breadcrumbs items={[{ label: "خانه", href: "/" }, { label: "علاقه‌مندی‌ها" }]} />
        <header className="interaction-page__header interaction-page__header--compact">
          <p className="eyebrow" dir="ltr">BOOFCHI / WISHLIST</p>
          <h1>علاقه‌مندی‌ها</h1>
          <p>چیزایی که می‌خوای یادت بمونه.</p>
        </header>
        <WishlistView products={products} universes={universes} />
      </Container>
    </main>
  );
}
