<template>
  <div :class="['tg-card p-5 flex flex-col', emphasis ? 'tg-card-em' : '', `gap-${gap}`, stretch ? '' : 'self-start', cls]">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  gap:      { type: String, default: '4' },
  cls:      { type: String, default: '' },
  emphasis: { type: Boolean, default: false },
  stretch:  { type: Boolean, default: false },  // set true when card must fill full height
})
</script>
