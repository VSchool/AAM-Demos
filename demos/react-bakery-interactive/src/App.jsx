import { useState } from 'react'
import Header from './components/Header.jsx'
import CardList from './components/CardList.jsx'

const items = [
  {
    id: 1,
    title: 'Sourdough Loaf',
    description: 'Crusty artisan sourdough with a tangy, complex flavor. 24-hour fermented.',
    price: '$8.50',
    image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=600&h=400&fit=crop',
  },
  {
    id: 2,
    title: 'Cinnamon Rolls',
    description: 'Warm, gooey rolls swirled with cinnamon and topped with cream cheese glaze.',
    price: '$4.75',
    image: 'https://images.unsplash.com/photo-1509365390695-33aee754301f?w=600&h=400&fit=crop',
  },
  {
    id: 3,
    title: 'Almond Croissant',
    description: 'Flaky, buttery layers filled with almond cream and topped with sliced almonds.',
    price: '$5.25',
    image: 'https://images.unsplash.com/photo-1623334044303-241021148842?w=600&h=400&fit=crop',
  },
  {
    id: 4,
    title: 'Baguette',
    description: 'Classic French baguette with a golden crust and soft, airy interior.',
    price: '$4.00',
    image: 'https://images.unsplash.com/photo-1549931319-a545753467c8?w=600&h=400&fit=crop',
  },
]

function App() {
  const [search, setSearch] = useState('')

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="app">
      <Header />
      <main className="main">
        <input
          type="text"
          className="search-bar"
          placeholder="Search our menu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <p className="count">
          Showing {filtered.length} of {items.length} items
        </p>
        <CardList items={filtered} />
      </main>
    </div>
  )
}

export default App
