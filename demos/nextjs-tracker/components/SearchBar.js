"use client";
// Client component — needs "use client" because it handles user input
// This is one of the key Next.js patterns: only components that need
// interactivity (state, event handlers) use the "use client" directive

const STATUSES = ["All", "Active", "In Progress", "Planning", "Complete"];

export default function SearchBar({ search, onSearchChange, status, onStatusChange }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search projects..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
      <div className="filter-pills">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => onStatusChange(s)}
            className={`pill ${status === s ? "pill-active" : ""}`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
