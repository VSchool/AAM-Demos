<script setup>
defineProps({
  project: {
    type: Object,
    required: true
  }
})

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
  <div class="project-card">
    <router-link :to="`/projects/${project.id}`">
      <div class="card-header">
        <h3>{{ project.title }}</h3>
        <span class="badge" :class="badgeClass(project.status)">
          {{ project.status }}
        </span>
      </div>
      <p class="card-description">{{ project.description }}</p>
      <div class="card-footer">
        <span v-for="tag in project.tags" :key="tag" class="tag">
          {{ tag }}
        </span>
      </div>
    </router-link>
  </div>
</template>

<style scoped>
.project-card a {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  color: inherit;
  text-decoration: none;
}
</style>
