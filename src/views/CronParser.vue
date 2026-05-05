<template>
  <ToolLayout title="Cron Expression Parser" subtitle="Enter a cron expression to get a human-readable description and next run times.">
    <div class="w-full flex flex-col gap-5">

      <BentoCard>
        <CardHeader icon="bx-time-five">Cron Expression</CardHeader>
        <p class="text-xs text-gray-400">A cron expression has 5 fields: <code>minute hour day-of-month month day-of-week</code></p>
        <div class="flex gap-2">
          <input v-model="expr" @input="parse" class="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="* * * * *" />
          <AppBtn @click="parse" icon="bx-play">Parse</AppBtn>
        </div>

        <!-- Field labels -->
        <div class="grid grid-cols-5 gap-1 text-center text-xs text-gray-400 font-mono">
          <div v-for="f in fields" :key="f.label" class="flex flex-col items-center gap-1">
            <div :class="['px-2 py-1 rounded-lg font-semibold', f.active ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500']">
              {{ f.value }}
            </div>
            <span>{{ f.label }}</span>
          </div>
        </div>
      </BentoCard>

      <!-- Result -->
      <BentoCard v-if="result">
        <CardHeader :icon="result.valid ? 'bx-check-circle' : 'bx-error-circle'"
          :icon-color="result.valid ? 'text-green-500' : 'text-red-500'">
          {{ result.valid ? 'Human-Readable Description' : 'Error' }}
        </CardHeader>
        <p :class="['text-lg font-semibold', result.valid ? 'text-gray-800' : 'text-red-600']">
          {{ result.description }}
        </p>
        <div v-if="result.valid" class="flex flex-col gap-1">
          <p class="text-xs text-gray-400 uppercase tracking-widest font-medium mt-2">Next 5 Run Times</p>
          <div v-for="(t, i) in nextRuns" :key="i" class="flex items-center gap-2 text-sm text-gray-700">
            <span class="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">{{ i+1 }}</span>
            {{ t }}
          </div>
        </div>
      </BentoCard>

      <!-- Examples -->
      <BentoCard>
        <CardHeader icon="bx-list-ul">Common Examples</CardHeader>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <button v-for="ex in examples" :key="ex.expr" @click="useExample(ex.expr)"
            class="flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl text-left transition-colors group">
            <div>
              <p class="font-mono text-sm text-blue-600 font-semibold">{{ ex.expr }}</p>
              <p class="text-xs text-gray-500">{{ ex.label }}</p>
            </div>
            <i class="bx bx-right-arrow-alt text-gray-300 group-hover:text-blue-400"></i>
          </button>
        </div>
      </BentoCard>

      <!-- Legend -->
      <BentoCard cls="text-xs text-gray-500">
        <CardHeader icon="bx-info-circle">Cron Field Reference</CardHeader>
        <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead><tr class="text-gray-400 border-b border-gray-200">
              <th class="text-left py-1 pr-4">Field</th>
              <th class="text-left py-1 pr-4">Allowed Values</th>
              <th class="text-left py-1 pr-4">Special Characters</th>
            </tr></thead>
            <tbody>
              <tr v-for="f in fieldRef" :key="f.name" class="border-b border-gray-100">
                <td class="py-1 pr-4 font-semibold text-gray-700">{{ f.name }}</td>
                <td class="py-1 pr-4 font-mono">{{ f.range }}</td>
                <td class="py-1 font-mono text-gray-500">{{ f.special }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="mt-2"><code>*</code> = any, <code>*/n</code> = every n, <code>a-b</code> = range, <code>a,b</code> = list</p>
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
import { parseCron, CRON_EXAMPLES } from '../utils/cronParser.js'

const expr   = ref('0 9 * * 1-5')
const result = ref(null)

const examples  = CRON_EXAMPLES
const fieldRef  = [
  { name: 'Minute',       range: '0–59',  special: '* , - /' },
  { name: 'Hour',         range: '0–23',  special: '* , - /' },
  { name: 'Day of Month', range: '1–31',  special: '* , - /' },
  { name: 'Month',        range: '1–12',  special: '* , - /' },
  { name: 'Day of Week',  range: '0–6 (Sun=0)', special: '* , - /' },
]

const fields = computed(() => {
  const parts = expr.value.trim().split(/\s+/)
  const labels = ['Minute', 'Hour', 'Day', 'Month', 'Weekday']
  return labels.map((label, i) => ({
    label,
    value: parts[i] ?? '?',
    active: parts[i] && parts[i] !== '*',
  }))
})

function parse() {
  result.value = parseCron(expr.value)
  if (result.value.valid) computeNextRuns()
}

function useExample(e) { expr.value = e; parse() }

// Simple next-run calculator
const nextRuns = ref([])
function computeNextRuns() {
  const parts = expr.value.trim().split(/\s+/)
  if (parts.length !== 5) return
  const [minF, hourF, , , ] = parts
  const runs = []
  const now = new Date()
  let d = new Date(now)
  d.setSeconds(0, 0)
  d.setMinutes(d.getMinutes() + 1)

  let attempts = 0
  while (runs.length < 5 && attempts < 10000) {
    attempts++
    if (matchField(minF, d.getMinutes(), 0, 59) && matchField(hourF, d.getHours(), 0, 23)) {
      runs.push(d.toLocaleString())
    }
    d = new Date(d.getTime() + 60000)
  }
  nextRuns.value = runs
}

function matchField(field, val, min, max) {
  if (field === '*') return true
  if (field.startsWith('*/')) return val % parseInt(field.slice(2)) === 0
  if (field.includes(',')) return field.split(',').map(Number).includes(val)
  if (field.includes('-')) {
    const [a, b] = field.split('-').map(Number)
    return val >= a && val <= b
  }
  return parseInt(field) === val
}

parse()
</script>
