<template>
  <ToolLayout title="SQL Formatter" subtitle="Paste messy SQL and get clean, readable, formatted output.">
    <div class="w-full flex flex-col gap-5">

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <BentoCard>
          <CardHeader icon="bx-code-curly">Input SQL</CardHeader>
          <textarea v-model="input" class="w-full h-72 p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="SELECT u.id, u.name, o.total FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.active = 1 ORDER BY o.total DESC LIMIT 10"></textarea>
          <div class="flex gap-2">
            <AppBtn @click="format" icon="bx-magic-wand">Format SQL</AppBtn>
            <AppBtn variant="ghost" @click="input='';output=''" icon="bx-x">Clear</AppBtn>
            <button @click="loadExample" class="px-3 py-2 bg-gray-100 text-gray-600 text-sm rounded-xl hover:bg-gray-200">Load Example</button>
          </div>
        </BentoCard>

        <BentoCard>
          <CardHeader icon="bx-check-square">Formatted Output</CardHeader>
          <div class="relative">
            <pre v-if="output" class="w-full h-72 p-3 bg-gray-900 rounded-xl text-xs overflow-auto" v-html="highlighted"></pre>
            <textarea v-else class="w-full h-72 p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm resize-none focus:outline-none" readonly placeholder="Formatted SQL appears here..."></textarea>
          </div>
          <div class="flex gap-2">
            <button @click="copyOutput" class="flex-1 py-2 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600">
              {{ copied ? 'Copied!' : 'Copy SQL' }}
            </button>
            <button @click="downloadSQL" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl text-sm hover:bg-gray-300">
              <i class="bx bx-download"></i>
            </button>
          </div>
        </BentoCard>
      </div>

      <!-- Legend -->
      <BentoCard cls="text-xs text-gray-500">
        <CardHeader icon="bx-info-circle">SQL Keyword Color Guide</CardHeader>
        <div class="flex flex-wrap gap-3">
          <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-blue-400 inline-block"></span> DML (SELECT, INSERT, UPDATE, DELETE)</span>
          <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-purple-400 inline-block"></span> Clauses (FROM, WHERE, JOIN, ON)</span>
          <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-yellow-400 inline-block"></span> Operators (AND, OR, NOT, IN, LIKE)</span>
          <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-green-400 inline-block"></span> Sorting / Grouping (ORDER BY, GROUP BY)</span>
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
import AppBtn     from '../components/ui/AppBtn.vue'
import { formatSQL } from '../utils/sqlFormatter.js'

const input  = ref('')
const output = ref('')
const copied = ref(false)

function format() { output.value = formatSQL(input.value) }

const DML      = ['SELECT','INSERT INTO','UPDATE','DELETE FROM','INSERT','DELETE','TRUNCATE TABLE','CREATE TABLE','ALTER TABLE','DROP TABLE']
const CLAUSES  = ['FROM','WHERE','LEFT JOIN','RIGHT JOIN','INNER JOIN','OUTER JOIN','FULL JOIN','CROSS JOIN','JOIN','ON','HAVING','WITH','RETURNING','SET','VALUES']
const OPERATORS= ['AND','OR','NOT','IN','EXISTS','BETWEEN','LIKE','IS NULL','IS NOT NULL','DISTINCT','AS','CASE','WHEN','THEN','ELSE','END','UNION ALL','UNION']
const SORTING  = ['ORDER BY','GROUP BY','LIMIT','OFFSET','PRIMARY KEY','FOREIGN KEY','REFERENCES','DEFAULT','UNIQUE','INDEX','CONSTRAINT','NOT NULL']

const highlighted = computed(() => {
  if (!output.value) return ''
  let s = output.value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  const colorize = (kws, cls) => {
    for (const kw of [...kws].sort((a,b) => b.length - a.length)) {
      const re = new RegExp(`\\b${kw}\\b`, 'g')
      s = s.replace(re, `<span class="${cls}">${kw}</span>`)
    }
  }
  colorize(DML,       'text-blue-400 font-bold')
  colorize(CLAUSES,   'text-purple-400 font-semibold')
  colorize(OPERATORS, 'text-yellow-300')
  colorize(SORTING,   'text-green-400')
  return `<code class="text-gray-200 text-xs">${s}</code>`
})

function copyOutput() {
  if (!output.value) return
  navigator.clipboard.writeText(output.value)
  copied.value = true; setTimeout(() => copied.value = false, 2000)
}
function downloadSQL() {
  if (!output.value) return
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([output.value], { type: 'text/plain' }))
  a.download = 'formatted.sql'; a.click()
}
function loadExample() {
  input.value = `select u.id,u.name,u.email,o.id as order_id,o.total,o.created_at from users u left join orders o on u.id=o.user_id where u.active=1 and o.total>100 order by o.total desc limit 10`
  format()
}
</script>
