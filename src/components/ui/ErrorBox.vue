<template>
  <div v-if="message" class="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
    <i class="bx bx-error-circle text-base shrink-0"></i>
    {{ message }}
  </div>
</template>
<script setup>
defineProps({ message: { type: String, default: '' } })
</script>
