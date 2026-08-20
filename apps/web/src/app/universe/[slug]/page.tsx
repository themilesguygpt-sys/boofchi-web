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

interface UniversePageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<CatalogSearchParams>;
}

export async function generateStaticParams() {
  const universes = await demoCatalogDataSource.listUniverses();
  return universes.map((universe) => ({ slug: universe.slug }));
}

export async function generateMetadata({ params }: UniversePageProps): Promise<Metadata> {
  const { slug } = await params;
  const universe = await demoCatalogDataSource.getUniverseBySlug(decodeRouteSlug(slug));
  if (!universe) return {};
  const name = universe.name.en ?? universe.name.fa;
  return {
    title: name,
    description: `محصولات دنیای ${name} در بوفچی.`,
    alternates: { canonical: `/universe/${universe.slug}` },
  };
}

export default async function UniversePage({ params, searchParams }: UniversePageProps) {
  const [{ slug }, rawSearchParams] = await Promise.all([params, searchParams]);
  const universe = await demoCatalogDataSource.getUniverseBySlug(decodeRouteSlug(slug));
  if (!universe) notFound();

  const selection = parseCatalogSelection(rawSearchParams);
  const [categories, universes] = await Promise.all([
    demoCatalogDataSource.listCategories(),
    demoCatalogDataSource.listUniverses(),
  ]);
  const query = productQueryFromSelection(selection, categories, universes, {
    universeId: universe.id,
  });
  const { items: products } = await demoCatalogDataSource.listProducts(query);
  const name = universe.name.en ?? universe.name.fa;

  return (
    <main id="main-content" className="commerce-page universe-page">
      <Container>
        <Breadcrumbs
          items={[
            { label: "خانه", href: "/" },
            { label: "محصولات", href: "/shop" },
            { label: "دنیاها", href: "/#universes" },
            { label: name, dir: "ltr" },
          ]}
        />
        <header className="commerce-hero commerce-hero--universe">
          <p className="eyebrow" dir="ltr">WORLD / BOOFCHI</p>
          <h1><bdi dir="ltr">{name}</bdi></h1>
          <p>چیزهایی از این دنیا که توی ویترین بوفچی داریم.</p>
        </header>
        <div className="taxonomy-toolbar">
          <p><strong>{products.length.toLocaleString("fa-IR")}</strong> محصول</p>
          <SortSelect value={selection.sort} />
        </div>
        {products.length ? (
          <ProductGrid products={products} universes={universes} />
        ) : (
          <div className="empty-state">
            <h2>فعلاً محصولی از این دنیا موجود نیست.</h2>
            <Link className="button button--primary" href="/shop">دیدن همه محصولات</Link>
          </div>
        )}
      </Container>
    </main>
  );
}
