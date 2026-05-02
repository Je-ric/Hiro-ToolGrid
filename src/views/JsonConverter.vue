<template>
  <ToolLayout title="JSON ↔ Table / CSV" subtitle="Convert JSON arrays to a table or CSV, and CSV back to JSON" max-w="max-w-4xl">

    <TabBar :tabs="modes" :active="activeTab" @change="switchMode" />

    <BentoCard cls="w-full max-w-4xl" gap="4" padding="6">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-bold text-gray-700">{{ activeTab === 'csv2json' ? 'CSV Input' : 'JSON Input' }}</h2>
        <button @click="loadSample" class="text-sm text-blue-500 hover:text-blue-700 font-medium">Load Sample</button>
      </div>
      <textarea v-model="inputArea" :placeholder="inputPlaceholder"
        class="w-full h-48 p-3 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm font-mono"></textarea>
      <div class="flex gap-3">
        <AppBtn @click="convert">Convert</AppBtn>
        <AppBtn variant="green" icon="bx-copy" @click="copy(outputArea)">{{ copied ? 'Copied!' : 'Copy Output' }}</AppBtn>
        <AppBtn variant="ghost" icon="bx-x" @click="clearAll">Clear</AppBtn>
      </div>
      <ErrorBox :message="error" />
    </BentoCard>

    <!-- Table output -->
    <BentoCard v-if="tableData.rows.length" cls="w-full max-w-4xl" gap="3" padding="6">
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
    </BentoCard>

    <!-- Text output -->
    <BentoCard v-if="outputArea" cls="w-full max-w-4xl" gap="3" padding="6">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-bold text-gray-700">{{ activeTab === 'json2csv' ? 'CSV Output' : 'JSON Output' }}</h2>
        <button @click="download" class="text-sm text-blue-500 hover:text-blue-700 font-medium">Download</button>
      </div>
      <textarea :value="outputArea" readonly
        class="w-full h-64 p-3 border border-gray-300 rounded resize-none focus:outline-none text-sm font-mono bg-gray-50"></textarea>
    </BentoCard>

  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout  from '../components/layouts/ToolLayout.vue'
import BentoCard   from '../components/ui/BentoCard.vue'
import AppBtn      from '../components/ui/AppBtn.vue'
import TabBar      from '../components/ui/TabBar.vue'
import ErrorBox    from '../components/ui/ErrorBox.vue'
import { useClipboard } from '../composables/useClipboard.js'
import { useTabBar }    from '../composables/useTabBar.js'
import { getKeys, jsonToCSV, csvToJSON, downloadText } from '../utils/csvJson.js'

const modes = [{ id:'json2table', label:'JSON → Table' }, { id:'json2csv', label:'JSON → CSV' }, { id:'csv2json', label:'CSV → JSON' }]
const { activeTab, setTab } = useTabBar(modes, 'json2table')
const { copied, copy } = useClipboard()

const inputArea = ref(''), outputArea = ref(''), error = ref('')
const tableData = ref({ keys: [], rows: [] })
const lastExt = ref('txt')

const SAMPLE_JSON = '[{"name":"Alice","age":25,"city":"Manila","role":"Developer"},{"name":"Bob","age":30,"city":"Cebu","role":"Designer"},{"name":"Carol","age":28,"city":"Davao","role":"Manager"}]'
const SAMPLE_CSV  = 'name,age,city,role\nAlice,25,Manila,Developer\nBob,30,Cebu,Designer\nCarol,28,Davao,Manager'

const inputPlaceholder = computed(() => activeTab.value === 'csv2json' ? 'Paste CSV here (first row = headers)' : 'Paste JSON array here, e.g. [{"name":"Alice","age":25}]')

function switchMode(id) { setTab(id); clearAll() }
function loadSample()   { inputArea.value = activeTab.value === 'csv2json' ? SAMPLE_CSV : SAMPLE_JSON }

function convert() {
  error.value = ''; tableData.value = { keys:[], rows:[] }; outputArea.value = ''
  if (!inputArea.value.trim()) { error.value = 'Please enter some input.'; return }
  try {
    if (activeTab.value === 'json2table') {
      const data = JSON.parse(inputArea.value)
      if (!Array.isArray(data) || !data.length) throw new Error('JSON must be a non-empty array of objects.')
      tableData.value = { keys: getKeys(data), rows: data }
    } else if (activeTab.value === 'json2csv') {
      const data = JSON.parse(inputArea.value)
      if (!Array.isArray(data) || !data.length) throw new Error('JSON must be a non-empty array of objects.')
      outputArea.value = jsonToCSV(data); lastExt.value = 'csv'
    } else {
      const result = csvToJSON(inputArea.value)
      outputArea.value = JSON.stringify(result, null, 2); lastExt.value = 'json'
    }
  } catch (e) { error.value = e.message }
}

function download() { downloadText(outputArea.value, `output.${lastExt.value}`) }

function clearAll() {
  inputArea.value = ''; outputArea.value = ''; error.value = ''
  tableData.value = { keys:[], rows:[] }
}
</script>
