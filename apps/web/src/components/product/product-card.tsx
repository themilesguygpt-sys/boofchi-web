import type { Product, Universe } from "@boofchi/contracts";
import Image from "next/image";
import Link from "next/link";

import { BidiText } from "@/components/bidi-text";
import { MixedTitleText } from "@/components/mixed-title-text";
import { WishlistToggle } from "@/components/wishlist/wishlist-toggle";
import { formatMoney } from "@/lib/format-money";

interface ProductCardProps {
  product: Product;
  universe?: Universe;
}

export function ProductCard({ product, universe }: ProductCardProps) {
  const image = product.images.find((item) => item.primary) ?? product.images[0];
  const hasSale =
    product.regularPrice &&
    product.regularPrice.amount > product.price.amount &&
    product.price.amount > 0;

  return (
    <article className="product-card">
      <WishlistToggle productId={product.id} productTitle={product.title.fa} />
      <Link className="product-card__link" href={`/product/${product.slug}`}>
        <div className="product-card__media">
          {image ? (
            <Image
              src={image.path}
              alt={image.alt || product.title.fa}
              fill
              sizes="(max-width: 479px) 46vw, (max-width: 767px) 46vw, (max-width: 1199px) 30vw, 22vw"
            />
          ) : null}
          <div className="product-card__badges">
            {hasSale ? <span className="badge badge--sale">قیمت ویژه</span> : null}
            {product.availability === "out-of-stock" ? (
              <span className="badge badge--muted">ناموجود</span>
            ) : null}
          </div>
        </div>

        <div className="product-card__body">
          <div className="product-card__meta">
            {universe ? <BidiText dir="ltr">{universe.name.en ?? universe.name.fa}</BidiText> : <span>BOOFCHI PICK</span>}
            <span>{product.availability === "in-stock" ? "موجود" : "ناموجود"}</span>
          </div>
          <h3>
            <MixedTitleText>{product.title.fa}</MixedTitleText>
          </h3>
          <div className="product-card__price">
            {hasSale && product.regularPrice ? (
              <del>
                <BidiText dir="rtl">{formatMoney(product.regularPrice)}</BidiText>
              </del>
            ) : null}
            {product.price.amount > 0 ? (
              <strong>
                <BidiText dir="rtl">{formatMoney(product.price)}</BidiText>
              </strong>
            ) : (
              <strong>قیمت در فروشگاه</strong>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
