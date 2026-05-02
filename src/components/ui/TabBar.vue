<template>
  <div class="flex flex-wrap gap-2">
    <button v-for="tab in tabs" :key="tab.id" @click="$emit('change', tab.id)"
      :class="['px-4 py-2 rounded-full font-semibold text-sm transition-colors',
        active === tab.id
          ? 'bg-blue-500 text-white'
          : 'bg-white text-gray-700 border hover:bg-gray-100']">
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup>
defineEmits(['change'])
defineProps({
  tabs:   { type: Array, required: true },  // [{ id, label }]
  active: { type: String, required: true },
})
</script>
