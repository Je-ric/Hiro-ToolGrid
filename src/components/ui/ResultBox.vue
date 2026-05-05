<template>
  <div v-if="value" class="tg-result text-lg">{{ value }}</div>
</template>
<script setup>
defineProps({ value: { type: String, default: '' } })
</script>
