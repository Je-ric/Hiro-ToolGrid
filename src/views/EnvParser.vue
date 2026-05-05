<template>
  <ToolLayout title=".env Parser" subtitle="Convert .env files to JSON and back. Useful for config management and debugging.">
    <div class="w-full max-w-5xl flex flex-col gap-5">

      <TabBar :tabs="tabs" :active="activeTab" @change="activeTab = $event; reset()" />

      <!-- .env → JSON -->
      <div v-if="activeTab === 'env-to-json'" class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <BentoCard>
          <CardHeader icon="bx-file-blank">.env Input</CardHeader>
          <p class="text-xs text-gray-400">Paste your .env file content. Comments (#) and blank lines are ignored.</p>
          <textarea v-model="envInput" class="w-full h-64 p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="APP_NAME=MyApp&#10;APP_ENV=production&#10;DB_HOST=localhost&#10;DB_PORT=3306&#10;# This is a comment&#10;SECRET_KEY=abc123"></textarea>
          <div class="flex gap-2">
            <AppBtn @click="envToJson" icon="bx-right-arrow-alt">Convert to JSON</AppBtn>
            <AppBtn variant="ghost" @click="envInput='';jsonOutput=''" icon="bx-x">Clear</AppBtn>
          </div>
        </BentoCard>
        <BentoCard>
          <CardHeader icon="bx-file-json">JSON Output</CardHeader>
          <pre v-if="jsonOutput" class="w-full h-64 p-3 bg-gray-900 text-green-300 rounded-xl text-xs overflow-auto">{{ jsonOutput }}</pre>
          <div v-else class="w-full h-64 flex items-center justify-center text-gray-400 text-sm italic bg-gray-50 border border-gray-200 rounded-xl">JSON appears here...</div>
          <div class="flex gap-2">
            <button @click="copyJson" class="flex-1 py-2 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600">
              {{ copiedJson ? 'Copied!' : 'Copy JSON' }}
            </button>
          </div>
        </BentoCard>
      </div>

      <!-- JSON → .env -->
      <div v-if="activeTab === 'json-to-env'" class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <BentoCard>
          <CardHeader icon="bx-file-json">JSON Input</CardHeader>
          <p class="text-xs text-gray-400">Paste a flat JSON object (key-value pairs). Nested objects are not supported.</p>
          <textarea v-model="jsonInput" class="w-full h-64 p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder='{"APP_NAME": "MyApp", "DB_HOST": "localhost"}'></textarea>
          <div class="flex gap-2">
            <AppBtn @click="jsonToEnv" icon="bx-right-arrow-alt">Convert to .env</AppBtn>
            <AppBtn variant="ghost" @click="jsonInput='';envOutput=''" icon="bx-x">Clear</AppBtn>
          </div>
          <div v-if="jsonError" class="text-sm text-red-500 flex items-center gap-1"><i class="bx bx-error-circle"></i> {{ jsonError }}</div>
        </BentoCard>
        <BentoCard>
          <CardHeader icon="bx-file-blank">.env Output</CardHeader>
          <textarea :value="envOutput" readonly class="w-full h-64 p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm resize-none focus:outline-none"
            placeholder=".env content appears here..."></textarea>
          <div class="flex gap-2">
            <button @click="copyEnv" class="flex-1 py-2 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600">
              {{ copiedEnv ? 'Copied!' : 'Copy .env' }}
            </button>
            <button @click="downloadEnv" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl text-sm hover:bg-gray-300">
              <i class="bx bx-download"></i> .env
            </button>
          </div>
        </BentoCard>
      </div>

      <!-- Legend -->
      <BentoCard cls="text-xs text-gray-500">
        <CardHeader icon="bx-info-circle">.env File Format Rules</CardHeader>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div><code class="text-blue-600">KEY=value</code> — Basic key-value pair</div>
          <div><code class="text-blue-600">KEY="value with spaces"</code> — Quoted values</div>
          <div><code class="text-blue-600"># comment</code> — Lines starting with # are ignored</div>
          <div><code class="text-blue-600">KEY=</code> — Empty value is allowed</div>
        </div>
        <p class="mt-2 text-amber-600"><i class="bx bx-shield-x"></i> Never commit .env files with real secrets to version control.</p>
      </BentoCard>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../components/layouts/ToolLayout.vue'
import BentoCard  from '../components/ui/BentoCard.vue'
import CardHeader from '../components/ui/CardHeader.vue'
import AppBtn     from '../components/ui/AppBtn.vue'
import TabBar     from '../components/ui/TabBar.vue'

const tabs = [
  { id: 'env-to-json', label: '.env → JSON' },
  { id: 'json-to-env', label: 'JSON → .env' },
]
const activeTab = ref('env-to-json')

const envInput  = ref('')
const jsonOutput= ref('')
const copiedJson= ref(false)

const jsonInput = ref('')
const envOutput = ref('')
const jsonError = ref('')
const copiedEnv = ref(false)

function envToJson() {
  const obj = {}
  for (const line of envInput.value.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    const key = trimmed.slice(0, idx).trim()
    let val = trimmed.slice(idx + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    obj[key] = val
  }
  jsonOutput.value = JSON.stringify(obj, null, 2)
}

function jsonToEnv() {
  jsonError.value = ''
  try {
    const obj = JSON.parse(jsonInput.value)
    envOutput.value = Object.entries(obj)
      .map(([k, v]) => {
        const val = String(v)
        return val.includes(' ') ? `${k}="${val}"` : `${k}=${val}`
      }).join('\n')
  } catch (e) {
    jsonError.value = 'Invalid JSON: ' + e.message
  }
}

function copyJson() {
  if (!jsonOutput.value) return
  navigator.clipboard.writeText(jsonOutput.value)
  copiedJson.value = true; setTimeout(() => copiedJson.value = false, 2000)
}
function copyEnv() {
  if (!envOutput.value) return
  navigator.clipboard.writeText(envOutput.value)
  copiedEnv.value = true; setTimeout(() => copiedEnv.value = false, 2000)
}
function downloadEnv() {
  if (!envOutput.value) return
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([envOutput.value], { type: 'text/plain' }))
  a.download = '.env'; a.click()
}
function reset() { envInput.value=''; jsonOutput.value=''; jsonInput.value=''; envOutput.value=''; jsonError.value='' }
</script>
