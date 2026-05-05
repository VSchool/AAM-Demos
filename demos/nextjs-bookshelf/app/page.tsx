import Link from "next/link";
import { books } from "@/lib/books";
import BookCard from "@/components/BookCard";
import ComponentLabel from "@/components/ComponentLabel";

// Show 4 featured books on the home page
const featuredBooks = books.slice(0, 4);

export default function HomePage() {
  return (
    <main className="page-container">
      <section className="hero">
        <h1>
          Your <span className="accent">Bookshelf</span> Awaits
        </h1>
        <p>
          Discover essential programming books curated for engineers. Browse,
          search, and save your favorites — all built with Next.js App Router.
        </p>
        <Link href="/books" className="hero-cta">
          Browse All Books
        </Link>
      </section>

      <section>
        <div className="section-header">
          <h2>Featured Books</h2>
          <p>Hand-picked classics every developer should read</p>
        </div>
        <div className="featured-grid">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
        <div style={{ textAlign: "center" }}>
          <Link href="/books" className="hero-cta" style={{ fontSize: "0.9rem", padding: "0.6rem 1.5rem" }}>
            See All 8 Books →
          </Link>
        </div>
      </section>

      <ComponentLabel
        type="server"
        description="data fetched at build time, rendered on the server"
      />
    </main>
  );
}
