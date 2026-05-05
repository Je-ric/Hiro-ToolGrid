<template>
  <ToolLayout title="Dice Roll Simulator" subtitle="Roll any combination of dice. Supports D4, D6, D8, D10, D12, D20, and D100.">
    <div class="w-full max-w-5xl flex flex-col gap-5">

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

        <!-- Config -->
        <BentoCard>
          <CardHeader icon="bx-dice-5">Dice Configuration</CardHeader>
          <p class="text-xs text-gray-400">Select dice type and quantity, then roll. Common in tabletop RPGs (D&D, Pathfinder).</p>

          <div class="grid grid-cols-4 gap-2">
            <button v-for="d in diceTypes" :key="d" @click="selectedDie = d"
              :class="['py-3 rounded-xl font-bold text-sm border-2 transition-colors',
                selectedDie === d ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300']">
              D{{ d }}
            </button>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm text-gray-500">Number of dice: <strong class="text-gray-800">{{ count }}</strong></label>
            <input type="range" v-model.number="count" min="1" max="20" class="accent-blue-500" />
          </div>

          <div class="flex gap-2">
            <AppBtn @click="roll" icon="bx-refresh" :disabled="rolling">
              {{ rolling ? 'Rolling...' : `Roll ${count}D${selectedDie}` }}
            </AppBtn>
            <AppBtn variant="ghost" @click="clearHistory" icon="bx-trash">Clear</AppBtn>
          </div>

          <!-- Modifier -->
          <div class="flex items-center gap-3">
            <label class="text-sm text-gray-500 shrink-0">Modifier:</label>
            <input v-model.number="modifier" type="number" class="w-20 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-1 focus:ring-blue-300" />
            <span class="text-xs text-gray-400">Added to total (e.g. +3 for STR bonus)</span>
          </div>
        </BentoCard>

        <!-- Current roll result -->
        <BentoCard cls="items-center justify-center text-center">
          <CardHeader icon="bx-target-lock">Result</CardHeader>
          <div v-if="lastRoll">
            <!-- Dice faces -->
            <div class="flex flex-wrap justify-center gap-2 mb-4">
              <div v-for="(val, i) in lastRoll.rolls" :key="i"
                :class="['w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border-2 transition-all',
                  val === selectedDie ? 'border-yellow-400 bg-yellow-50 text-yellow-700' :
                  val === 1 ? 'border-red-300 bg-red-50 text-red-600' : 'border-gray-200 bg-white text-gray-800']">
                {{ val }}
              </div>
            </div>
            <div class="text-5xl font-black text-gray-800">{{ lastRoll.total }}</div>
            <p class="text-sm text-gray-400 mt-1">
              {{ lastRoll.rolls.join(' + ') }}
              <span v-if="modifier !== 0"> {{ modifier > 0 ? '+' : '' }}{{ modifier }}</span>
              = {{ lastRoll.total }}
            </p>
            <div class="flex gap-2 justify-center mt-3 text-xs">
              <span class="px-2 py-1 bg-green-100 text-green-700 rounded-lg">Max: {{ lastRoll.max }}</span>
              <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg">Min: {{ lastRoll.min }}</span>
              <span class="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg">Avg: {{ lastRoll.avg }}</span>
            </div>
            <p v-if="lastRoll.rolls.every(v => v === selectedDie)" class="mt-2 text-yellow-600 font-semibold text-sm">🎉 All max! Critical!</p>
            <p v-else-if="lastRoll.rolls.every(v => v === 1)" class="mt-2 text-red-600 font-semibold text-sm">💀 All ones! Critical fail!</p>
          </div>
          <div v-else class="text-gray-400 text-sm italic">Roll the dice to see results.</div>
        </BentoCard>
      </div>

      <!-- History -->
      <BentoCard v-if="history.length">
        <CardHeader icon="bx-history">Roll History</CardHeader>
        <div class="flex flex-col gap-1 max-h-48 overflow-y-auto">
          <div v-for="(roll, i) in history" :key="i"
            class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg text-sm">
            <span class="text-xs text-gray-400 w-6 text-right">{{ history.length - i }}</span>
            <span class="font-mono text-xs text-gray-500">{{ roll.label }}</span>
            <span class="ml-auto font-bold text-gray-800">{{ roll.total }}</span>
            <span class="text-xs text-gray-400">{{ roll.rolls.join(', ') }}</span>
          </div>
        </div>
      </BentoCard>

      <!-- Legend -->
      <BentoCard cls="text-xs text-gray-500">
        <CardHeader icon="bx-info-circle">Dice Reference</CardHeader>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div><strong class="text-gray-700">D4</strong> — Tetrahedron. Used for small damage (daggers).</div>
          <div><strong class="text-gray-700">D6</strong> — Standard cube. Most common die.</div>
          <div><strong class="text-gray-700">D8</strong> — Octahedron. Longsword damage.</div>
          <div><strong class="text-gray-700">D10</strong> — Percentile die (0–9).</div>
          <div><strong class="text-gray-700">D12</strong> — Dodecahedron. Greataxe damage.</div>
          <div><strong class="text-gray-700">D20</strong> — Icosahedron. Core D&D attack/skill die.</div>
          <div><strong class="text-gray-700">D100</strong> — Two D10s for percentile rolls.</div>
          <div><strong class="text-gray-700">Modifier</strong> — Flat bonus/penalty added to total.</div>
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

const diceTypes  = [4, 6, 8, 10, 12, 20, 100]
const selectedDie= ref(6)
const count      = ref(2)
const modifier   = ref(0)
const lastRoll   = ref(null)
const history    = ref([])
const rolling    = ref(false)

function roll() {
  rolling.value = true
  setTimeout(() => {
    const rolls = Array.from({ length: count.value }, () => Math.floor(Math.random() * selectedDie.value) + 1)
    const sum   = rolls.reduce((a, b) => a + b, 0) + modifier.value
    lastRoll.value = {
      rolls,
      total: sum,
      max: Math.max(...rolls),
      min: Math.min(...rolls),
      avg: (rolls.reduce((a,b)=>a+b,0) / rolls.length).toFixed(1),
    }
    history.value.unshift({ label: `${count.value}D${selectedDie.value}${modifier.value !== 0 ? (modifier.value > 0 ? '+' : '') + modifier.value : ''}`, rolls, total: sum })
    if (history.value.length > 30) history.value.pop()
    rolling.value = false
  }, 300)
}

function clearHistory() { history.value = []; lastRoll.value = null }
</script>
