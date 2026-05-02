<template>
  <div v-if="value" class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
    <p v-if="label" class="text-gray-500 text-sm mb-1">{{ label }}</p>
    <p class="text-2xl font-bold text-blue-600">{{ value }}</p>
  </div>
</template>

<script setup>
defineProps({
  value: { type: String, default: '' },
  label: { type: String, default: '' },
})
</script>
