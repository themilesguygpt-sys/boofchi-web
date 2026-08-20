import Image from "next/image";

import { BidiText } from "@/components/bidi-text";
import { CategoryCard } from "@/components/home/category-card";
import { UniverseCard } from "@/components/home/universe-card";
import { ProductRail } from "@/components/product/product-rail";
import { Container } from "@/components/ui/container";
import { ArrowIcon, SparkIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { getHomepageCatalog } from "@/lib/homepage-catalog";

export default async function Home() {
  const catalog = await getHomepageCatalog();
  const universes = catalog.universes.map(({ universe }) => universe);

  return (
    <main id="main-content">
      <section className="hero" aria-labelledby="hero-title">
        <Container className="hero__grid">
          <div className="hero__copy">
            <p className="hero__kicker">
              <span dir="ltr">BOOFCHI / 2026</span>
              <span>کانسپت استور فرهنگ پاپ</span>
            </p>
            <h1 id="hero-title">
              چیزایی که فقط
              <span>«وسیله» نیستن.</span>
            </h1>
            <p className="hero__description">
              از فیگور و دکور تا اکسسوری‌های فندوم‌دار؛ هر چیزی اینجاست تا یه تکه از
              دنیای موردعلاقه‌ت رو بیاره توی زندگی واقعی.
            </p>
            <div className="hero__actions">
              <a className="button button--primary" href="#catalog">
                دیدن محصولات
                <ArrowIcon />
              </a>
              <a className="button button--ghost" href="#universes">
                کشف دنیاها
              </a>
            </div>
            <div className="hero__footnote">
              <span className="status-dot" />
              <span>کالکشن واقعی بوفچی، آماده‌ی کشف</span>
            </div>
          </div>

          <div className="hero-composition" aria-label="منتخبی از محصولات واقعی بوفچی">
            <span className="hero-composition__word" dir="ltr">UNCOMMON</span>
            <span className="hero-composition__grid" aria-hidden="true" />
            {catalog.heroProducts.map((product, index) => {
              const image = product.images.find((item) => item.primary) ?? product.images[0];
              if (!image) return null;

              return (
                <figure className={`hero-product hero-product--${index + 1}`} key={product.id}>
                  <Image
                    src={image.path}
                    alt={index === 0 ? image.alt || product.title.fa : ""}
                    fill
                    sizes={index === 0 ? "(max-width: 767px) 72vw, 36vw" : "(max-width: 767px) 30vw, 15vw"}
                    priority={index === 0}
                  />
                  {index === 0 ? (
                    <figcaption>
                      <span dir="ltr">HERO OBJECT / 01</span>
                      <BidiText dir="auto">{product.title.fa}</BidiText>
                    </figcaption>
                  ) : null}
                </figure>
              );
            })}
            <span className="hero-stamp" aria-hidden="true">
              <SparkIcon />
              <b dir="ltr">BOOFCHI</b>
              <small>برای کلکتورها</small>
            </span>
          </div>
        </Container>
      </section>

      <section className="shortcut-section" id="discovery" aria-labelledby="discovery-title">
        <Container>
          <h2 className="sr-only" id="discovery-title">راه‌های کشف محصولات بوفچی</h2>
          <div className="discovery-shortcuts">
            <a href="#categories" className="discovery-shortcut discovery-shortcut--violet">
              <span className="discovery-shortcut__label">از جنسِ چیزی که می‌خوای</span>
              <strong>چی می‌خوای؟</strong>
              <span className="discovery-shortcut__action">دسته‌بندی محصولات <ArrowIcon /></span>
            </a>
            <a href="#universes" className="discovery-shortcut discovery-shortcut--dark">
              <span className="discovery-shortcut__label">از دل داستان موردعلاقه‌ت</span>
              <strong>دنیات کدومه؟</strong>
              <span className="discovery-shortcut__action">کشف فندوم‌ها <ArrowIcon /></span>
            </a>
          </div>
        </Container>
      </section>

      <section className="content-section" id="catalog" aria-labelledby="featured-title">
        <Container>
          <SectionHeading
            id="featured-title"
            index="01"
            eyebrow="منتخب این ویترین"
            title="انتخاب‌های بوفچی"
            description="یه شروع سریع از بین اشیایی که هرکدوم حال‌وهوای خودشون رو دارن."
          />
          <ProductRail products={catalog.featuredProducts} universes={universes} label="محصولات منتخب بوفچی" />
          <p className="rail-hint">برای دیدن بقیه، به طرفین حرکت کن</p>
        </Container>
      </section>

      <section className="content-section universe-section" id="universes" aria-labelledby="universes-title">
        <Container>
          <SectionHeading
            id="universes-title"
            index="02"
            eyebrow="از قصه وارد شو"
            title="دنیای موردعلاقه‌ت کجاست؟"
            description="هشت دنیای واقعی از همین ویترین؛ بدون دسته‌بندی‌های ساختگی و حدس‌های بی‌پایه."
          />
          <div className="universe-grid">
            {catalog.universes.map(({ universe, product }, index) => (
              <UniverseCard key={universe.id} universe={universe} product={product} index={index} />
            ))}
          </div>
        </Container>
      </section>

      <section className="content-section" id="categories" aria-labelledby="categories-title">
        <Container>
          <SectionHeading
            id="categories-title"
            index="03"
            eyebrow="از خودِ شیء وارد شو"
            title="چی می‌خوای با خودت ببری؟"
            description="چند مسیر جمع‌وجور از دسته‌بندی واقعی محصولات بوفچی؛ برای پیدا کردن چیزی که به فضای تو میاد."
          />
          <div className="category-grid">
            {catalog.categories.map(({ category, product }, index) => (
              <CategoryCard key={category.id} category={category} product={product} index={index} />
            ))}
          </div>
        </Container>
      </section>

      <section className="story-section" id="story" aria-labelledby="story-title">
        <Container className="story-section__grid">
          <div className="story-section__media">
            <Image
              src="/media/brand/store/boofchi-store-1.webp"
              alt="فضای داخلی فروشگاه بوفچی با قفسه‌های محصولات و دکور صنعتی"
              fill
              sizes="(max-width: 767px) 92vw, 58vw"
            />
            <span className="story-section__caption" dir="ltr">BOOFCHI / PHYSICAL SPACE</span>
          </div>
          <div className="story-section__copy">
            <p className="eyebrow">نه فقط یک ویترین آنلاین</p>
            <h2 id="story-title">از بتن و نور قرمز، تا صفحه‌ی موبایل تو.</h2>
            <p>
              بوفچی یه فضای واقعی برای پیدا کردن اشیای شخصیت‌داره؛ این تجربه‌ی دیجیتال هم
              قراره همون حس کشف کردن بین قفسه‌ها رو ادامه بده.
            </p>
            <div className="story-section__tags" aria-label="ویژگی‌های هویت بوفچی">
              <span>اشیای کلکسیونی</span><span>فرهنگ پاپ</span><span>هویت مستقل</span>
            </div>
          </div>
        </Container>
      </section>

      <section className="content-section discovery-products" aria-labelledby="more-title">
        <Container>
          <SectionHeading
            id="more-title"
            index="04"
            eyebrow="یه کم دورتر از انتخاب‌های واضح"
            title="چیزهای جالب این دور"
            description="از فیگور و سردیس تا دکورهای خاص؛ چند انتخاب برای وقتی که دنبال چیز قابل‌پیش‌بینی نیستی."
          />
          <ProductRail products={catalog.discoveryProducts} universes={universes} label="کشف‌های بیشتر از بوفچی" />
        </Container>
      </section>

      <section className="collector-section" id="collector" aria-labelledby="collector-title">
        <Container className="collector-section__inner">
          <div className="collector-section__graphic" aria-hidden="true">
            <span className="collector-orbit collector-orbit--one" />
            <span className="collector-orbit collector-orbit--two" />
            <SparkIcon />
            <strong dir="ltr">YOU / IRL</strong>
          </div>
          <div className="collector-section__copy">
            <span className="badge badge--sale">به‌زودی</span>
            <h2 id="collector-title">کالکشن تو، بخشی از هویت توئه.</h2>
            <p>
              بوفچی قراره جایی باشه برای ساختن لیست علاقه‌مندی، دنبال کردن کالکشن‌ها و
              شکل دادن به پروفایل فندومی خودت—این بخش هنوز در حال ساخته‌شدنه.
            </p>
            <span className="collector-section__signature" dir="ltr">COLLECT / EXPRESS / REPEAT</span>
          </div>
        </Container>
      </section>

      <section className="closing-section" aria-labelledby="closing-title">
        <Container className="closing-section__inner">
          <p dir="ltr">NOT ANOTHER ORDINARY STORE</p>
          <h2 id="closing-title">عادی انتخاب نکن.</h2>
          <a className="button button--primary" href="#catalog">برگشتن به ویترین <ArrowIcon /></a>
        </Container>
      </section>
    </main>
  );
}
