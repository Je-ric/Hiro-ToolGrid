<template>
  <ToolLayout title="Logic Gate Simulator" subtitle="Toggle inputs A and B to see each gate's output live">

    <!-- Input toggles -->
    <BentoCard :emphasis="true">
      <CardHeader icon="bx-chip">Inputs</CardHeader>
      <div class="flex gap-8 justify-center py-2">
        <div v-for="inp in ['A','B']" :key="inp" class="flex flex-col items-center gap-3">
          <span class="text-lg font-bold text-slate-600" style="font-family:'Oswald',sans-serif">Input {{ inp }}</span>
          <button @click="toggle(inp)"
            :class="['w-16 h-8 rounded-full relative transition-colors duration-200 focus:outline-none border-2',
              inputs[inp] ? 'bg-cyan-500 border-cyan-400' : 'bg-slate-200 border-slate-300']">
            <span :class="['absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200',
              inputs[inp] ? 'translate-x-8' : 'translate-x-0.5']"></span>
          </button>
          <span :class="['text-3xl font-bold font-mono', inputs[inp] ? 'text-cyan-500' : 'text-slate-300']">
            {{ inputs[inp] ? 1 : 0 }}
          </span>
        </div>
      </div>
    </BentoCard>

    <!-- Gate grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="gate in gates" :key="gate.id"
        :class="['tg-card p-4 flex flex-col gap-3 border-2 transition-all',
          gateOutput(gate.id) ? 'border-cyan-300 shadow-md shadow-cyan-100' : 'border-transparent']">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-base font-bold text-slate-700" style="font-family:'Oswald',sans-serif">{{ gate.label }}</h2>
            <p class="text-xs text-slate-400 mt-0.5">{{ gate.desc }}</p>
          </div>
          <div :class="['w-11 h-11 rounded-xl flex items-center justify-center text-xl font-bold border-2 transition-all',
            gateOutput(gate.id) ? 'bg-cyan-500 border-cyan-400 text-white shadow-md shadow-cyan-200' : 'bg-slate-100 border-slate-200 text-slate-400']">
            {{ gateOutput(gate.id) ? 1 : 0 }}
          </div>
        </div>
        <div class="tg-input tg-input-mono text-xs text-slate-500 py-1.5">{{ gateExpr(gate.id) }}</div>
        <!-- Truth table -->
        <div :class="`grid ${gate.id.startsWith('NOT') ? 'grid-cols-2' : 'grid-cols-3'} text-xs text-center gap-0.5`">
          <template v-if="gate.id.startsWith('NOT')">
            <div class="font-bold text-slate-400 bg-slate-50 rounded p-1">In</div>
            <div class="font-bold text-slate-400 bg-slate-50 rounded p-1">Out</div>
            <template v-for="(row, ri) in [[0,1],[1,0]]" :key="ri">
              <div v-for="(cell, ci) in row" :key="ci"
                :class="['rounded p-1', isActiveNotRow(gate.id, ri) ? 'bg-cyan-100 text-cyan-700 font-bold' : 'text-slate-500']">{{ cell }}</div>
            </template>
          </template>
          <template v-else>
            <div class="font-bold text-slate-400 bg-slate-50 rounded p-1">A</div>
            <div class="font-bold text-slate-400 bg-slate-50 rounded p-1">B</div>
            <div class="font-bold text-slate-400 bg-slate-50 rounded p-1">Out</div>
            <template v-for="(row, ri) in truthData[gate.id]" :key="ri">
              <div v-for="(cell, ci) in row" :key="ci"
                :class="['rounded p-1', isActiveRow(ri) ? 'bg-cyan-100 text-cyan-700 font-bold' : 'text-slate-500']">{{ cell }}</div>
            </template>
          </template>
        </div>
      </div>
    </div>

    <template #legend>
      <div class="flex flex-col gap-2 text-xs text-slate-500">
        <p><strong class="text-slate-600">Logic Gates</strong> — fundamental building blocks of digital circuits.</p>
        <div class="tg-divider"></div>
        <div v-for="gate in gates" :key="gate.id" class="flex items-start gap-2">
          <span class="font-bold text-cyan-600 w-10 shrink-0">{{ gate.label }}</span>
          <span>{{ gate.desc }}</span>
        </div>
        <div class="tg-divider"></div>
        <p class="text-[10px] text-slate-400">Highlighted rows show the current A/B input combination.</p>
      </div>
    </template>
  </ToolLayout>
</template>

<script setup>
import { reactive } from 'vue'
import ToolLayout from '../components/layouts/ToolLayout.vue'
import BentoCard  from '../components/ui/BentoCard.vue'
import CardHeader from '../components/ui/CardHeader.vue'

const inputs = reactive({ A: 0, B: 0 })
function toggle(inp) { inputs[inp] = inputs[inp] ? 0 : 1 }

const gates = [
  { id:'AND',  label:'AND',   desc:'Both inputs must be 1' },
  { id:'OR',   label:'OR',    desc:'At least one input is 1' },
  { id:'NOTA', label:'NOT A', desc:'Inverts input A' },
  { id:'NOTB', label:'NOT B', desc:'Inverts input B' },
  { id:'NAND', label:'NAND',  desc:'Opposite of AND' },
  { id:'NOR',  label:'NOR',   desc:'Opposite of OR' },
  { id:'XOR',  label:'XOR',   desc:'Inputs must differ' },
  { id:'XNOR', label:'XNOR', desc:'Inputs must be equal' },
]

const truthData = {
  AND:  [[0,0,0],[0,1,0],[1,0,0],[1,1,1]],
  OR:   [[0,0,0],[0,1,1],[1,0,1],[1,1,1]],
  NAND: [[0,0,1],[0,1,1],[1,0,1],[1,1,0]],
  NOR:  [[0,0,1],[0,1,0],[1,0,0],[1,1,0]],
  XOR:  [[0,0,0],[0,1,1],[1,0,1],[1,1,0]],
  XNOR: [[0,0,1],[0,1,0],[1,0,0],[1,1,1]],
}

function gateOutput(id) {
  const a = inputs.A, b = inputs.B
  if (id==='AND')  return a && b
  if (id==='OR')   return a || b
  if (id==='NOTA') return !a ? 1 : 0
  if (id==='NOTB') return !b ? 1 : 0
  if (id==='NAND') return !(a && b) ? 1 : 0
  if (id==='NOR')  return !(a || b) ? 1 : 0
  if (id==='XOR')  return a !== b ? 1 : 0
  if (id==='XNOR') return a === b ? 1 : 0
}
function gateExpr(id) {
  const a = inputs.A, b = inputs.B, out = gateOutput(id)
  if (id==='NOTA') return `NOT ${a} = ${out}`
  if (id==='NOTB') return `NOT ${b} = ${out}`
  return `${a} ${id} ${b} = ${out}`
}
function isActiveRow(ri) {
  const rows = [[0,0],[0,1],[1,0],[1,1]]
  return rows[ri][0] === inputs.A && rows[ri][1] === inputs.B
}
function isActiveNotRow(id, ri) {
  return id === 'NOTA' ? ri === inputs.A : ri === inputs.B
}
</script>
