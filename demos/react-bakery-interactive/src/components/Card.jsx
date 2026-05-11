import { useState } from 'react'

function Card({ item }) {
  const [isFav, setIsFav] = useState(false)

  return (
    <div className="card">
      <div className="card-img-wrapper">
        <img className="card-img" src={item.image} alt={item.title} />
        <button
          className={`card-fav${isFav ? ' active' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            setIsFav(!isFav)
          }}
          aria-label={isFav ? `Remove ${item.title} from favorites` : `Add ${item.title} to favorites`}
        >
          {isFav ? '\u2665' : '\u2661'}
        </button>
      </div>
      <div className="card-body">
        <div className="card-header">
          <h2 className="card-title">{item.title}</h2>
          <span className="card-price">{item.price}</span>
        </div>
        <p className="card-description">{item.description}</p>
      </div>
    </div>
  )
}

export default Card
