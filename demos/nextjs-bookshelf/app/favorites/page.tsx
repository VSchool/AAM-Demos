"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { books } from "@/lib/books";
import BookCard from "@/components/BookCard";
import ComponentLabel from "@/components/ComponentLabel";

export default function FavoritesPage() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadFavorites();

    // Listen for favorite changes from FavoriteButton
    function handleChange() {
      loadFavorites();
    }

    window.addEventListener("favorites-changed", handleChange);
    return () => window.removeEventListener("favorites-changed", handleChange);
  }, []);

  function loadFavorites() {
    try {
      const stored = localStorage.getItem("bookshelf-favorites");
      setFavoriteIds(stored ? JSON.parse(stored) : []);
    } catch {
      setFavoriteIds([]);
    }
  }

  // Prevent hydration mismatch — render nothing until client-mounted
  if (!mounted) {
    return (
      <main className="page-container" style={{ paddingTop: "7rem" }}>
        <div className="section-header">
          <span className="section-label">Your Library</span>
          <h2>Favorites</h2>
          <p>Loading your saved books...</p>
        </div>
      </main>
    );
  }

  const favoriteBooks = books.filter((book) => favoriteIds.includes(book.id));

  return (
    <main className="page-container" style={{ paddingTop: "7rem" }}>
      <div className="section-header">
        <span className="section-label">Your Library</span>
        <h2>Favorites</h2>
        <p>
          {favoriteBooks.length > 0
            ? `You've saved ${favoriteBooks.length} book${favoriteBooks.length === 1 ? "" : "s"}`
            : "Books you save will appear here"}
        </p>
      </div>

      {favoriteBooks.length > 0 ? (
        <div className="book-grid">
          {favoriteBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="favorites-empty">
          <div className="favorites-empty-icon">📖</div>
          <h2>No favorites yet</h2>
          <p>
            Click the heart icon on any book to save it to your favorites list.
            Your selections are stored in localStorage.
          </p>
          <Link href="/books" className="favorites-cta">
            Browse Collection
          </Link>
        </div>
      )}

      <ComponentLabel
        type="client"
        description="uses localStorage to persist favorites — no server required"
      />
    </main>
  );
}
