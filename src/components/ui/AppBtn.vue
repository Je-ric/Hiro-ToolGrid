<template>
  <button @click="$emit('click')" :type="type" :disabled="disabled"
    :class="[base, variants[variant], disabled ? 'opacity-50 cursor-not-allowed' : '', cls]">
    <i v-if="icon" :class="`bx ${icon}`"></i>
    <slot />
  </button>
</template>

<script setup>
defineEmits(['click'])
defineProps({
  variant:  { type: String, default: 'primary' },
  icon:     { type: String, default: '' },
  type:     { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  cls:      { type: String, default: '' },
})

const base = 'flex-1 flex items-center justify-center gap-2 font-semibold py-2 rounded-xl transition-colors text-sm'

const variants = {
  primary:   'bg-blue-500 text-white hover:bg-blue-600',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  danger:    'bg-red-500 text-white hover:bg-red-600',
  ghost:     'bg-gray-300 text-gray-800 hover:bg-gray-400',
  green:     'bg-green-500 text-white hover:bg-green-600',
  purple:    'bg-purple-500 text-white hover:bg-purple-600',
}
</script>
