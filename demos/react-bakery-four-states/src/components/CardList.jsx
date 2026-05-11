import Card from './Card.jsx'

function CardList({ items, favorites, onToggleFavorite }) {
  if (items.length === 0) {
    return (
      <div className="no-results">
        <p>No recipes match your search.</p>
      </div>
    )
  }

  return (
    <div className="card-grid">
      {items.map(item => (
        <Card
          key={item.id}
          item={item}
          isFavorite={favorites.includes(item.id)}
          onToggleFavorite={() => onToggleFavorite(item.id)}
        />
      ))}
    </div>
  )
}

export default CardList
