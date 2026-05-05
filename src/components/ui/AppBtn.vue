<template>
  <button
    @click="$emit('click')"
    :type="type"
    :disabled="disabled"
    :class="['tg-btn', variantClass, sizeClass, full ? 'tg-btn-full' : '']"
  >
    <i v-if="icon" :class="`bx ${icon}`" style="font-size:0.9em"></i>
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'
defineEmits(['click'])
const props = defineProps({
  variant:  { type: String, default: 'primary' },
  icon:     { type: String, default: '' },
  type:     { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  size:     { type: String, default: 'md' },   // sm | md | lg
  full:     { type: Boolean, default: false },
  // legacy
  cls:      { type: String, default: '' },
})

const MAP = {
  primary: 'tg-btn-primary', copy: 'tg-btn-copy', download: 'tg-btn-download',
  ghost: 'tg-btn-ghost', secondary: 'tg-btn-secondary', danger: 'tg-btn-danger',
  green: 'tg-btn-copy', purple: 'tg-btn-primary', blue: 'tg-btn-primary',
}
const variantClass = computed(() => MAP[props.variant] || 'tg-btn-primary')
const sizeClass    = computed(() => ({ sm: 'tg-btn-sm', lg: 'tg-btn-lg' }[props.size] || ''))
</script>
