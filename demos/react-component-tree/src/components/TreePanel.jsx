function TreePanel({ title, items, highlighted, onHighlight, onUpdateTitle, onUpdateItem }) {
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

  // Build the props inspector content based on what's highlighted
  function renderInspector() {
    if (!highlighted) {
      return <span className="inspector-hint">&larr; Click a component to inspect and edit its props</span>
    }

    if (highlighted === 'app') {
      return (
        <div className="inspector-content">
          <div className="inspector-header">
            <span className="inspector-name node-color-app">App</span>
            <span className="inspector-tag">root &mdash; owns all data</span>
          </div>
          <div className="inspector-props">
            <div className="prop-row">
              <span className="prop-key">title</span>
              <span className="prop-type">string</span>
              <input
                className="prop-input"
                value={title}
                onChange={(e) => onUpdateTitle(e.target.value)}
              />
            </div>
            <div className="prop-row">
              <span className="prop-key">items</span>
              <span className="prop-type">Array({items.length})</span>
              <span className="prop-value">[{items.map(i => i.title).join(', ')}]</span>
            </div>
          </div>
          <div className="inspector-note">App passes title to Header and items to CardList</div>
        </div>
      )
    }

    if (highlighted === 'header') {
      return (
        <div className="inspector-content">
          <div className="inspector-header">
            <span className="inspector-name node-color-header">Header</span>
            <span className="inspector-tag">receives from App</span>
          </div>
          <div className="inspector-props">
            <div className="prop-row">
              <span className="prop-key">title</span>
              <span className="prop-type">string</span>
              <input
                className="prop-input"
                value={title}
                onChange={(e) => onUpdateTitle(e.target.value)}
              />
            </div>
          </div>
          <div className="inspector-note">Change the title above &mdash; watch the bakery header update</div>
        </div>
      )
    }

    if (highlighted === 'cardlist') {
      return (
        <div className="inspector-content">
          <div className="inspector-header">
            <span className="inspector-name node-color-cardlist">CardList</span>
            <span className="inspector-tag">receives from App</span>
          </div>
          <div className="inspector-props">
            <div className="prop-row">
              <span className="prop-key">items</span>
              <span className="prop-type">Array({items.length})</span>
              <span className="prop-value">[{'{'}...{'}'}, {'{'}...{'}'}, {'{'}...{'}'}, {'{'}...{'}'}]</span>
            </div>
          </div>
          <div className="inspector-note">Maps over items and renders one {'<Card />'} per item</div>
        </div>
      )
    }

    if (highlighted === 'footer') {
      return (
        <div className="inspector-content">
          <div className="inspector-header">
            <span className="inspector-name node-color-footer">Footer</span>
            <span className="inspector-tag">no props</span>
          </div>
          <div className="inspector-note">Static component &mdash; no data from parent. Just renders itself.</div>
        </div>
      )
    }

    // Card
    const cardId = parseInt(highlighted.replace('card-', ''))
    const item = items.find(i => i.id === cardId)
    if (!item) return null

    return (
      <div className="inspector-content">
        <div className="inspector-header">
          <span className="inspector-name node-color-card">Card</span>
          <span className="inspector-tag">receives from CardList</span>
        </div>
        <div className="inspector-props">
          <div className="prop-row">
            <span className="prop-key">item.title</span>
            <span className="prop-type">string</span>
            <input
              className="prop-input"
              value={item.title}
              onChange={(e) => onUpdateItem(cardId, 'title', e.target.value)}
            />
          </div>
          <div className="prop-row">
            <span className="prop-key">item.body</span>
            <span className="prop-type">string</span>
            <input
              className="prop-input"
              value={item.body}
              onChange={(e) => onUpdateItem(cardId, 'body', e.target.value)}
            />
          </div>
          <div className="prop-row">
            <span className="prop-key">item.price</span>
            <span className="prop-type">number</span>
            <input
              className="prop-input prop-input-short"
              type="number"
              value={item.price}
              onChange={(e) => onUpdateItem(cardId, 'price', e.target.value)}
            />
          </div>
        </div>
        <div className="inspector-note">Edit any prop &mdash; the bakery card updates in real time</div>
      </div>
    )
  }

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
        {renderInspector()}
      </div>
    </div>
  )
}

export default TreePanel
