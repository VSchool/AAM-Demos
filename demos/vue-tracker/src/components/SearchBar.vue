<script setup>
defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>

<template>
  <input
    type="text"
    class="search-input"
    placeholder="Search projects..."
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<style scoped>
/* Styles inherited from global .search-input */
</style>
