import type { Product, Universe } from "@boofchi/contracts";
import Image from "next/image";

import { BidiText } from "@/components/bidi-text";

interface UniverseCardProps {
  universe: Universe;
  product: Product;
  index: number;
}

export function UniverseCard({ universe, product, index }: UniverseCardProps) {
  const image = product.images.find((item) => item.primary) ?? product.images[0];

  return (
    <a className="universe-card" href={`/universe/${universe.slug}`} aria-label={`کشف دنیای ${universe.name.fa}`}>
      {image ? (
        <Image
          src={image.path}
          alt=""
          fill
          sizes="(max-width: 639px) 78vw, (max-width: 1023px) 42vw, 25vw"
        />
      ) : null}
      <span className="universe-card__scrim" />
      <span className="universe-card__index" dir="ltr">
        WORLD / {String(index + 1).padStart(2, "0")}
      </span>
      <span className="universe-card__name">
        <BidiText dir="ltr">{universe.name.en ?? universe.name.fa}</BidiText>
      </span>
      <span className="universe-card__action">کشف این دنیا</span>
    </a>
  );
}
