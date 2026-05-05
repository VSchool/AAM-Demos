import Link from "next/link";
import { notFound } from "next/navigation";
import { books, getBookById } from "@/lib/books";
import FavoriteButton from "@/components/FavoriteButton";
import ComponentLabel from "@/components/ComponentLabel";

// Generate static pages for all book IDs at build time
export function generateStaticParams() {
  return books.map((book) => ({
    id: book.id,
  }));
}

export function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  // For static export, we can use a sync approach with the book data
  // But since Next.js 15+ params are async, we return a basic title
  return {
    title: "Book Details — Bookshelf",
  };
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = getBookById(id);

  if (!book) {
    notFound();
  }

  return (
    <main className="page-container">
      <div className="book-detail">
        <Link href="/books" className="back-link">
          ← Back to all books
        </Link>

        <div className="book-detail-header">
          <div
            className="book-detail-cover"
            style={{ backgroundColor: book.coverColor }}
          >
            <div className="book-detail-cover-title">{book.title}</div>
          </div>

          <div className="book-detail-info">
            <h1>{book.title}</h1>
            <p className="book-detail-author">by {book.author}</p>

            <div className="book-detail-meta">
              <span className="book-detail-tag category">{book.category}</span>
              <span className="book-detail-tag year">{book.year}</span>
            </div>

            <p className="book-detail-description">{book.description}</p>

            <div className="book-detail-actions">
              <FavoriteButton bookId={book.id} />
            </div>
          </div>
        </div>

        <ComponentLabel
          type="server"
          description={`static page generated at build time via generateStaticParams — route: /books/${book.id}`}
        />
      </div>
    </main>
  );
}
