"use client";

import type { ReactNode } from "react";
import { useRef } from "react";

import { ArrowIcon } from "@/components/ui/icons";

interface ProductRailControlsProps {
  children: ReactNode;
  label: string;
}

export function ProductRailControls({ children, label }: ProductRailControlsProps) {
  const railRef = useRef<HTMLDivElement>(null);

  function move(direction: 1 | -1) {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * rail.clientWidth * 0.78, behavior: "smooth" });
  }

  return (
    <div className="product-rail-shell">
      <div className="product-rail__controls" aria-label={`کنترل ${label}`}>
        <button type="button" aria-label="محصولات قبلی" onClick={() => move(1)}>
          <ArrowIcon />
        </button>
        <button type="button" aria-label="محصولات بعدی" onClick={() => move(-1)}>
          <ArrowIcon />
        </button>
      </div>
      <div ref={railRef} className="product-rail" role="list" aria-label={label} tabIndex={0}>
        {children}
      </div>
    </div>
  );
}
