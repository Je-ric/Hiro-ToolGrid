<template>
  <ToolLayout title="Markdown Previewer" subtitle="Write Markdown on the left, see the live preview on the right.">
    <div class="w-full flex flex-col gap-4">

      <!-- Toolbar -->
      <div class="flex flex-wrap gap-2 items-center">
        <TabBar :tabs="tabs" :active="activeTab" @change="activeTab = $event" />
        <div class="ml-auto flex gap-2">
          <button @click="exportHTML" class="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 flex items-center gap-1">
            <i class="bx bx-download"></i> Export HTML
          </button>
          <button @click="exportTxt" class="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 flex items-center gap-1">
            <i class="bx bx-download"></i> Export .txt
          </button>
          <button @click="clearAll" class="px-3 py-1.5 bg-red-100 text-red-600 text-sm rounded-lg hover:bg-red-200 flex items-center gap-1">
            <i class="bx bx-trash"></i> Clear
          </button>
        </div>
      </div>

      <!-- Split / Single view -->
      <div :class="['grid gap-4', activeTab === 'split' ? 'grid-cols-2' : 'grid-cols-1']">
        <!-- Editor -->
        <div v-if="activeTab !== 'preview'" class="flex flex-col gap-1">
          <p class="text-xs text-gray-400 uppercase tracking-widest font-medium">Markdown Input</p>
          <textarea v-model="source" spellcheck="false"
            class="w-full h-[520px] p-4 bg-white border border-gray-200 rounded-2xl font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 shadow"
            placeholder="# Hello World&#10;&#10;Write **markdown** here..."></textarea>
        </div>
        <!-- Preview -->
        <div v-if="activeTab !== 'editor'" class="flex flex-col gap-1">
          <p class="text-xs text-gray-400 uppercase tracking-widest font-medium">Preview</p>
          <div class="w-full h-[520px] overflow-y-auto p-4 bg-white border border-gray-200 rounded-2xl shadow prose prose-sm max-w-none"
            v-html="rendered"></div>
        </div>
      </div>

      <!-- Stats bar -->
      <div class="flex gap-4 text-xs text-gray-400">
        <span>Words: <strong class="text-gray-600">{{ wordCount }}</strong></span>
        <span>Chars: <strong class="text-gray-600">{{ source.length }}</strong></span>
        <span>Lines: <strong class="text-gray-600">{{ lineCount }}</strong></span>
      </div>

      <!-- Legend -->
      <BentoCard cls="text-xs text-gray-500">
        <CardHeader icon="bx-info-circle">Markdown Quick Reference</CardHeader>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 font-mono text-xs">
          <span><code># H1</code> — Heading 1</span>
          <span><code>**bold**</code> — Bold</span>
          <span><code>*italic*</code> — Italic</span>
          <span><code>~~strike~~</code> — Strikethrough</span>
          <span><code>`code`</code> — Inline code</span>
          <span><code>```block```</code> — Code block</span>
          <span><code>- item</code> — List item</span>
          <span><code>[text](url)</code> — Link</span>
          <span><code>![alt](url)</code> — Image</span>
          <span><code>&gt; quote</code> — Blockquote</span>
          <span><code>---</code> — Horizontal rule</span>
          <span><code>1. item</code> — Ordered list</span>
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
import TabBar     from '../components/ui/TabBar.vue'
import { parseMarkdown } from '../utils/markdownParser.js'

const source = ref(`# Welcome to Markdown Previewer

Write your **markdown** here and see the *live preview* on the right.

## Features
- Live preview as you type
- Export to HTML or plain text
- Split, editor-only, or preview-only view

## Code Example
\`\`\`js
const greet = name => \`Hello, \${name}!\`
\`\`\`

> Tip: Use the tabs above to switch between split, editor, and preview modes.

---

[ToolGrid](https://github.com) — built with Vue 3 & Tailwind CSS
`)

const tabs = [
  { id: 'split',   label: 'Split' },
  { id: 'editor',  label: 'Editor Only' },
  { id: 'preview', label: 'Preview Only' },
]
const activeTab = ref('split')

const rendered  = computed(() => parseMarkdown(source.value))
const wordCount = computed(() => source.value.trim().split(/\s+/).filter(Boolean).length)
const lineCount = computed(() => source.value.split('\n').length)

function download(content, filename, mime) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([content], { type: mime }))
  a.download = filename
  a.click()
}

function exportHTML() {
  download(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Export</title></head><body>${rendered.value}</body></html>`, 'export.html', 'text/html')
}
function exportTxt() {
  download(source.value, 'export.md', 'text/plain')
}
function clearAll() { source.value = '' }
</script>

<style scoped>
.prose h1 { font-size: 1.6rem; font-weight: 700; margin: .5rem 0; }
.prose h2 { font-size: 1.3rem; font-weight: 700; margin: .5rem 0; }
.prose h3 { font-size: 1.1rem; font-weight: 600; margin: .4rem 0; }
.prose h4,.prose h5,.prose h6 { font-weight: 600; margin: .3rem 0; }
.prose p  { margin: .4rem 0; line-height: 1.6; }
.prose ul,.prose ol { padding-left: 1.5rem; margin: .4rem 0; }
.prose li { margin: .2rem 0; }
.prose blockquote { border-left: 3px solid #3b82f6; padding-left: .75rem; color: #6b7280; margin: .5rem 0; }
.prose code { background: #f3f4f6; padding: .1rem .3rem; border-radius: .25rem; font-size: .85em; }
.prose pre  { background: #1e293b; color: #e2e8f0; padding: 1rem; border-radius: .5rem; overflow-x: auto; margin: .5rem 0; }
.prose pre code { background: none; padding: 0; color: inherit; }
.prose a   { color: #3b82f6; text-decoration: underline; }
.prose hr  { border: none; border-top: 1px solid #e5e7eb; margin: .75rem 0; }
.prose img { max-width: 100%; border-radius: .5rem; }
.prose strong { font-weight: 700; }
.prose em { font-style: italic; }
.prose del { text-decoration: line-through; color: #9ca3af; }
</style>
