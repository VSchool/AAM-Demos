import { useState } from 'react'
import ProjectCard from './ProjectCard'
import SearchBar from './SearchBar'

const STATUS_OPTIONS = ['All', 'Active', 'In Progress', 'Complete', 'Planning']

function ProjectList({ projects }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const filtered = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All' || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="project-list">
      <div className="list-header">
        <h1>Projects</h1>
        <p className="project-count">{filtered.length} project{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      <SearchBar value={search} onChange={setSearch} />

      <div className="status-filters">
        {STATUS_OPTIONS.map(status => (
          <button
            key={status}
            className={`status-pill ${statusFilter === status ? 'active' : ''}`}
            onClick={() => setStatusFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="cards-grid">
        {filtered.length > 0 ? (
          filtered.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <p className="empty-state">No projects match your filters.</p>
        )}
      </div>
    </div>
  )
}

export default ProjectList
