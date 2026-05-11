function Header({ completedCount, total }) {
  return (
    <header className="header">
      <h1 className="header-title">Daily Habits</h1>
      <p className="header-subtitle">
        {completedCount} of {total} complete
      </p>
    </header>
  )
}

export default Header
