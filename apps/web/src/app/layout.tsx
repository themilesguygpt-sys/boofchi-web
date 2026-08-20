import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { getSiteUrl } from "@/lib/site";

import "./globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Boofchi | زیرساخت فروشگاه",
    template: "%s | Boofchi",
  },
  description: "زیرساخت فنی فروشگاه فارسی Boofchi برای تجربه‌ای سریع، مدرن و دسترس‌پذیر.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: "/",
    siteName: "Boofchi",
    title: "Boofchi | زیرساخت فروشگاه",
    description: "زیرساخت فنی فروشگاه فارسی Boofchi.",
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
      <body>{children}</body>
    </html>
  );
}
