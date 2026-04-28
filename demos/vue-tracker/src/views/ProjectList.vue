<script setup>
import { ref, computed } from 'vue'
import { useProjects } from '../stores/projects.js'
import SearchBar from '../components/SearchBar.vue'
import ProjectCard from '../components/ProjectCard.vue'

const { projects } = useProjects()
const searchQuery = ref('')
const activeFilter = ref('All')

const statuses = ['All', 'Active', 'In Progress', 'Complete', 'Planning']

const filteredProjects = computed(() => {
  return projects.value.filter((project) => {
    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
    const matchesStatus =
      activeFilter.value === 'All' || project.status === activeFilter.value
    return matchesSearch && matchesStatus
  })
})
</script>

<template>
  <div>
    <div class="filter-bar">
      <SearchBar v-model="searchQuery" />
      <div class="status-filters">
        <button
          v-for="status in statuses"
          :key="status"
          class="filter-pill"
          :class="{ active: activeFilter === status }"
          @click="activeFilter = status"
        >
          {{ status }}
        </button>
      </div>
    </div>

    <div v-if="filteredProjects.length" class="project-grid">
      <ProjectCard
        v-for="project in filteredProjects"
        :key="project.id"
        :project="project"
      />
    </div>

    <div v-else class="empty-state">
      <p>No projects found.</p>
      <p>Try adjusting your search or filter.</p>
    </div>
  </div>
</template>

<style scoped>
/* Layout handled by global styles */
</style>
