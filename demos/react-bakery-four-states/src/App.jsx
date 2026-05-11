import { useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import Loading from './components/Loading.jsx'
import Error from './components/Error.jsx'
import Empty from './components/Empty.jsx'
import CardList from './components/CardList.jsx'

function App() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [favorites, setFavorites] = useState([])

  function fetchData() {
    setIsLoading(true)
    setError(null)
    fetch('https://dummyjson.com/recipes?limit=8')
      .then(res => {
        if (!res.ok) throw new Error('Could not load the bakery menu.')
        return res.json()
      })
      .then(data => {
        setItems(data.recipes.map(r => ({
          id: r.id,
          title: r.name,
          body: r.instructions?.slice(0, 80) + '...' || r.cuisine + ' cuisine',
          image: r.image,
        })))
      })
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  function toggleFavorite(id) {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  const visible = items.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase())
  )

  // --- Testing helpers ---
  function simulateLoading() {
    setIsLoading(true)
    setError(null)
    setTimeout(() => setIsLoading(false), 3000)
  }

  function simulateError() {
    setIsLoading(false)
    setError('Something went wrong — the oven caught fire!')
  }

  function simulateEmpty() {
    setIsLoading(false)
    setError(null)
    setItems([])
  }

  function resetData() {
    setFavorites([])
    setSearch('')
    fetchData()
  }

  // --- Four-state branching ---
  if (isLoading) {
    return (
      <div className="app">
        <Header title="Maya's Bakery" />
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <Header title="Maya's Bakery" />
        <Error message={error} onRetry={() => window.location.reload()} />
        <TestControls
          onLoading={simulateLoading}
          onError={simulateError}
          onEmpty={simulateEmpty}
          onReset={resetData}
        />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="app">
        <Header title="Maya's Bakery" />
        <Empty />
        <TestControls
          onLoading={simulateLoading}
          onError={simulateError}
          onEmpty={simulateEmpty}
          onReset={resetData}
        />
      </div>
    )
  }

  return (
    <div className="app">
      <Header title="Maya's Bakery" />
      <main className="main">
        <div className="toolbar">
          <input
            type="text"
            className="search-input"
            placeholder="Search the menu..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <span className="count">
            Showing {visible.length} of {items.length}
          </span>
        </div>
        <CardList
          items={visible}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
        <TestControls
          onLoading={simulateLoading}
          onError={simulateError}
          onEmpty={simulateEmpty}
          onReset={resetData}
        />
      </main>
    </div>
  )
}

function TestControls({ onLoading, onError, onEmpty, onReset }) {
  return (
    <div className="test-controls">
      <span className="test-label">Testing:</span>
      <button onClick={onLoading}>Simulate Loading</button>
      <button onClick={onError}>Simulate Error</button>
      <button onClick={onEmpty}>Simulate Empty</button>
      <button onClick={onReset}>Reset</button>
    </div>
  )
}

export default App
