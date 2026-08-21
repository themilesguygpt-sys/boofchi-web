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
            <a href="/shop">همه محصولات</a>
            <a href="/shop?availability=in-stock">محصولات موجود</a>
          </section>
          <section aria-labelledby="footer-discovery">
            <h2 id="footer-discovery">کشف</h2>
            <Link href="/#universes" prefetch={false}>دنیاها</Link>
            <Link href="/#categories" prefetch={false}>دسته‌بندی‌ها</Link>
          </section>
          <section aria-labelledby="footer-about">
            <h2 id="footer-about">بوفچی</h2>
            <Link href="/#story" prefetch={false}>فضای بوفچی</Link>
            <Link href="/#collector" prefetch={false}>کالکشن تو</Link>
          </section>
          <section aria-labelledby="footer-next">
            <h2 id="footer-next">انتخاب‌های تو</h2>
            <a href="/search">جستجو</a>
            <a href="/wishlist">علاقه‌مندی‌ها</a>
            <a href="/cart">سبد خرید</a>
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
