"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/books", label: "Books" },
    { href: "/favorites", label: "Favorites" },
  ];

  // Normalize paths by stripping the basePath for comparison
  const basePath = "/AAM-Demos/nextjs-bookshelf";
  const currentPath = pathname?.replace(basePath, "") || "/";
  const normalizedPath = currentPath === "" ? "/" : currentPath;

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="nav-logo">
          <span className="nav-logo-icon">📚</span>
          <span>Bookshelf</span>
        </Link>
        <ul className="nav-links">
          {links.map((link) => {
            const isActive =
              link.href === "/"
                ? normalizedPath === "/"
                : normalizedPath.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`nav-link ${isActive ? "active" : ""}`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
