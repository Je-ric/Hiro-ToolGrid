<template>
  <div class="tg-stat flex flex-col gap-0.5">
    <p :class="['font-bold leading-tight', large ? 'text-2xl' : 'text-lg', valueColor]">{{ value }}</p>
    <p class="text-xs text-slate-400 font-medium">{{ label }}</p>
  </div>
</template>
<script setup>
defineProps({
  value:      { type: [String, Number], required: true },
  label:      { type: String, required: true },
  valueColor: { type: String, default: 'text-cyan-600' },
  large:      { type: Boolean, default: true },
})
</script>
