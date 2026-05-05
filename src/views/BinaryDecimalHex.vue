<template>
  <ToolLayout title="Binary ↔ Decimal ↔ Hex" subtitle="Convert between number systems instantly">

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">

      <!-- Converters -->
      <BentoCard :emphasis="true">
        <CardHeader icon="bx-transfer">Convert</CardHeader>

        <div v-for="field in fields" :key="field.base" class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {{ field.label }}
            <span class="text-slate-300 font-normal normal-case ml-1">{{ field.hint }}</span>
          </label>
          <div class="flex gap-2">
            <input v-model="field.value" :placeholder="field.placeholder"
              @keydown.enter="convertFrom(field.base)"
              :class="['tg-input tg-input-mono flex-1 text-base', field.base === 'hex' ? 'uppercase' : '']" />
            <AppBtn @click="convertFrom(field.base)" icon="bx-transfer" size="sm">Go</AppBtn>
          </div>
        </div>

        <div class="flex gap-2 pt-1">
          <AppBtn variant="ghost" icon="bx-x" cls="flex-1" @click="clearAll">Clear All</AppBtn>
        </div>
        <div v-if="error" class="flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
          <i class="bx bx-error-circle"></i> {{ error }}
        </div>
      </BentoCard>

      <!-- 8-bit visualizer -->
      <BentoCard>
        <CardHeader icon="bx-chip">8-bit Visualizer</CardHeader>
        <div class="flex gap-2 justify-center flex-wrap py-2">
          <div v-for="(bit, i) in bits" :key="i" class="flex flex-col items-center gap-1">
            <div :class="['w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base border-2 transition-all',
              bit ? 'bg-cyan-500 border-cyan-400 text-white shadow-md shadow-cyan-200' : 'bg-slate-50 border-slate-200 text-slate-300']">
              {{ bit }}
            </div>
            <span class="text-[10px] text-slate-400 font-mono">{{ powers[i] }}</span>
          </div>
        </div>
        <p class="text-center text-xs text-slate-400">{{ bitLabel }}</p>

        <!-- Quick reference table -->
        <div class="tg-divider"></div>
        <CardHeader icon="bx-table">Quick Reference</CardHeader>
        <div class="overflow-x-auto">
          <table class="w-full text-xs text-center">
            <thead>
              <tr class="border-b border-cyan-100">
                <th class="py-1.5 px-2 text-slate-500 font-semibold">Dec</th>
                <th class="py-1.5 px-2 text-slate-500 font-semibold">Binary</th>
                <th class="py-1.5 px-2 text-slate-500 font-semibold">Hex</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(d, i) in refRows" :key="d" :class="['border-b border-cyan-50', i%2===0 ? 'bg-white' : 'bg-cyan-50/40']">
                <td class="py-1 px-2 font-semibold text-slate-700">{{ d }}</td>
                <td class="py-1 px-2 font-mono text-cyan-600">{{ decToBin(d) }}</td>
                <td class="py-1 px-2 font-mono text-teal-600">{{ decToHex(d) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </BentoCard>
    </div>

    <template #legend>
      <div class="flex flex-col gap-2 text-xs text-slate-500">
        <div><strong class="text-slate-600">Binary (base 2)</strong> — only 0 and 1. Each position is a power of 2.</div>
        <div><strong class="text-slate-600">Decimal (base 10)</strong> — standard 0–9 digits.</div>
        <div><strong class="text-slate-600">Hex (base 16)</strong> — 0–9 then A–F. Used in colors, memory addresses.</div>
        <div class="tg-divider"></div>
        <div class="font-mono text-[11px] flex flex-col gap-1">
          <span><span class="text-cyan-600">FF</span> hex = <span class="text-teal-600">255</span> dec</span>
          <span><span class="text-cyan-600">1111 1111</span> = 255</span>
          <span><span class="text-cyan-600">#RRGGBB</span> = hex color</span>
        </div>
      </div>
    </template>
  </ToolLayout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import ToolLayout from '../components/layouts/ToolLayout.vue'
import BentoCard  from '../components/ui/BentoCard.vue'
import CardHeader from '../components/ui/CardHeader.vue'
import AppBtn     from '../components/ui/AppBtn.vue'

const fields = reactive([
  { base: 'binary',  label: 'Binary',      hint: 'base 2 — 0s and 1s',    placeholder: 'e.g. 1010',  value: '' },
  { base: 'decimal', label: 'Decimal',     hint: 'base 10',                placeholder: 'e.g. 255',   value: '' },
  { base: 'hex',     label: 'Hexadecimal', hint: 'base 16 — 0-9, A-F',    placeholder: 'e.g. FF',    value: '' },
])
const error = ref('')
const bits  = ref(Array(8).fill(0))
const powers = [128,64,32,16,8,4,2,1]
const bitLabel = ref('Enter a value to see 8-bit representation')
const refRows  = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,32,64,128,255]

function decToBin(n) { if(n===0)return'0'; let r=''; while(n>0){r=(n%2)+r;n=Math.floor(n/2)} return r }
function decToHex(n) { if(n===0)return'0'; const h='0123456789ABCDEF'; let r=''; while(n>0){r=h[n%16]+r;n=Math.floor(n/16)} return r }
function binToDec(b) { let r=0,p=1; for(let i=b.length-1;i>=0;i--){if(b[i]==='1')r+=p;p*=2} return r }

function updateBits(dec) {
  let n = dec
  bits.value = powers.map(p => { if(n>=p){n-=p;return 1} return 0 })
  bitLabel.value = `Decimal ${dec} = 0x${decToHex(dec)} in 8-bit binary`
}

function convertFrom(src) {
  error.value = ''
  const f = fields.find(x => x.base === src)
  const v = f.value.trim()
  if (!v) { error.value = `Enter a ${src} value.`; return }
  let dec
  if (src === 'binary') {
    if (!/^[01]+$/.test(v)) { error.value = 'Binary only allows 0 and 1.'; return }
    dec = binToDec(v)
  } else if (src === 'decimal') {
    if (!/^\d+$/.test(v)) { error.value = 'Decimal only allows digits 0–9.'; return }
    dec = parseInt(v, 10)
  } else {
    if (!/^[0-9A-Fa-f]+$/.test(v)) { error.value = 'Hex only allows 0–9 and A–F.'; return }
    dec = parseInt(v, 16)
  }
  fields.find(x => x.base === 'decimal').value = src !== 'decimal' ? String(dec) : v
  fields.find(x => x.base === 'binary').value  = src !== 'binary'  ? decToBin(dec) : v
  fields.find(x => x.base === 'hex').value     = src !== 'hex'     ? decToHex(dec) : v.toUpperCase()
  updateBits(dec)
}

function clearAll() {
  fields.forEach(f => f.value = '')
  error.value = ''
  bits.value = Array(8).fill(0)
  bitLabel.value = 'Enter a value to see 8-bit representation'
}
</script>
