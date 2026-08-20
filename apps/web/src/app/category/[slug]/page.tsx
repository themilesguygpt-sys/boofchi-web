import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/commerce/breadcrumbs";
import { ProductGrid } from "@/components/commerce/product-grid";
import { SortSelect } from "@/components/commerce/sort-select";
import { Container } from "@/components/ui/container";
import { demoCatalogDataSource } from "@/data/demo/catalog";
import {
  type CatalogSearchParams,
  decodeRouteSlug,
  parseCatalogSelection,
  productQueryFromSelection,
} from "@/lib/catalog-browse";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<CatalogSearchParams>;
}

export async function generateStaticParams() {
  const categories = await demoCatalogDataSource.listCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await demoCatalogDataSource.getCategoryBySlug(decodeRouteSlug(slug));
  if (!category) return {};
  return {
    title: category.name.fa,
    description: `محصولات دسته‌بندی ${category.name.fa} در بوفچی.`,
    alternates: { canonical: `/category/${category.slug}` },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const [{ slug }, rawSearchParams] = await Promise.all([params, searchParams]);
  const category = await demoCatalogDataSource.getCategoryBySlug(decodeRouteSlug(slug));
  if (!category) notFound();

  const selection = parseCatalogSelection(rawSearchParams);
  const [categories, universes] = await Promise.all([
    demoCatalogDataSource.listCategories(),
    demoCatalogDataSource.listUniverses(),
  ]);
  const query = productQueryFromSelection(selection, categories, universes, {
    categoryId: category.id,
  });
  const { items: products } = await demoCatalogDataSource.listProducts(query);

  return (
    <main id="main-content" className="commerce-page">
      <Container>
        <Breadcrumbs
          items={[
            { label: "خانه", href: "/" },
            { label: "محصولات", href: "/shop" },
            { label: category.name.fa },
          ]}
        />
        <header className="commerce-hero commerce-hero--taxonomy">
          <p className="eyebrow">دسته‌بندی</p>
          <h1><bdi dir="auto">{category.name.fa}</bdi></h1>
          <p>همه چیزهایی که توی این دسته داریم، یک‌جا.</p>
        </header>
        <div className="taxonomy-toolbar">
          <p><strong>{products.length.toLocaleString("fa-IR")}</strong> محصول</p>
          <SortSelect value={selection.sort} />
        </div>
        {products.length ? (
          <ProductGrid products={products} universes={universes} />
        ) : (
          <div className="empty-state">
            <h2>فعلاً محصولی توی این دسته نیست.</h2>
            <Link className="button button--primary" href="/shop">دیدن همه محصولات</Link>
          </div>
        )}
      </Container>
    </main>
  );
}
