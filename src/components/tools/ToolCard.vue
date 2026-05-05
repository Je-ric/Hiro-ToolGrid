<template>
  <router-link :to="tool.path" class="tool-card bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3 group">
    <div class="flex items-start justify-between gap-2">
      <div :class="`w-10 h-10 rounded-xl ${tool.iconBg} flex items-center justify-center ${tool.iconColor} text-xl shrink-0`">
        <i :class="`bx ${tool.icon}`"></i>
      </div>
      <span class="text-[10px] text-gray-300 font-mono mt-0.5">{{ tool.num }}</span>
    </div>
    <div class="flex-1 min-w-0">
      <h2 class="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors leading-snug">{{ tool.name }}</h2>
      <p class="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">{{ tool.desc }}</p>
    </div>
    <div class="flex items-center gap-1 text-blue-500 text-xs font-medium mt-auto">
      Open <i class="bx bx-right-arrow-alt text-sm"></i>
    </div>
  </router-link>
</template>

<script setup>
defineProps({ tool: { type: Object, required: true } })
</script>

<style scoped>
.tool-card { transition: transform 0.15s ease, box-shadow 0.15s ease; }
.tool-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.10); }
</style>
