<template>
  <router-link :to="tool.path" class="tool-card bg-white rounded-2xl shadow p-5 flex flex-col gap-3 group">
    <div :class="`w-12 h-12 rounded-xl ${tool.iconBg} flex items-center justify-center ${tool.iconColor} text-2xl`">
      <i :class="`bx ${tool.icon}`"></i>
    </div>
    <div>
      <p class="text-xs text-gray-400 uppercase tracking-widest">{{ tool.num }}</p>
      <h2 class="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{{ tool.name }}</h2>
      <p class="text-sm text-gray-400 font-light mt-1">{{ tool.desc }}</p>
    </div>
    <div class="mt-auto flex items-center gap-1 text-blue-500 text-sm font-medium">
      Open <i class="bx bx-right-arrow-alt"></i>
    </div>
  </router-link>
</template>

<script setup>
defineProps({ tool: { type: Object, required: true } })
</script>

<style scoped>
.tool-card { transition: transform 0.2s, box-shadow 0.2s; }
.tool-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.12); }
</style>
