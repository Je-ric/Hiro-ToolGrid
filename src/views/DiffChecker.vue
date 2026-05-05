<template>
  <ToolLayout title="Diff Checker" subtitle="Compare two texts and highlight added, removed, and unchanged lines.">
    <div class="w-full flex flex-col gap-5">

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <BentoCard>
          <CardHeader icon="bx-file" icon-color="text-blue-400">Original (A)</CardHeader>
          <textarea v-model="textA" class="w-full h-56 p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Paste original text here..."></textarea>
        </BentoCard>
        <BentoCard>
          <CardHeader icon="bx-file" icon-color="text-purple-400">Modified (B)</CardHeader>
          <textarea v-model="textB" class="w-full h-56 p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-300"
            placeholder="Paste modified text here..."></textarea>
        </BentoCard>
      </div>

      <div class="flex gap-2 items-center flex-wrap">
        <AppBtn @click="runDiff" icon="bx-git-compare">Compare</AppBtn>
        <AppBtn variant="ghost" @click="textA='';textB='';diffLines=[]" icon="bx-x">Clear</AppBtn>
        <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer ml-2">
          <input type="checkbox" v-model="ignoreWhitespace" class="accent-blue-500 w-4 h-4" />
          Ignore leading/trailing whitespace
        </label>
        <div v-if="diffLines.length" class="ml-auto flex gap-3 text-xs">
          <span class="px-2 py-1 bg-green-100 text-green-700 rounded-lg font-semibold">+{{ addedCount }} added</span>
          <span class="px-2 py-1 bg-red-100 text-red-700 rounded-lg font-semibold">-{{ removedCount }} removed</span>
          <span class="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg font-semibold">{{ unchangedCount }} unchanged</span>
        </div>
      </div>

      <!-- Diff Output -->
      <BentoCard v-if="diffLines.length">
        <div class="flex items-center justify-between">
          <CardHeader icon="bx-git-compare">Diff Result</CardHeader>
          <button @click="copyDiff" class="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600">
            {{ copiedDiff ? 'Copied!' : 'Copy Diff' }}
          </button>
        </div>
        <div class="font-mono text-xs rounded-xl overflow-hidden border border-gray-200">
          <div v-for="(line, i) in diffLines" :key="i"
            :class="['flex gap-2 px-3 py-0.5 border-b border-gray-100 last:border-0',
              line.type === 'add'    ? 'bg-green-50' :
              line.type === 'remove' ? 'bg-red-50'   : 'bg-white']">
            <span class="w-6 text-gray-300 select-none shrink-0 text-right">{{ line.lineNum }}</span>
            <span :class="['w-4 font-bold shrink-0',
              line.type === 'add'    ? 'text-green-500' :
              line.type === 'remove' ? 'text-red-500'   : 'text-gray-300']">
              {{ line.type === 'add' ? '+' : line.type === 'remove' ? '−' : ' ' }}
            </span>
            <span :class="['flex-1 whitespace-pre-wrap break-all',
              line.type === 'add'    ? 'text-green-800' :
              line.type === 'remove' ? 'text-red-800'   : 'text-gray-700']">{{ line.text }}</span>
          </div>
        </div>
      </BentoCard>

      <div v-else-if="ran" class="text-center py-8 text-gray-400">
        <i class="bx bx-check-circle text-4xl text-green-400"></i>
        <p class="mt-2">No differences found — the texts are identical.</p>
      </div>

      <!-- Legend -->
      <BentoCard cls="text-xs text-gray-500">
        <CardHeader icon="bx-info-circle">How to read the diff</CardHeader>
        <div class="flex gap-4 flex-wrap">
          <span class="flex items-center gap-1"><span class="w-4 h-4 bg-green-100 rounded inline-block"></span> <strong class="text-green-700">+</strong> Line added in B</span>
          <span class="flex items-center gap-1"><span class="w-4 h-4 bg-red-100 rounded inline-block"></span> <strong class="text-red-700">−</strong> Line removed from A</span>
          <span class="flex items-center gap-1"><span class="w-4 h-4 bg-white border border-gray-200 rounded inline-block"></span> <strong class="text-gray-500"> </strong> Unchanged line</span>
        </div>
      </BentoCard>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../components/layouts/ToolLayout.vue'
import BentoCard  from '../components/ui/BentoCard.vue'
import CardHeader from '../components/ui/CardHeader.vue'
import AppBtn     from '../components/ui/AppBtn.vue'

const textA = ref(''), textB = ref('')
const diffLines = ref([])
const ignoreWhitespace = ref(false)
const ran = ref(false)
const copiedDiff = ref(false)

// LCS-based diff
function lcs(a, b) {
  const m = a.length, n = b.length
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1])
  return dp
}

function buildDiff(a, b) {
  const dp = lcs(a, b)
  const result = []
  let i = a.length, j = b.length, lineNum = 1
  const stack = []
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i-1] === b[j-1]) { stack.push({ type: 'same', text: a[i-1] }); i--; j-- }
    else if (j > 0 && (i === 0 || dp[i][j-1] >= dp[i-1][j])) { stack.push({ type: 'add', text: b[j-1] }); j-- }
    else { stack.push({ type: 'remove', text: a[i-1] }); i-- }
  }
  stack.reverse()
  let addLine = 1, removeLine = 1
  for (const s of stack) {
    result.push({ ...s, lineNum: s.type === 'remove' ? removeLine++ : s.type === 'add' ? addLine++ : addLine++ })
    if (s.type === 'same') removeLine = addLine
  }
  return result
}

function runDiff() {
  ran.value = true
  const norm = s => ignoreWhitespace.value ? s.trim() : s
  const a = textA.value.split('\n').map(norm)
  const b = textB.value.split('\n').map(norm)
  diffLines.value = buildDiff(a, b)
}

const addedCount     = computed(() => diffLines.value.filter(l => l.type === 'add').length)
const removedCount   = computed(() => diffLines.value.filter(l => l.type === 'remove').length)
const unchangedCount = computed(() => diffLines.value.filter(l => l.type === 'same').length)

function copyDiff() {
  const text = diffLines.value.map(l => `${l.type === 'add' ? '+' : l.type === 'remove' ? '-' : ' '} ${l.text}`).join('\n')
  navigator.clipboard.writeText(text)
  copiedDiff.value = true; setTimeout(() => copiedDiff.value = false, 2000)
}
</script>
