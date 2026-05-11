function TreePanel({ items, highlighted, onHighlight }) {
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

  function isDimmed(key) {
    if (!highlighted) return false
    return !isActive(key)
  }

  function handleClick(key, e) {
    e.stopPropagation()
    onHighlight(highlighted === key ? null : key)
  }

  const propsInfo = {
    app: 'Root component. Owns items array + title string. Passes data down to children.',
    header: 'props: { title: "Maya\'s Bakery" }',
    cardlist: 'props: { items: [{...}, {...}, {...}, {...}] } — maps each item to a <Card />',
    footer: 'No props. Static content.',
  }
  items.forEach(item => {
    propsInfo['card-' + item.id] = 'props: { item: { title: "' + item.title + '", body: "...", price: ' + item.price + ' } }'
  })

  return (
    <div className="tree-panel">
      <div className="tree-diagram">
        {/* Level 1: App */}
        <div className="tree-level">
          <button
            className={`tree-node node-app ${isActive('app') ? 'active' : ''} ${isDimmed('app') ? 'dimmed' : ''}`}
            onClick={(e) => handleClick('app', e)}
          >
            App
          </button>
        </div>

        {/* Branches: App → children */}
        <div className="tree-branches branches-3">
          <div className="branch-line" />
          <div className="branch-horizontal" />
          <div className="branch-line" />
          <div className="branch-line" />
          <div className="branch-line" />
          <span className="branch-label left">title</span>
          <span className="branch-label center">items</span>
        </div>

        {/* Level 2: Header, CardList, Footer */}
        <div className="tree-level level-2">
          <button
            className={`tree-node node-header ${isActive('header') ? 'active' : ''} ${isDimmed('header') ? 'dimmed' : ''}`}
            onClick={(e) => handleClick('header', e)}
          >
            Header
          </button>
          <button
            className={`tree-node node-cardlist ${isActive('cardlist') ? 'active' : ''} ${isDimmed('cardlist') ? 'dimmed' : ''}`}
            onClick={(e) => handleClick('cardlist', e)}
          >
            CardList
          </button>
          <button
            className={`tree-node node-footer ${isActive('footer') ? 'active' : ''} ${isDimmed('footer') ? 'dimmed' : ''}`}
            onClick={(e) => handleClick('footer', e)}
          >
            Footer
          </button>
        </div>

        {/* Branches: CardList → Cards */}
        <div className="tree-branches branches-cards">
          <div className="branch-line" />
          <div className="branch-horizontal" />
          {items.map(item => (
            <div key={item.id} className="branch-line" />
          ))}
          <span className="branch-label center">item</span>
        </div>

        {/* Level 3: Cards */}
        <div className="tree-level level-3">
          {items.map(item => (
            <button
              key={item.id}
              className={`tree-node node-card ${isActive('card-' + item.id) ? 'active' : ''} ${isDimmed('card-' + item.id) ? 'dimmed' : ''}`}
              onClick={(e) => handleClick('card-' + item.id, e)}
            >
              Card
            </button>
          ))}
        </div>
      </div>

      {/* Props Inspector */}
      <div className="props-inspector">
        {highlighted ? (
          <>
            <span className={'inspector-name node-color-' + (highlighted.startsWith('card') ? 'card' : highlighted)}>
              {highlighted.charAt(0).toUpperCase() + highlighted.slice(1).replace(/-\d+/, '')}
            </span>
            <span className="inspector-sep"> &mdash; </span>
            <span className="inspector-detail">{propsInfo[highlighted] || ''}</span>
          </>
        ) : (
          <span className="inspector-hint">&larr; Click a component to inspect its props</span>
        )}
      </div>
    </div>
  )
}

export default TreePanel
