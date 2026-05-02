<template>
  <div class="bg-gray-100 min-h-screen p-6 md:p-10">
    <div class="max-w-6xl mx-auto mb-10 text-center">
      <p class="text-blue-500 font-medium tracking-widest text-sm uppercase mb-2">Vue Frontend</p>
      <h1 class="text-5xl font-bold text-gray-800">ToolGrid</h1>
      <p class="text-gray-400 mt-2 text-lg font-light">A collection of interactive mini-tools built with Vue & Tailwind</p>
    </div>

    <div class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      <ToolCard v-for="tool in tools" :key="tool.path" :tool="tool" />
    </div>

    <p class="text-center text-gray-400 text-sm mt-12 font-light">ToolGrid — {{ tools.length }} tools</p>
  </div>
</template>

<script setup>
import { tools } from '../data/tools.js'
import ToolCard from '../components/tools/ToolCard.vue'
</script>
