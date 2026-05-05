<template>
  <ToolLayout title="Logic Gate Simulator" subtitle="Toggle inputs A and B to see each gate's output live">

    <!-- Input panel -->
    <BentoCard :emphasis="true">
      <CardHeader icon="bx-chip">Inputs — Click the toggles to switch between 0 and 1</CardHeader>
      <div class="flex gap-6 flex-wrap">
        <div v-for="inp in ['A','B']" :key="inp"
          class="flex items-center gap-4 px-5 py-3 rounded-xl border"
          style="border-color:var(--border-accent);background:var(--accent-bg)">
          <span class="text-base font-bold" style="font-family:'Oswald',sans-serif;color:var(--text-base);min-width:4rem">
            Input {{ inp }}
          </span>
          <!-- Toggle — fixed width/height, no overflow -->
          <button @click="toggle(inp)"
            class="relative shrink-0 rounded-full transition-colors duration-200"
            style="width:48px;height:26px;outline:none"
            :style="inputs[inp] ? 'background:var(--accent)' : 'background:#cbd5e1'">
            <span class="absolute top-1 rounded-full bg-white shadow transition-transform duration-200"
              style="width:18px;height:18px"
              :style="inputs[inp] ? 'transform:translateX(24px)' : 'transform:translateX(4px)'">
            </span>
          </button>
          <span class="text-2xl font-bold tg-mono w-6 text-center"
            :style="inputs[inp] ? 'color:var(--accent)' : 'color:var(--text-faint)'">
            {{ inputs[inp] ? 1 : 0 }}
          </span>
        </div>
        <div class="flex items-center gap-2 text-sm" style="color:var(--text-muted)">
          <i class="bx bx-info-circle" style="color:var(--accent)"></i>
          Current: A={{ inputs.A }}, B={{ inputs.B }} — highlighted rows show active combination
        </div>
      </div>
    </BentoCard>

    <!-- Gate grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="gate in gates" :key="gate.id"
        class="tg-card p-4 flex flex-col gap-3 transition-all"
        :style="gateOutput(gate.id) ? 'border-color:var(--accent-lt);box-shadow:var(--shadow-accent)' : ''">

        <!-- Gate header -->
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <p class="text-sm font-bold" style="font-family:'Oswald',sans-serif;color:var(--text-base)">{{ gate.label }}</p>
            <p class="text-xs mt-0.5" style="color:var(--text-faint)">{{ gate.desc }}</p>
          </div>
          <!-- Output indicator -->
          <div class="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold border-2 transition-all"
            :style="gateOutput(gate.id)
              ? 'background:var(--accent);border-color:var(--accent);color:#fff'
              : 'background:#f1f5f9;border-color:var(--border-md);color:var(--text-faint)'">
            {{ gateOutput(gate.id) ? 1 : 0 }}
          </div>
        </div>

        <!-- Expression -->
        <div class="tg-input tg-mono text-xs py-1.5" style="color:var(--text-muted)">{{ gateExpr(gate.id) }}</div>

        <!-- Truth table -->
        <div :class="`grid text-xs text-center gap-0.5`"
          :style="`grid-template-columns:repeat(${gate.id.startsWith('NOT') ? 2 : 3},1fr)`">
          <template v-if="gate.id.startsWith('NOT')">
            <div class="font-semibold py-1 rounded" style="background:#f1f5f9;color:var(--text-muted)">In</div>
            <div class="font-semibold py-1 rounded" style="background:#f1f5f9;color:var(--text-muted)">Out</div>
            <template v-for="(row, ri) in [[0,1],[1,0]]" :key="ri">
              <div v-for="(cell, ci) in row" :key="ci" class="py-1 rounded tg-mono"
                :style="isActiveNotRow(gate.id, ri) ? 'background:var(--accent-bg);color:var(--accent);font-weight:700' : 'color:var(--text-muted)'">
                {{ cell }}
              </div>
            </template>
          </template>
          <template v-else>
            <div class="font-semibold py-1 rounded" style="background:#f1f5f9;color:var(--text-muted)">A</div>
            <div class="font-semibold py-1 rounded" style="background:#f1f5f9;color:var(--text-muted)">B</div>
            <div class="font-semibold py-1 rounded" style="background:#f1f5f9;color:var(--text-muted)">Out</div>
            <template v-for="(row, ri) in truthData[gate.id]" :key="ri">
              <div v-for="(cell, ci) in row" :key="ci" class="py-1 rounded tg-mono"
                :style="isActiveRow(ri) ? 'background:var(--accent-bg);color:var(--accent);font-weight:700' : 'color:var(--text-muted)'">
                {{ cell }}
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>

    <template #legend>
      <div class="flex flex-col gap-2 text-xs" style="color:var(--text-muted)">
        <p class="font-semibold" style="color:var(--text-base)">What are logic gates?</p>
        <p>Basic building blocks of digital circuits. They take binary inputs (0 or 1) and produce a binary output.</p>
        <div class="tg-divider"></div>
        <div v-for="gate in gates" :key="gate.id" class="flex items-start gap-2">
          <span class="font-bold shrink-0 w-10" style="color:var(--accent)">{{ gate.label }}</span>
          <span>{{ gate.desc }}</span>
        </div>
        <div class="tg-divider"></div>
        <p style="color:var(--text-faint)">Highlighted cells = current A/B combination. Glowing card = output is 1.</p>
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
  { id:'AND',  label:'AND',   desc:'Output 1 only if BOTH inputs are 1' },
  { id:'OR',   label:'OR',    desc:'Output 1 if AT LEAST ONE input is 1' },
  { id:'NOTA', label:'NOT A', desc:'Flips input A (0→1, 1→0)' },
  { id:'NOTB', label:'NOT B', desc:'Flips input B (0→1, 1→0)' },
  { id:'NAND', label:'NAND',  desc:'Opposite of AND — 0 only if both are 1' },
  { id:'NOR',  label:'NOR',   desc:'Opposite of OR — 1 only if both are 0' },
  { id:'XOR',  label:'XOR',   desc:'Output 1 only if inputs are DIFFERENT' },
  { id:'XNOR', label:'XNOR', desc:'Output 1 only if inputs are THE SAME' },
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
