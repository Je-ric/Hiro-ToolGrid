<template>
  <ToolLayout title="Case Converter & Formatter" subtitle="Transform, format, and convert text in one click">

    <!-- Top row: transforms list | input | output -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-5 items-start">

      <!-- Transform picker -->
      <BentoCard>
        <CardHeader icon="bx-transfer-alt">Transforms</CardHeader>
        <p class="text-xs" style="color:var(--text-faint)">Click a transform to apply it instantly.</p>
        <div class="flex flex-col gap-1">
          <button v-for="t in TRANSFORMS" :key="t.id" @click="applyTransform(t.fn, t.label)"
            class="w-full text-left px-3 py-2 rounded-lg border text-xs font-medium transition-all flex items-center justify-between"
            :style="activeLabel === t.label
              ? 'background:var(--accent);border-color:var(--accent);color:#fff'
              : 'background:var(--bg-card);border-color:var(--border-md);color:var(--text-muted)'">
            <span>{{ t.label }}</span>
            <i class="bx bx-right-arrow-alt text-sm opacity-60"></i>
          </button>
        </div>
      </BentoCard>

      <!-- Input -->
      <BentoCard cls="lg:col-span-1.5" :emphasis="true" :stretch="true">
        <CardHeader icon="bx-edit">Input</CardHeader>
        <p class="text-xs" style="color:var(--text-faint)">Type or paste your text here.</p>
        <textarea v-model="input" placeholder="Type or paste text here…"
          class="tg-input tg-mono w-full resize-none text-sm leading-relaxed flex-1" style="min-height:220px"></textarea>
        <div class="flex items-center justify-between">
          <span class="text-xs" style="color:var(--text-faint)">{{ wordCount }} words · {{ input.length }} chars</span>
          <AppBtn variant="ghost" icon="bx-x" size="sm" @click="input = ''; output = ''">Clear</AppBtn>
        </div>
      </BentoCard>

      <!-- Output -->
      <BentoCard cls="lg:col-span-2" :stretch="true">
        <div class="flex items-center justify-between gap-2 flex-wrap">
          <CardHeader icon="bx-check-circle" icon-color="#0d9488">Output</CardHeader>
          <span v-if="activeLabel" class="text-xs px-2 py-0.5 rounded-full font-semibold"
            style="background:var(--accent-bg);color:var(--accent);border:1px solid var(--border-accent)">
            {{ activeLabel }}
          </span>
        </div>
        <p class="text-xs" style="color:var(--text-faint)">Result appears here after selecting a transform.</p>
        <div class="tg-input tg-mono text-sm leading-relaxed flex-1 whitespace-pre-wrap break-all"
          style="min-height:220px;color:var(--text-base);background:#f8fafc">
          <span v-if="output">{{ output }}</span>
          <span v-else style="color:var(--text-faint);font-style:italic">Select a transform on the left…</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-xs" style="color:var(--text-faint)">{{ outputWordCount }} words · {{ output.length }} chars</span>
          <div class="flex gap-2">
            <AppBtn variant="copy" icon="bx-copy" size="sm" @click="copy(output)" :disabled="!output">
              {{ copied ? 'Copied!' : 'Copy' }}
            </AppBtn>
            <AppBtn variant="ghost" icon="bx-transfer" size="sm" @click="input = output; output = ''" :disabled="!output">
              Use as Input
            </AppBtn>
          </div>
        </div>
      </BentoCard>
    </div>

    <!-- All transforms preview -->
    <BentoCard>
      <CardHeader icon="bx-grid-alt">All Transforms Preview</CardHeader>
      <p class="text-xs" style="color:var(--text-faint)">Live preview of all transforms applied to your input. Click any card to apply.</p>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 mt-1">
        <div v-for="t in TRANSFORMS" :key="t.id"
          class="p-3 rounded-lg border cursor-pointer transition-all"
          :style="activeLabel === t.label
            ? 'border-color:var(--accent);background:var(--accent-bg)'
            : 'border-color:var(--border);background:var(--bg-page)'"
          @click="applyTransform(t.fn, t.label)">
          <p class="text-[10px] font-semibold uppercase tracking-wider mb-1" style="color:var(--text-muted)">{{ t.label }}</p>
          <p class="text-xs tg-mono truncate" style="color:var(--text-base)">{{ input ? t.fn(input) : '—' }}</p>
        </div>
      </div>
    </BentoCard>

    <template #legend>
      <div class="flex flex-col gap-1.5 text-xs" style="color:var(--text-muted)">
        <p class="font-semibold" style="color:var(--text-base)">Transform types</p>
        <div v-for="t in TRANSFORMS" :key="t.id" class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full shrink-0" style="background:var(--accent)"></span>
          <span>{{ t.label }}</span>
        </div>
        <div class="tg-divider"></div>
        <p style="color:var(--text-faint)">Use "Use as Input" to chain multiple transforms.</p>
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
import { useClipboard } from '../composables/useClipboard.js'
import { TRANSFORMS, countWords } from '../utils/caseConverter.js'

const input  = ref('')
const output = ref('')
const activeLabel = ref('')
const { copied, copy } = useClipboard()

const wordCount       = computed(() => countWords(input.value))
const outputWordCount = computed(() => countWords(output.value))

function applyTransform(fn, label = '') {
  output.value = fn(input.value)
  activeLabel.value = label
}
</script>
