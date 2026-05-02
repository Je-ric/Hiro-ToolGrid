<template>
  <ToolLayout title="Logic Gate Simulator" subtitle="Toggle inputs A and B to see each gate's output live" max-w="max-w-3xl">
    <div class="w-full max-w-3xl bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
      <h2 class="text-lg font-bold text-gray-700">Inputs</h2>
      <div class="flex gap-8 justify-center">
        <div v-for="inp in ['A','B']" :key="inp" class="flex flex-col items-center gap-3">
          <span class="text-2xl font-bold text-gray-700">{{ inp }}</span>
          <button @click="toggle(inp)"
            :class="`w-20 h-10 rounded-full relative transition-colors duration-300 focus:outline-none ${inputs[inp] ? 'bg-blue-500' : 'bg-gray-300'}`">
            <span :class="`absolute top-1 w-8 h-8 bg-white rounded-full shadow transition-transform duration-300 ${inputs[inp] ? 'left-auto right-1' : 'left-1'}`"></span>
          </button>
          <span :class="`text-2xl font-bold ${inputs[inp] ? 'text-blue-500' : 'text-gray-400'}`">{{ inputs[inp] ? 1 : 0 }}</span>
        </div>
      </div>
    </div>

    <div class="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div v-for="gate in gates" :key="gate.id" class="bg-white rounded-xl shadow-md p-5 flex flex-col gap-3">
        <div class="flex justify-between items-center">
          <div>
            <h2 :class="`text-lg font-bold ${gate.color}`">{{ gate.label }}</h2>
            <p class="text-xs text-gray-400">{{ gate.desc }}</p>
          </div>
          <div :class="`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold transition-colors ${gateOutput(gate.id) ? gate.activeBg + ' text-white' : 'bg-gray-200 text-gray-400'}`">
            {{ gateOutput(gate.id) ? 1 : 0 }}
          </div>
        </div>
        <div class="bg-gray-50 rounded p-3 text-sm text-gray-600 font-mono">{{ gateExpr(gate.id) }}</div>
        <div :class="`grid ${gate.id.startsWith('NOT') ? 'grid-cols-2' : 'grid-cols-3'} text-xs text-center gap-1`">
          <template v-if="gate.id.startsWith('NOT')">
            <div class="font-bold text-gray-500 bg-gray-100 rounded p-1">In</div>
            <div class="font-bold text-gray-500 bg-gray-100 rounded p-1">Out</div>
            <template v-for="(row, ri) in [[0,1],[1,0]]" :key="ri">
              <div v-for="(cell, ci) in row" :key="ci"
                :class="`rounded p-1 ${isActiveNotRow(gate.id, ri) ? 'bg-purple-100 text-purple-700 font-bold' : 'text-gray-600'}`">{{ cell }}</div>
            </template>
          </template>
          <template v-else>
            <div class="font-bold text-gray-500 bg-gray-100 rounded p-1">A</div>
            <div class="font-bold text-gray-500 bg-gray-100 rounded p-1">B</div>
            <div class="font-bold text-gray-500 bg-gray-100 rounded p-1">Out</div>
            <template v-for="(row, ri) in truthData[gate.id]" :key="ri">
              <div v-for="(cell, ci) in row" :key="ci"
                :class="`rounded p-1 ${isActiveRow(ri) ? 'bg-blue-100 text-blue-700 font-bold' : 'text-gray-600'}`">{{ cell }}</div>
            </template>
          </template>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { reactive } from 'vue'
import ToolLayout from '../components/layouts/ToolLayout.vue'

const inputs = reactive({ A: 0, B: 0 })

function toggle(inp) { inputs[inp] = inputs[inp] ? 0 : 1 }

const gates = [
  { id:'AND',  label:'AND',   desc:'Output is 1 only if both inputs are 1',      color:'text-blue-600',   activeBg:'bg-blue-500' },
  { id:'OR',   label:'OR',    desc:'Output is 1 if at least one input is 1',     color:'text-green-600',  activeBg:'bg-green-500' },
  { id:'NOTA', label:'NOT A', desc:'Inverts input A',                             color:'text-purple-600', activeBg:'bg-purple-500' },
  { id:'NOTB', label:'NOT B', desc:'Inverts input B',                             color:'text-purple-600', activeBg:'bg-purple-500' },
  { id:'NAND', label:'NAND',  desc:'NOT AND — opposite of AND',                  color:'text-orange-500', activeBg:'bg-orange-500' },
  { id:'NOR',  label:'NOR',   desc:'NOT OR — opposite of OR',                    color:'text-red-500',    activeBg:'bg-red-500' },
  { id:'XOR',  label:'XOR',   desc:'Output is 1 only if inputs are different',   color:'text-teal-600',   activeBg:'bg-teal-500' },
  { id:'XNOR', label:'XNOR', desc:'Output is 1 only if inputs are the same',    color:'text-pink-500',   activeBg:'bg-pink-500' },
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
