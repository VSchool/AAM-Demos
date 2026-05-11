import Header from './components/Header'
import CardList from './components/CardList'
import './App.css'

const items = [
  { id: 1, title: 'Sourdough Loaf', body: 'Crusty, tangy, ready by 8am Saturdays.', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=260&fit=crop' },
  { id: 2, title: 'Cinnamon Rolls', body: 'Sticky, swirled, gone by noon.', image: 'https://images.unsplash.com/photo-1509365390695-33aee754301f?w=400&h=260&fit=crop' },
  { id: 3, title: 'Almond Croissant', body: 'Flaky layers, almond cream center.', image: 'https://images.unsplash.com/photo-1623334044303-241021148842?w=400&h=260&fit=crop' },
  { id: 4, title: 'Baguette', body: 'Classic French, crispy crust, soft interior.', image: 'https://images.unsplash.com/photo-1568471173242-461f0a730452?w=400&h=260&fit=crop' },
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
