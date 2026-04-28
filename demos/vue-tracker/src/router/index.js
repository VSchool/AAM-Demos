import { createRouter, createWebHashHistory } from 'vue-router'
import ProjectList from '../views/ProjectList.vue'
import ProjectDetail from '../views/ProjectDetail.vue'
import ProjectForm from '../views/ProjectForm.vue'

const routes = [
  { path: '/', name: 'ProjectList', component: ProjectList },
  { path: '/projects/:id', name: 'ProjectDetail', component: ProjectDetail },
  { path: '/new', name: 'ProjectForm', component: ProjectForm }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
