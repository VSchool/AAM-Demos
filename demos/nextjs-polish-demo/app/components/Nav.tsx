"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/items", label: "Items" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const pathname = usePathname();
  const basePath = "/AAM-Demos/nextjs-polish-demo";

  function isActive(href: string): boolean {
    const fullPath = pathname.replace(basePath, "") || "/";
    if (href === "/") return fullPath === "/";
    return fullPath.startsWith(href);
  }

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="nav-brand">
          TechGear
        </Link>
        <ul className="nav-links">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="nav-link"
                data-active={isActive(link.href)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
