import { useEffect, useState } from 'react';

// React island #1 — Menu Search.
//
// This component renders only the search input. The menu cards themselves
// are static HTML rendered at build time by Astro. We progressively
// enhance the static list by hiding/showing cards based on the query.
//
// Without JS (or while the island hydrates), all cards are visible.
// Search engines see the full menu in the HTML source.

export default function MenuSearch() {
  const [query, setQuery] = useState('');
  const [matchCount, setMatchCount] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  useEffect(() => {
    const cards = Array.from(
      document.querySelectorAll<HTMLElement>('[data-menu-id]')
    );
    setTotalCount(cards.length);

    const needle = query.trim().toLowerCase();
    let visible = 0;

    cards.forEach((card) => {
      const name = card.dataset.menuName ?? '';
      const description = card.dataset.menuDescription ?? '';
      const category = card.dataset.menuCategory ?? '';
      const haystack = `${name} ${description} ${category}`;
      const matches = needle === '' || haystack.includes(needle);
      card.classList.toggle('is-hidden', !matches);
      if (matches) visible += 1;
    });

    setMatchCount(visible);

    // Toggle an empty-state message inside the menu section.
    const emptyEl = document.getElementById('menu-empty');
    if (emptyEl) {
      emptyEl.style.display = visible === 0 ? 'block' : 'none';
    }
  }, [query]);

  return (
    <div>
      <div className="menu-search" role="search">
        <span className="menu-search__icon" aria-hidden="true">
          🔍
        </span>
        <input
          type="search"
          className="menu-search__input"
          placeholder="Search the menu (try 'sourdough' or 'lemon')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search menu items"
        />
        {query && (
          <button
            type="button"
            className="menu-search__clear"
            onClick={() => setQuery('')}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
      <p className="menu-search__status">
        {query
          ? matchCount === null
            ? 'Searching…'
            : `${matchCount} of ${totalCount} items match "${query}"`
          : totalCount === null
            ? 'Loaded — ready to filter'
            : `Showing all ${totalCount} items · React state holds the query`}
      </p>
    </div>
  );
}
