import Link from "next/link";
import { books } from "@/lib/books";
import BookCard from "@/components/BookCard";
import ComponentLabel from "@/components/ComponentLabel";

// Show 4 featured books on the home page
const featuredBooks = books.slice(0, 4);

export default function HomePage() {
  return (
    <main>
      <section className="hero-banner">
        <img
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1600&h=600&q=80&fit=crop"
          alt="Library with bookshelves"
          className="hero-banner-bg"
          loading="eager"
        />
        <div className="hero-banner-overlay" />
        <div className="hero-banner-content">
          <h1>
            Your <span className="accent">Bookshelf</span> Awaits
          </h1>
          <p>
            Discover essential programming books curated for engineers. Browse,
            search, and save your favorites.
          </p>
          <Link href="/books" className="hero-cta">
            Browse All Books
          </Link>
        </div>
      </section>

      <div className="page-container">

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
      </div>
    </main>
  );
}
