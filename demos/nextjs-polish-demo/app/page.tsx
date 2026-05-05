import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="home-hero">
        <img
          src="https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=1200&h=500&q=80&fit=crop"
          alt="Modern workspace with monitor, keyboard and accessories"
          className="home-hero-bg"
          loading="eager"
        />
        <div className="home-hero-overlay" />
        <div className="home-hero-content">
          <h1>TechGear</h1>
          <p>
            Premium desk accessories and peripherals, curated for the modern
            workspace.
          </p>
          <Link href="/items" className="btn btn-accent btn-lg">
            Browse Collection
          </Link>
        </div>
      </div>

      <div className="home-cards">
        <Link href="/items" className="home-card">
          <div className="home-card-icon">&#9881;</div>
          <div className="home-card-title">Products</div>
          <div className="home-card-desc">
            Browse 8 curated tech gadgets with loading skeletons and error
            handling.
          </div>
        </Link>
        <Link href="/about" className="home-card">
          <div className="home-card-icon">&#9733;</div>
          <div className="home-card-title">About</div>
          <div className="home-card-desc">
            Learn what polish features this demo showcases.
          </div>
        </Link>
      </div>
    </>
  );
}
