import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          <span className="logo-icon">&#9670;</span>
          Project Tracker
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Projects</Link>
          <Link to="/new" className="nav-link nav-link-accent">+ New Project</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
