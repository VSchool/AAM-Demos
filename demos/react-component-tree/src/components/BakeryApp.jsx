function BakeryApp({ items, highlighted, onHighlight }) {
  const renderMap = {
    app: ['app', 'header', 'cardlist', 'card-1', 'card-2', 'card-3', 'card-4', 'footer'],
    header: ['header'],
    cardlist: ['cardlist', 'card-1', 'card-2', 'card-3', 'card-4'],
    footer: ['footer'],
  }
  items.forEach(item => {
    renderMap['card-' + item.id] = ['card-' + item.id]
  })

  function isActive(key) {
    if (!highlighted) return false
    const targets = renderMap[highlighted] || [highlighted]
    return targets.includes(key)
  }

  function handleClick(key, e) {
    e.stopPropagation()
    onHighlight(highlighted === key ? null : key)
  }

  return (
    <div
      className={`bakery ${isActive('app') ? 'glow' : ''}`}
      onClick={(e) => handleClick('app', e)}
    >
      {/* Header */}
      <div
        className={`bakery-header ${isActive('header') ? 'glow' : ''}`}
        onClick={(e) => handleClick('header', e)}
      >
        <h1 className="bakery-title">Maya&#39;s Bakery</h1>
        <p className="bakery-subtitle">Fresh daily &bull; Est. 2024</p>
      </div>

      {/* CardList */}
      <div
        className={`bakery-cards ${isActive('cardlist') ? 'glow' : ''}`}
        onClick={(e) => handleClick('cardlist', e)}
      >
        {items.map(item => (
          <div
            key={item.id}
            className={`bakery-card ${isActive('card-' + item.id) ? 'glow' : ''}`}
            onClick={(e) => handleClick('card-' + item.id, e)}
          >
            <div className="card-content">
              <div>
                <div className="card-name">{item.title}</div>
                <div className="card-desc">{item.body}</div>
              </div>
              <div className="card-price">${item.price}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        className={`bakery-footer ${isActive('footer') ? 'glow' : ''}`}
        onClick={(e) => handleClick('footer', e)}
      >
        &copy; 2024 Maya&#39;s Bakery
      </div>
    </div>
  )
}

export default BakeryApp
