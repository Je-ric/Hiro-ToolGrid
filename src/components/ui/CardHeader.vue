<template>
  <div class="flex items-center gap-2">
    <i v-if="icon" :class="`bx ${icon} text-base`" :style="`color:${iconColor}`"></i>
    <span class="text-xs font-semibold uppercase tracking-wider text-slate-500"><slot /></span>
  </div>
</template>

<script setup>
defineProps({
  icon:      { type: String, default: '' },
  iconColor: { type: String, default: '#0891b2' },
})
</script>
