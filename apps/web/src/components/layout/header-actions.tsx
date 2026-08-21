"use client";

import { useCommerce } from "@/components/commerce/commerce-provider";
import { SearchDialog } from "@/components/search/search-dialog";
import { BagIcon, HeartIcon, UserIcon } from "@/components/ui/icons";

export function HeaderActions() {
  const { hydrated, wishlistCount, cartCount } = useCommerce();

  return (
    <div className="header-actions" aria-label="ابزارهای فروشگاه">
      <SearchDialog />
      <a className="icon-button desktop-only" href="/wishlist" aria-label={`علاقه‌مندی‌ها${hydrated ? `، ${wishlistCount.toLocaleString("fa-IR")} محصول` : ""}`}>
        <HeartIcon />
        {hydrated && wishlistCount ? <span className="header-count">{wishlistCount.toLocaleString("fa-IR")}</span> : null}
      </a>
      <a className="icon-button desktop-only" href="/cart" aria-label={`سبد خرید${hydrated ? `، ${cartCount.toLocaleString("fa-IR")} محصول` : ""}`}>
        <BagIcon />
        {hydrated && cartCount ? <span className="header-count">{cartCount.toLocaleString("fa-IR")}</span> : null}
      </a>
      <button className="icon-button desktop-only" type="button" disabled title="حساب کاربری؛ به‌زودی">
        <span className="sr-only">حساب کاربری؛ به‌زودی</span>
        <UserIcon />
      </button>
    </div>
  );
}
