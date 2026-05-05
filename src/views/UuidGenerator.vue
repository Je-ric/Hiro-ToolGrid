<template>
  <ToolLayout title="UUID / Token Generator" subtitle="Generate UUIDs, secure tokens, and cryptographic hashes.">
    <div class="w-full max-w-5xl flex flex-col gap-5">

      <TabBar :tabs="tabs" :active="activeTab" @change="activeTab = $event" />

      <!-- UUID Tab -->
      <div v-if="activeTab === 'uuid'" class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <BentoCard>
          <CardHeader icon="bx-id-card">UUID v4 Generator</CardHeader>
          <p class="text-xs text-gray-400">UUID v4 is randomly generated. Each click produces a cryptographically unique identifier — ideal for database primary keys, session IDs, and request tracking.</p>
          <div class="flex gap-2">
            <input :value="uuid" readonly class="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm focus:outline-none" placeholder="Click Generate" />
            <button @click="copyText(uuid)" class="px-3 bg-green-500 text-white rounded-xl hover:bg-green-600 text-sm font-semibold">
              {{ copiedKey === 'uuid' ? '✓' : 'Copy' }}
            </button>
          </div>
          <div class="flex gap-2">
            <AppBtn @click="makeUUID" icon="bx-refresh">Generate UUID</AppBtn>
            <AppBtn variant="secondary" @click="makeBulkUUID" icon="bx-list-ul">Bulk (5)</AppBtn>
          </div>
          <div v-if="bulkUUIDs.length" class="flex flex-col gap-1">
            <p class="text-xs text-gray-400 uppercase tracking-widest">Bulk Output</p>
            <textarea :value="bulkUUIDs.join('\n')" readonly class="w-full h-28 p-2 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs resize-none focus:outline-none"></textarea>
            <button @click="copyText(bulkUUIDs.join('\n'))" class="self-start px-3 py-1 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600">
              {{ copiedKey === 'bulk' ? 'Copied!' : 'Copy All' }}
            </button>
          </div>
        </BentoCard>

        <BentoCard>
          <CardHeader icon="bx-history">History</CardHeader>
          <p class="text-xs text-gray-400">Last 20 generated values. Saved in localStorage.</p>
          <div v-if="history.length === 0" class="text-sm text-gray-400 italic">No history yet.</div>
          <div v-else class="flex flex-col gap-1 max-h-64 overflow-y-auto">
            <div v-for="(item, i) in history" :key="i"
              class="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-xs font-mono group">
              <span class="flex-1 truncate">{{ item.value }}</span>
              <span class="text-gray-300 text-[10px] shrink-0">{{ item.type }}</span>
              <button @click="copyText(item.value)" class="opacity-0 group-hover:opacity-100 px-2 py-0.5 bg-green-500 text-white rounded text-[10px]">Copy</button>
            </div>
          </div>
          <button v-if="history.length" @click="clearHistory" class="self-start text-xs text-red-400 hover:text-red-600">Clear history</button>
        </BentoCard>
      </div>

      <!-- Token Tab -->
      <div v-if="activeTab === 'token'" class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <BentoCard>
          <CardHeader icon="bx-key">Token Options</CardHeader>
          <p class="text-xs text-gray-400">Tokens are random strings useful for API keys, session secrets, and one-time codes.</p>
          <div class="flex flex-col gap-1">
            <label class="text-sm text-gray-500">Length: <strong class="text-gray-800">{{ tokenLen }}</strong></label>
            <input type="range" v-model.number="tokenLen" min="8" max="128" class="accent-blue-500" />
          </div>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" v-model="tokUpper"   class="accent-blue-500 w-4 h-4" /> A–Z Uppercase</label>
            <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" v-model="tokLower"   class="accent-blue-500 w-4 h-4" /> a–z Lowercase</label>
            <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" v-model="tokDigits"  class="accent-blue-500 w-4 h-4" /> 0–9 Digits</label>
            <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" v-model="tokSymbols" class="accent-blue-500 w-4 h-4" /> Symbols (!@#…)</label>
          </div>
          <AppBtn @click="makeToken" icon="bx-refresh">Generate Token</AppBtn>
        </BentoCard>
        <BentoCard>
          <CardHeader icon="bx-code-alt">Generated Token</CardHeader>
          <textarea :value="token" readonly class="w-full h-24 p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs resize-none focus:outline-none break-all"></textarea>
          <div class="flex gap-2">
            <button @click="copyText(token)" class="flex-1 py-2 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600">
              {{ copiedKey === 'token' ? 'Copied!' : 'Copy Token' }}
            </button>
          </div>
          <p class="text-xs text-gray-400">Entropy: ~{{ entropy }} bits</p>
        </BentoCard>
      </div>

      <!-- Hash Tab -->
      <div v-if="activeTab === 'hash'" class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <BentoCard>
          <CardHeader icon="bx-hash">Input</CardHeader>
          <p class="text-xs text-gray-400">Enter any text to compute its hash. Hashes are one-way — you cannot reverse them. Useful for checksums, password verification, and data integrity.</p>
          <textarea v-model="hashInput" class="w-full h-32 p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Enter text to hash..."></textarea>
          <AppBtn @click="computeHashes" icon="bx-cog">Compute Hashes</AppBtn>
        </BentoCard>
        <BentoCard>
          <CardHeader icon="bx-shield">Hash Results</CardHeader>
          <div v-if="!hashResults.md5" class="text-sm text-gray-400 italic">Enter text and click Compute.</div>
          <div v-else class="flex flex-col gap-3">
            <div v-for="(val, algo) in hashResults" :key="algo">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-semibold text-gray-500 uppercase">{{ algo }}</span>
                <button @click="copyText(val)" class="text-xs px-2 py-0.5 bg-green-500 text-white rounded hover:bg-green-600">
                  {{ copiedKey === algo ? '✓' : 'Copy' }}
                </button>
              </div>
              <input :value="val" readonly class="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg font-mono text-xs focus:outline-none" />
            </div>
          </div>
        </BentoCard>
      </div>

      <!-- Legend -->
      <BentoCard cls="text-xs text-gray-500">
        <CardHeader icon="bx-info-circle">What's the difference?</CardHeader>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div><strong class="text-gray-700">UUID v4</strong> — 128-bit random identifier. Standard format: <code>xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx</code>. Use for DB keys, request IDs.</div>
          <div><strong class="text-gray-700">Token</strong> — Custom-length random string. Use for API keys, secrets, OTPs. More flexible than UUID.</div>
          <div><strong class="text-gray-700">Hash</strong> — Deterministic one-way fingerprint. Same input always gives same output. MD5/SHA-1 are fast but weak for passwords; SHA-256 is preferred.</div>
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
import AppBtn     from '../components/ui/AppBtn.vue'
import TabBar     from '../components/ui/TabBar.vue'
import { generateUUID, generateToken, hashMD5, hashSHA1, hashSHA256, hashSHA512 } from '../utils/uuidTokenHash.js'

