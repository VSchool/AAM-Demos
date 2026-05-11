import { useState } from 'react'
import BakeryApp from './components/BakeryApp'
import TreePanel from './components/TreePanel'

const items = [
  { id: 1, title: 'Sourdough Loaf', body: 'Crusty, tangy, ready by 8am.', price: 6 },
  { id: 2, title: 'Cinnamon Roll', body: 'Warm glaze, weekend special.', price: 4 },
  { id: 3, title: 'Almond Croissant', body: 'Flaky layers, almond cream.', price: 5 },
  { id: 4, title: 'Baguette', body: 'Classic French, crispy crust.', price: 3 },
]

function App() {
  const [highlighted, setHighlighted] = useState(null)

  return (
    <div className="split-layout">
      <div className="panel panel-app">
        <div className="panel-label">What the user sees</div>
        <BakeryApp
          items={items}
          highlighted={highlighted}
          onHighlight={setHighlighted}
        />
      </div>
      <div className="panel panel-tree">
        <div className="panel-label">Component tree</div>
        <TreePanel
          items={items}
          highlighted={highlighted}
          onHighlight={setHighlighted}
        />
      </div>
    </div>
  )
}

export default App
