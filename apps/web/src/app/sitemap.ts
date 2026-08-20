import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site";
import { demoCatalogDataSource } from "@/data/demo/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, universes] = await Promise.all([
    demoCatalogDataSource.listProducts({ limit: 100 }),
    demoCatalogDataSource.listCategories(),
    demoCatalogDataSource.listUniverses(),
  ]);
  const siteUrl = getSiteUrl();

  return [
    {
      url: siteUrl.toString(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: new URL("/shop", siteUrl).toString(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...categories.map((category) => ({
      url: new URL(`/category/${category.slug}`, siteUrl).toString(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...universes.map((universe) => ({
      url: new URL(`/universe/${universe.slug}`, siteUrl).toString(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...products.items.map((product) => ({
      url: new URL(`/product/${product.slug}`, siteUrl).toString(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
