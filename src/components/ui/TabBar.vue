<template>
  <div class="tg-tabs">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      @click="$emit('change', tab.id)"
      :class="['tg-tab', active === tab.id ? 'tg-tab-active' : '']"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup>
defineEmits(['change'])
defineProps({
  tabs:   { type: Array, required: true },
  active: { type: String, required: true },
})
</script>
