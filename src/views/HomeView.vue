<template>
  <div class="bg-gray-100 min-h-screen p-6 md:p-10">
    <div class="max-w-6xl mx-auto mb-10 text-center">
      <p class="text-blue-500 font-medium tracking-widest text-sm uppercase mb-2">Vue Frontend</p>
      <h1 class="text-5xl font-bold text-gray-800">ToolGrid</h1>
      <p class="text-gray-400 mt-2 text-lg font-light">A collection of interactive mini-tools built with Vue & Tailwind</p>
    </div>

    <div v-for="group in groups" :key="group.label" class="max-w-6xl mx-auto mb-10">
      <div class="flex items-center gap-3 mb-5">
        <i :class="`bx ${group.icon} text-xl ${group.iconColor}`"></i>
        <h2 class="text-xl font-bold text-gray-700">{{ group.label }}</h2>
        <div class="flex-1 h-px bg-gray-200"></div>
        <span class="text-xs text-gray-400">{{ group.tools.length }} tools</span>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <ToolCard v-for="tool in group.tools" :key="tool.path" :tool="tool" />
      </div>
    </div>

    <p class="text-center text-gray-400 text-sm mt-4 font-light">ToolGrid — {{ tools.length }} tools</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { tools } from '../data/tools.js'
import ToolCard from '../components/tools/ToolCard.vue'

const groups = computed(() => [
  {
    label: 'General Tools',
    icon: 'bx-wrench',
    iconColor: 'text-blue-500',
    tools: tools.filter(t => +t.num <= 16),
  },
  {
    label: 'Developer Tools',
    icon: 'bx-code-alt',
    iconColor: 'text-purple-500',
    tools: tools.filter(t => [17,18,19,20,21,22,23,24,25].includes(+t.num)),
  },
  {
    label: 'Productivity & Fun',
    icon: 'bx-joystick',
    iconColor: 'text-pink-500',
    tools: tools.filter(t => [26,27,28].includes(+t.num)),
  },
])
</script>
