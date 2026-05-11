function HabitItem({ habit, isDone, onToggle }) {
  function handleChange() {
    onToggle(habit.id)
  }

  return (
    <li className={`habit-item ${isDone ? 'done' : ''}`}>
      <label className="habit-checkbox">
        <input
          type="checkbox"
          checked={isDone}
          onChange={handleChange}
        />
        <span className="checkmark" />
      </label>

      <span className="habit-emoji">{habit.emoji}</span>

      <div className="habit-info">
        <span className="habit-name">{habit.name}</span>
        {habit.streak > 0 && (
          <span className="habit-streak">
            🔥 {habit.streak} day streak
          </span>
        )}
      </div>
    </li>
  )
}

export default HabitItem
