<template>
  <div v-if="message" class="bg-red-50 border border-red-200 rounded-lg p-3 text-center text-red-600 font-medium text-sm">
    {{ message }}
  </div>
</template>

<script setup>
defineProps({ message: { type: String, default: '' } })
</script>
