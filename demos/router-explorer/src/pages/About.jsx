import { useEffect } from "react";
import { useNavContext } from "../context/NavigationContext";

export default function About() {
  const { recordNavigation } = useNavContext();

  useEffect(() => {
    recordNavigation(undefined, "/about");
  }, [recordNavigation]);

  return (
    <div className="page page-about">
      <div className="page-header">
        <h1>About Router Explorer</h1>
        <p>
          This app is a teaching tool for understanding React Router.
          Every route, link, and navigation action is instrumented so you can
          see exactly what React Router is doing under the hood.
        </p>
      </div>

      <section className="about-section">
        <h2>Concepts Demonstrated</h2>
        <div className="concept-grid">
          <div className="concept-card">
            <h3><code>&lt;HashRouter&gt;</code></h3>
            <p>
              Wraps the entire app. Uses the URL hash (<code>#/path</code>) to
              keep the UI in sync with the URL. Works on static hosts like
              GitHub Pages that don't support SPA fallbacks.
            </p>
          </div>
          <div className="concept-card">
            <h3><code>&lt;Routes&gt;</code> &amp; <code>&lt;Route&gt;</code></h3>
            <p>
              <code>&lt;Routes&gt;</code> acts as a switch -- it renders the
              first <code>&lt;Route&gt;</code> whose <code>path</code> matches
              the current URL. Only one route renders at a time.
            </p>
          </div>
          <div className="concept-card">
            <h3><code>&lt;Link&gt;</code></h3>
            <p>
              Replaces <code>&lt;a&gt;</code> tags. Navigates without a full
              page reload by updating the URL and triggering a re-render.
              The navbar and cards all use <code>&lt;Link&gt;</code>.
            </p>
          </div>
          <div className="concept-card">
            <h3><code>useNavigate()</code></h3>
            <p>
              Programmatic navigation from event handlers. The "Delete &amp; Go
              Back" button on project detail pages calls{" "}
              <code>navigate(-1)</code> to go back one step in history.
            </p>
          </div>
          <div className="concept-card">
            <h3><code>useParams()</code></h3>
            <p>
              Reads dynamic URL segments. When you visit{" "}
              <code>/projects/ai-chatbot</code>, <code>useParams()</code>{" "}
              returns <code>{`{ id: "ai-chatbot" }`}</code>. Check the Route
              Inspector on any project page.
            </p>
          </div>
          <div className="concept-card">
            <h3><code>path="*"</code></h3>
            <p>
              The catch-all route. If no other route matches, this renders the
              404 page. Try navigating to{" "}
              <code>/nonexistent</code> to see it in action.
            </p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>How to Use This Demo</h2>
        <ol className="usage-list">
          <li>Navigate between pages using the navbar or the cards on Home.</li>
          <li>Watch the <strong>Route Inspector</strong> at the bottom update in real time.</li>
          <li>Visit a project detail page and notice <code>useParams()</code> populate.</li>
          <li>Click "Delete &amp; Go Back" and see the navigation method change to <code>useNavigate</code>.</li>
          <li>Try a URL that doesn't exist to hit the 404 route.</li>
        </ol>
      </section>

      <div className="route-hint">
        <p>
          <strong>This page</strong> is a static route at <code>/about</code>.
          No dynamic segments, no parameters -- the simplest kind of route.
        </p>
      </div>
    </div>
  );
}
