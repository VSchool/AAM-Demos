import { NavLink } from "react-router-dom";
import { useNavContext } from "../context/NavigationContext";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { recordNavigation } = useNavContext();

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar-inner">
        <NavLink
          to="/"
          className="navbar-brand"
          onClick={() => recordNavigation("<Link> click", "/")}
        >
          <span className="brand-icon" aria-hidden="true">&#9783;</span>
          <span>Router Explorer</span>
        </NavLink>
        <ul className="navbar-links">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "nav-link--active" : ""}`
                }
                onClick={() =>
                  recordNavigation("<Link> click", item.to)
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
