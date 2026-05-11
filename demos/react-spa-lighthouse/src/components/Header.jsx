import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          <span className="logo-icon" role="img" aria-label="fork and knife">🍴</span>
          <span className="logo-text">Quick Bites</span>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <span className="nav-badge">React SPA</span>
        </nav>
      </div>
    </header>
  )
}

export default Header
