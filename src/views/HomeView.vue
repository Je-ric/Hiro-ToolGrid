<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">

    <!-- Header -->
    <header class="bg-white border-b border-gray-200 px-6 py-5">
      <div class="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 tracking-tight">ToolGrid</h1>
          <p class="text-gray-400 text-sm mt-0.5">{{ tools.length }} interactive tools — all in your browser</p>
        </div>
        <input v-model="search" placeholder="Search tools..."
          class="w-64 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition" />
      </div>
    </header>

    <div class="flex flex-1 max-w-screen-2xl mx-auto w-full">

      <!-- Sidebar -->
      <aside class="hidden md:flex flex-col gap-1 w-52 shrink-0 p-4 pt-6">
        <button v-for="cat in categories" :key="cat.id" @click="activeCat = cat.id"
          :class="['flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left w-full',
            activeCat === cat.id
              ? 'bg-blue-500 text-white shadow-sm'
              : 'text-gray-600 hover:bg-white hover:text-gray-900']">
          <i :class="`bx ${cat.icon} text-base`"></i>
          <span>{{ cat.label }}</span>
          <span :class="['ml-auto text-xs font-semibold px-1.5 py-0.5 rounded-full',
            activeCat === cat.id ? 'bg-blue-400 text-white' : 'bg-gray-200 text-gray-500']">
            {{ cat.id === 'all' ? tools.length : tools.filter(t => t.category === cat.id).length }}
          </span>
        </button>
      </aside>

      <!-- Mobile category bar -->
      <div class="md:hidden flex gap-2 overflow-x-auto px-4 pt-4 pb-0 scrollbar-hide w-full">
        <button v-for="cat in categories" :key="cat.id" @click="activeCat = cat.id"
          :class="['flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors shrink-0',
            activeCat === cat.id ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 border border-gray-200']">
          <i :class="`bx ${cat.icon}`"></i>
          {{ cat.label }}
        </button>
      </div>

      <!-- Main content -->
      <main class="flex-1 p-4 md:p-6 min-w-0">

        <!-- Filtered / searched: flat grid -->
        <template v-if="search || activeCat !== 'all'">
          <div class="mb-4 flex items-center gap-2">
            <h2 class="text-lg font-bold text-gray-800">
              {{ search ? `Results for "${search}"` : categories.find(c => c.id === activeCat)?.label }}
            </h2>
            <span class="text-xs text-gray-400">{{ visibleTools.length }} tools</span>
            <button v-if="search || activeCat !== 'all'" @click="search=''; activeCat='all'"
              class="ml-auto text-xs text-blue-500 hover:text-blue-700">Clear</button>
          </div>
          <div v-if="visibleTools.length === 0" class="text-center py-20 text-gray-400">
            <i class="bx bx-search text-5xl mb-3 block"></i>
            No tools match "{{ search }}"
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            <ToolCard v-for="tool in visibleTools" :key="tool.path" :tool="tool" />
          </div>
        </template>

        <!-- Default: grouped by category -->
        <template v-else>
          <div v-for="group in groupedTools" :key="group.category" class="mb-10">
            <div class="flex items-center gap-2 mb-4">
              <i :class="`bx ${group.icon} text-lg ${group.iconColor}`"></i>
              <h2 class="text-base font-bold text-gray-700">{{ group.category }}</h2>
              <div class="flex-1 h-px bg-gray-200 ml-1"></div>
              <span class="text-xs text-gray-400">{{ group.tools.length }}</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              <ToolCard v-for="tool in group.tools" :key="tool.path" :tool="tool" />
            </div>
          </div>
        </template>

      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { tools, categories } from '../data/tools.js'
import ToolCard from '../components/tools/ToolCard.vue'

const search    = ref('')
const activeCat = ref('all')

const visibleTools = computed(() => {
  let list = tools
  if (activeCat.value !== 'all') list = list.filter(t => t.category === activeCat.value)
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(t => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q))
  }
  return list
})

const catMeta = Object.fromEntries(categories.map(c => [c.id, c]))

const groupedTools = computed(() =>
  categories
    .filter(c => c.id !== 'all')
    .map(c => ({
      category:  c.label,
      icon:      c.icon,
      iconColor: c.id === 'Text & Writing'  ? 'text-green-500'  :
                 c.id === 'Converters'       ? 'text-orange-500' :
                 c.id === 'Developer Tools'  ? 'text-purple-500' :
                 c.id === 'Math & Science'   ? 'text-blue-500'   :
                 'text-pink-500',
      tools: tools.filter(t => t.category === c.id),
    }))
    .filter(g => g.tools.length > 0)
)
</script>
