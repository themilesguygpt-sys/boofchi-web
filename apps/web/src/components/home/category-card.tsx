import type { Category, Product } from "@boofchi/contracts";
import Image from "next/image";
import Link from "next/link";

import { BidiText } from "@/components/bidi-text";
import { ArrowIcon } from "@/components/ui/icons";

interface CategoryCardProps {
  category: Category;
  product: Product;
  index: number;
}

export function CategoryCard({ category, product, index }: CategoryCardProps) {
  const image = product.images.find((item) => item.primary) ?? product.images[0];

  return (
    <Link className="category-card" href={`/category/${category.slug}`} aria-label={`دیدن ${category.name.fa}`}>
      <span className="category-card__number" dir="ltr">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="category-card__image">
        {image ? (
          <Image
            src={image.path}
            alt=""
            fill
            sizes="(max-width: 767px) 34vw, (max-width: 1199px) 20vw, 14vw"
          />
        ) : null}
      </div>
      <div className="category-card__label">
        <span>
          <BidiText dir="auto">{category.name.fa}</BidiText>
        </span>
        <ArrowIcon />
      </div>
    </Link>
  );
}
