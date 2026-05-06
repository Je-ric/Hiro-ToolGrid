<template>
  <router-link :to="tool.path" class="tool-card tg-card p-5 flex flex-col gap-3 group" style="text-decoration:none">
    <div class="flex items-start justify-between gap-2">
      <div :class="`w-11 h-11 rounded-xl ${tool.iconBg} flex items-center justify-center ${tool.iconColor} text-xl shrink-0`">
        <i :class="`bx ${tool.icon}`"></i>
      </div>
      <span class="text-[10px] font-mono mt-0.5 shrink-0" style="color:var(--text-faint)">{{ tool.num }}</span>
    </div>
    <div class="flex-1 min-w-0">
      <h2 class="text-sm font-bold leading-snug transition-colors" style="color:var(--text-base)">{{ tool.name }}</h2>
      <p class="text-xs mt-1 leading-relaxed line-clamp-2" style="color:var(--text-faint)">{{ tool.desc }}</p>
    </div>
    <div class="flex items-center gap-1 text-xs font-bold mt-auto" style="color:var(--accent)">
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
  box-shadow: 0 8px 28px rgba(22,163,74,0.18);
  border-color: #4ade80;
}
.tool-card:hover h2 { color: #16a34a; }
</style>
