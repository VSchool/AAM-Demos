import type { Metadata } from "next";
import "./globals.css";
import Nav from "./components/Nav";

export const metadata: Metadata = {
  title: "TechGear — Polished Next.js Demo",
  description: "A demo showing layout, loading states, error handling, and visual polish in a Next.js App Router application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <Nav />
          <main className="app-main">{children}</main>
          <footer className="footer">
            TechGear Demo &mdash; Built with Next.js App Router
          </footer>
        </div>
      </body>
    </html>
  );
}
