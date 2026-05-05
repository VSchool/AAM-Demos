"use client";

import { useState } from "react";
import type { Book } from "@/lib/books";
import BookCard from "./BookCard";

interface SearchBarProps {
  books: Book[];
}

export default function SearchBar({ books }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? books.filter(
        (book) =>
          book.title.toLowerCase().includes(query.toLowerCase()) ||
          book.author.toLowerCase().includes(query.toLowerCase())
      )
    : books;

  return (
    <>
      <div className="search-container">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by title or author..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="book-grid">
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <div className="no-results-icon">📖</div>
          <p>No books found matching &ldquo;{query}&rdquo;</p>
        </div>
      )}
    </>
  );
}
