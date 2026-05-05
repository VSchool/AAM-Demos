import Link from "next/link";
import { books } from "@/lib/books";
import BookCard from "@/components/BookCard";
import ComponentLabel from "@/components/ComponentLabel";

// Show 4 featured books on the home page
const featuredBooks = books.slice(0, 4);

// Derive some stats
const categories = new Set(books.map((b) => b.category));

export default function HomePage() {
  return (
    <main>
      <section className="hero-banner">
        <img
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1400&h=800&fit=crop&q=80"
          alt="Grand library interior with rows of illuminated bookshelves"
          className="hero-banner-bg"
          loading="eager"
        />
        <div className="hero-banner-overlay" />
        <div className="hero-banner-content">
          <span className="hero-eyebrow">Curated for Engineers</span>
          <h1>
            Build Your <span className="accent">Library</span>
          </h1>
          <p>
            A carefully curated collection of the most influential programming
            books — the ones that change how you think about code.
          </p>
          <Link href="/books" className="hero-cta">
            Explore the Collection
          </Link>
        </div>
      </section>

      <div className="page-container">
        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-number">{books.length}</span>
            <span className="stat-label">Books</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{categories.size}</span>
            <span className="stat-label">Categories</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {Math.min(...books.map((b) => b.year))}
            </span>
            <span className="stat-label">Earliest</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {Math.max(...books.map((b) => b.year))}
            </span>
            <span className="stat-label">Latest</span>
          </div>
        </div>

        <section className="featured-section">
          <div className="section-header">
            <span className="section-label">Handpicked</span>
            <h2>Featured Books</h2>
            <p>Classics every developer should read at least once</p>
          </div>
          <div className="featured-grid">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          <div className="browse-cta-wrapper">
            <Link href="/books" className="hero-cta">
              View All {books.length} Books
            </Link>
          </div>
        </section>

        <section className="featured-callout">
          <img
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1400&h=600&fit=crop&q=80"
            alt="Warm library reading room with natural light"
            className="featured-callout-bg"
            loading="lazy"
          />
          <div className="featured-callout-overlay" />
          <div className="featured-callout-content">
            <blockquote>
              &ldquo;A reader lives a thousand lives before he dies. The man who
              never reads lives only one.&rdquo;
            </blockquote>
            <cite>George R.R. Martin</cite>
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
