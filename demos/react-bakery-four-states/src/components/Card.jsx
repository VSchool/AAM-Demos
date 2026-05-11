function Card({ item, isFavorite, onToggleFavorite }) {
  return (
    <div className="card">
      <div className="card-image-wrapper">
        <img className="card-image" src={item.image} alt={item.title} />
        <button
          className={`heart-btn ${isFavorite ? 'heart-active' : ''}`}
          onClick={onToggleFavorite}
          aria-label={isFavorite ? `Remove ${item.title} from favorites` : `Add ${item.title} to favorites`}
        >
          {isFavorite ? '\u2764\uFE0F' : '\u2661'}
        </button>
      </div>
      <div className="card-body">
        <h3 className="card-title">{item.title}</h3>
        <p className="card-text">{item.body}</p>
      </div>
    </div>
  )
}

export default Card
