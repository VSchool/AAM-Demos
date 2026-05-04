import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { projects } from "../data/projects";
import { useNavContext } from "../context/NavigationContext";

const statusColors = {
  Deployed: "status--deployed",
  "In Progress": "status--progress",
  Planning: "status--planning",
};

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recordNavigation } = useNavContext();

  useEffect(() => {
    recordNavigation(undefined, "/projects/:id");
  }, [recordNavigation]);

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="page page-not-found">
        <h1>Project Not Found</h1>
        <p>
          No project matches the id <code>{id}</code>.
        </p>
        <Link
          to="/projects"
          className="btn btn-primary"
          onClick={() => recordNavigation("<Link> click", "/projects")}
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    // Simulated delete -- just navigate back
    recordNavigation("useNavigate(-1)", "/projects");
    navigate(-1);
  };

  return (
    <div className="page page-detail">
      <div className="detail-back">
        <Link
          to="/projects"
          className="back-link"
          onClick={() => recordNavigation("<Link> click", "/projects")}
        >
          &#8592; Back to Projects
        </Link>
      </div>

      <article className="detail-card">
        <div className="detail-header">
          <h1>{project.name}</h1>
          <span className={`status-badge ${statusColors[project.status]}`}>
            {project.status}
          </span>
        </div>

        <p className="detail-description">{project.description}</p>

        <div className="detail-section">
          <h3>Tech Stack</h3>
          <div className="detail-tech">
            {project.techStack.map((tech) => (
              <span key={tech} className="tech-tag tech-tag--lg">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="detail-section">
          <h3>Features</h3>
          <ul className="detail-features">
            {project.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>

        <div className="detail-meta">
          <div className="meta-item">
            <span className="meta-label">Difficulty</span>
            <span className="meta-value">{project.difficulty}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Route ID</span>
            <code className="meta-value">{id}</code>
          </div>
        </div>

        <div className="detail-actions">
          <Link
            to="/projects"
            className="btn btn-secondary"
            onClick={() => recordNavigation("<Link> click", "/projects")}
          >
            Back to Projects
          </Link>
          <button
            className="btn btn-danger"
            onClick={handleDelete}
          >
            Delete &amp; Go Back
          </button>
        </div>

        <div className="route-hint">
          <p>
            <strong>What's happening:</strong> This page uses{" "}
            <code>useParams()</code> to read <code>:id</code> from the URL.
            The "Delete &amp; Go Back" button uses <code>useNavigate(-1)</code>{" "}
            for programmatic navigation. Check the Route Inspector below.
          </p>
        </div>
      </article>
    </div>
  );
}
