import type { Product, Universe } from "@boofchi/contracts";

import { ProductCard } from "@/components/product/product-card";

interface ProductRailProps {
  products: readonly Product[];
  universes: readonly Universe[];
  label: string;
}

export function ProductRail({ products, universes, label }: ProductRailProps) {
  const universeById = new Map(universes.map((universe) => [universe.id, universe]));

  return (
    <div className="product-rail" role="list" aria-label={label} tabIndex={0}>
      {products.map((product) => (
        <div role="listitem" key={product.id}>
          <ProductCard
            product={product}
            universe={product.universeId ? universeById.get(product.universeId) : undefined}
          />
        </div>
      ))}
    </div>
  );
}
