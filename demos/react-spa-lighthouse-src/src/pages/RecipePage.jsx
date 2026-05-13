import { useParams, Link } from 'react-router-dom'
import { recipes } from '../data/recipes.js'
import './RecipePage.css'

function RecipePage() {
  const { id } = useParams()
  const recipe = recipes.find((r) => r.id === Number(id))

  if (!recipe) {
    return (
      <div className="not-found">
        <h2>Recipe not found</h2>
        <p>The recipe you are looking for does not exist.</p>
        <Link to="/" className="back-link">&larr; Back to recipes</Link>
      </div>
    )
  }

  return (
    <article className="recipe-page">
      <Link to="/" className="back-link">&larr; All recipes</Link>

      <div className="recipe-hero">
        <img src={recipe.image} alt={recipe.title} className="recipe-hero-image" />
        <div className="recipe-hero-overlay">
          <span className="recipe-category-badge">{recipe.category}</span>
          <h1 className="recipe-title">{recipe.title}</h1>
        </div>
      </div>

      <div className="recipe-meta-bar">
        <div className="meta-chip">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
          {recipe.time}
        </div>
        <div className="meta-chip">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
          </svg>
          {recipe.servings} servings
        </div>
        <div className={`meta-chip difficulty-chip difficulty-${recipe.difficulty.toLowerCase()}`}>
          {recipe.difficulty}
        </div>
      </div>

      <p className="recipe-description">{recipe.description}</p>

      <div className="recipe-content">
        <section className="recipe-section">
          <h2>Ingredients</h2>
          <ul className="ingredients-list">
            {recipe.ingredients.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="recipe-section">
          <h2>Instructions</h2>
          <ol className="steps-list">
            {recipe.steps.map((step, i) => (
              <li key={i}>
                <span className="step-number">{i + 1}</span>
                <span className="step-text">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  )
}

export default RecipePage
