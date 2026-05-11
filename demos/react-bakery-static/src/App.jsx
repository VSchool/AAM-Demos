import Header from './components/Header'
import CardList from './components/CardList'
import './App.css'

const items = [
  { id: 1, title: 'Sourdough Loaf', body: 'Crusty, tangy, ready by 8am Saturdays.', image: 'https://picsum.photos/seed/bread/400/260' },
  { id: 2, title: 'Cinnamon Rolls', body: 'Sticky, swirled, gone by noon.', image: 'https://picsum.photos/seed/cinnamon/400/260' },
  { id: 3, title: 'Almond Croissant', body: 'Flaky layers, almond cream center.', image: 'https://picsum.photos/seed/croissant/400/260' },
  { id: 4, title: 'Baguette', body: 'Classic French, crispy crust, soft interior.', image: 'https://picsum.photos/seed/baguette/400/260' },
]

function App() {
  return (
    <div className="app">
      <Header title="Maya's Bakery" />
      <main className="main">
        <CardList items={items} />
      </main>
    </div>
  )
}

export default App
