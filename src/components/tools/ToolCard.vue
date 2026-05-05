<template>
  <router-link :to="tool.path" class="tool-card tg-card p-4 flex flex-col gap-3 group">
    <div class="flex items-start justify-between gap-2">
      <div :class="`w-10 h-10 rounded-xl ${tool.iconBg} flex items-center justify-center ${tool.iconColor} text-xl shrink-0 border border-white/60`">
        <i :class="`bx ${tool.icon}`"></i>
      </div>
      <span class="text-[10px] text-slate-300 font-mono mt-0.5 shrink-0">{{ tool.num }}</span>
    </div>
    <div class="flex-1 min-w-0">
      <h2 class="text-sm font-semibold text-slate-800 group-hover:text-cyan-600 transition-colors leading-snug" style="font-family:'Oswald',sans-serif">
        {{ tool.name }}
      </h2>
      <p class="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">{{ tool.desc }}</p>
    </div>
    <div class="flex items-center gap-1 text-cyan-500 text-xs font-semibold mt-auto">
      Open <i class="bx bx-right-arrow-alt text-sm"></i>
    </div>
  </router-link>
</template>

<script setup>
defineProps({ tool: { type: Object, required: true } })
</script>

<style scoped>
.tool-card { transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease; }
.tool-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(6,182,212,0.15);
  border-color: #67e8f9;
}
</style>
