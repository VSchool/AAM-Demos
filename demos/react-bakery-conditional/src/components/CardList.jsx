import Card from './Card.jsx'

function CardList({ items, favorites, onToggleFav }) {
  return (
    <div className="card-list">
      {items.map((item) => (
        <Card
          key={item.id}
          item={item}
          isFav={favorites.includes(item.id)}
          onToggleFav={onToggleFav}
        />
      ))}
    </div>
  )
}

export default CardList
