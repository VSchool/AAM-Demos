"use client";

import { useState, useEffect } from "react";

interface FavoriteButtonProps {
  bookId: string;
}

export default function FavoriteButton({ bookId }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const favorites = getFavorites();
    setIsFavorited(favorites.includes(bookId));
  }, [bookId]);

  function getFavorites(): string[] {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("bookshelf-favorites");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  function toggleFavorite() {
    const favorites = getFavorites();
    let updated: string[];

    if (favorites.includes(bookId)) {
      updated = favorites.filter((id) => id !== bookId);
    } else {
      updated = [...favorites, bookId];
    }

    localStorage.setItem("bookshelf-favorites", JSON.stringify(updated));
    setIsFavorited(!isFavorited);

    // Dispatch a custom event so the favorites page can react
    window.dispatchEvent(new Event("favorites-changed"));
  }

  return (
    <button
      className={`favorite-btn ${isFavorited ? "favorited" : ""}`}
      onClick={toggleFavorite}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <span className="favorite-btn-icon">{isFavorited ? "♥" : "♡"}</span>
      <span>{isFavorited ? "Saved" : "Save"}</span>
    </button>
  );
}
