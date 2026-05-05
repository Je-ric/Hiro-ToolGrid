<template>
  <ToolLayout title="Text Analyzer" subtitle="Type or paste text to analyze it in real time">

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <!-- Input -->
      <BentoCard cls="lg:col-span-2" :emphasis="true">
        <CardHeader icon="bx-edit">Input</CardHeader>
        <textarea v-model="text" placeholder="Type or paste your text here..."
          class="tg-input tg-input-mono w-full min-h-56 resize-none text-sm leading-relaxed"></textarea>
        <div class="flex items-center justify-between">
          <span class="text-xs text-slate-400">{{ stats.words }} words · {{ stats.chars }} chars</span>
          <AppBtn variant="ghost" icon="bx-x" size="sm" @click="text = ''">Clear</AppBtn>
        </div>
      </BentoCard>

      <!-- Primary stats -->
      <div class="flex flex-col gap-3">
        <div class="tg-card-emphasis p-5 flex flex-col gap-1 rounded-2xl" style="background:linear-gradient(135deg,#ecfeff,#cffafe)">
          <i class="bx bx-text text-2xl text-cyan-400"></i>
          <p class="text-4xl font-bold text-cyan-600">{{ stats.words }}</p>
          <p class="text-sm text-cyan-500 font-medium">Words</p>
        </div>
        <BentoCard>
          <p class="text-xs text-slate-400 font-medium">Characters</p>
          <p class="text-3xl font-bold text-slate-700">{{ stats.chars }}</p>
          <p class="text-xs text-slate-400">including spaces</p>
        </BentoCard>
        <div class="grid grid-cols-3 gap-2">
          <div class="tg-stat"><p class="text-xl font-bold text-teal-500">{{ stats.letters }}</p><p class="text-[10px] text-slate-400 mt-0.5">Letters</p></div>
          <div class="tg-stat"><p class="text-xl font-bold text-sky-500">{{ stats.numbers }}</p><p class="text-[10px] text-slate-400 mt-0.5">Numbers</p></div>
          <div class="tg-stat"><p class="text-xl font-bold text-cyan-400">{{ stats.spaces }}</p><p class="text-[10px] text-slate-400 mt-0.5">Spaces</p></div>
        </div>
      </div>
    </div>

    <!-- Secondary stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div class="tg-stat"><p class="text-2xl font-bold text-teal-500">{{ stats.sentences }}</p><p class="text-sm text-slate-400 mt-1">Sentences</p></div>
      <div class="tg-stat"><p class="text-2xl font-bold text-sky-500">{{ stats.paragraphs }}</p><p class="text-sm text-slate-400 mt-1">Paragraphs</p></div>
      <div class="tg-stat"><p class="text-2xl font-bold text-cyan-600">{{ stats.avgWord }}</p><p class="text-sm text-slate-400 mt-1">Avg Word Len</p></div>
      <div class="tg-stat"><p class="text-2xl font-bold text-cyan-500">{{ stats.readTime }}</p><p class="text-sm text-slate-400 mt-1">Read Time</p></div>
    </div>

    <template #legend>
      <div class="flex flex-col gap-2 text-xs text-slate-500">
        <div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-cyan-400 shrink-0"></span><span><strong class="text-slate-600">Words</strong> — space-separated tokens</span></div>
        <div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-teal-400 shrink-0"></span><span><strong class="text-slate-600">Letters</strong> — A–Z only</span></div>
        <div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-sky-400 shrink-0"></span><span><strong class="text-slate-600">Sentences</strong> — ends with . ! ?</span></div>
        <div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-cyan-300 shrink-0"></span><span><strong class="text-slate-600">Read Time</strong> — ~200 wpm average</span></div>
        <div class="tg-divider"></div>
        <p class="text-[10px] text-slate-400">Tip: paste any text — article, essay, or code — to get instant stats.</p>
      </div>
    </template>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../components/layouts/ToolLayout.vue'
import BentoCard  from '../components/ui/BentoCard.vue'
import CardHeader from '../components/ui/CardHeader.vue'
import AppBtn     from '../components/ui/AppBtn.vue'

const text = ref('')
const stats = computed(() => {
  const t = text.value
  const words      = t.trim() === '' ? 0 : t.trim().split(/\s+/).length
  const letters    = (t.match(/[a-zA-Z]/g) || []).length
  const numbers    = (t.match(/[0-9]/g) || []).length
  const spaces     = (t.match(/\s/g) || []).length
  const sentences  = t.trim() === '' ? 0 : (t.match(/[.!?]+/g) || []).length
  const paragraphs = t.trim() === '' ? 0 : t.trim().split(/\n\s*\n/).length
  const wordArr    = t.trim() === '' ? [] : t.trim().split(/\s+/)
  const avgWord    = wordArr.length > 0 ? (wordArr.reduce((s,w) => s+w.length,0) / wordArr.length).toFixed(1) : 0
  const readSec    = Math.ceil(words / 3.3)
  const readTime   = readSec >= 60 ? Math.ceil(readSec/60)+'m' : readSec+'s'
  return { words, chars: t.length, letters, numbers, spaces, sentences, paragraphs, avgWord, readTime }
})
</script>
