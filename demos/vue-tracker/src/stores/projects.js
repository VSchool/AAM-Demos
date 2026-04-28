import { ref } from 'vue'
import { INITIAL_PROJECTS } from '../data.js'

// Shared reactive state — a simple composable pattern
// (Students: compare this to React's useState + context or lifting state up)
const projects = ref([...INITIAL_PROJECTS])

export function useProjects() {
  function addProject(project) {
    const newId = projects.value.length
      ? Math.max(...projects.value.map((p) => p.id)) + 1
      : 1
    projects.value.push({
      ...project,
      id: newId,
      created: new Date().toISOString().split('T')[0]
    })
  }

  function getProject(id) {
    return projects.value.find((p) => p.id === Number(id))
  }

  return { projects, addProject, getProject }
}
