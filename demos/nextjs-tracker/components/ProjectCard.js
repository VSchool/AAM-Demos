// Server component — receives project data as props, no interactivity needed
// Uses next/link for navigation (compare to React Router's <Link>)
import Link from "next/link";

export default function ProjectCard({ project }) {
  return (
    <Link href={`/projects/${project.id}`} className="card">
      <div className="card-header">
        <h3 className="card-title">{project.title}</h3>
        <span className={`badge badge-${project.status.toLowerCase().replace(" ", "-")}`}>
          {project.status}
        </span>
      </div>
      <p className="card-description">{project.description}</p>
      <div className="card-footer">
        <div className="card-tags">
          {project.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
        <span className="card-date">{project.created}</span>
      </div>
    </Link>
  );
}
