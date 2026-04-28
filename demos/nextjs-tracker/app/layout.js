// Root layout — server component (no "use client" needed)
// In Next.js, layout.js wraps all pages automatically.
// This replaces the need for a top-level <App> wrapper in React.
import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  title: "Project Tracker — Next.js",
  description: "A project tracking app built with Next.js App Router",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
