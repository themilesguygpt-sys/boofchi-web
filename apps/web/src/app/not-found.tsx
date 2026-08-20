import Link from "next/link";

import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <main id="main-content" className="not-found-page">
      <Container>
        <p dir="ltr">404 / NOT FOUND</p>
        <h1>اینجا چیزی پیدا نشد.</h1>
        <p>آدرس رو دوباره چک کن یا برگرد به ویترین.</p>
        <div>
          <Link className="button button--primary" href="/shop">دیدن محصولات</Link>
          <Link className="button button--ghost" href="/">صفحه اصلی</Link>
        </div>
      </Container>
    </main>
  );
}
