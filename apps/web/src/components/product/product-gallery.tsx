"use client";

import type { ProductImage } from "@boofchi/contracts";
import Image from "next/image";
import { useState } from "react";

interface ProductGalleryProps {
  images: readonly ProductImage[];
  productTitle: string;
}

export function ProductGallery({ images, productTitle }: ProductGalleryProps) {
  const [selectedId, setSelectedId] = useState(
    images.find((image) => image.primary)?.id ?? images[0]?.id,
  );
  const selected = images.find((image) => image.id === selectedId) ?? images[0];
  if (!selected) return null;

  return (
    <div className="product-gallery">
      <div className="product-gallery__primary">
        <Image
          key={selected.id}
          src={selected.path}
          alt={selected.alt || productTitle}
          fill
          priority
          sizes="(max-width: 767px) 92vw, (max-width: 1199px) 52vw, 45vw"
        />
      </div>
      {images.length > 1 ? (
        <div className="product-gallery__thumbs" aria-label="تصاویر محصول">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              className={image.id === selected.id ? "is-selected" : undefined}
              aria-label={`نمایش تصویر ${(index + 1).toLocaleString("fa-IR")} از ${productTitle}`}
              aria-pressed={image.id === selected.id}
              onClick={() => setSelectedId(image.id)}
            >
              <Image src={image.path} alt="" fill sizes="6rem" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