const tabs = [
  { id: 'uuid',  label: 'UUID v4' },
  { id: 'token', label: 'Token' },
  { id: 'hash',  label: 'Hash' },
]
const activeTab = ref('uuid')

// UUID
const uuid      = ref('')
const bulkUUIDs = ref([])

// Token
const tokenLen  = ref(32)
const tokUpper  = ref(true)
const tokLower  = ref(true)
const tokDigits = ref(true)
const tokSymbols= ref(false)
const token     = ref('')

// Hash
const hashInput   = ref('')
const hashResults = ref({})

// Shared
const copiedKey = ref('')
const history   = ref([])

onMounted(() => {
  const saved = localStorage.getItem('tg_uuid_history')
  if (saved) history.value = JSON.parse(saved)
})

function saveHistory(value, type) {
  history.value.unshift({ value, type })
  if (history.value.length > 20) history.value.pop()
  localStorage.setItem('tg_uuid_history', JSON.stringify(history.value))
}

function copyText(text, key) {
  if (!text) return
  navigator.clipboard.writeText(text)
  copiedKey.value = key || text.slice(0, 8)
  setTimeout(() => copiedKey.value = '', 2000)
}

function makeUUID() {
  uuid.value = generateUUID()
  saveHistory(uuid.value, 'UUID')
  copyText(uuid.value, 'uuid')
}

function makeBulkUUID() {
  bulkUUIDs.value = Array.from({ length: 5 }, generateUUID)
  bulkUUIDs.value.forEach(u => saveHistory(u, 'UUID'))
  copyText(bulkUUIDs.value.join('\n'), 'bulk')
}

function makeToken() {
  token.value = generateToken({ length: tokenLen.value, upper: tokUpper.value, lower: tokLower.value, digits: tokDigits.value, symbols: tokSymbols.value })
  saveHistory(token.value, 'Token')
  copyText(token.value, 'token')
}

async function computeHashes() {
  if (!hashInput.value) return
  const [sha1, sha256, sha512] = await Promise.all([
    hashSHA1(hashInput.value),
    hashSHA256(hashInput.value),
    hashSHA512(hashInput.value),
  ])
  hashResults.value = {
    md5: hashMD5(hashInput.value),
    'sha-1': sha1,
    'sha-256': sha256,
    'sha-512': sha512,
  }
}

function clearHistory() {
  history.value = []
  localStorage.removeItem('tg_uuid_history')
}

const charsetSize = computed(() => {
  let s = 0
  if (tokUpper.value)   s += 26
  if (tokLower.value)   s += 26
  if (tokDigits.value)  s += 10
  if (tokSymbols.value) s += 12
  return s || 36
})
const entropy = computed(() => Math.floor(tokenLen.value * Math.log2(charsetSize.value)))
</script>
