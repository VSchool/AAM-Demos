import { useState } from 'react'
import Header from './components/Header.jsx'
import CardList from './components/CardList.jsx'
import EmptyState from './components/EmptyState.jsx'

const items = [
  {
    id: 1,
    title: 'Sourdough Loaf',
    description: 'Crusty artisan sourdough with a tangy, complex flavor. 24-hour fermented.',
    price: '$8.50',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop',
  },
  {
    id: 2,
    title: 'Cinnamon Rolls',
    description: 'Warm, gooey rolls swirled with cinnamon and topped with cream cheese glaze.',
    price: '$4.75',
    image: 'https://images.unsplash.com/photo-1585190775852-3e6bb2b80184?w=600&h=400&fit=crop',
  },
  {
    id: 3,
    title: 'Almond Croissant',
    description: 'Flaky, buttery layers filled with almond cream and topped with sliced almonds.',
    price: '$5.25',
    image: 'https://images.unsplash.com/photo-1623334044303-241021148842?w=600&h=400&fit=crop',
  },
  {
    id: 4,
    title: 'Baguette',
    description: 'Classic French baguette with a golden crust and soft, airy interior.',
    price: '$4.00',
    image: 'https://images.unsplash.com/photo-1568471173242-461f0a730452?w=600&h=400&fit=crop',
  },
]

function App() {
  const [search, setSearch] = useState('')
  const [favorites, setFavorites] = useState([])
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  function toggleFav(id) {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    )
  }

  function clearSearch() {
    setSearch('')
  }

  function showAll() {
    setShowFavoritesOnly(false)
  }

  const searched = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  )
  const visible = showFavoritesOnly
    ? searched.filter((item) => favorites.includes(item.id))
    : searched

  return (
    <div className="app">
      <Header />
      <main className="main">
        <input
          type="text"
          className="search-bar"
          placeholder="Search our menu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="toolbar">
          <button
            className={`filter-toggle${showFavoritesOnly ? ' active' : ''}`}
            onClick={() => setShowFavoritesOnly((v) => !v)}
            aria-pressed={showFavoritesOnly}
          >
            {showFavoritesOnly ? '♥ Favorites only' : '♡ Favorites only'}
          </button>

          {favorites.length > 0 && (
            <span className="fav-badge">
              {favorites.length} {favorites.length === 1 ? 'favorite' : 'favorites'}
            </span>
          )}

          <span className="count">
            Showing {visible.length} of {items.length}
          </span>
        </div>

        {visible.length === 0 ? (
          showFavoritesOnly && favorites.length === 0 ? (
            <EmptyState
              icon="♡"
              title="No favorites yet"
              message="Tap the heart on any item to add it to your favorites."
              actionLabel="Show all items"
              onAction={showAll}
            />
          ) : search ? (
            <EmptyState
              icon="🔎"
              title="Nothing matched your search"
              message={`We couldn't find anything for "${search}". Try a different word, or clear the search.`}
              actionLabel="Clear search"
              onAction={clearSearch}
            />
          ) : (
            <EmptyState
              icon="🥐"
              title="No items to show"
              message="The case is empty right now. Check back soon."
            />
          )
        ) : (
          <CardList
            items={visible}
            favorites={favorites}
            onToggleFav={toggleFav}
          />
        )}
      </main>
    </div>
  )
}

export default App
