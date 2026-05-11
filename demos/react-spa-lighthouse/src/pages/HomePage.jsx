import { useState } from 'react'
import { recipes } from '../data/recipes.js'
import SearchBar from '../components/SearchBar.jsx'
import RecipeCard from '../components/RecipeCard.jsx'
import './HomePage.css'

function HomePage() {
  const [query, setQuery] = useState('')

  const filtered = recipes.filter((recipe) => {
    const q = query.toLowerCase()
    return (
      recipe.title.toLowerCase().includes(q) ||
      recipe.category.toLowerCase().includes(q) ||
      recipe.description.toLowerCase().includes(q)
    )
  })

  return (
    <div className="home">
      <section className="hero-section">
        <h1 className="hero-title">Quick Bites</h1>
        <p className="hero-subtitle">
          Simple recipes, made fast. Find your next favorite meal.
        </p>
      </section>

      <SearchBar query={query} onChange={setQuery} />

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p className="empty-icon">🔍</p>
          <p className="empty-text">No recipes match &ldquo;{query}&rdquo;</p>
          <button className="empty-clear" onClick={() => setQuery('')}>
            Clear search
          </button>
        </div>
      ) : (
        <div className="recipe-grid">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}

      <p className="result-count">
        {filtered.length} of {recipes.length} recipes
      </p>
    </div>
  )
}

export default HomePage
