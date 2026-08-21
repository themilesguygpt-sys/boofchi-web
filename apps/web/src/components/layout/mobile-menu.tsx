"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { useCommerce } from "@/components/commerce/commerce-provider";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function MobileMenu() {
  const { hydrated, wishlistCount, cartCount } = useCommerce();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const links = [
    { href: "/shop", label: "همه محصولات" },
    { href: "/search", label: "جستجو" },
    { href: "/wishlist", label: `علاقه‌مندی‌ها${hydrated && wishlistCount ? ` (${wishlistCount.toLocaleString("fa-IR")})` : ""}` },
    { href: "/cart", label: `سبد خرید${hydrated && cartCount ? ` (${cartCount.toLocaleString("fa-IR")})` : ""}` },
    { href: "/#universes", label: "دنیاها" },
    { href: "/#categories", label: "دسته‌بندی‌ها" },
    { href: "/#story", label: "خودِ بوفچی" },
  ];

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      const focusableElements = Array.from(
        panel?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
      ).filter(
        (element) =>
          element.getAttribute("aria-hidden") !== "true" &&
          !element.hasAttribute("hidden") &&
          element.getClientRects().length > 0,
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (!panel || !firstElement || !lastElement) {
        event.preventDefault();
        return;
      }

      const focusIsOutside = !panel.contains(document.activeElement);

      if (event.shiftKey && (document.activeElement === firstElement || focusIsOutside)) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && (document.activeElement === lastElement || focusIsOutside)) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="icon-button mobile-menu__trigger"
        aria-label="باز کردن منوی اصلی"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen(true)}
      >
        <MenuIcon />
      </button>

      {open ? (
        <div className="mobile-menu" id="mobile-navigation">
          <button
            type="button"
            className="mobile-menu__backdrop"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setOpen(false)}
          />
          <div
            ref={panelRef}
            className="mobile-menu__panel"
            role="dialog"
            aria-modal="true"
            aria-label="منوی اصلی"
          >
            <div className="mobile-menu__top">
              <span className="brand-mark brand-mark--menu">
                <Image
                  src="/media/brand/boofchi-logo.png"
                  alt="بوفچی"
                  width={200}
                  height={80}
                  sizes="140px"
                />
              </span>
              <button
                ref={closeRef}
                type="button"
                className="icon-button"
                aria-label="بستن منوی اصلی"
                onClick={() => setOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>
            <nav aria-label="پیمایش موبایل">
              <ul className="mobile-menu__links">
                {links.map((link, index) => (
                  <li key={link.href}>
                    <Link href={link.href} onClick={() => setOpen(false)}>
                      <span dir="ltr">{String(index + 1).padStart(2, "0")}</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <p className="mobile-menu__note">حساب کاربری در نسخه نهایی فعال می‌شه.</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
