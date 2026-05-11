import './SearchBar.css'

function SearchBar({ query, onChange }) {
  return (
    <div className="search-bar">
      <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        type="text"
        className="search-input"
        placeholder="Search recipes..."
        value={query}
        onChange={(e) => onChange(e.target.value)}
      />
      {query && (
        <button
          className="search-clear"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          &times;
        </button>
      )}
    </div>
  )
}

export default SearchBar
