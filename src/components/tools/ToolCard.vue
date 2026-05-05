<template>
  <router-link :to="tool.path" class="tool-card tg-card p-4 flex flex-col gap-3 group" style="text-decoration:none">
    <div class="flex items-start justify-between gap-2">
      <div :class="`w-10 h-10 rounded-xl ${tool.iconBg} flex items-center justify-center ${tool.iconColor} text-xl shrink-0`">
        <i :class="`bx ${tool.icon}`"></i>
      </div>
      <span class="text-[10px] font-mono mt-0.5 shrink-0" style="color:var(--text-faint)">{{ tool.num }}</span>
    </div>
    <div class="flex-1 min-w-0">
      <h2 class="text-sm font-semibold leading-snug transition-colors" style="font-family:'Oswald',sans-serif;color:var(--text-base)">
        {{ tool.name }}
      </h2>
      <p class="text-xs mt-1 leading-relaxed line-clamp-2" style="color:var(--text-faint)">{{ tool.desc }}</p>
    </div>
    <div class="flex items-center gap-1 text-xs font-semibold mt-auto" style="color:var(--accent)">
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
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(15,23,42,0.12);
  border-color: #bae6fd;
}
.tool-card:hover h2 { color: #0891b2; }
</style>
