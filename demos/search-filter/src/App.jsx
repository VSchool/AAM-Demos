import { useState } from 'react'
import products from './products'
import ProductCard from './ProductCard'
import HowItWorks from './HowItWorks'

const categories = ['All', ...new Set(products.map(p => p.category))].sort((a, b) => {
  if (a === 'All') return -1
  if (b === 'All') return 1
  return a.localeCompare(b)
})

function App() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory =
      activeCategory === 'All' || product.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const handleClear = () => {
    setSearch('')
    setActiveCategory('All')
  }

  const hasFilters = search !== '' || activeCategory !== 'All'

  return (
    <div className="app">
      <div className="hero-banner">
        <img
          className="hero-image"
          src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&q=80"
          alt=""
          aria-hidden="true"
        />
        <div className="hero-overlay">
          <h1>Product Catalog</h1>
          <p className="subtitle">Search and filter products in real time</p>
        </div>
      </div>

      <main className="app-main">
        <div className="search-bar">
          <label htmlFor="search-input" className="sr-only">
            Search products
          </label>
          <div className="search-input-wrapper">
            <svg
              className="search-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id="search-input"
              type="text"
              placeholder="Search by name or description..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoComplete="off"
            />
            {hasFilters && (
              <button
                className="clear-btn"
                onClick={handleClear}
                aria-label="Clear all filters"
              >
                &times;
              </button>
            )}
          </div>
        </div>

        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <p className="results-count" aria-live="polite">
          Showing <strong>{filtered.length}</strong> of{' '}
          <strong>{products.length}</strong> items
        </p>

        {filtered.length > 0 ? (
          <div className="product-grid">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p className="no-results-emoji" aria-hidden="true">
              &#128269;
            </p>
            <p className="no-results-title">No products found</p>
            <p className="no-results-hint">
              Try a different search term or clear the filters to see all products.
            </p>
            <button className="reset-btn" onClick={handleClear}>
              Show all products
            </button>
          </div>
        )}

        <HowItWorks />
      </main>

      <footer className="app-footer">
        <p>
          AIM Curriculum Demo &mdash; Built with React + Vite
        </p>
      </footer>
    </div>
  )
}

export default App
