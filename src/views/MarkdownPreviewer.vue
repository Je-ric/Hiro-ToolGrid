<template>
  <ToolLayout title="Markdown Previewer" subtitle="Write Markdown on the left, see the live preview on the right">

    <!-- Toolbar: tabs left, actions right -->
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <TabBar :tabs="tabs" :active="activeTab" @change="activeTab = $event" />
      <div class="flex gap-2">
        <AppBtn variant="download" icon="bx-download" size="sm" @click="exportHTML">Export HTML</AppBtn>
        <AppBtn variant="download" icon="bx-download" size="sm" @click="exportMd">Export .md</AppBtn>
        <AppBtn variant="ghost" icon="bx-trash" size="sm" @click="clearAll">Clear</AppBtn>
      </div>
    </div>

    <!-- Editor / Preview panes -->
    <div :class="['grid gap-5', activeTab === 'split' ? 'grid-cols-2' : 'grid-cols-1']">
      <div v-if="activeTab !== 'preview'" class="flex flex-col gap-2">
        <p class="tg-label">Markdown Input</p>
        <textarea v-model="source" spellcheck="false"
          class="tg-input tg-mono w-full resize-none text-sm leading-relaxed"
          style="min-height:480px"
          placeholder="# Hello World&#10;&#10;Write **markdown** here..."></textarea>
      </div>
      <div v-if="activeTab !== 'editor'" class="flex flex-col gap-2">
        <p class="tg-label">Preview</p>
        <div class="tg-card p-5 overflow-y-auto prose" style="min-height:480px" v-html="rendered"></div>
      </div>
    </div>

    <!-- Stats -->
    <div class="flex gap-4 text-xs" style="color:var(--text-faint)">
      <span>Words: <strong style="color:var(--text-base)">{{ wordCount }}</strong></span>
      <span>Chars: <strong style="color:var(--text-base)">{{ source.length }}</strong></span>
      <span>Lines: <strong style="color:var(--text-base)">{{ lineCount }}</strong></span>
    </div>

    <template #legend>
      <div class="flex flex-col gap-1.5 text-xs" style="color:var(--text-muted)">
        <p class="font-semibold" style="color:var(--text-base)">Markdown Syntax</p>
        <div class="flex flex-col gap-1 tg-mono text-[11px]">
          <span><span style="color:var(--accent)"># H1</span> — Heading 1</span>
          <span><span style="color:var(--accent)">## H2</span> — Heading 2</span>
          <span><span style="color:var(--accent)">**bold**</span> — Bold</span>
          <span><span style="color:var(--accent)">*italic*</span> — Italic</span>
          <span><span style="color:var(--accent)">~~strike~~</span> — Strikethrough</span>
          <span><span style="color:var(--accent)">`code`</span> — Inline code</span>
          <span><span style="color:var(--accent)">- item</span> — List item</span>
          <span><span style="color:var(--accent)">1. item</span> — Ordered list</span>
          <span><span style="color:var(--accent)">[text](url)</span> — Link</span>
          <span><span style="color:var(--accent)">![alt](url)</span> — Image</span>
          <span><span style="color:var(--accent)">&gt; text</span> — Blockquote</span>
          <span><span style="color:var(--accent)">---</span> — Horizontal rule</span>
        </div>
        <div class="tg-divider"></div>
        <p style="color:var(--text-faint)">Use Split view to write and preview simultaneously.</p>
      </div>
    </template>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../components/layouts/ToolLayout.vue'
import TabBar     from '../components/ui/TabBar.vue'
import AppBtn     from '../components/ui/AppBtn.vue'
import { parseMarkdown } from '../utils/markdownParser.js'

const source = ref(`# Welcome to Markdown Previewer\n\nWrite your **markdown** here and see the *live preview* on the right.\n\n## Features\n- Live preview as you type\n- Export to HTML or .md\n- Split, editor-only, or preview-only view\n\n## Code Example\n\`\`\`js\nconst greet = name => \`Hello, \${name}!\`\n\`\`\`\n\n> Tip: Use the tabs above to switch views.\n\n---\n\n[ToolGrid](https://github.com) — built with Vue 3 & Tailwind CSS\n`)

const tabs = [
  { id: 'split',   label: '⬛ Split' },
  { id: 'editor',  label: '✏️ Editor' },
  { id: 'preview', label: '👁 Preview' },
]
const activeTab = ref('split')

const rendered  = computed(() => parseMarkdown(source.value))
const wordCount = computed(() => source.value.trim().split(/\s+/).filter(Boolean).length)
const lineCount = computed(() => source.value.split('\n').length)

function dl(content, name, mime) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([content], { type: mime }))
  a.download = name; a.click()
}
function exportHTML() { dl(`<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${rendered.value}</body></html>`, 'export.html', 'text/html') }
function exportMd()   { dl(source.value, 'export.md', 'text/plain') }
function clearAll()   { source.value = '' }
</script>

<style scoped>
.prose :deep(h1) { font-size:1.5rem;font-weight:700;margin:.5rem 0;color:#0f172a }
.prose :deep(h2) { font-size:1.2rem;font-weight:700;margin:.5rem 0;color:#0f172a }
.prose :deep(h3) { font-size:1rem;font-weight:600;margin:.4rem 0;color:#0f172a }
.prose :deep(p)  { margin:.4rem 0;line-height:1.6;color:#334155 }
.prose :deep(ul),.prose :deep(ol) { padding-left:1.5rem;margin:.4rem 0 }
.prose :deep(li) { margin:.2rem 0;color:#334155 }
.prose :deep(blockquote) { border-left:3px solid #0891b2;padding-left:.75rem;color:#64748b;margin:.5rem 0 }
.prose :deep(code) { background:#f1f5f9;padding:.1rem .3rem;border-radius:.25rem;font-size:.85em;font-family:'JetBrains Mono',monospace;color:#0891b2 }
.prose :deep(pre)  { background:#0f172a;color:#e2e8f0;padding:1rem;border-radius:.5rem;overflow-x:auto;margin:.5rem 0 }
.prose :deep(pre code) { background:none;padding:0;color:inherit }
.prose :deep(a)   { color:#0891b2;text-decoration:underline }
.prose :deep(hr)  { border:none;border-top:1px solid #e2e8f0;margin:.75rem 0 }
.prose :deep(img) { max-width:100%;border-radius:.5rem }
.prose :deep(strong) { font-weight:700;color:#0f172a }
.prose :deep(em) { font-style:italic }
.prose :deep(del) { text-decoration:line-through;color:#94a3b8 }
</style>
