import { BidiText } from "@/components/bidi-text";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-5 py-16 sm:px-8 lg:px-12">
      <section
        id="foundation"
        aria-labelledby="foundation-title"
        className="w-full rounded-[var(--radius-large)] border border-border bg-surface p-6 shadow-[var(--shadow-raised)] sm:p-10 lg:p-14"
      >
        <p className="mb-4 text-sm font-semibold tracking-wide text-primary-glow">
          BOOFCHI — Neon Concrete
        </p>

        <h1
          id="foundation-title"
          className="max-w-3xl text-[length:var(--text-h1)] font-black leading-[1.35] text-text-primary"
        >
          زیرساخت فروشگاه <BidiText dir="ltr">Boofchi</BidiText> آماده توسعه است.
        </h1>

        <p className="mt-5 max-w-2xl text-text-secondary">
          این پایه با <BidiText dir="ltr">Next.js</BidiText>، معماری سرورمحور و پشتیبانی
          اصولی از متن‌های ترکیبی فارسی و انگلیسی ساخته شده است.
        </p>

        <a
          href="#token-sample"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-[var(--radius-medium)] bg-primary px-6 py-3 font-semibold text-white transition-[background-color,transform] duration-[var(--duration-normal)] ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:bg-primary-deep"
        >
          بررسی پایه طراحی
        </a>

        <div
          id="token-sample"
          aria-label="نمونه رنگ‌های پایه طراحی"
          className="mt-10 grid gap-3 border-t border-border pt-6 sm:grid-cols-3"
        >
          <div className="rounded-[var(--radius-medium)] bg-primary p-4 text-sm font-semibold text-white">
            تعامل اصلی
          </div>
          <div className="rounded-[var(--radius-medium)] bg-surface-elevated p-4 text-sm text-text-primary">
            سطح مرتفع
          </div>
          <div className="rounded-[var(--radius-medium)] border border-signature/50 bg-background p-4 text-sm text-text-secondary">
            امضای Boofchi
          </div>
        </div>
      </section>
    </main>
  );
}
