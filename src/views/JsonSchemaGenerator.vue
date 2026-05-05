<template>
  <ToolLayout title="JSON Schema Generator" subtitle="Paste a JSON object or array to automatically generate its JSON Schema." max-w="max-w-6xl">
    <div class="w-full max-w-6xl flex flex-col gap-5">

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <BentoCard>
          <CardHeader icon="bx-code-curly">JSON Input</CardHeader>
          <textarea v-model="input" class="w-full h-72 p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder='{"id": 1, "name": "Alice", "email": "alice@example.com", "active": true}'></textarea>
          <div class="flex gap-2">
            <AppBtn @click="generate" icon="bx-magic-wand">Generate Schema</AppBtn>
            <AppBtn variant="ghost" @click="input='';schema='';error=''" icon="bx-x">Clear</AppBtn>
            <button @click="loadExample" class="px-3 py-2 bg-gray-100 text-gray-600 text-sm rounded-xl hover:bg-gray-200">Example</button>
          </div>
          <div v-if="error" class="text-sm text-red-500 flex items-center gap-1"><i class="bx bx-error-circle"></i> {{ error }}</div>
        </BentoCard>

        <BentoCard>
          <CardHeader icon="bx-file-json">Generated Schema</CardHeader>
          <pre v-if="schema" class="w-full h-72 p-3 bg-gray-900 text-green-300 rounded-xl text-xs overflow-auto">{{ schema }}</pre>
          <div v-else class="w-full h-72 flex items-center justify-center text-gray-400 text-sm italic bg-gray-50 border border-gray-200 rounded-xl">
            Schema appears here...
          </div>
          <div class="flex gap-2">
            <button @click="copySchema" class="flex-1 py-2 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600">
              {{ copied ? 'Copied!' : 'Copy Schema' }}
            </button>
            <button @click="downloadSchema" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl text-sm hover:bg-gray-300">
              <i class="bx bx-download"></i>
            </button>
          </div>
        </BentoCard>
      </div>

      <!-- Legend -->
      <BentoCard cls="text-xs text-gray-500">
        <CardHeader icon="bx-info-circle">What is JSON Schema?</CardHeader>
        <p>JSON Schema is a vocabulary for annotating and validating JSON documents. It describes the structure, types, and constraints of your data — useful for API documentation, form validation, and code generation.</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
          <div><code class="text-blue-600">type</code> — Data type (string, number, boolean, object, array, null)</div>
          <div><code class="text-blue-600">properties</code> — Object field definitions</div>
          <div><code class="text-blue-600">required</code> — Required field names</div>
          <div><code class="text-blue-600">format</code> — Detected formats (email, uri, date-time, uuid)</div>
        </div>
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
import { inferSchema } from '../utils/jsonSchema.js'

const input  = ref('')
const schema = ref('')
const error  = ref('')
const copied = ref(false)

function generate() {
  error.value = ''
  try {
    const parsed = JSON.parse(input.value)
    const s = inferSchema(parsed)
    schema.value = JSON.stringify({ $schema: 'http://json-schema.org/draft-07/schema#', ...s }, null, 2)
  } catch (e) {
    error.value = 'Invalid JSON: ' + e.message
    schema.value = ''
  }
}

function copySchema() {
  if (!schema.value) return
  navigator.clipboard.writeText(schema.value)
  copied.value = true; setTimeout(() => copied.value = false, 2000)
}
function downloadSchema() {
  if (!schema.value) return
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([schema.value], { type: 'application/json' }))
  a.download = 'schema.json'; a.click()
}
function loadExample() {
  input.value = JSON.stringify({
    id: 1, name: 'Alice', email: 'alice@example.com',
    age: 28, active: true, score: 9.5,
    createdAt: '2024-01-15T10:30:00Z',
    profileUrl: 'https://example.com/alice',
    tags: ['admin', 'user'],
    address: { street: '123 Main St', city: 'Springfield', zip: '12345' }
  }, null, 2)
  generate()
}
</script>
