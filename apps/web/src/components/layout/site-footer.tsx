import Image from "next/image";
import Link from "next/link";

import { BidiText } from "@/components/bidi-text";
import { Container } from "@/components/ui/container";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="site-footer__lead">
          <div>
            <span className="brand-mark brand-mark--footer">
              <Image
                src="/media/brand/boofchi-logo.png"
                alt="بوفچی"
                width={200}
                height={80}
                sizes="150px"
              />
            </span>
            <p>فیگور، دکور و چیزایی از دنیای موردعلاقه‌ت.</p>
          </div>
          <p className="site-footer__statement">
            <BidiText dir="ltr">Stay uncommon.</BidiText>
          </p>
        </div>

        <div className="site-footer__grid">
          <section aria-labelledby="footer-shop">
            <h2 id="footer-shop">فروشگاه</h2>
            <Link href="/shop">همه محصولات</Link>
            <Link href="/shop?availability=in-stock">محصولات موجود</Link>
          </section>
          <section aria-labelledby="footer-discovery">
            <h2 id="footer-discovery">کشف</h2>
            <Link href="/#universes">دنیاها</Link>
            <Link href="/#categories">دسته‌بندی‌ها</Link>
          </section>
          <section aria-labelledby="footer-about">
            <h2 id="footer-about">بوفچی</h2>
            <Link href="/#story">فضای بوفچی</Link>
            <Link href="/#collector">کالکشن تو</Link>
          </section>
          <section aria-labelledby="footer-next">
            <h2 id="footer-next">انتخاب‌های تو</h2>
            <Link href="/search">جستجو</Link>
            <Link href="/wishlist">علاقه‌مندی‌ها</Link>
            <Link href="/cart">سبد خرید</Link>
          </section>
        </div>

        <div className="site-footer__bottom">
          <p>© ۲۰۲۶ بوفچی</p>
          <p dir="ltr">NEON CONCRETE / IR</p>
        </div>
      </Container>
    </footer>
  );
}
