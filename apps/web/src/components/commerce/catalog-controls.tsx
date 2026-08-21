"use client";

import type {
  AvailabilityFilterOption,
  CategoryFilterOption,
  ProductSort,
  UniverseFilterOption,
} from "@boofchi/contracts";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { SortSelect } from "@/components/commerce/sort-select";
import { CloseIcon } from "@/components/ui/icons";
import { normalizeSearchText } from "@/lib/search-normalize";

interface CatalogControlsProps {
  categories: readonly CategoryFilterOption[];
  universes: readonly UniverseFilterOption[];
  availability: readonly AvailabilityFilterOption[];
  current: {
    categorySlug?: string;
    universeSlug?: string;
    availability?: string;
    sort: ProductSort;
  };
  resultCount: number;
}

const availabilityLabels = {
  "in-stock": "موجود",
  "out-of-stock": "ناموجود",
  unknown: "وضعیت نامشخص",
} as const;

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function filterHref(
  current: CatalogControlsProps["current"],
  key: "category" | "universe" | "availability",
  value: string,
): string {
  const params = new URLSearchParams();
  if (current.categorySlug) params.set("category", current.categorySlug);
  if (current.universeSlug) params.set("universe", current.universeSlug);
  if (current.availability) params.set("availability", current.availability);
  if (current.sort !== "default") params.set("sort", current.sort);

  if (params.get(key) === value) params.delete(key);
  else params.set(key, value);
  return `/shop${params.size ? `?${params}` : ""}`;
}

function FilterPanel({
  categories,
  universes,
  availability,
  current,
  onNavigate,
}: Omit<CatalogControlsProps, "resultCount"> & { onNavigate?: () => void }) {
  const [categoryQuery, setCategoryQuery] = useState("");
  const normalizedCategoryQuery = normalizeSearchText(categoryQuery);
  const visibleCategories = normalizedCategoryQuery
    ? categories.filter(({ category }) =>
        normalizeSearchText([category.name.fa, category.name.en].filter(Boolean).join(" "))
          .includes(normalizedCategoryQuery),
      )
    : categories;

  return (
    <div className="filter-panel">
      <section className="filter-group" aria-labelledby="filter-category-title">
        <h2 id="filter-category-title">دسته‌بندی</h2>
        <label className="filter-option-search">
          <span>جستجو در دسته‌بندی‌ها</span>
          <input
            type="search"
            dir="auto"
            value={categoryQuery}
            placeholder="اسم دسته‌بندی"
            autoComplete="off"
            onChange={(event) => setCategoryQuery(event.target.value)}
          />
        </label>
        <div className="filter-options filter-options--scroll" aria-live="polite">
          {visibleCategories.map(({ category, count }) => {
            const selected = current.categorySlug === category.slug;
            return (
              <Link
                key={category.id}
                href={filterHref(current, "category", category.slug)}
                className={selected ? "is-selected" : undefined}
                aria-current={selected ? "true" : undefined}
                onClick={onNavigate}
              >
                <bdi dir="auto">{category.name.fa}</bdi>
                <span>{count.toLocaleString("fa-IR")}</span>
              </Link>
            );
          })}
          {!visibleCategories.length ? (
            <p className="filter-options__empty">هیچ دسته‌ای با این عبارت پیدا نشد.</p>
          ) : null}
        </div>
      </section>

      <section className="filter-group" aria-labelledby="filter-universe-title">
        <h2 id="filter-universe-title">دنیا</h2>
        <div className="filter-options">
          {universes.map(({ universe, count }) => {
            const selected = current.universeSlug === universe.slug;
            return (
              <Link
                key={universe.id}
                href={filterHref(current, "universe", universe.slug)}
                className={selected ? "is-selected" : undefined}
                aria-current={selected ? "true" : undefined}
                onClick={onNavigate}
              >
                <bdi dir="ltr">{universe.name.en ?? universe.name.fa}</bdi>
                <span>{count.toLocaleString("fa-IR")}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="filter-group" aria-labelledby="filter-availability-title">
        <h2 id="filter-availability-title">موجودی</h2>
        <div className="filter-options">
          {availability.map((option) => {
            const selected = current.availability === option.availability;
            return (
              <Link
                key={option.availability}
                href={filterHref(current, "availability", option.availability)}
                className={selected ? "is-selected" : undefined}
                aria-current={selected ? "true" : undefined}
                onClick={onNavigate}
              >
                {availabilityLabels[option.availability]}
                <span>{option.count.toLocaleString("fa-IR")}</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export function CatalogControls(props: CatalogControlsProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const appliedCount = [
    props.current.categorySlug,
    props.current.universeSlug,
    props.current.availability,
  ].filter(Boolean).length;

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

  return (
    <>
      <aside className="catalog-sidebar" aria-label="فیلتر محصولات">
        <div className="catalog-sidebar__top">
          <strong>فیلترها</strong>
          {appliedCount ? <Link href="/shop">پاک کردن</Link> : null}
        </div>
        <FilterPanel {...props} />
      </aside>

      <div className="catalog-toolbar">
        <button
          ref={triggerRef}
          type="button"
          className="filter-trigger"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          فیلترها
          {appliedCount ? <span>{appliedCount.toLocaleString("fa-IR")}</span> : null}
        </button>
        <SortSelect value={props.current.sort} />
      </div>

      {open ? (
        <div className="filter-dialog">
          <button
            type="button"
            className="filter-dialog__backdrop"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setOpen(false)}
          />
          <div
            ref={panelRef}
            className="filter-dialog__panel"
            role="dialog"
            aria-modal="true"
            aria-label="فیلتر محصولات"
          >
            <div className="filter-dialog__header">
              <div>
                <strong>فیلترها</strong>
                <span>{props.resultCount.toLocaleString("fa-IR")} محصول</span>
              </div>
              <button
                ref={closeRef}
                type="button"
                className="icon-button"
                aria-label="بستن فیلترها"
                onClick={() => setOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>
            <FilterPanel {...props} onNavigate={() => setOpen(false)} />
            <div className="filter-dialog__footer">
              {appliedCount ? <Link href="/shop">پاک کردن فیلترها</Link> : <span />}
              <button type="button" className="button button--primary" onClick={() => setOpen(false)}>
                دیدن {props.resultCount.toLocaleString("fa-IR")} محصول
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
