<template>
  <ToolLayout title="Text Analyzer" subtitle="Type or paste text to analyze it in real time">
    <div class="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div class="lg:col-span-2 bg-white rounded-2xl shadow p-5 flex flex-col gap-3">
        <h2 class="text-lg font-semibold text-gray-700 flex items-center gap-2"><i class="bx bx-edit text-blue-500"></i> Input</h2>
        <textarea v-model="text" placeholder="Type or paste your text here..."
          class="w-full flex-1 min-h-64 p-3 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm text-gray-700"></textarea>
        <button @click="text = ''" class="self-end bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-xl hover:bg-gray-300 transition-colors text-sm flex items-center gap-2">
          <i class="bx bx-x"></i> Clear
        </button>
      </div>
      <div class="flex flex-col gap-4">
        <div class="bg-blue-500 text-white rounded-2xl shadow p-5 flex flex-col gap-1">
          <i class="bx bx-text text-3xl opacity-70"></i>
          <p class="text-4xl font-bold">{{ stats.words }}</p>
          <p class="text-sm font-light opacity-80">Words</p>
        </div>
        <div class="bg-white rounded-2xl shadow p-5 flex flex-col gap-1">
          <i class="bx bx-font-size text-2xl text-gray-400"></i>
          <p class="text-3xl font-bold text-gray-800">{{ stats.chars }}</p>
          <p class="text-sm text-gray-400 font-light">Characters (with spaces)</p>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div class="bg-white rounded-2xl shadow p-3 text-center"><p class="text-2xl font-bold text-green-500">{{ stats.letters }}</p><p class="text-xs text-gray-400 font-light mt-1">Letters</p></div>
          <div class="bg-white rounded-2xl shadow p-3 text-center"><p class="text-2xl font-bold text-purple-500">{{ stats.numbers }}</p><p class="text-xs text-gray-400 font-light mt-1">Numbers</p></div>
          <div class="bg-white rounded-2xl shadow p-3 text-center"><p class="text-2xl font-bold text-orange-400">{{ stats.spaces }}</p><p class="text-xs text-gray-400 font-light mt-1">Spaces</p></div>
        </div>
      </div>
    </div>
    <div class="w-full max-w-5xl grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div class="bg-white rounded-2xl shadow p-4 text-center"><p class="text-2xl font-bold text-teal-500">{{ stats.sentences }}</p><p class="text-sm text-gray-400 font-light mt-1">Sentences</p></div>
      <div class="bg-white rounded-2xl shadow p-4 text-center"><p class="text-2xl font-bold text-pink-500">{{ stats.paragraphs }}</p><p class="text-sm text-gray-400 font-light mt-1">Paragraphs</p></div>
      <div class="bg-white rounded-2xl shadow p-4 text-center"><p class="text-2xl font-bold text-indigo-500">{{ stats.avgWord }}</p><p class="text-sm text-gray-400 font-light mt-1">Avg Word Length</p></div>
      <div class="bg-white rounded-2xl shadow p-4 text-center"><p class="text-2xl font-bold text-rose-500">{{ stats.readTime }}</p><p class="text-sm text-gray-400 font-light mt-1">Read Time</p></div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../components/layouts/ToolLayout.vue'

const text = ref('')

const stats = computed(() => {
  const t = text.value
  const words = t.trim() === '' ? 0 : t.trim().split(/\s+/).length
  const letters = (t.match(/[a-zA-Z]/g) || []).length
  const numbers = (t.match(/[0-9]/g) || []).length
  const spaces  = (t.match(/\s/g) || []).length
  const sentences = t.trim() === '' ? 0 : (t.match(/[.!?]+/g) || []).length
  const paragraphs = t.trim() === '' ? 0 : t.trim().split(/\n\s*\n/).length
  const wordArr = t.trim() === '' ? [] : t.trim().split(/\s+/)
  const totalLen = wordArr.reduce((s, w) => s + w.length, 0)
  const avgWord = wordArr.length > 0 ? (totalLen / wordArr.length).toFixed(1) : 0
  const readSec = Math.ceil(words / 3)
  const readTime = readSec >= 60 ? Math.ceil(readSec / 60) + 'm' : readSec + 's'
  return { words, chars: t.length, letters, numbers, spaces, sentences, paragraphs, avgWord, readTime }
})
</script>
