import Image from "next/image";
import Link from "next/link";

import { MobileMenu } from "@/components/layout/mobile-menu";
import { BagIcon, HeartIcon, SearchIcon, UserIcon } from "@/components/ui/icons";

const navigation = [
  { href: "/shop", label: "همه محصولات" },
  { href: "/#universes", label: "دنیاها" },
  { href: "/#categories", label: "چی می‌خوای؟" },
  { href: "/#story", label: "خودِ بوفچی" },
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="utility-strip">
        <p>برای کسایی که معمولی انتخاب نمی‌کنن.</p>
        <span dir="ltr">BOOFCHI / CONCEPT STORE</span>
      </div>

      <div className="site-header__bar site-container">
        <div className="site-header__mobile-action">
          <MobileMenu />
        </div>

        <Link className="brand-mark" href="/" aria-label="صفحه اصلی بوفچی">
          <Image
            src="/media/brand/boofchi-logo.png"
            alt="بوفچی"
            width={200}
            height={80}
            sizes="(max-width: 767px) 112px, 140px"
            priority
          />
        </Link>

        <nav className="desktop-navigation" aria-label="پیمایش اصلی">
          <ul>
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions" aria-label="ابزارهای فروشگاه">
          <Link className="icon-button" href="/shop" aria-label="رفتن به محصولات">
            <SearchIcon />
          </Link>
          <button className="icon-button desktop-only" type="button" disabled title="علاقه‌مندی‌ها؛ به‌زودی">
            <span className="sr-only">علاقه‌مندی‌ها؛ به‌زودی</span>
            <HeartIcon />
          </button>
          <button className="icon-button desktop-only" type="button" disabled title="سبد خرید؛ به‌زودی">
            <span className="sr-only">سبد خرید؛ به‌زودی</span>
            <BagIcon />
          </button>
          <button className="icon-button desktop-only" type="button" disabled title="حساب کاربری؛ به‌زودی">
            <span className="sr-only">حساب کاربری؛ به‌زودی</span>
            <UserIcon />
          </button>
        </div>
      </div>
    </header>
  );
}
