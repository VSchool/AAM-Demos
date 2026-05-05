import { books } from "@/lib/books";
import SearchBar from "@/components/SearchBar";
import ComponentLabel from "@/components/ComponentLabel";

export const metadata = {
  title: "Collection — Bookshelf",
};

export default function BooksPage() {
  return (
    <main className="page-container" style={{ paddingTop: "7rem" }}>
      <div className="section-header">
        <span className="section-label">Full Collection</span>
        <h2>All Books</h2>
        <p>Browse the complete library — search by title or author</p>
      </div>

      <SearchBar books={books} />

      <ComponentLabel
        type="server"
        description="page is a server component; SearchBar is a client component that filters the pre-rendered list"
      />
    </main>
  );
}
