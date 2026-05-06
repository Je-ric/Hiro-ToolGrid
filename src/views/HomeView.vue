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
          <input v-model="search" placeholder="Search tools…" class="tg-input pl-8 w-48 sm:w-64" />
        </div>
        <span class="text-xs font-medium px-2.5 py-1 rounded-full hidden sm:inline"
          style="background:var(--bg-accent);color:var(--text-muted)">
          {{ tools.length }} tools
        </span>
        <a href="https://github.com/Je-ric" target="_blank"
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
        <input v-model="search" placeholder="Search tools…" class="tg-input pl-8" />
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
    <main ref="toolsSection" class="flex-1 w-full px-4 sm:px-6 lg:px-8 py-10">

      <!-- Category pills -->
      <div class="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-1">
        <button v-for="cat in categories" :key="cat.id" @click="activeCat = cat.id; search = ''"
          :class="['tg-tab shrink-0', activeCat === cat.id ? 'tg-tab-active' : '']">
          <i :class="`bx ${cat.icon} mr-1`"></i>{{ cat.label }}
        </button>
      </div>

      <!-- Section header -->
      <div class="mb-5 flex items-center gap-3">
        <h2 class="text-sm font-bold uppercase tracking-widest" style="color:var(--text-muted)">
          {{ search ? `Results for "${search}"` : categories.find(c => c.id === activeCat)?.label }}
        </h2>
        <div class="flex-1 h-px" style="background:var(--border)"></div>
        <span class="text-xs font-bold px-2 py-0.5 rounded-full" style="background:var(--bg-accent);color:var(--text-muted)">
          {{ visibleTools.length }}
        </span>
        <button v-if="search || activeCat !== 'all'" @click="search=''; activeCat='all'"
          class="text-xs font-semibold" style="color:var(--accent)">Clear ×</button>
      </div>

      <p v-if="visibleTools.length === 0" class="text-center py-20" style="color:var(--text-faint)">
        <i class="bx bx-search text-5xl block mb-3"></i>No tools match "{{ search }}"
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        <ToolCard v-for="tool in visibleTools" :key="tool.path" :tool="tool" />
      </div>
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
import { ref, computed } from 'vue'
import { tools, categories } from '../data/tools.js'
import ToolCard from '../components/tools/ToolCard.vue'

const search    = ref('')
const activeCat = ref('all')
const toolsSection = ref(null)

function scrollToTools() {
  toolsSection.value?.scrollIntoView({ behavior: 'smooth' })
}

const visibleTools = computed(() => {
  let list = tools
  if (activeCat.value !== 'all') list = list.filter(t => t.category === activeCat.value)
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(t => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q))
  }
  return list
})
</script>
