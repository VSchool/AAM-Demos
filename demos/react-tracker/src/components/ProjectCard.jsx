import { Link } from 'react-router-dom'

function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project.id}`} className="card">
      <div className="card-top">
        <h2 className="card-title">{project.title}</h2>
        <span className={`badge badge-${project.status.toLowerCase().replace(' ', '-')}`}>
          {project.status}
        </span>
      </div>
      <p className="card-description">{project.description}</p>
      <div className="card-tags">
        {project.tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
    </Link>
  )
}

export default ProjectCard
