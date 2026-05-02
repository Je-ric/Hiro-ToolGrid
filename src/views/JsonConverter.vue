<template>
  <ToolLayout title="JSON ↔ Table / CSV" subtitle="Convert JSON arrays to a table or CSV, and CSV back to JSON" max-w="max-w-4xl">
    <div class="flex gap-2">
      <button v-for="tab in modes" :key="tab.id" @click="switchMode(tab.id)"
        :class="`px-4 py-2 rounded-full font-semibold text-sm ${currentMode === tab.id ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border hover:bg-gray-100'}`">
        {{ tab.label }}
      </button>
    </div>

    <div class="w-full max-w-4xl bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-bold text-gray-700">{{ currentMode === 'csv2json' ? 'CSV Input' : 'JSON Input' }}</h2>
        <button @click="loadSample" class="text-sm text-blue-500 hover:text-blue-700 font-medium">Load Sample</button>
      </div>
      <textarea v-model="inputArea" :placeholder="inputPlaceholder"
        class="w-full h-48 p-3 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm font-mono"></textarea>
      <div class="flex gap-3">
        <button @click="convert" class="flex-1 bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition-colors">Convert</button>
        <button @click="copyOutput" class="flex-1 bg-green-500 text-white font-semibold py-2 rounded hover:bg-green-600 transition-colors">Copy Output</button>
        <button @click="clearAll" class="flex-1 bg-gray-300 text-gray-800 font-semibold py-2 rounded hover:bg-gray-400 transition-colors">Clear</button>
      </div>
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 font-medium text-sm">{{ error }}</div>
    </div>

    <!-- Table output -->
    <div v-if="tableData.rows.length" class="w-full max-w-4xl bg-white rounded-2xl shadow p-6 flex flex-col gap-3">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-bold text-gray-700">Table</h2>
        <span class="text-sm text-gray-400">{{ tableData.rows.length }} rows, {{ tableData.keys.length }} columns</span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="bg-blue-500 text-white">
              <th class="p-2 border border-blue-400 text-left font-semibold text-xs">#</th>
              <th v-for="k in tableData.keys" :key="k" class="p-2 border border-blue-400 text-left font-semibold text-xs whitespace-nowrap">{{ k }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in tableData.rows" :key="i" :class="i%2===0?'bg-white hover:bg-blue-50':'bg-gray-50 hover:bg-blue-50'">
              <td class="p-2 border border-gray-200 text-gray-400 text-xs">{{ i+1 }}</td>
              <td v-for="k in tableData.keys" :key="k" class="p-2 border border-gray-200 text-sm text-gray-700">{{ row[k] ?? '' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Text output -->
    <div v-if="outputArea" class="w-full max-w-4xl bg-white rounded-2xl shadow p-6 flex flex-col gap-3">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-bold text-gray-700">{{ currentMode === 'json2csv' ? 'CSV Output' : 'JSON Output' }}</h2>
        <button @click="downloadOutput" class="text-sm text-blue-500 hover:text-blue-700 font-medium">Download</button>
      </div>
      <textarea :value="outputArea" readonly class="w-full h-64 p-3 border border-gray-300 rounded resize-none focus:outline-none text-sm font-mono bg-gray-50"></textarea>
      <p v-if="copied" class="text-green-600 text-sm font-medium text-center">Copied!</p>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../components/ToolLayout.vue'

const modes = [{ id:'json2table', label:'JSON → Table' }, { id:'json2csv', label:'JSON → CSV' }, { id:'csv2json', label:'CSV → JSON' }]
const currentMode = ref('json2table')
const inputArea = ref(''), outputArea = ref(''), error = ref(''), copied = ref(false)
const tableData = ref({ keys: [], rows: [] })
const lastOutput = ref(''), lastExt = ref('txt')

const sampleJSON = '[{"name":"Alice","age":25,"city":"Manila","role":"Developer"},{"name":"Bob","age":30,"city":"Cebu","role":"Designer"},{"name":"Carol","age":28,"city":"Davao","role":"Manager"}]'
const sampleCSV  = 'name,age,city,role\nAlice,25,Manila,Developer\nBob,30,Cebu,Designer\nCarol,28,Davao,Manager'

const inputPlaceholder = computed(() => currentMode.value === 'csv2json' ? 'Paste CSV here (first row = headers)' : 'Paste JSON array here, e.g. [{"name":"Alice","age":25}]')

function switchMode(mode) { currentMode.value = mode; clearAll() }
function loadSample() { inputArea.value = currentMode.value === 'csv2json' ? sampleCSV : sampleJSON }

function getKeys(data) {
  const keys = []
  data.forEach(row => Object.keys(row).forEach(k => { if (!keys.includes(k)) keys.push(k) }))
  return keys
}

function convert() {
  error.value = ''; tableData.value = { keys:[], rows:[] }; outputArea.value = ''
  if (!inputArea.value.trim()) { error.value = 'Please enter some input.'; return }
  if (currentMode.value === 'json2table') json2table()
  else if (currentMode.value === 'json2csv') json2csv()
  else csv2json()
}

function json2table() {
  let data
  try { data = JSON.parse(inputArea.value) } catch(e) { error.value = 'Invalid JSON: ' + e.message; return }
  if (!Array.isArray(data) || !data.length) { error.value = 'JSON must be a non-empty array of objects.'; return }
  tableData.value = { keys: getKeys(data), rows: data }
}

function json2csv() {
  let data
  try { data = JSON.parse(inputArea.value) } catch(e) { error.value = 'Invalid JSON: ' + e.message; return }
  if (!Array.isArray(data) || !data.length) { error.value = 'JSON must be a non-empty array of objects.'; return }
  const keys = getKeys(data)
  let csv = keys.join(',') + '\n'
  data.forEach(row => {
    csv += keys.map(k => {
      const v = row[k] == null ? '' : String(row[k])
      return v.includes(',') || v.includes('"') || v.includes('\n') ? `"${v.replace(/"/g,'""')}"` : v
    }).join(',') + '\n'
  })
  outputArea.value = csv; lastOutput.value = csv; lastExt.value = 'csv'
}

function parseCSVLine(line) {
  const fields = []; let cur = '', inQ = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQ) { if (ch==='"' && line[i+1]==='"') { cur+='"'; i++ } else if (ch==='"') inQ=false; else cur+=ch }
    else { if (ch==='"') inQ=true; else if (ch===',') { fields.push(cur.trim()); cur='' } else cur+=ch }
  }
  fields.push(cur.trim()); return fields
}

function csv2json() {
  const lines = inputArea.value.split('\n').filter(l => l.trim())
  if (lines.length < 2) { error.value = 'CSV must have at least a header row and one data row.'; return }
  const headers = parseCSVLine(lines[0])
  const result = lines.slice(1).map(line => {
    const vals = parseCSVLine(line)
    return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? '']))
  })
  const json = JSON.stringify(result, null, 2)
  outputArea.value = json; lastOutput.value = json; lastExt.value = 'json'
}

function copyOutput() {
  if (!outputArea.value) return
  navigator.clipboard.writeText(outputArea.value)
  copied.value = true; setTimeout(() => copied.value = false, 2000)
}

function downloadOutput() {
  const blob = new Blob([lastOutput.value], { type:'text/plain' })
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `output.${lastExt.value}` })
  a.click(); URL.revokeObjectURL(a.href)
}

function clearAll() {
  inputArea.value = ''; outputArea.value = ''; error.value = ''
  tableData.value = { keys:[], rows:[] }; copied.value = false; lastOutput.value = ''
}
</script>
