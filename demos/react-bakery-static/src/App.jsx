import Header from './components/Header'
import CardList from './components/CardList'
import './App.css'

const items = [
  { id: 1, title: 'Sourdough Loaf', body: 'Crusty, tangy, ready by 8am Saturdays.', image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=400&h=260&fit=crop' },
  { id: 2, title: 'Cinnamon Rolls', body: 'Sticky, swirled, gone by noon.', image: 'https://images.unsplash.com/photo-1609127407659-69c6b2313a27?w=400&h=260&fit=crop' },
  { id: 3, title: 'Almond Croissant', body: 'Flaky layers, almond cream center.', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400&h=260&fit=crop' },
  { id: 4, title: 'Baguette', body: 'Classic French, crispy crust, soft interior.', image: 'https://images.unsplash.com/photo-1549931319-a545753467c8?w=400&h=260&fit=crop' },
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
