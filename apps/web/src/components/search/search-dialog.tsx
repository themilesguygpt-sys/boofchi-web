"use client";

import type { Money, ProductAvailability } from "@boofchi/contracts";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { MixedTitleText } from "@/components/mixed-title-text";
import { CloseIcon, SearchIcon } from "@/components/ui/icons";
import { formatMoney } from "@/lib/format-money";

interface SearchSuggestion {
  id: string;
  slug: string;
  title: string;
  price: Money;
  availability: ProductAvailability;
  image: { path: string; alt: string } | null;
}

interface SuggestionResponse {
  query: string;
  total: number;
  items: SearchSuggestion[];
}

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function SearchDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
      ).filter((element) => element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [open]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (response.ok) setSuggestions(await response.json() as SuggestionResponse);
      } catch (error) {
        if ((error as Error).name !== "AbortError") setSuggestions(null);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 140);
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  function navigateToSearch() {
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="icon-button"
        aria-label="باز کردن جستجو"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <SearchIcon />
      </button>

      {open ? (
        <div className="search-dialog">
          <button
            type="button"
            className="search-dialog__backdrop"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setOpen(false)}
          />
          <div
            ref={panelRef}
            className="search-dialog__panel"
            role="dialog"
            aria-modal="true"
            aria-label="جستجوی محصولات"
          >
            <div className="search-dialog__top">
              <div>
                <span dir="ltr">BOOFCHI / SEARCH</span>
                <strong>جستجو</strong>
              </div>
              <button
                type="button"
                className="icon-button"
                aria-label="بستن جستجو"
                onClick={() => setOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>

            <form
              className="search-dialog__form"
              action="/search"
              method="get"
              role="search"
              onSubmit={(event) => {
                event.preventDefault();
                navigateToSearch();
              }}
            >
              <label htmlFor="header-search-query">دنبال چی می‌گردی؟</label>
              <div>
                <SearchIcon />
                <input
                  ref={inputRef}
                  id="header-search-query"
                  name="q"
                  type="search"
                  dir="auto"
                  value={query}
                  placeholder="مثلاً Naruto یا هری پاتر"
                  autoComplete="off"
                  onKeyDown={(event) => {
                    if (event.key !== "Enter" || event.nativeEvent.isComposing) return;
                    event.preventDefault();
                    navigateToSearch();
                  }}
                  onChange={(event) => {
                    const nextQuery = event.target.value;
                    setQuery(nextQuery);
                    if (nextQuery.trim().length < 2) {
                      setSuggestions(null);
                      setLoading(false);
                    }
                  }}
                />
                {query ? (
                  <button
                    type="button"
                    aria-label="پاک کردن جستجو"
                    onClick={() => {
                      setQuery("");
                      setSuggestions(null);
                      setLoading(false);
                      inputRef.current?.focus();
                    }}
                  >
                    <CloseIcon />
                  </button>
                ) : null}
              </div>
              <button type="submit" className="sr-only">
                مشاهده نتایج جستجو
              </button>
            </form>

            <div className="search-dialog__content" aria-live="polite">
              {loading ? <p className="search-dialog__hint">داریم می‌گردیم…</p> : null}
              {!loading && query.trim().length < 2 ? (
                <p className="search-dialog__hint">اسم محصول، دنیا یا دسته‌بندی رو بنویس.</p>
              ) : null}
              {!loading && suggestions && !suggestions.items.length ? (
                <div className="search-dialog__empty">
                  <strong>چیزی پیدا نشد.</strong>
                  <span>املای عبارت رو چک کن یا یه چیز دیگه امتحان کن.</span>
                </div>
              ) : null}
              {!loading && suggestions?.items.length ? (
                <>
                  <ul className="search-suggestions">
                    {suggestions.items.map((item) => (
                      <li key={item.id}>
                        <Link href={`/product/${item.slug}`} onClick={() => setOpen(false)}>
                          <span className="search-suggestions__image">
                            {item.image ? (
                              <Image src={item.image.path} alt={item.image.alt} fill sizes="4.5rem" />
                            ) : null}
                          </span>
                          <span className="search-suggestions__copy">
                            <strong><MixedTitleText>{item.title}</MixedTitleText></strong>
                            <small>{item.availability === "in-stock" ? "موجود" : "ناموجود"}</small>
                          </span>
                          <bdi dir="rtl">{formatMoney(item.price)}</bdi>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    className="search-dialog__all"
                    href={`/search?q=${encodeURIComponent(query.trim())}`}
                    onClick={() => setOpen(false)}
                  >
                    دیدن همه {suggestions.total.toLocaleString("fa-IR")} نتیجه
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
