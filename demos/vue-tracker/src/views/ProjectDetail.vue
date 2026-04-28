<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProjects } from '../stores/projects.js'

const route = useRoute()
const { getProject } = useProjects()

const project = computed(() => getProject(route.params.id))

function badgeClass(status) {
  const map = {
    'Active': 'badge-active',
    'Complete': 'badge-complete',
    'Planning': 'badge-planning',
    'In Progress': 'badge-in-progress'
  }
  return map[status] || ''
}
</script>

<template>
  <div v-if="project" class="detail-page">
    <router-link to="/" class="back-link">
      &larr; Back to projects
    </router-link>

    <div class="detail-header">
      <h2>{{ project.title }}</h2>
      <span class="badge" :class="badgeClass(project.status)">
        {{ project.status }}
      </span>
    </div>

    <div class="detail-meta">
      <span>Created: {{ project.created }}</span>
      <span>Status: {{ project.status }}</span>
    </div>

    <p class="detail-description">{{ project.description }}</p>

    <div class="detail-tags">
      <span v-for="tag in project.tags" :key="tag" class="tag">
        {{ tag }}
      </span>
    </div>
  </div>

  <div v-else class="not-found">
    <h2>Project not found</h2>
    <router-link to="/">Back to projects</router-link>
  </div>
</template>

<style scoped>
/* Layout handled by global styles */
</style>
