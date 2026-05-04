import { useState } from 'react'

function HowItWorks() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="how-it-works">
      <button
        className="how-it-works-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>How it works</span>
        <span className={`toggle-icon ${isOpen ? 'open' : ''}`}>&#9662;</span>
      </button>

      {isOpen && (
        <div className="how-it-works-content">
          <div className="code-pattern">
            <h4>1. State holds the search term</h4>
            <pre><code>{`const [search, setSearch] = useState('')`}</code></pre>
            <p>
              A single piece of state tracks what the user has typed.
              Every keystroke updates this value.
            </p>
          </div>

          <div className="code-pattern">
            <h4>2. Controlled input stays in sync</h4>
            <pre><code>{`<input
  value={search}
  onChange={e => setSearch(e.target.value)}
/>`}</code></pre>
            <p>
              The input's <code>value</code> is always whatever <code>search</code> holds.
              React owns the data — the input just reflects it.
            </p>
          </div>

          <div className="code-pattern">
            <h4>3. Filter runs on every render</h4>
            <pre><code>{`const filtered = products.filter(p =>
  p.name.toLowerCase().includes(
    search.toLowerCase()
  )
)`}</code></pre>
            <p>
              No separate "filter" button needed. When <code>search</code> changes,
              the component re-renders, and <code>.filter()</code> runs with the new value.
              The UI always shows the current results.
            </p>
          </div>

          <div className="code-pattern">
            <h4>The pattern in one sentence</h4>
            <p className="pattern-summary">
              State changes &rarr; component re-renders &rarr; derived data recalculates &rarr; UI updates.
              That's the entire mechanism behind every search box, filter panel, and live preview in React.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default HowItWorks
