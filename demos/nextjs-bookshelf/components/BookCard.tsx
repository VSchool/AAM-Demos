import Link from "next/link";
import type { Book } from "@/lib/books";
import FavoriteButton from "./FavoriteButton";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <div className="book-card">
      <div className="book-card-cover">
        <img
          src={book.coverImage}
          alt={book.title}
          loading="lazy"
          className="book-card-cover-img"
        />
      </div>
      <div className="book-card-body">
        <span className="book-card-category">{book.category}</span>
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-author">{book.author}</p>
        <p className="book-card-description">{book.description}</p>
      </div>
      <div className="book-card-footer">
        <span className="book-card-year">{book.year}</span>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <FavoriteButton bookId={book.id} />
          <Link href={`/books/${book.id}`} className="book-card-link">
            Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
