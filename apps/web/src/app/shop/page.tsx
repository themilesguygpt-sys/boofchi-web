import type { Metadata } from "next";
import Link from "next/link";

import { CatalogControls } from "@/components/commerce/catalog-controls";
import { Breadcrumbs } from "@/components/commerce/breadcrumbs";
import { ProductGrid } from "@/components/commerce/product-grid";
import { Container } from "@/components/ui/container";
import { demoCatalogDataSource } from "@/data/demo/catalog";
import {
  type CatalogSearchParams,
  parseCatalogSelection,
  productQueryFromSelection,
} from "@/lib/catalog-browse";

export const metadata: Metadata = {
  title: "همه محصولات",
  description: "همه محصولات بوفچی؛ با فیلتر دسته‌بندی، دنیا و وضعیت موجودی.",
  alternates: { canonical: "/shop" },
};

interface ShopPageProps {
  searchParams: Promise<CatalogSearchParams>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const rawSearchParams = await searchParams;
  const selection = parseCatalogSelection(rawSearchParams);
  const [categories, universes] = await Promise.all([
    demoCatalogDataSource.listCategories(),
    demoCatalogDataSource.listUniverses(),
  ]);
  const selectedCategory = categories.find((item) => item.slug === selection.categorySlug);
  const selectedUniverse = universes.find((item) => item.slug === selection.universeSlug);
  const current = {
    categorySlug: selectedCategory?.slug,
    universeSlug: selectedUniverse?.slug,
    availability: selection.availability,
    sort: selection.sort,
  };
  const query = productQueryFromSelection(current, categories, universes);
  const [{ items: products }, filters] = await Promise.all([
    demoCatalogDataSource.listProducts(query),
    demoCatalogDataSource.getAvailableFilters(query),
  ]);

  return (
    <main id="main-content" className="commerce-page">
      <Container>
        <Breadcrumbs items={[{ label: "خانه", href: "/" }, { label: "محصولات" }]} />
        <header className="commerce-hero commerce-hero--shop">
          <p className="eyebrow">ویترین کامل</p>
          <h1>همه محصولات</h1>
          <p>فیلتر کن، مرتب کن و برو سراغ چیزی که می‌خوای.</p>
        </header>

        <div className="catalog-summary">
          <p aria-live="polite">
            <strong>{products.length.toLocaleString("fa-IR")}</strong> محصول
          </p>
        </div>

        <div className="catalog-layout">
          <CatalogControls
            categories={filters.categories}
            universes={filters.universes}
            availability={filters.availability}
            current={current}
            resultCount={products.length}
          />
          <section className="catalog-results" aria-label="نتایج محصولات">
            {products.length ? (
              <ProductGrid products={products} universes={universes} />
            ) : (
              <div className="empty-state">
                <span dir="ltr">NO MATCH</span>
                <h2>چیزی با این فیلترها پیدا نشد.</h2>
                <p>فیلترها رو پاک کن و دوباره ببین.</p>
                <Link className="button button--primary" href="/shop">
                  پاک کردن فیلترها
                </Link>
              </div>
            )}
          </section>
        </div>
      </Container>
    </main>
  );
}
