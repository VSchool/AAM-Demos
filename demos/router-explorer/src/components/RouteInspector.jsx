import { useLocation, useParams } from "react-router-dom";
import { useNavContext } from "../context/NavigationContext";

export default function RouteInspector() {
  const location = useLocation();
  const params = useParams();
  const { lastNavMethod, matchedRoute } = useNavContext();

  const hasParams = Object.keys(params).length > 0;

  return (
    <div className="route-inspector" role="region" aria-label="Route Inspector">
      <div className="inspector-header">
        <span className="inspector-icon" aria-hidden="true">&#128269;</span>
        <h3>Route Inspector</h3>
        <span className="inspector-badge">Live</span>
      </div>
      <div className="inspector-grid">
        <div className="inspector-item">
          <span className="inspector-label">Current Path</span>
          <code className="inspector-value">{location.pathname}</code>
        </div>
        <div className="inspector-item">
          <span className="inspector-label">Matched Route</span>
          <code className="inspector-value">{matchedRoute}</code>
        </div>
        <div className="inspector-item">
          <span className="inspector-label">useParams()</span>
          <code className="inspector-value">
            {hasParams ? JSON.stringify(params, null, 2) : "{ }"}
          </code>
        </div>
        <div className="inspector-item">
          <span className="inspector-label">Navigation Method</span>
          <code className="inspector-value inspector-value--method">
            {lastNavMethod}
          </code>
        </div>
      </div>
    </div>
  );
}
