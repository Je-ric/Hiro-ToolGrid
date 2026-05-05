<template>
  <div class="min-h-screen flex flex-col" style="background:var(--bg-page)">

    <!-- Header -->
    <header class="bg-white border-b px-6 py-4" style="border-color:var(--border);box-shadow:var(--shadow-sm)">
      <div class="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight" style="font-family:'Oswald',sans-serif;color:var(--text-base)">
            Tool<span style="color:var(--accent)">Grid</span>
          </h1>
          <p class="text-xs mt-0.5" style="color:var(--text-faint)">{{ tools.length }} tools — all in your browser</p>
        </div>
        <div class="relative">
          <i class="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-sm" style="color:var(--text-faint)"></i>
          <input v-model="search" placeholder="Search tools…" class="tg-input pl-8 w-56 sm:w-72" />
        </div>
      </div>
    </header>

    <div class="flex flex-1 max-w-screen-2xl mx-auto w-full">

      <!-- Sidebar -->
      <aside class="hidden md:flex flex-col gap-0.5 w-52 shrink-0 p-4 pt-6">
        <p class="tg-label px-3 mb-2">Categories</p>
        <button v-for="cat in categories" :key="cat.id" @click="activeCat = cat.id"
          :class="['flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left w-full',
            activeCat === cat.id ? 'tg-tab-active' : 'tg-tab']"
          style="border-radius:0.5rem">
          <i :class="`bx ${cat.icon} text-sm`"></i>
          <span class="flex-1 truncate">{{ cat.label }}</span>
          <span class="text-xs font-bold px-1.5 py-0.5 rounded-full"
            :style="activeCat === cat.id ? 'background:rgba(255,255,255,0.25);color:#fff' : 'background:#f1f5f9;color:#64748b'">
            {{ cat.id === 'all' ? tools.length : tools.filter(t => t.category === cat.id).length }}
          </span>
        </button>
      </aside>

      <!-- Main -->
      <main class="flex-1 p-4 md:p-6 min-w-0">

        <!-- Mobile pills -->
        <div class="md:hidden flex gap-2 overflow-x-auto scrollbar-hide mb-4 pb-1">
          <button v-for="cat in categories" :key="cat.id" @click="activeCat = cat.id"
            :class="['tg-tab shrink-0', activeCat === cat.id ? 'tg-tab-active' : '']">
            <i :class="`bx ${cat.icon} mr-1`"></i>{{ cat.label }}
          </button>
        </div>

        <!-- Filtered/searched -->
        <template v-if="search || activeCat !== 'all'">
          <div class="mb-5 flex items-center gap-2">
            <h2 class="text-sm font-bold" style="font-family:'Oswald',sans-serif;color:var(--text-base)">
              {{ search ? `Results for "${search}"` : categories.find(c => c.id === activeCat)?.label }}
            </h2>
            <span class="text-xs px-2 py-0.5 rounded-full" style="background:#f1f5f9;color:var(--text-muted)">{{ visibleTools.length }}</span>
            <button @click="search=''; activeCat='all'" class="ml-auto text-xs font-semibold" style="color:var(--accent)">Clear ×</button>
          </div>
          <p v-if="visibleTools.length === 0" class="text-center py-20" style="color:var(--text-faint)">
            <i class="bx bx-search text-5xl block mb-3"></i>No tools match "{{ search }}"
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            <ToolCard v-for="tool in visibleTools" :key="tool.path" :tool="tool" />
          </div>
        </template>

        <!-- Grouped -->
        <template v-else>
          <div v-for="group in groupedTools" :key="group.category" class="mb-10">
            <div class="tg-section-title mb-4">
              <i :class="`bx ${group.icon}`" :style="`color:${group.color}`"></i>
              {{ group.category }}
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

const GROUP_COLORS = { 'Text & Writing': '#0d9488', 'Converters': '#0284c7', 'Developer Tools': '#0891b2', 'Math & Science': '#0891b2', 'Fun & Visual': '#0d9488' }

const groupedTools = computed(() =>
  categories.filter(c => c.id !== 'all').map(c => ({
    category: c.label, icon: c.icon,
    color: GROUP_COLORS[c.id] || '#0891b2',
    tools: tools.filter(t => t.category === c.id),
  })).filter(g => g.tools.length > 0)
)
</script>
