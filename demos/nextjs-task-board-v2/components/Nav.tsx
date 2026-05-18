import Link from "next/link";

export default function Nav() {
  return (
    <header className="cn-nav">
      <div className="cn-nav-inner">
        <Link href="/" className="cn-brand">
          <span className="cn-brand-glyph" aria-hidden="true">
            ▸
          </span>
          Cadence
          <span className="cn-brand-state">v2 · server list</span>
        </Link>
        <nav className="cn-nav-links" aria-label="primary">
          <Link className="cn-nav-link" href="/">
            Home
          </Link>
          <Link className="cn-nav-link" href="/tasks">
            Tasks
          </Link>
          <Link className="cn-nav-link" href="/about">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
