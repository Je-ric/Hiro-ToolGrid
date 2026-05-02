<template>
  <ToolLayout title="Case Converter & Formatter" subtitle="Transform, format, and convert text in one click" max-w="max-w-4xl">
    <div class="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-5">

      <!-- Input -->
      <div class="lg:col-span-2 bg-white rounded-2xl shadow p-5 flex flex-col gap-3">
        <CardHeader icon="bx-edit">Input</CardHeader>
        <textarea v-model="input" placeholder="Type or paste your text here..."
          class="w-full flex-1 min-h-48 p-3 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm text-gray-700 font-mono"></textarea>
        <div class="flex items-center justify-between text-xs text-gray-400">
          <span>{{ wordCount }} words · {{ input.length }} chars</span>
          <button @click="input = ''" class="flex items-center gap-1 hover:text-red-400 transition-colors"><i class="bx bx-x"></i> Clear</button>
        </div>
      </div>

      <!-- Quick transforms -->
      <div class="bg-white rounded-2xl shadow p-5 flex flex-col gap-3">
        <CardHeader icon="bx-transfer-alt">Quick Apply</CardHeader>
        <div class="flex flex-col gap-2">
          <button v-for="t in TRANSFORMS" :key="t.id" @click="applyTransform(t.fn)"
            class="w-full text-left px-3 py-2 rounded-xl bg-gray-50 hover:bg-blue-50 hover:text-blue-600 text-sm font-medium text-gray-700 transition-colors flex items-center justify-between group">
            <span>{{ t.label }}</span>
            <i class="bx bx-right-arrow-alt text-gray-300 group-hover:text-blue-400"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Output -->
    <div v-if="output" class="w-full max-w-4xl bg-white rounded-2xl shadow p-5 flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <CardHeader icon="bx-check-circle" icon-color="text-green-500">Output — <span class="text-gray-400 font-normal text-sm ml-1">{{ activeLabel }}</span></CardHeader>
        <AppBtn variant="green" icon="bx-copy" cls="w-auto px-4" @click="copy(output)">{{ copied ? 'Copied!' : 'Copy' }}</AppBtn>
      </div>
      <div class="p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 font-mono whitespace-pre-wrap break-all min-h-16">{{ output }}</div>
      <div class="flex items-center justify-between text-xs text-gray-400">
        <span>{{ outputWordCount }} words · {{ output.length }} chars</span>
        <button @click="input = output; output = ''" class="flex items-center gap-1 hover:text-blue-500 transition-colors"><i class="bx bx-transfer"></i> Use as input</button>
      </div>
    </div>

    <!-- All transforms preview -->
    <div class="w-full max-w-4xl bg-white rounded-2xl shadow p-5 flex flex-col gap-3">
      <CardHeader icon="bx-grid-alt">All Transforms Preview</CardHeader>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div v-for="t in TRANSFORMS" :key="t.id"
          class="bg-gray-50 rounded-xl p-3 cursor-pointer hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all group"
          @click="applyTransform(t.fn, t.label)">
          <p class="text-xs text-gray-400 mb-1 font-medium">{{ t.label }}</p>
          <p class="text-sm text-gray-700 font-mono truncate group-hover:text-blue-700">
            {{ input ? t.fn(input) : '—' }}
          </p>
        </div>
      </div>
    </div>

  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout  from '../components/layouts/ToolLayout.vue'
import CardHeader  from '../components/ui/CardHeader.vue'
import AppBtn      from '../components/ui/AppBtn.vue'
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
