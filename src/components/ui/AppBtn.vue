<template>
  <button
    @click="$emit('click')"
    :type="type"
    :disabled="disabled"
    :class="['tg-btn', variantClass, sizeClass, cls]"
  >
    <i v-if="icon" :class="`bx ${icon} text-sm`"></i>
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
  size:     { type: String, default: 'md' },
  cls:      { type: String, default: '' },
})

const variantClass = computed(() => ({
  primary:   'tg-btn-primary',
  copy:      'tg-btn-copy',
  download:  'tg-btn-download',
  ghost:     'tg-btn-ghost',
  secondary: 'tg-btn-secondary',
  danger:    'tg-btn-danger',
  // legacy aliases
  green:     'tg-btn-copy',
  purple:    'tg-btn-primary',
  blue:      'tg-btn-primary',
}[props.variant] || 'tg-btn-primary'))

const sizeClass = computed(() => props.size === 'sm' ? 'px-3 py-1.5 text-xs' : props.size === 'lg' ? 'px-5 py-2.5 text-sm' : '')
</script>
