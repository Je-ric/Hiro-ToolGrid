<template>
  <div class="min-h-screen flex flex-col" style="background:var(--bg-page)">

    <!-- Header -->
    <header class="bg-white border-b sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
      style="border-color:var(--border);box-shadow:var(--shadow-sm)">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white text-lg"
          style="background:linear-gradient(135deg,#15803d,#22c55e)">
          <i class="bx bx-grid-alt"></i>
        </div>
        <span class="text-xl font-bold tracking-tight" style="color:var(--text-base)">
          Tool<span style="color:var(--accent)">Grid</span>
        </span>
      </div>
      <div class="flex items-center gap-3">
        <div class="relative hidden sm:block">
          <i class="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-sm" style="color:var(--text-faint)"></i>
          <input type="search" aria-label="Search tools" v-model="search" placeholder="Search tools…" class="tg-input pl-8 w-48 sm:w-64" />
        </div>
        <span class="text-xs font-medium px-2.5 py-1 rounded-full hidden sm:inline"
          style="background:var(--bg-accent);color:var(--text-muted)">
          {{ tools.length }} tools
        </span>
        <a href="https://github.com/Je-ric" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile"
          class="text-sm font-medium transition-colors flex items-center gap-1.5"
          style="color:var(--text-muted)"
          onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--text-muted)'">
          <i class="bx bxl-github text-lg"></i>
          <span class="hidden md:inline">@Je-ric</span>
        </a>
      </div>
    </header>

    <!-- Mobile search -->
    <div class="sm:hidden px-4 pt-3 pb-1">
      <div class="relative">
        <i class="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-sm" style="color:var(--text-faint)"></i>
        <input type="search" aria-label="Search tools" v-model="search" placeholder="Search tools…" class="tg-input pl-8" />
      </div>
    </div>

    <!-- Hero -->
    <section class="relative overflow-hidden py-14 px-6 text-center"
      style="background:linear-gradient(135deg,#052e16 0%,#14532d 40%,#166534 70%,#15803d 100%)">
      <div class="absolute inset-0 pointer-events-none opacity-10"
        style="background-image:radial-gradient(circle,#22c55e22 1px,transparent 1px);background-size:28px 28px"></div>
      <div class="relative z-10 max-w-2xl mx-auto">
        <span class="inline-flex items-center gap-2 text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest"
          style="background:rgba(22,163,74,0.25);color:#86efac">
          <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block"></span>
          All tools run in your browser
        </span>
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          Your Browser. <span style="color:#4ade80">Your Toolbox.</span>
        </h1>
        <p class="text-lg mb-8 font-medium" style="color:#bbf7d0">
          {{ tools.length }} interactive tools — no installs, no sign-ups, just open and use.
        </p>
        <button @click="scrollToTools"
          class="inline-flex items-center gap-2 font-bold px-7 py-3 rounded-xl text-white transition-all"
          style="background:linear-gradient(90deg,#15803d,#22c55e)"
          onmouseover="this.style.filter='brightness(1.1)'" onmouseout="this.style.filter=''">
          Browse Tools <i class="bx bx-down-arrow-alt text-lg"></i>
        </button>
      </div>
    </section>

    <!-- Tools -->
    <main ref="toolsSection" class="tool-directory flex-1 w-full px-4 sm:px-6 lg:px-8 py-10">

      <div class="directory-heading"><div><span class="tg-label">PICK A TOOL. GET IT DONE.</span><h2>Your everyday toolbox</h2><p>Quick utilities for code, content, and everything in between.</p></div><span class="directory-badge">4 new developer &amp; converter tools</span></div>
      <!-- Category pills -->
      <div class="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-1">
        <button v-for="cat in categories" :key="cat.id" @click="activeCat = cat.id" :aria-pressed="activeCat === cat.id"
          :class="['tg-tab shrink-0', activeCat === cat.id ? 'tg-tab-active' : '']">
          <i :class="`bx ${cat.icon} mr-1`"></i>{{ cat.label }}
        </button>
      </div>

      <div class="directory-options"><button class="tg-tab" :class="{ 'tg-tab-active': favoritesOnly }" :aria-pressed="favoritesOnly" @click="favoritesOnly = !favoritesOnly"><span aria-hidden="true">&#9733;</span> Favorites ({{ favorites.length }})</button><label class="sort-label">Sort by <select v-model="sort" class="tg-input"><option value="featured">Featured</option><option value="name">Name A-Z</option></select></label></div>
      <!-- Section header -->
      <div class="mb-5 flex items-center gap-3">
        <h2 class="text-sm font-bold uppercase tracking-widest" style="color:var(--text-muted)">
          {{ search ? `Results for "${search}"` : categories.find(c => c.id === activeCat)?.label }}
        </h2>
        <div class="flex-1 h-px" style="background:var(--border)"></div>
        <span class="text-xs font-bold px-2 py-0.5 rounded-full" style="background:var(--bg-accent);color:var(--text-muted)">
          {{ visibleTools.length }}
        </span>
        <button v-if="search || activeCat !== 'all' || favoritesOnly" @click="resetFilters"
          class="text-xs font-semibold" style="color:var(--accent)">Clear ×</button>
      </div>

      <div v-if="visibleTools.length === 0" role="status" class="empty-tools" style="color:var(--text-faint)">
        <i class="bx bx-search text-5xl block mb-3" aria-hidden="true"></i><h3>No tools found</h3><p>{{ favoritesOnly ? 'Star tools to save them here, or adjust your filters.' : 'Try another keyword or choose a different category.' }}</p><button class="tg-btn tg-btn-primary" @click="resetFilters">Reset filters</button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        <ToolCard v-for="tool in visibleTools" :key="tool.path" :tool="tool" :favorite="favorites.includes(tool.path)" @toggle-favorite="toggleFavorite(tool.path)" />
      </div>
      <p class="directory-summary" role="status">Showing {{ visibleTools.length }} of {{ tools.length }} tools</p>
      <p v-if="storageError" class="directory-summary" role="status">Browser storage is unavailable. Favorites will last for this session only.</p>
    </main>

    <!-- Footer -->
    <footer class="text-center py-5 text-sm border-t" style="border-color:var(--border);color:var(--text-faint)">
      ToolGrid · {{ tools.length }} tools ·
      <a href="https://github.com/Je-ric" class="font-semibold transition-colors" style="color:var(--accent)"
        onmouseover="this.style.color='var(--text-muted)'" onmouseout="this.style.color='var(--accent)'">@Je-ric (Hiro)</a>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { tools, categories } from '../data/tools.js'
