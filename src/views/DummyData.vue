<template>
  <ToolLayout title="Dummy Data Generator" subtitle="Generate Lorem Ipsum text and fake data for prototyping" max-w="max-w-2xl">
    <div class="flex flex-wrap justify-center gap-2">
      <button v-for="tab in tabs" :key="tab.id" @click="currentTab = tab.id"
        :class="`px-4 py-2 rounded-full font-semibold text-sm ${currentTab === tab.id ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border hover:bg-gray-100'}`">
        {{ tab.label }}
      </button>
    </div>

    <div class="w-full max-w-2xl bg-white rounded-2xl shadow p-5 flex flex-col gap-4">
      <template v-if="currentTab === 'lorem'">
        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-600">Type</label>
            <select v-model="loremType" class="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm">
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-600">Count</label>
            <input v-model.number="loremCount" type="number" min="1" max="20" class="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
          </div>
        </div>
      </template>
      <template v-else>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-600">How many to generate</label>
          <input v-model.number="otherCount" type="number" min="1" max="50" class="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
        </div>
      </template>
      <div class="flex gap-3">
        <button @click="generate" class="flex-1 bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition-colors">Generate</button>
        <button @click="copyOutput" class="flex-1 bg-green-500 text-white font-semibold py-2 rounded hover:bg-green-600 transition-colors">Copy</button>
        <button @click="output = ''" class="flex-1 bg-gray-300 text-gray-800 font-semibold py-2 rounded hover:bg-gray-400 transition-colors">Clear</button>
      </div>
    </div>

    <div class="w-full max-w-2xl bg-white rounded-2xl shadow p-5 flex flex-col gap-3">
      <h2 class="text-lg font-bold text-gray-700">Output</h2>
      <textarea :value="output" readonly placeholder="Generated content will appear here..."
        class="w-full h-64 p-3 border border-gray-300 rounded resize-none focus:outline-none text-sm text-gray-700 bg-gray-50 font-mono"></textarea>
      <p v-if="copied" class="text-green-600 text-sm font-medium text-center">Copied to clipboard!</p>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../components/ToolLayout.vue'

const tabs = [
  { id:'lorem', label:'Lorem Ipsum' }, { id:'names', label:'Names' }, { id:'emails', label:'Emails' },
  { id:'phones', label:'Phone Numbers' }, { id:'dates', label:'Dates' }, { id:'colors', label:'Colors' }
]
const currentTab = ref('lorem'), loremType = ref('paragraphs'), loremCount = ref(3), otherCount = ref(5)
const output = ref(''), copied = ref(false)

const loremWords = ['lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do','eiusmod','tempor','incididunt','ut','labore','et','dolore','magna','aliqua','enim','ad','minim','veniam','quis','nostrud','exercitation','ullamco','laboris','nisi','aliquip','ex','ea','commodo','consequat','duis','aute','irure','in','reprehenderit','voluptate','velit','esse','cillum','fugiat','nulla','pariatur','excepteur','sint','occaecat','cupidatat','non','proident','sunt','culpa','qui','officia','deserunt','mollit','anim','id','est']
const firstNames = ['James','Maria','John','Patricia','Robert','Jennifer','Michael','Linda','William','Barbara','David','Susan','Richard','Jessica','Joseph','Sarah','Thomas','Karen','Charles','Lisa','Ana','Carlos','Sofia','Miguel','Isabella','Lucas','Valentina','Diego','Camila','Andres']
const lastNames  = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Wilson','Taylor','Anderson','Thomas','Jackson','White','Harris','Martin','Thompson','Young','Lee','Walker','Santos','Reyes','Cruz','Flores','Rivera','Gomez','Torres','Ramirez','Diaz','Morales']
const domains    = ['gmail.com','yahoo.com','outlook.com','hotmail.com','mail.com','proton.me','icloud.com']

const ri = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const pick = arr => arr[Math.floor(Math.random() * arr.length)]

function sentence() { const w = Array.from({length:ri(8,18)}, () => pick(loremWords)).join(' '); return w[0].toUpperCase() + w.slice(1) + '.' }
function paragraph() { return Array.from({length:ri(4,7)}, sentence).join(' ') }

function generate() {
  if (currentTab.value === 'lorem') {
    const c = Math.max(1, loremCount.value)
    if (loremType.value === 'words') output.value = Array.from({length:c}, () => pick(loremWords)).join(' ')
    else if (loremType.value === 'sentences') output.value = Array.from({length:c}, sentence).join(' ')
    else output.value = Array.from({length:c}, paragraph).join('\n\n')
  } else {
    const c = Math.max(1, otherCount.value)
    const lines = Array.from({length:c}, () => {
      if (currentTab.value === 'names')  return `${pick(firstNames)} ${pick(lastNames)}`
      if (currentTab.value === 'emails') { const sep = pick(['.','_','']); return `${pick(firstNames).toLowerCase()}${sep}${pick(lastNames).toLowerCase()}${ri(0,1)?ri(0,99):''}@${pick(domains)}` }
      if (currentTab.value === 'phones') { let n=''; for(let i=0;i<10;i++){n+=ri(0,9);if(i===2||i===5)n+='-'} return `${pick(['+1','+63','+44','+61','+81'])} ${n}` }
      if (currentTab.value === 'dates')  { const y=ri(1970,2025),m=ri(1,12),d=ri(1,28); return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}` }
      if (currentTab.value === 'colors') { const r=ri(0,255),g=ri(0,255),b=ri(0,255); return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}  rgb(${r}, ${g}, ${b})` }
    })
    output.value = lines.join('\n')
  }
}

function copyOutput() {
  if (!output.value) return
  navigator.clipboard.writeText(output.value)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
</script>
