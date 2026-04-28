import { useParams, Link } from 'react-router-dom'

function ProjectDetail({ projects }) {
  const { id } = useParams()
  const project = projects.find(p => p.id === Number(id))

  if (!project) {
    return (
      <div className="detail-not-found">
        <h2>Project not found</h2>
        <Link to="/" className="back-link">&larr; Back to projects</Link>
      </div>
    )
  }

  return (
    <div className="project-detail">
      <Link to="/" className="back-link">&larr; Back to projects</Link>

      <div className="detail-header">
        <h1>{project.title}</h1>
        <span className={`badge badge-${project.status.toLowerCase().replace(' ', '-')}`}>
          {project.status}
        </span>
      </div>

      <p className="detail-date">Created {project.created}</p>

      <div className="detail-section">
        <h3>Description</h3>
        <p>{project.description}</p>
      </div>

      <div className="detail-section">
        <h3>Tags</h3>
        <div className="card-tags">
          {project.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectDetail
