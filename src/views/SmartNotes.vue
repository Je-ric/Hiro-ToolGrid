<template>
  <ToolLayout title="Smart Notes" subtitle="Offline notepad — notes are saved automatically in your browser.">
    <div class="w-full flex flex-col gap-5">

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">

        <!-- Sidebar: note list -->
        <BentoCard cls="md:col-span-1 h-fit">
          <div class="flex items-center justify-between">
            <CardHeader icon="bx-note">Notes ({{ notes.length }})</CardHeader>
            <button @click="newNote" class="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 flex items-center gap-1">
              <i class="bx bx-plus"></i> New
            </button>
          </div>

          <!-- Search -->
          <input v-model="search" class="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Search notes..." />

          <!-- Category filter -->
          <div class="flex flex-wrap gap-1">
            <button v-for="cat in allCategories" :key="cat" @click="filterCat = filterCat === cat ? '' : cat"
              :class="['px-2 py-0.5 rounded-full text-xs font-semibold transition-colors',
                filterCat === cat ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']">
              {{ cat }}
            </button>
          </div>

          <!-- Note list -->
          <div class="flex flex-col gap-1 max-h-96 overflow-y-auto">
            <div v-if="filteredNotes.length === 0" class="text-sm text-gray-400 italic text-center py-4">No notes found.</div>
            <button v-for="note in filteredNotes" :key="note.id" @click="selectNote(note)"
              :class="['text-left p-3 rounded-xl border transition-colors',
                activeNote?.id === note.id ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100']">
              <div class="flex items-center justify-between gap-1">
                <p class="font-semibold text-sm text-gray-800 truncate">{{ note.title || 'Untitled' }}</p>
                <span v-if="note.category" class="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded-full shrink-0">{{ note.category }}</span>
              </div>
              <p class="text-xs text-gray-400 truncate mt-0.5">{{ note.content.slice(0, 60) || 'Empty note' }}</p>
              <p class="text-[10px] text-gray-300 mt-1">{{ formatDate(note.updatedAt) }}</p>
            </button>
          </div>
        </BentoCard>

        <!-- Editor -->
        <BentoCard cls="md:col-span-2">
          <div v-if="activeNote">
            <div class="flex items-center justify-between mb-3">
              <CardHeader icon="bx-edit">Edit Note</CardHeader>
              <div class="flex gap-2">
                <button @click="exportNote('txt')" class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200">Export .txt</button>
                <button @click="exportNote('md')" class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200">Export .md</button>
                <button @click="deleteNote" class="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-lg hover:bg-red-200">
                  <i class="bx bx-trash"></i>
                </button>
              </div>
            </div>

            <input v-model="activeNote.title" @input="save" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 mb-3"
              placeholder="Note title..." />

            <input v-model="activeNote.category" @input="save" class="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 mb-3"
              placeholder="Category (e.g. Work, Personal, Ideas)..." />

            <textarea v-model="activeNote.content" @input="save"
              class="w-full h-72 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Start writing..."></textarea>

            <div class="flex items-center justify-between mt-2 text-xs text-gray-400">
              <span>{{ wordCount }} words · {{ activeNote.content.length }} chars</span>
              <span class="flex items-center gap-1 text-green-500"><i class="bx bx-check"></i> Auto-saved</span>
            </div>
          </div>
          <div v-else class="flex flex-col items-center justify-center h-64 text-gray-400">
            <i class="bx bx-note text-5xl mb-3"></i>
            <p class="text-sm">Select a note or create a new one.</p>
            <button @click="newNote" class="mt-3 px-4 py-2 bg-blue-500 text-white text-sm rounded-xl hover:bg-blue-600">
              <i class="bx bx-plus"></i> New Note
            </button>
          </div>
        </BentoCard>
      </div>

      <!-- Legend -->
      <BentoCard cls="text-xs text-gray-500">
        <CardHeader icon="bx-info-circle">About Smart Notes</CardHeader>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div><i class="bx bx-save text-blue-500"></i> <strong>Auto-save</strong> — Notes are saved instantly to localStorage as you type.</div>
          <div><i class="bx bx-tag text-blue-500"></i> <strong>Categories</strong> — Tag notes with any category and filter by it.</div>
          <div><i class="bx bx-download text-blue-500"></i> <strong>Export</strong> — Download any note as .txt or .md file.</div>
        </div>
      </BentoCard>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ToolLayout from '../components/layouts/ToolLayout.vue'
import BentoCard  from '../components/ui/BentoCard.vue'
import CardHeader from '../components/ui/CardHeader.vue'

const STORAGE_KEY = 'tg_smart_notes'
const notes      = ref([])
const activeNote = ref(null)
const search     = ref('')
const filterCat  = ref('')

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) notes.value = JSON.parse(saved)
})

function persist() { localStorage.setItem(STORAGE_KEY, JSON.stringify(notes.value)) }

function newNote() {
  const note = { id: Date.now(), title: '', content: '', category: '', updatedAt: Date.now() }
  notes.value.unshift(note)
  activeNote.value = note
  persist()
}

function selectNote(note) { activeNote.value = note }

function save() {
  if (!activeNote.value) return
  activeNote.value.updatedAt = Date.now()
  const idx = notes.value.findIndex(n => n.id === activeNote.value.id)
  if (idx !== -1) notes.value[idx] = { ...activeNote.value }
  persist()
}

function deleteNote() {
  if (!activeNote.value) return
  notes.value = notes.value.filter(n => n.id !== activeNote.value.id)
  activeNote.value = notes.value[0] ?? null
  persist()
}

function exportNote(ext) {
  if (!activeNote.value) return
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([activeNote.value.content], { type: 'text/plain' }))
  a.download = `${activeNote.value.title || 'note'}.${ext}`; a.click()
}

const allCategories = computed(() => {
  const cats = [...new Set(notes.value.map(n => n.category).filter(Boolean))]
  return ['All', ...cats]
})

const filteredNotes = computed(() => {
  let list = notes.value
  if (filterCat.value && filterCat.value !== 'All') list = list.filter(n => n.category === filterCat.value)
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q))
  }
  return list
})

const wordCount = computed(() => activeNote.value?.content.trim().split(/\s+/).filter(Boolean).length ?? 0)

function formatDate(ts) {
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>
