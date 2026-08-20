"use client";

import type { ProductSort } from "@boofchi/contracts";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { sortOptions } from "@/lib/catalog-browse";

export function SortSelect({ value }: { value: ProductSort }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  return (
    <label className="sort-control">
      <span>مرتب‌سازی</span>
      <select
        value={value}
        disabled={pending}
        onChange={(event) => {
          const params = new URLSearchParams(searchParams.toString());
          if (event.target.value === "default") params.delete("sort");
          else params.set("sort", event.target.value);
          startTransition(() => router.push(`${pathname}${params.size ? `?${params}` : ""}`));
        }}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
