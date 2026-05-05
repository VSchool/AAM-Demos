"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import type { Item } from "@/lib/items";
import { ItemGrid } from "./ItemGrid";

function ItemsInner({ items }: { items: Item[] }) {
  const searchParams = useSearchParams();
  const simulateError = searchParams.get("simulate") === "error";

  if (simulateError) {
    throw new Error("Simulated network error: failed to fetch items.");
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Items</h1>
        <p className="page-subtitle">
          {items.length} products &mdash;{" "}
          <Link
            href="/items?simulate=error"
            style={{ color: "var(--error)", textDecoration: "underline" }}
          >
            simulate error
          </Link>
        </p>
      </div>
      <ItemGrid items={items} />
    </>
  );
}

export function ItemsContent({ items }: { items: Item[] }) {
  return (
    <Suspense>
      <ItemsInner items={items} />
    </Suspense>
  );
}
