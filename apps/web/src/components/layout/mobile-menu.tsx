"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { CloseIcon, MenuIcon } from "@/components/ui/icons";

const links = [
  { href: "/#catalog", label: "منتخب بوفچی" },
  { href: "/#universes", label: "دنیاها" },
  { href: "/#categories", label: "دسته‌بندی‌ها" },
  { href: "/#story", label: "قصه‌ی بوفچی" },
] as const;

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
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
            aria-label="بستن منوی اصلی"
            onClick={() => setOpen(false)}
          />
          <div className="mobile-menu__panel" role="dialog" aria-modal="true" aria-label="منوی اصلی">
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
                      <span dir="ltr">0{index + 1}</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <p className="mobile-menu__note">
              جست‌وجو، سبد خرید و پروفایل در مرحله‌ی بعدی فروشگاه فعال می‌شوند.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
