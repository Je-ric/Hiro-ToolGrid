<template>
  <h2 class="text-sm font-semibold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
    <i v-if="icon" :class="`bx ${icon} text-base ${iconColor}`"></i>
    <slot />
  </h2>
</template>

<script setup>
defineProps({
  icon:      { type: String, default: '' },
  iconColor: { type: String, default: 'text-cyan-500' },
})
</script>
