import { books } from "@/lib/books";
import SearchBar from "@/components/SearchBar";
import ComponentLabel from "@/components/ComponentLabel";

export const metadata = {
  title: "All Books — Bookshelf",
};

export default function BooksPage() {
  return (
    <main className="page-container">
      <div className="section-header">
        <h2>All Books</h2>
        <p>Browse the full collection — search by title or author</p>
      </div>

      <SearchBar books={books} />

      <ComponentLabel
        type="server"
        description="page is a server component; SearchBar is a client component that filters the pre-rendered list"
      />
    </main>
  );
}
