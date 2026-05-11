import { useState } from 'react'
import Header from './components/Header'
import ProgressBar from './components/ProgressBar'
import FilterTabs from './components/FilterTabs'
import HabitList from './components/HabitList'
import './App.css'

const initialHabits = [
  { id: 1, name: 'Morning stretch', streak: 5, emoji: '🧘' },
  { id: 2, name: 'Read 20 pages', streak: 12, emoji: '📖' },
  { id: 3, name: 'Drink 8 glasses of water', streak: 3, emoji: '💧' },
  { id: 4, name: 'Write in journal', streak: 0, emoji: '✏️' },
  { id: 5, name: 'No phone first hour', streak: 8, emoji: '📵' },
]

function App() {
  const [completed, setCompleted] = useState({})
  const [filter, setFilter] = useState('all')

  const completedCount = Object.values(completed).filter(Boolean).length
  const percentage = Math.round((completedCount / initialHabits.length) * 100)

  function handleToggle(id) {
    setCompleted(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const visible = initialHabits.filter(habit => {
    if (filter === 'done') return completed[habit.id]
    if (filter === 'remaining') return !completed[habit.id]
    return true
  })

  return (
    <div className="app">
      <Header completedCount={completedCount} total={initialHabits.length} />
      <main className="main">
        <ProgressBar percentage={percentage} />
        <FilterTabs active={filter} onChange={setFilter} />
        <HabitList habits={visible} completed={completed} onToggle={handleToggle} />
      </main>
    </div>
  )
}

export default App
