import { NextResponse } from "next/server";

import { demoCatalogSearchService } from "@/data/demo/search";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.slice(0, 100) ?? "";
  const result = await demoCatalogSearchService.search(query, 5);

  return NextResponse.json({
    query: result.query,
    total: result.total,
    items: result.items.map((product) => {
      const image = product.images.find((item) => item.primary) ?? product.images[0];
      return {
        id: product.id,
        slug: product.slug,
        title: product.title.fa,
        price: product.price,
        availability: product.availability,
        image: image ? { path: image.path, alt: image.alt || product.title.fa } : null,
      };
    }),
  });
}
