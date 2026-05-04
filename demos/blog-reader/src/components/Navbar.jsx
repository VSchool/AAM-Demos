import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <span className="brand-icon" aria-hidden="true">&#9783;</span>
          Blog Reader
        </NavLink>
        <ul className="navbar-links">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Posts
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              About
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
