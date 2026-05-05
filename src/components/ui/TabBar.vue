<template>
  <div class="flex flex-wrap gap-1.5 p-1 bg-cyan-50 border border-cyan-100 rounded-xl w-fit">
    <button v-for="tab in tabs" :key="tab.id" @click="$emit('change', tab.id)"
      :class="['px-3.5 py-1.5 rounded-lg font-semibold text-xs transition-all',
        active === tab.id
          ? 'bg-cyan-500 text-white shadow-sm'
          : 'text-slate-500 hover:text-cyan-600 hover:bg-cyan-100']">
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
