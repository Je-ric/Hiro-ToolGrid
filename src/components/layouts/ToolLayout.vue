<template>
  <div class="min-h-screen flex flex-col" style="background:var(--bg-page)">

    <!-- Top bar -->
    <div class="bg-white border-b px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3" style="border-color:var(--border)">
      <router-link to="/" class="inline-flex items-center gap-1.5 text-sm font-medium transition-colors shrink-0"
        style="color:var(--text-muted)" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--text-muted)'">
        <i class="bx bx-arrow-back"></i>
        <span class="hidden sm:inline">Back</span>
      </router-link>
      <div class="w-px h-5" style="background:var(--border)"></div>
      <div class="min-w-0 flex-1">
        <h1 class="text-base font-bold leading-tight truncate" style="font-family:'Oswald',sans-serif;color:var(--text-base)">{{ title }}</h1>
        <p v-if="subtitle" class="text-xs truncate hidden sm:block" style="color:var(--text-faint)">{{ subtitle }}</p>
      </div>
    </div>

    <!-- Body -->
    <div class="flex flex-1 w-full max-w-screen-2xl mx-auto">

      <!-- Main content -->
      <div class="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-5">
        <slot />
      </div>

      <!-- Sticky legend — desktop only -->
      <aside v-if="$slots.legend" class="hidden xl:flex flex-col w-60 shrink-0 px-4 py-6">
        <div class="sticky top-6 tg-legend flex flex-col gap-3">
          <div class="tg-section-title">
            <i class="bx bx-info-circle" style="color:var(--accent)"></i>
            Guide
          </div>
          <slot name="legend" />
        </div>
      </aside>
    </div>

    <!-- Mobile legend — collapsible bottom -->
    <div v-if="$slots.legend" class="xl:hidden border-t bg-white" style="border-color:var(--border)">
      <button @click="open = !open"
        class="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold"
        style="color:var(--accent)">
        <span class="flex items-center gap-1.5"><i class="bx bx-info-circle"></i> Guide / Reference</span>
        <i :class="`bx ${open ? 'bx-chevron-down' : 'bx-chevron-up'} text-lg`"></i>
      </button>
      <div v-show="open" class="px-4 pb-4 flex flex-col gap-2 text-xs" style="color:var(--text-muted)">
        <slot name="legend" />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
defineProps({ title: String, subtitle: String })
const open = ref(false)
</script>
