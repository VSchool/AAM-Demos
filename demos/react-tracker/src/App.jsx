import { HashRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import ProjectList from './components/ProjectList'
import ProjectDetail from './components/ProjectDetail'
import ProjectForm from './components/ProjectForm'
import { useState } from 'react'

const INITIAL_PROJECTS = [
  {
    id: 1,
    title: "Weather Dashboard",
    status: "Active",
    description: "Real-time weather app using OpenWeather API with interactive maps and 7-day forecasts.",
    tags: ["API", "Charts", "CSS"],
    created: "2026-04-15"
  },
  {
    id: 2,
    title: "Task Tracker",
    status: "In Progress",
    description: "Kanban-style task management with drag-and-drop, categories, and localStorage persistence.",
    tags: ["State", "DnD", "LocalStorage"],
    created: "2026-04-18"
  },
  {
    id: 3,
    title: "Portfolio Site",
    status: "Planning",
    description: "Personal portfolio with project showcase, blog section, and contact form.",
    tags: ["Design", "Routing", "Forms"],
    created: "2026-04-20"
  },
  {
    id: 4,
    title: "Recipe Finder",
    status: "Complete",
    description: "Search recipes by ingredients using Spoonacular API with save-to-favorites feature.",
    tags: ["API", "Search", "Favorites"],
    created: "2026-04-10"
  },
  {
    id: 5,
    title: "Budget Planner",
    status: "Active",
    description: "Monthly budget tracker with expense categories, charts, and CSV export.",
    tags: ["Charts", "Forms", "Export"],
    created: "2026-04-22"
  }
]

function App() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS)

  function addProject(project) {
    const newProject = {
      ...project,
      id: projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1,
      created: new Date().toISOString().split('T')[0]
    }
    setProjects([...projects, newProject])
  }

  return (
    <HashRouter>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<ProjectList projects={projects} />} />
          <Route path="/projects/:id" element={<ProjectDetail projects={projects} />} />
          <Route path="/new" element={<ProjectForm onAdd={addProject} />} />
        </Routes>
      </main>
    </HashRouter>
  )
}

export default App
