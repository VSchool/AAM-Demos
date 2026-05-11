function Card({ item }) {
  return (
    <div className="card">
      <img
        className="card-image"
        src={item.image}
        alt={item.title}
      />
      <div className="card-body">
        <h3 className="card-title">{item.title}</h3>
        <p className="card-text">{item.body}</p>
      </div>
    </div>
  )
}

export default Card