import ToolCard from '../components/tools/ToolCard.vue'

const favoritesOnly = ref(false), sort = ref('featured'), storageError = ref(false)
function readFavorites() {
  try { const saved = JSON.parse(localStorage.getItem('toolgrid:favorites') || '[]'); return Array.isArray(saved) ? [...new Set(saved.filter(path => tools.some(tool => tool.path === path)))] : [] }
  catch { storageError.value = true; return [] }
}
const favorites = ref(readFavorites())
watch(favorites, value => { try { localStorage.setItem('toolgrid:favorites', JSON.stringify(value)) } catch { storageError.value = true } })
function toggleFavorite(path) { favorites.value = favorites.value.includes(path) ? favorites.value.filter(item => item !== path) : [...favorites.value, path] }
function resetFilters() { search.value = ''; activeCat.value = 'all'; favoritesOnly.value = false }
const search    = ref('')
const activeCat = ref('all')
const toolsSection = ref(null)

function scrollToTools() {
  toolsSection.value?.scrollIntoView({ behavior: 'smooth' })
}

const visibleTools = computed(() => {
  let list = tools
  if (favoritesOnly.value) list = list.filter(t => favorites.value.includes(t.path))
  if (activeCat.value !== 'all') list = list.filter(t => t.category === activeCat.value)
  if (search.value) {
    const q = search.value.trim().toLowerCase()
    list = list.filter(t => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q) || t.category.toLowerCase().includes(q))
  }
  return sort.value === 'name' ? [...list].sort((a, b) => a.name.localeCompare(b.name)) : list
})
</script>
