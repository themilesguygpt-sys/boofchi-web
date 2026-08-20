import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BidiText } from "@/components/bidi-text";
import { Breadcrumbs } from "@/components/commerce/breadcrumbs";
import { ProductGrid } from "@/components/commerce/product-grid";
import { ProductGallery } from "@/components/product/product-gallery";
import { Container } from "@/components/ui/container";
import { demoCatalogDataSource } from "@/data/demo/catalog";
import { decodeRouteSlug, safeMetadataDescription } from "@/lib/catalog-browse";
import { formatMoney } from "@/lib/format-money";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { items: products } = await demoCatalogDataSource.listProducts({ limit: 100 });
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await demoCatalogDataSource.getProductBySlug(decodeRouteSlug(slug));
  if (!product) return {};
  const image = product.images.find((item) => item.primary) ?? product.images[0];
  const description = safeMetadataDescription(
    product.shortDescription ?? product.description,
    `${product.title.fa} در فروشگاه بوفچی.`,
  );

  return {
    title: product.title.fa,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: "website",
      title: product.title.fa,
      description,
      images: image
        ? [{ url: image.path, width: image.width, height: image.height, alt: image.alt || product.title.fa }]
        : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await demoCatalogDataSource.getProductBySlug(decodeRouteSlug(slug));
  if (!product) notFound();

  const [categories, universes, relatedProducts] = await Promise.all([
    demoCatalogDataSource.listCategories(),
    demoCatalogDataSource.listUniverses(),
    demoCatalogDataSource.getRelatedProducts(product.slug, 6),
  ]);
  const category = categories.find((item) => item.id === product.categoryId);
  const universe = universes.find((item) => item.id === product.universeId);
  const hasSale = Boolean(
    product.regularPrice && product.regularPrice.amount > product.price.amount,
  );

  return (
    <main id="main-content" className="commerce-page product-page">
      <Container>
        <Breadcrumbs
          items={[
            { label: "خانه", href: "/" },
            { label: "محصولات", href: "/shop" },
            ...(category
              ? [{ label: category.name.fa, href: `/category/${category.slug}` }]
              : []),
            { label: product.title.fa },
          ]}
        />

        <section className="product-detail" aria-labelledby="product-title">
          <ProductGallery images={product.images} productTitle={product.title.fa} />
          <div className="product-detail__info">
            <p className="product-detail__eyebrow" dir="ltr">BOOFCHI / PRODUCT</p>
            <h1 id="product-title"><BidiText dir="auto">{product.title.fa}</BidiText></h1>
            <div className="product-detail__price">
              {hasSale && product.regularPrice ? (
                <del><BidiText dir="rtl">{formatMoney(product.regularPrice)}</BidiText></del>
              ) : null}
              <strong><BidiText dir="rtl">{formatMoney(product.price)}</BidiText></strong>
            </div>

            <p className={`availability availability--${product.availability}`}>
              <span aria-hidden="true" />
              {product.availability === "in-stock" ? "موجود" : "ناموجود"}
            </p>

            <dl className="product-detail__meta">
              {category ? (
                <div><dt>دسته‌بندی</dt><dd><Link href={`/category/${category.slug}`}><bdi dir="auto">{category.name.fa}</bdi></Link></dd></div>
              ) : null}
              {universe ? (
                <div><dt>دنیا</dt><dd><Link href={`/universe/${universe.slug}`}><bdi dir="ltr">{universe.name.en ?? universe.name.fa}</bdi></Link></dd></div>
              ) : null}
            </dl>

            {product.availability === "in-stock" ? (
              <div className="product-action">
                <button type="button" className="button button--primary" disabled aria-describedby="cart-stage-note">
                  افزودن به سبد
                </button>
                <p id="cart-stage-note">سبد خرید در مرحله بعد فعال می‌شه.</p>
              </div>
            ) : (
              <div className="product-action product-action--unavailable" role="status">
                <strong>فعلاً موجود نیست.</strong>
                <p>محصولات مشابه رو پایین صفحه ببین.</p>
              </div>
            )}
          </div>
        </section>

        <section className="product-description" aria-labelledby="description-title">
          <p className="eyebrow">درباره محصول</p>
          <h2 id="description-title">جزئیات</h2>
          <p>{product.description ?? product.shortDescription ?? "توضیحات بیشتری برای این محصول ثبت نشده."}</p>
        </section>

        {relatedProducts.length ? (
          <section className="related-products" aria-labelledby="related-title">
            <div className="related-products__heading">
              <div><p className="eyebrow">ادامه بده</p><h2 id="related-title">محصولات مرتبط</h2></div>
              <Link href="/shop">دیدن همه محصولات</Link>
            </div>
            <ProductGrid products={relatedProducts} universes={universes} />
          </section>
        ) : null}
      </Container>
    </main>
  );
}
