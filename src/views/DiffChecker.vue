<template>
  <ToolLayout title="Diff Checker" subtitle="Compare two texts and highlight added, removed, and unchanged lines">

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
      <BentoCard :emphasis="true" :stretch="true">
        <CardHeader icon="bx-file">Original (A)</CardHeader>
        <p class="text-xs" style="color:var(--text-faint)">Paste the original / old version here.</p>
        <textarea v-model="textA" class="tg-input tg-mono w-full resize-none text-sm" style="min-height:200px"
          placeholder="Paste original text here…"></textarea>
      </BentoCard>
      <BentoCard :emphasis="true" :stretch="true">
        <CardHeader icon="bx-file" icon-color="#7c3aed">Modified (B)</CardHeader>
        <p class="text-xs" style="color:var(--text-faint)">Paste the modified / new version here.</p>
        <textarea v-model="textB" class="tg-input tg-mono w-full resize-none text-sm" style="min-height:200px"
          placeholder="Paste modified text here…"></textarea>
      </BentoCard>
    </div>

    <!-- Controls -->
    <div class="flex gap-2 items-center flex-wrap">
      <AppBtn @click="runDiff" icon="bx-git-compare">Compare</AppBtn>
      <AppBtn variant="ghost" icon="bx-x" @click="textA='';textB='';diffLines=[];ran=false">Clear All</AppBtn>
      <label class="flex items-center gap-2 text-sm cursor-pointer ml-2" style="color:var(--text-muted)">
        <input type="checkbox" v-model="ignoreWhitespace" style="accent-color:var(--accent);width:16px;height:16px" />
        Ignore leading/trailing whitespace
      </label>
      <div v-if="diffLines.length" class="ml-auto flex gap-2 text-xs">
        <span class="px-2 py-1 rounded-lg font-semibold" style="background:#f0fdf4;color:#16a34a;border:1px solid #bbf7d0">+{{ addedCount }} added</span>
        <span class="px-2 py-1 rounded-lg font-semibold" style="background:#fef2f2;color:#dc2626;border:1px solid #fecaca">−{{ removedCount }} removed</span>
        <span class="px-2 py-1 rounded-lg font-semibold" style="background:#f1f5f9;color:#64748b;border:1px solid var(--border)">{{ unchangedCount }} unchanged</span>
      </div>
    </div>

    <!-- Diff result -->
    <BentoCard v-if="diffLines.length">
      <div class="flex items-center justify-between gap-2 flex-wrap">
        <CardHeader icon="bx-git-compare">Diff Result</CardHeader>
        <AppBtn variant="copy" icon="bx-copy" size="sm" @click="copyDiff">{{ copiedDiff ? 'Copied!' : 'Copy Diff' }}</AppBtn>
      </div>
      <div class="tg-mono text-xs rounded-xl overflow-hidden border" style="border-color:var(--border)">
        <div v-for="(line, i) in diffLines" :key="i"
          class="flex gap-2 px-3 py-0.5 border-b last:border-0"
          :style="`border-color:var(--border);background:${line.type==='add'?'#f0fdf4':line.type==='remove'?'#fef2f2':'#fff'}`">
          <span class="w-6 select-none shrink-0 text-right" style="color:var(--text-faint)">{{ line.lineNum }}</span>
          <span class="w-4 font-bold shrink-0"
            :style="`color:${line.type==='add'?'#16a34a':line.type==='remove'?'#dc2626':'#cbd5e1'}`">
            {{ line.type === 'add' ? '+' : line.type === 'remove' ? '−' : ' ' }}
          </span>
          <span class="flex-1 whitespace-pre-wrap break-all"
            :style="`color:${line.type==='add'?'#166534':line.type==='remove'?'#991b1b':'#334155'}`">
            {{ line.text }}
          </span>
        </div>
      </div>
    </BentoCard>

    <div v-else-if="ran" class="tg-card flex flex-col items-center justify-center py-10" style="color:var(--text-faint)">
      <i class="bx bx-check-circle text-4xl mb-2" style="color:#16a34a"></i>
      <p class="text-sm font-medium">No differences found — the texts are identical.</p>
    </div>

    <template #legend>
      <div class="flex flex-col gap-2 text-xs" style="color:var(--text-muted)">
        <p class="font-semibold" style="color:var(--text-base)">How to read the diff</p>
        <div class="flex items-center gap-2">
          <span class="w-4 h-4 rounded shrink-0" style="background:#f0fdf4;border:1px solid #bbf7d0"></span>
          <span><strong style="color:#16a34a">+</strong> Line added in B (new)</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-4 h-4 rounded shrink-0" style="background:#fef2f2;border:1px solid #fecaca"></span>
          <span><strong style="color:#dc2626">−</strong> Line removed from A (old)</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-4 h-4 rounded shrink-0" style="background:#fff;border:1px solid var(--border)"></span>
          <span>Unchanged line</span>
        </div>
        <div class="tg-divider"></div>
        <p style="color:var(--text-faint)">Uses LCS (Longest Common Subsequence) algorithm — same as Git diff.</p>
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

const textA = ref(''), textB = ref(''), diffLines = ref([]), ignoreWhitespace = ref(false), ran = ref(false), copiedDiff = ref(false)

function lcs(a, b) {
  const dp = Array.from({ length: a.length+1 }, () => new Array(b.length+1).fill(0))
  for (let i=1;i<=a.length;i++) for (let j=1;j<=b.length;j++)
    dp[i][j] = a[i-1]===b[j-1] ? dp[i-1][j-1]+1 : Math.max(dp[i-1][j],dp[i][j-1])
  return dp
}
function buildDiff(a, b) {
  const dp=lcs(a,b), stack=[]
  let i=a.length, j=b.length
  while (i>0||j>0) {
    if (i>0&&j>0&&a[i-1]===b[j-1]) { stack.push({type:'same',text:a[i-1]}); i--;j-- }
    else if (j>0&&(i===0||dp[i][j-1]>=dp[i-1][j])) { stack.push({type:'add',text:b[j-1]}); j-- }
    else { stack.push({type:'remove',text:a[i-1]}); i-- }
  }
  stack.reverse()
  let n=1
  return stack.map(s => ({ ...s, lineNum: n++ }))
}
function runDiff() {
  ran.value=true
  const norm = s => ignoreWhitespace.value ? s.trim() : s
  diffLines.value = buildDiff(textA.value.split('\n').map(norm), textB.value.split('\n').map(norm))
}
const addedCount     = computed(() => diffLines.value.filter(l=>l.type==='add').length)
const removedCount   = computed(() => diffLines.value.filter(l=>l.type==='remove').length)
const unchangedCount = computed(() => diffLines.value.filter(l=>l.type==='same').length)
function copyDiff() {
  navigator.clipboard.writeText(diffLines.value.map(l=>`${l.type==='add'?'+':l.type==='remove'?'-':' '} ${l.text}`).join('\n'))
  copiedDiff.value=true; setTimeout(()=>copiedDiff.value=false,2000)
}
</script>
