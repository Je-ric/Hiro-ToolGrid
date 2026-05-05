<template>
  <ToolLayout title="Case Converter & Formatter" subtitle="Transform, format, and convert text in one click">

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">

      <!-- Input -->
      <BentoCard cls="lg:col-span-2" :emphasis="true">
        <CardHeader icon="bx-edit">Input</CardHeader>
        <textarea v-model="input" placeholder="Type or paste your text here..."
          class="tg-input tg-input-mono w-full min-h-48 resize-none text-sm leading-relaxed"></textarea>
        <div class="flex items-center justify-between">
          <span class="text-xs text-slate-400">{{ wordCount }} words · {{ input.length }} chars</span>
          <AppBtn variant="ghost" icon="bx-x" size="sm" @click="input = ''">Clear</AppBtn>
        </div>
      </BentoCard>

      <!-- Quick transforms -->
      <BentoCard>
        <CardHeader icon="bx-transfer-alt">Quick Apply</CardHeader>
        <div class="flex flex-col gap-1.5">
          <button v-for="t in TRANSFORMS" :key="t.id" @click="applyTransform(t.fn, t.label)"
            :class="['w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between group border',
              activeLabel === t.label
                ? 'bg-cyan-500 text-white border-cyan-400'
                : 'bg-cyan-50 border-cyan-100 text-slate-600 hover:bg-cyan-100 hover:border-cyan-300']">
            <span>{{ t.label }}</span>
            <i class="bx bx-right-arrow-alt text-sm opacity-50 group-hover:opacity-100"></i>
          </button>
        </div>
      </BentoCard>
    </div>

    <!-- Output -->
    <BentoCard v-if="output" :emphasis="true">
      <div class="flex items-center justify-between flex-wrap gap-2">
        <CardHeader icon="bx-check-circle" icon-color="text-teal-500">
          Output — <span class="text-slate-400 font-normal normal-case ml-1">{{ activeLabel }}</span>
        </CardHeader>
        <div class="flex gap-2">
          <AppBtn variant="copy" icon="bx-copy" size="sm" @click="copy(output)">{{ copied ? 'Copied!' : 'Copy' }}</AppBtn>
          <AppBtn variant="ghost" icon="bx-transfer" size="sm" @click="input = output; output = ''">Use as Input</AppBtn>
        </div>
      </div>
      <div class="tg-input tg-input-mono text-sm text-slate-700 whitespace-pre-wrap break-all min-h-12 bg-cyan-50/50">{{ output }}</div>
      <span class="text-xs text-slate-400">{{ outputWordCount }} words · {{ output.length }} chars</span>
    </BentoCard>

    <!-- All transforms preview -->
    <BentoCard>
      <CardHeader icon="bx-grid-alt">All Transforms Preview</CardHeader>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        <div v-for="t in TRANSFORMS" :key="t.id"
          class="p-3 rounded-xl border border-cyan-100 bg-cyan-50/40 cursor-pointer hover:bg-cyan-100 hover:border-cyan-300 transition-all group"
          @click="applyTransform(t.fn, t.label)">
          <p class="text-[10px] text-slate-400 mb-1 font-semibold uppercase tracking-wider">{{ t.label }}</p>
          <p class="text-xs text-slate-600 font-mono truncate group-hover:text-cyan-700">
            {{ input ? t.fn(input) : '—' }}
          </p>
        </div>
      </div>
    </BentoCard>

    <template #legend>
      <div class="flex flex-col gap-1.5 text-xs text-slate-500">
        <div v-for="t in TRANSFORMS" :key="t.id" class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-300 shrink-0"></span>
          <span class="font-medium text-slate-600">{{ t.label }}</span>
        </div>
        <div class="tg-divider"></div>
        <p class="text-[10px] text-slate-400">Click any transform card to apply it instantly.</p>
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
