import type { Product, Universe } from "@boofchi/contracts";

import { ProductCard } from "@/components/product/product-card";

interface ProductGridProps {
  products: readonly Product[];
  universes: readonly Universe[];
}

export function ProductGrid({ products, universes }: ProductGridProps) {
  const universeById = new Map(universes.map((universe) => [universe.id, universe]));

  return (
    <div className="product-grid" role="list">
      {products.map((product) => (
        <div key={product.id} role="listitem">
          <ProductCard
            product={product}
            universe={product.universeId ? universeById.get(product.universeId) : undefined}
          />
        </div>
      ))}
    </div>
  );
}
