<template>
  <div :class="['tg-card p-5 flex flex-col', emphasis ? 'tg-card-emphasis' : '', gapClass, cls]">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  gap:      { type: String, default: '4' },
  cls:      { type: String, default: '' },
  emphasis: { type: Boolean, default: false },
})
const gapClass = computed(() => `gap-${props.gap}`)
</script>
