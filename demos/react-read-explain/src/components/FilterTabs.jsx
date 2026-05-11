const filters = ['all', 'done', 'remaining']

function FilterTabs({ active, onChange }) {
  function handleClick(filter) {
    onChange(filter)
  }

  return (
    <div className="filter-tabs">
      {filters.map(filter => (
        <button
          key={filter}
          className={`filter-tab ${filter === active ? 'active' : ''}`}
          onClick={() => handleClick(filter)}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  )
}

export default FilterTabs
