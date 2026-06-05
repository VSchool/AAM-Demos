"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-store";

export default function Nav() {
  const { user, ready, logout } = useAuth();

  return (
    <header className="cn-nav">
      <div className="cn-nav-inner">
        <Link href="/" className="cn-brand">
          <span className="cn-brand-glyph" aria-hidden="true">
            ▸
          </span>
          Cadence
        </Link>
        <nav className="cn-nav-links" aria-label="primary">
          <Link className="cn-nav-link" href="/">
            Home
          </Link>
          <Link className="cn-nav-link" href="/tasks">
            Tasks
          </Link>
          <Link className="cn-nav-link" href="/compare">
            V7 → V8
          </Link>
          {/* Auth-aware tail. Stays empty until the initial session check
              resolves so we don't flash the wrong state. */}
          {ready && user ? (
            <>
              <Link className="cn-nav-link" href="/profile">
                {user.name.split(" ")[0] || "Profile"}
              </Link>
              <button
                type="button"
                className="cn-nav-link cn-nav-link-btn"
                onClick={logout}
              >
                Log out
              </button>
            </>
          ) : ready ? (
            <Link className="cn-nav-link cn-nav-link-cta" href="/login">
              Log in
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
