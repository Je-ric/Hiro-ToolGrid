<template>
  <div class="bg-gray-100 min-h-screen flex flex-col">

    <!-- Top bar -->
    <div class="bg-white border-b border-cyan-100 px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3 shadow-sm">
      <router-link to="/" class="inline-flex items-center gap-1.5 text-slate-400 hover:text-cyan-500 text-sm transition-colors shrink-0">
        <i class="bx bx-arrow-back text-base"></i>
        <span class="hidden sm:inline font-medium">Back</span>
      </router-link>
      <div class="w-px h-5 bg-cyan-100"></div>
      <div class="min-w-0 flex-1">
        <h1 class="text-lg font-bold text-slate-800 leading-tight truncate" style="font-family:'Oswald',sans-serif">{{ title }}</h1>
        <p v-if="subtitle" class="text-xs text-slate-400 truncate hidden sm:block">{{ subtitle }}</p>
      </div>
    </div>

    <!-- Body: content + optional sticky legend -->
    <div class="flex flex-1 w-full max-w-screen-2xl mx-auto">

      <!-- Main content -->
      <div class="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-5">
        <slot />
      </div>

      <!-- Sticky legend sidebar (desktop only) -->
      <aside v-if="$slots.legend" class="hidden xl:flex flex-col w-64 shrink-0 px-4 py-6">
        <div class="sticky top-6 tg-legend flex flex-col gap-3">
          <p class="text-xs font-semibold text-cyan-600 uppercase tracking-wider flex items-center gap-1.5">
            <i class="bx bx-info-circle"></i> Reference
          </p>
          <slot name="legend" />
        </div>
      </aside>
    </div>

    <!-- Mobile legend (bottom, collapsible) -->
    <div v-if="$slots.legend" class="xl:hidden border-t border-cyan-100 bg-white">
      <button @click="legendOpen = !legendOpen"
        class="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-cyan-600">
        <span class="flex items-center gap-1.5"><i class="bx bx-info-circle"></i> Reference</span>
        <i :class="`bx ${legendOpen ? 'bx-chevron-down' : 'bx-chevron-up'} text-lg`"></i>
      </button>
      <div v-show="legendOpen" class="px-4 pb-4 flex flex-col gap-2">
        <slot name="legend" />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
defineProps({ title: String, subtitle: String })
const legendOpen = ref(false)
</script>
