import { useState } from 'react'
import BakeryApp from './components/BakeryApp'
import TreePanel from './components/TreePanel'

const defaultItems = [
  { id: 1, title: 'Sourdough Loaf', body: 'Crusty, tangy, ready by 8am.', price: 6 },
  { id: 2, title: 'Cinnamon Roll', body: 'Warm glaze, weekend special.', price: 4 },
  { id: 3, title: 'Almond Croissant', body: 'Flaky layers, almond cream.', price: 5 },
  { id: 4, title: 'Baguette', body: 'Classic French, crispy crust.', price: 3 },
]

function App() {
  const [highlighted, setHighlighted] = useState(null)
  const [items, setItems] = useState(defaultItems)
  const [bakeryTitle, setBakeryTitle] = useState("Maya's Bakery")

  function updateItem(id, field, value) {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: field === 'price' ? Number(value) || 0 : value } : item
    ))
  }

  return (
    <div className="split-layout">
      <div className="panel panel-app">
        <div className="panel-label">What the user sees</div>
        <BakeryApp
          title={bakeryTitle}
          items={items}
          highlighted={highlighted}
          onHighlight={setHighlighted}
        />
      </div>
      <div className="panel panel-tree">
        <div className="panel-label">Component tree</div>
        <TreePanel
          title={bakeryTitle}
          items={items}
          highlighted={highlighted}
          onHighlight={setHighlighted}
          onUpdateTitle={setBakeryTitle}
          onUpdateItem={updateItem}
        />
      </div>
    </div>
  )
}

export default App
