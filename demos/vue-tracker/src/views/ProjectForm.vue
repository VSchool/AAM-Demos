<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProjects } from '../stores/projects.js'

const router = useRouter()
const { addProject } = useProjects()

const title = ref('')
const description = ref('')
const status = ref('Planning')
const tagsInput = ref('')

const statusOptions = ['Active', 'In Progress', 'Planning', 'Complete']

function handleSubmit() {
  if (!title.value.trim()) return

  const tags = tagsInput.value
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  addProject({
    title: title.value.trim(),
    description: description.value.trim(),
    status: status.value,
    tags
  })

  router.push('/')
}
</script>

<template>
  <div class="form-page">
    <h2>Add New Project</h2>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">Title</label>
        <input
          id="title"
          v-model="title"
          type="text"
          placeholder="Project name"
          required
        />
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="description"
          placeholder="What is this project about?"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="status">Status</label>
        <select id="status" v-model="status">
          <option v-for="opt in statusOptions" :key="opt" :value="opt">
            {{ opt }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="tags">Tags</label>
        <input
          id="tags"
          v-model="tagsInput"
          type="text"
          placeholder="API, Charts, CSS"
        />
        <p class="form-hint">Separate tags with commas</p>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">Add Project</button>
        <router-link to="/" class="btn btn-secondary">Cancel</router-link>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Layout handled by global styles */
</style>
