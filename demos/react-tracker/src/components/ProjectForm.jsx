import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function ProjectForm({ onAdd }) {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('Planning')
  const [tagsInput, setTagsInput] = useState('')

  function handleSubmit(e) {
    e.preventDefault()

    if (!title.trim()) return

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)

    onAdd({ title: title.trim(), description: description.trim(), status, tags })
    navigate('/')
  }

  return (
    <div className="form-container">
      <h1>New Project</h1>
      <form onSubmit={handleSubmit} className="project-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Project name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="What is this project about?"
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="Planning">Planning</option>
            <option value="Active">Active</option>
            <option value="In Progress">In Progress</option>
            <option value="Complete">Complete</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags (comma-separated)</label>
          <input
            id="tags"
            type="text"
            value={tagsInput}
            onChange={e => setTagsInput(e.target.value)}
            placeholder="React, API, CSS"
          />
        </div>

        <button type="submit" className="submit-btn">Add Project</button>
      </form>
    </div>
  )
}

export default ProjectForm
