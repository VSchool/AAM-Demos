import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useNavContext } from "../context/NavigationContext";

export default function NotFound() {
  const location = useLocation();
  const { recordNavigation } = useNavContext();

  useEffect(() => {
    recordNavigation(undefined, "* (no match)");
  }, [recordNavigation]);

  return (
    <div className="page page-404">
      <div className="not-found-card">
        <span className="not-found-code">404</span>
        <h1>Page Not Found</h1>
        <p>
          No <code>&lt;Route&gt;</code> matches the path{" "}
          <code>{location.pathname}</code>.
        </p>
        <p className="not-found-explanation">
          This is the catch-all route: <code>&lt;Route path="*"&gt;</code>.
          When React Router can't find a matching path, it falls through to
          this wildcard. Every app should have one.
        </p>
        <Link
          to="/"
          className="btn btn-primary"
          onClick={() => recordNavigation("<Link> click", "/")}
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
