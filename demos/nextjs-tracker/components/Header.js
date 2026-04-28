// Server component — no "use client" needed
// Uses next/link instead of React Router's <Link>
import Link from "next/link";

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <Link href="/" className="logo">
          Project Tracker
        </Link>
        <nav className="nav-links">
          <Link href="/" className="nav-link">
            Projects
          </Link>
          <Link href="/new" className="nav-link nav-link-add">
            + New Project
          </Link>
        </nav>
      </div>
    </header>
  );
}
