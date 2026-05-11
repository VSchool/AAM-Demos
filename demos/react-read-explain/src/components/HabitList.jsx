import HabitItem from './HabitItem'

function HabitList({ habits, completed, onToggle }) {
  if (habits.length === 0) {
    return <p className="empty-message">No habits match this filter.</p>
  }

  return (
    <ul className="habit-list">
      {habits.map(habit => (
        <HabitItem
          key={habit.id}
          habit={habit}
          isDone={Boolean(completed[habit.id])}
          onToggle={onToggle}
        />
      ))}
    </ul>
  )
}

export default HabitList
