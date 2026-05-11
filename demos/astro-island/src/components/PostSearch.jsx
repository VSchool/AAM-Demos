import { useState } from 'react';

export default function PostSearch({ posts, basePath = '' }) {
  const [query, setQuery] = useState('');

  const filtered = posts.filter((post) => {
    const search = query.toLowerCase();
    return (
      post.title.toLowerCase().includes(search) ||
      post.description.toLowerCase().includes(search)
    );
  });

  return (
    <div className="post-search">
      <div className="search-bar">
        <svg
          className="search-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search recipes and stories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search blog posts"
        />
        {query && (
          <button
            className="clear-btn"
            onClick={() => setQuery('')}
            aria-label="Clear search"
          >
            &times;
          </button>
        )}
      </div>

      {query && (
        <p className="result-count">
          {filtered.length} {filtered.length === 1 ? 'result' : 'results'} found
        </p>
      )}

      <div className="post-grid">
        {filtered.map((post) => (
          <a key={post.slug} href={`${basePath}blog/${post.slug}/`} className="post-card">
            {post.image && (
              <div className="card-image">
                <img src={post.image} alt="" loading="lazy" />
              </div>
            )}
            <div className="card-body">
              <div className="card-tags">
                {post.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
              <h3>{post.title}</h3>
              <p>{post.description}</p>
              <span className="read-more">Read article &rarr;</span>
            </div>
          </a>
        ))}
      </div>

      {query && filtered.length === 0 && (
        <div className="no-results">
          <p>No posts match "<strong>{query}</strong>"</p>
          <p className="suggestion">Try searching for "sourdough", "fermentation", or "miso"</p>
        </div>
      )}
    </div>
  );
}
