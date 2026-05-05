import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="home-hero">
        <h1>TechGear</h1>
        <p>
          A polished Next.js demo showing persistent layout, loading skeletons,
          error boundaries, and thoughtful UI details.
        </p>
        <Link href="/items" className="btn btn-accent">
          Browse Items
        </Link>
      </div>

      <div className="home-cards">
        <Link href="/items" className="home-card">
          <div className="home-card-title">Items</div>
          <div className="home-card-desc">
            Browse 8 tech gadgets with loading skeletons and error handling.
          </div>
        </Link>
        <Link href="/about" className="home-card">
          <div className="home-card-title">About</div>
          <div className="home-card-desc">
            Learn what polish features this demo showcases.
          </div>
        </Link>
      </div>
    </>
  );
}
