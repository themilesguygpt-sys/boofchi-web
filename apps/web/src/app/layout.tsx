import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { CommerceProvider } from "@/components/commerce/commerce-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import demoProductIds from "@/data/demo/product-ids.json";
import { getSiteUrl } from "@/lib/site";

import "./globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "بوفچی | کانسپت استور فرهنگ پاپ",
    template: "%s | Boofchi",
  },
  description:
    "فروشگاه بوفچی برای کشف اکسسوری، دکور، فیگور و اشیای کلکسیونی از دنیای بازی، انیمه و فرهنگ پاپ.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: "/",
    siteName: "Boofchi",
    title: "بوفچی | چیزهایی که فقط وسیله نیستن",
    description: "اکسسوری، دکور، فیگور و اشیای کلکسیونی برای آدم‌های فندوم‌دار.",
    images: [
      {
        url: "/media/brand/store/boofchi-store-1.webp",
        width: 1600,
        height: 900,
        alt: "فضای فروشگاه بوفچی",
      },
    ],
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0B0B10",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <a className="skip-link" href="#main-content">
          رفتن به محتوای اصلی
        </a>
        <CommerceProvider validProductIds={demoProductIds}>
          <SiteHeader />
          {children}
          <SiteFooter />
        </CommerceProvider>
      </body>
    </html>
  );
}
