import { useLocation, Link } from "react-router-dom";
import { useNavContext } from "../context/NavigationContext";

export default function Breadcrumbs() {
  const location = useLocation();
  const { recordNavigation } = useNavContext();
  const pathSegments = location.pathname
    .split("/")
    .filter((segment) => segment !== "");

  if (pathSegments.length === 0) return null;

  const crumbs = pathSegments.map((segment, index) => {
    const path = "/" + pathSegments.slice(0, index + 1).join("/");
    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return { path, label };
  });

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li>
          <Link
            to="/"
            onClick={() => recordNavigation("<Link> click", "/")}
          >
            Home
          </Link>
        </li>
        {crumbs.map((crumb, index) => (
          <li key={crumb.path}>
            <span className="breadcrumb-separator" aria-hidden="true">
              /
            </span>
            {index === crumbs.length - 1 ? (
              <span className="breadcrumb-current" aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.path}
                onClick={() =>
                  recordNavigation("<Link> click", crumb.path)
                }
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
