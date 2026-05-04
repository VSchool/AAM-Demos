function ProductCard({ product }) {
  const { name, category, price, description } = product

  return (
    <article className="product-card">
      <div className="card-header">
        <h3 className="card-title">{name}</h3>
        <span className="card-category">{category}</span>
      </div>
      <p className="card-description">{description}</p>
      <div className="card-footer">
        <span className="card-price">
          {price === 0 ? 'Free' : `$${price.toFixed(2)}`}
        </span>
      </div>
    </article>
  )
}

export default ProductCard
