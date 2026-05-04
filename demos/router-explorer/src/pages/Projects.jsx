import { Link } from "react-router-dom";
import { useEffect } from "react";
import { projects } from "../data/projects";
import { useNavContext } from "../context/NavigationContext";

const statusColors = {
  Deployed: "status--deployed",
  "In Progress": "status--progress",
  Planning: "status--planning",
};

export default function Projects() {
  const { recordNavigation } = useNavContext();

  useEffect(() => {
    recordNavigation(undefined, "/projects");
  }, [recordNavigation]);

  return (
    <div className="page page-projects">
      <div className="page-header">
        <h1>Projects</h1>
        <p>
          Click any project to navigate to its detail page. Watch the Route
          Inspector -- you'll see <code>useParams()</code> populate with the
          project's <code>:id</code>.
        </p>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className="project-card"
            onClick={() =>
              recordNavigation("<Link> click", `/projects/${project.id}`)
            }
          >
            <div className="project-card-header">
              <h3>{project.name}</h3>
              <span className={`status-badge ${statusColors[project.status]}`}>
                {project.status}
              </span>
            </div>
            <p className="project-card-desc">{project.description}</p>
            <div className="project-card-tech">
              {project.techStack.map((tech) => (
                <span key={tech} className="tech-tag">
                  {tech}
                </span>
              ))}
            </div>
            <div className="project-card-footer">
              <span className="difficulty-label">{project.difficulty}</span>
              <span className="card-arrow" aria-hidden="true">&#8594;</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="route-hint">
        <p>
          <strong>Route pattern:</strong>{" "}
          <code>/projects</code> matches the static route. Clicking a card
          navigates to <code>/projects/:id</code> -- a dynamic route.
        </p>
      </div>
    </div>
  );
}
