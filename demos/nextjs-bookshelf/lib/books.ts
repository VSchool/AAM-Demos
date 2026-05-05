export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  year: number;
  coverColor: string;
}

export const books: Book[] = [
  {
    id: "pragmatic-programmer",
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt & David Thomas",
    description:
      "A timeless guide to software craftsmanship that covers everything from personal responsibility to architecture. It introduced concepts like DRY (Don't Repeat Yourself) and the Broken Window Theory to the programming world.",
    category: "Software Engineering",
    year: 1999,
    coverColor: "#4A90D9",
  },
  {
    id: "clean-code",
    title: "Clean Code",
    author: "Robert C. Martin",
    description:
      "A handbook of agile software craftsmanship focused on writing readable, maintainable code. Martin walks through real-world examples of messy code and demonstrates step-by-step how to refactor it into clean, professional-quality software.",
    category: "Software Engineering",
    year: 2008,
    coverColor: "#E74C3C",
  },
  {
    id: "designing-data-intensive-applications",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    description:
      "A deep dive into the architecture of systems that handle large volumes of data. Kleppmann covers databases, stream processing, and distributed systems with remarkable clarity, making complex infrastructure concepts accessible.",
    category: "Systems Design",
    year: 2017,
    coverColor: "#2ECC71",
  },
  {
    id: "you-dont-know-js",
    title: "You Don't Know JS",
    author: "Kyle Simpson",
    description:
      "A series that digs into the core mechanisms of JavaScript, covering scope, closures, prototypes, and async patterns. Simpson challenges developers to move beyond surface-level understanding and truly master the language.",
    category: "JavaScript",
    year: 2014,
    coverColor: "#F1C40F",
  },
  {
    id: "refactoring",
    title: "Refactoring",
    author: "Martin Fowler",
    description:
      "The definitive guide to improving the design of existing code without changing its behavior. Fowler provides a catalog of refactoring techniques with clear motivations, mechanics, and examples for each transformation.",
    category: "Software Engineering",
    year: 2018,
    coverColor: "#9B59B6",
  },
  {
    id: "system-design-interview",
    title: "System Design Interview",
    author: "Alex Xu",
    description:
      "A practical guide to tackling system design questions with a step-by-step framework. Each chapter walks through designing a real system like a rate limiter, URL shortener, or chat application from scratch.",
    category: "Systems Design",
    year: 2020,
    coverColor: "#E67E22",
  },
  {
    id: "eloquent-javascript",
    title: "Eloquent JavaScript",
    author: "Marijn Haverbeke",
    description:
      "A modern introduction to programming through JavaScript that balances fundamentals with practical projects. The book includes interactive exercises and builds real applications like a pixel art editor and a platform game.",
    category: "JavaScript",
    year: 2018,
    coverColor: "#1ABC9C",
  },
  {
    id: "art-of-readable-code",
    title: "The Art of Readable Code",
    author: "Dustin Boswell & Trevor Fouler",
    description:
      "A concise guide focused on the single most important aspect of code quality: readability. The authors provide practical techniques for naming, commenting, and structuring code so that other developers can understand it quickly.",
    category: "Software Engineering",
    year: 2011,
    coverColor: "#E84393",
  },
];

export function getBookById(id: string): Book | undefined {
  return books.find((book) => book.id === id);
}

export function getBooksByCategory(category: string): Book[] {
  return books.filter((book) => book.category === category);
}

export function searchBooks(query: string): Book[] {
  const lower = query.toLowerCase();
  return books.filter(
    (book) =>
      book.title.toLowerCase().includes(lower) ||
      book.author.toLowerCase().includes(lower)
  );
}
