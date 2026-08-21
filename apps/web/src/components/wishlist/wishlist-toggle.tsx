"use client";

import { useCommerce } from "@/components/commerce/commerce-provider";
import { HeartIcon } from "@/components/ui/icons";

export function WishlistToggle({
  productId,
  productTitle,
  className = "",
}: {
  productId: string;
  productTitle: string;
  className?: string;
}) {
  const { hydrated, isWishlisted, toggleWishlist } = useCommerce();
  const active = hydrated && isWishlisted(productId);

  return (
    <button
      type="button"
      className={`wishlist-toggle${active ? " is-active" : ""}${className ? ` ${className}` : ""}`}
      aria-label={`${active ? "حذف" : "افزودن"} ${productTitle} ${active ? "از" : "به"} علاقه‌مندی‌ها`}
      aria-pressed={active}
      onClick={() => toggleWishlist(productId)}
    >
      <HeartIcon />
    </button>
  );
}
