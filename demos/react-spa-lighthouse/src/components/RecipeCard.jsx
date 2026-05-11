import { Link } from 'react-router-dom'
import './RecipeCard.css'

function RecipeCard({ recipe }) {
  return (
    <Link to={`/recipe/${recipe.id}`} className="recipe-card">
      <div className="card-image-wrapper">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="card-image"
          loading="lazy"
        />
        <span className="card-category">{recipe.category}</span>
      </div>
      <div className="card-body">
        <h3 className="card-title">{recipe.title}</h3>
        <p className="card-description">{recipe.description}</p>
        <div className="card-meta">
          <span className="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            {recipe.time}
          </span>
          <span className="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
            </svg>
            {recipe.servings} servings
          </span>
          <span className={`difficulty difficulty-${recipe.difficulty.toLowerCase()}`}>
            {recipe.difficulty}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default RecipeCard
