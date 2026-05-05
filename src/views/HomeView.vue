<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">

    <!-- Header -->
    <header class="bg-white border-b border-cyan-100 shadow-sm px-6 py-4">
      <div class="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-800 tracking-tight" style="font-family:'Oswald',sans-serif">
            Tool<span class="text-cyan-500">Grid</span>
          </h1>
          <p class="text-xs text-slate-400 mt-0.5">{{ tools.length }} tools — all in your browser, no backend</p>
        </div>
        <div class="relative">
          <i class="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          <input v-model="search" placeholder="Search tools..."
            class="tg-input pl-8 w-56 sm:w-72" />
        </div>
      </div>
    </header>

    <div class="flex flex-1 max-w-screen-2xl mx-auto w-full">

      <!-- Sidebar -->
      <aside class="hidden md:flex flex-col gap-0.5 w-52 shrink-0 p-4 pt-6">
        <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-2">Categories</p>
        <button v-for="cat in categories" :key="cat.id" @click="activeCat = cat.id"
          :class="['flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all text-left w-full',
            activeCat === cat.id
              ? 'bg-cyan-500 text-white shadow-sm'
              : 'text-slate-500 hover:bg-cyan-50 hover:text-cyan-700']">
          <i :class="`bx ${cat.icon} text-base`"></i>
          <span class="flex-1 truncate">{{ cat.label }}</span>
          <span :class="['text-[10px] font-bold px-1.5 py-0.5 rounded-full',
            activeCat === cat.id ? 'bg-cyan-400 text-white' : 'bg-slate-100 text-slate-400']">
            {{ cat.id === 'all' ? tools.length : tools.filter(t => t.category === cat.id).length }}
          </span>
        </button>
      </aside>

      <!-- Mobile pill bar -->
      <div class="md:hidden flex gap-2 overflow-x-auto px-4 pt-4 scrollbar-hide w-full absolute">
      </div>

      <!-- Main -->
      <main class="flex-1 p-4 md:p-6 min-w-0">

        <!-- Mobile category pills -->
        <div class="md:hidden flex gap-2 overflow-x-auto scrollbar-hide mb-4 -mx-1 px-1">
          <button v-for="cat in categories" :key="cat.id" @click="activeCat = cat.id"
            :class="['flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all',
              activeCat === cat.id ? 'bg-cyan-500 text-white' : 'bg-white text-slate-500 border border-cyan-100 hover:border-cyan-300']">
            <i :class="`bx ${cat.icon} text-xs`"></i>{{ cat.label }}
          </button>
        </div>

        <!-- Filtered / searched -->
        <template v-if="search || activeCat !== 'all'">
          <div class="mb-5 flex items-center gap-2">
            <h2 class="text-base font-bold text-slate-700" style="font-family:'Oswald',sans-serif">
              {{ search ? `Results for "${search}"` : categories.find(c => c.id === activeCat)?.label }}
            </h2>
            <span class="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{{ visibleTools.length }}</span>
            <button @click="search=''; activeCat='all'" class="ml-auto text-xs text-cyan-500 hover:text-cyan-700 font-medium">
              Clear ×
            </button>
          </div>
          <div v-if="visibleTools.length === 0" class="text-center py-20 text-slate-400">
            <i class="bx bx-search text-5xl mb-3 block text-cyan-200"></i>
            No tools match "{{ search }}"
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            <ToolCard v-for="tool in visibleTools" :key="tool.path" :tool="tool" />
          </div>
        </template>

        <!-- Grouped default -->
        <template v-else>
          <div v-for="group in groupedTools" :key="group.category" class="mb-10">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-1 h-5 rounded-full bg-cyan-400"></div>
              <i :class="`bx ${group.icon} text-base ${group.iconColor}`"></i>
              <h2 class="text-sm font-bold text-slate-600 uppercase tracking-wider" style="font-family:'Oswald',sans-serif">
                {{ group.category }}
              </h2>
              <div class="flex-1 h-px bg-cyan-100 ml-1"></div>
              <span class="text-xs text-slate-400">{{ group.tools.length }}</span>
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

const groupedTools = computed(() =>
  categories.filter(c => c.id !== 'all').map(c => ({
    category:  c.label,
    icon:      c.icon,
    iconColor: { 'Text & Writing': 'text-teal-500', 'Converters': 'text-sky-500', 'Developer Tools': 'text-cyan-600', 'Math & Science': 'text-cyan-500', 'Fun & Visual': 'text-teal-400' }[c.id] || 'text-cyan-500',
    tools: tools.filter(t => t.category === c.id),
  })).filter(g => g.tools.length > 0)
)
</script>
