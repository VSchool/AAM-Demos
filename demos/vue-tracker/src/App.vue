<script setup>
import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <AppHeader />
  <main class="container">
    <router-view />
  </main>
</template>

<style scoped>
main {
  padding-bottom: 3rem;
}
</style>
