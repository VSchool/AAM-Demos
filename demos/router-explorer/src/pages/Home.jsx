import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useNavContext } from "../context/NavigationContext";

const cards = [
  {
    to: "/projects",
    title: "Projects",
    description: "Browse 6 demo projects and see dynamic routing in action with useParams.",
    icon: "\u{1F4C2}",
  },
  {
    to: "/about",
    title: "About",
    description: "A static route that demonstrates simple path matching.",
    icon: "\u{1F4CB}",
  },
  {
    to: "/contact",
    title: "Contact",
    description: "A form on a route -- see how forms and routing work together.",
    icon: "\u{2709}\uFE0F",
  },
];

export default function Home() {
  const { recordNavigation } = useNavContext();

  useEffect(() => {
    recordNavigation(undefined, "/");
  }, [recordNavigation]);

  return (
    <div className="page page-home">
      <div className="hero">
        <h1>Router Explorer</h1>
        <p className="hero-subtitle">
          A hands-on demo of React Router concepts. Click around, watch the
          Route Inspector at the bottom, and see how URLs map to components.
        </p>
        <div className="hero-concepts">
          <code>HashRouter</code>
          <code>Routes</code>
          <code>Route</code>
          <code>Link</code>
          <code>useNavigate</code>
          <code>useParams</code>
        </div>
      </div>

      <section className="nav-cards">
        <h2>Explore the App</h2>
        <div className="nav-cards-grid">
          {cards.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="nav-card"
              onClick={() => recordNavigation("<Link> click", card.to)}
            >
              <span className="nav-card-icon" aria-hidden="true">
                {card.icon}
              </span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <span className="nav-card-route">
                Route: <code>{card.to}</code>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="how-it-works">
        <h2>How Routing Works</h2>
        <div className="steps">
          <div className="step">
            <span className="step-number">1</span>
            <div>
              <h4>URL changes</h4>
              <p>
                You click a <code>&lt;Link&gt;</code> or call{" "}
                <code>useNavigate()</code>. The URL updates without a full page
                reload.
              </p>
            </div>
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <div>
              <h4>Router matches</h4>
              <p>
                <code>&lt;Routes&gt;</code> compares the new URL against each{" "}
                <code>&lt;Route path="..."&gt;</code> and finds the best match.
              </p>
            </div>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <div>
              <h4>Component renders</h4>
              <p>
                The matched <code>&lt;Route&gt;</code>'s <code>element</code>{" "}
                prop renders. Dynamic segments (like <code>:id</code>) become
                available via <code>useParams()</code>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
