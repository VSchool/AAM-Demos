"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { Item } from "@/lib/items";

interface Props {
  items: Item[];
}

export function ItemGrid({ items }: Props) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  if (!loaded) {
    return (
      <div className="item-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div className="skeleton-card" key={i}>
            <div className="skeleton-image skeleton" />
            <div className="skeleton-card-body">
              <div className="skeleton-line skeleton-line-medium skeleton" />
              <div className="skeleton-badge skeleton" />
              <div className="skeleton-line skeleton-line-full skeleton" />
              <div className="skeleton-line skeleton-line-short skeleton" />
              <div className="skeleton-footer">
                <div className="skeleton-tag skeleton" />
                <div className="skeleton-tag skeleton" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="item-grid">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/items/${item.id}`}
          className="item-card"
        >
          <div className="item-card-image-wrap">
            <img
              src={item.image}
              alt={item.name}
              className="item-card-image"
              loading="lazy"
            />
          </div>
          <div className="item-card-body">
            <div className="item-card-header">
              <span className="item-card-name">{item.name}</span>
              <span className="item-card-price">${item.price}</span>
            </div>
            <span className="item-card-category">{item.category}</span>
            <p className="item-card-desc">{item.description}</p>
            <div className="item-card-footer">
              <span
                className="stock-badge"
                data-stock={item.inStock.toString()}
              >
                {item.inStock ? "In Stock" : "Out of Stock"}
              </span>
              <span className="view-link">View details &rarr;</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
