import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/commerce/breadcrumbs";
import { ProductGrid } from "@/components/commerce/product-grid";
import { Container } from "@/components/ui/container";
import { demoCatalogSearchService } from "@/data/demo/search";
import { demoCatalogDataSource } from "@/data/demo/catalog";

export const metadata: Metadata = {
  title: "جستجو",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const raw = (await searchParams).q;
  const query = (Array.isArray(raw) ? raw[0] : raw)?.slice(0, 100).trim() ?? "";
  const [result, universes] = await Promise.all([
    demoCatalogSearchService.search(query, 100),
    demoCatalogDataSource.listUniverses(),
  ]);

  return (
    <main id="main-content" className="commerce-page interaction-page search-page">
      <Container>
        <Breadcrumbs items={[{ label: "خانه", href: "/" }, { label: "جستجو" }]} />
        <header className="interaction-page__header">
          <p className="eyebrow">پیداش کن</p>
          <h1>جستجو</h1>
          <form className="search-page__form" action="/search" method="get" role="search">
            <label htmlFor="search-page-query">دنبال چی می‌گردی؟</label>
            <div>
              <input
                id="search-page-query"
                name="q"
                type="search"
                dir="auto"
                defaultValue={query}
                placeholder="مثلاً Naruto یا هری پاتر"
                autoComplete="off"
              />
              <button type="submit" className="button button--primary">جستجو</button>
            </div>
          </form>
        </header>

        {query ? (
          <section className="search-results" aria-labelledby="search-results-title">
            <div className="search-results__heading">
              <h2 id="search-results-title">
                نتیجه برای <bdi dir="auto">«{query}»</bdi>
              </h2>
              <p><strong>{result.total.toLocaleString("fa-IR")}</strong> محصول</p>
            </div>
            {result.items.length ? (
              <ProductGrid products={result.items} universes={universes} />
            ) : (
              <div className="commerce-empty-state">
                <span dir="ltr">NO MATCH</span>
                <h2>چیزی برای <bdi dir="auto">«{query}»</bdi> پیدا نشد.</h2>
                <p>املای عبارت رو چک کن یا یه چیز دیگه امتحان کن.</p>
                <a className="button button--secondary" href="/shop">دیدن محصولات</a>
              </div>
            )}
          </section>
        ) : (
          <div className="commerce-empty-state commerce-empty-state--compact">
            <h2>یه اسم، دنیا یا دسته‌بندی بنویس.</h2>
            <p>بین همه محصولات بوفچی می‌گردیم.</p>
          </div>
        )}
      </Container>
    </main>
  );
}
