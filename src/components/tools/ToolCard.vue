<template>
  <article class="tool-tile">
  <button class="favorite-toggle" :class="{ saved: favorite }" :aria-label="`${favorite ? 'Remove' : 'Save'} ${tool.name} ${favorite ? 'from' : 'to'} favorites`" :aria-pressed="favorite" @click="$emit('toggle-favorite')"><span v-if="favorite" aria-hidden="true">&#9733;</span><span v-else aria-hidden="true">&#9734;</span></button>
  <router-link :to="tool.path" class="tool-card tg-card p-5 flex flex-col gap-3 group" style="text-decoration:none">
    <div class="flex items-start justify-between gap-2">
      <div :class="`w-11 h-11 rounded-xl ${tool.iconBg} flex items-center justify-center ${tool.iconColor} text-xl shrink-0`">
        <i :class="`bx ${tool.icon}`"></i>
      </div>
      <span class="text-[10px] font-mono mt-0.5 shrink-0 mr-8" style="color:var(--text-faint)"><span v-if="tool.isNew" class="new-badge">NEW</span></span>
    </div>
    <div class="flex-1 min-w-0">
      <h2 class="text-sm font-bold leading-snug transition-colors" style="color:var(--text-base)">{{ tool.name }}</h2>
      <p class="text-xs mt-1 leading-relaxed line-clamp-2" style="color:var(--text-faint)">{{ tool.desc }}</p>
    </div>
    <div class="flex items-center gap-1 text-xs font-bold mt-auto" style="color:var(--accent)">
      Open <i class="bx bx-right-arrow-alt text-sm"></i>
    </div>
  </router-link>
  </article>
</template>

<script setup>
defineProps({ tool: { type: Object, required: true }, favorite: Boolean })
defineEmits(['toggle-favorite'])
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
