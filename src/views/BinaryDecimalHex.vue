<template>
  <ToolLayout title="Binary ↔ Decimal ↔ Hex" subtitle="Convert between number systems instantly" max-w="max-w-2xl">
    <div class="w-full max-w-2xl bg-white rounded-2xl shadow p-6 flex flex-col gap-5">
      <div class="flex flex-col gap-1">
        <label class="font-semibold text-gray-700">Binary <span class="text-gray-400 font-normal text-sm">(base 2 — only 0s and 1s)</span></label>
        <div class="flex gap-2">
          <input v-model="binaryInput" type="text" placeholder="e.g. 1010" @keydown.enter="convertFrom('binary')"
            class="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono" />
          <button @click="convertFrom('binary')" class="bg-blue-500 text-white font-semibold px-4 py-2 rounded hover:bg-blue-600 transition-colors">Convert</button>
        </div>
      </div>
      <div class="flex flex-col gap-1">
        <label class="font-semibold text-gray-700">Decimal <span class="text-gray-400 font-normal text-sm">(base 10)</span></label>
        <div class="flex gap-2">
          <input v-model="decimalInput" type="text" placeholder="e.g. 255" @keydown.enter="convertFrom('decimal')"
            class="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 font-mono" />
          <button @click="convertFrom('decimal')" class="bg-green-500 text-white font-semibold px-4 py-2 rounded hover:bg-green-600 transition-colors">Convert</button>
        </div>
      </div>
      <div class="flex flex-col gap-1">
        <label class="font-semibold text-gray-700">Hexadecimal <span class="text-gray-400 font-normal text-sm">(base 16 — 0-9, A-F)</span></label>
        <div class="flex gap-2">
          <input v-model="hexInput" type="text" placeholder="e.g. FF" @keydown.enter="convertFrom('hex')"
            class="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono uppercase" />
          <button @click="convertFrom('hex')" class="bg-purple-500 text-white font-semibold px-4 py-2 rounded hover:bg-purple-600 transition-colors">Convert</button>
        </div>
      </div>
      <button @click="clearAll" class="w-full bg-gray-300 text-gray-800 font-semibold py-2 rounded hover:bg-gray-400 transition-colors">Clear</button>
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3 text-center text-red-600 font-medium">{{ error }}</div>
    </div>

    <div class="w-full max-w-2xl bg-white rounded-2xl shadow p-6 flex flex-col gap-3">
      <h2 class="text-lg font-bold text-gray-700">8-bit Visualizer</h2>
      <div class="flex gap-2 justify-center flex-wrap">
        <div v-for="(bit, i) in bits" :key="i" class="flex flex-col items-center gap-1">
          <div :class="`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${bit ? 'bg-blue-500 text-white shadow' : 'bg-gray-200 text-gray-400'}`">{{ bit }}</div>
          <span class="text-xs text-gray-400">{{ powers[i] }}</span>
        </div>
      </div>
      <p class="text-center text-gray-400 text-sm">{{ bitLabel }}</p>
    </div>

    <div class="w-full max-w-2xl bg-white rounded-2xl shadow p-6">
      <h2 class="text-lg font-bold text-gray-700 mb-3">Quick Reference</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-center border-collapse">
          <thead><tr class="bg-gray-100"><th class="p-2 border border-gray-200">Decimal</th><th class="p-2 border border-gray-200">Binary</th><th class="p-2 border border-gray-200">Hex</th></tr></thead>
          <tbody>
            <tr v-for="(d, i) in refRows" :key="d" :class="i%2===0?'bg-white':'bg-gray-50'">
              <td class="p-2 border border-gray-200">{{ d }}</td>
              <td class="p-2 border border-gray-200 font-mono">{{ decToBin(d) }}</td>
              <td class="p-2 border border-gray-200 font-mono">{{ decToHex(d) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../components/ToolLayout.vue'

const binaryInput = ref(''), decimalInput = ref(''), hexInput = ref('')
const error = ref('')
const bits = ref(Array(8).fill(0))
const powers = [128,64,32,16,8,4,2,1]
const bitLabel = ref('Enter a decimal value 0–255 to see bits')
const refRows = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,32,64,128,255]

function decToBin(n) { if (n===0) return '0'; let r=''; while(n>0){r=(n%2)+r;n=Math.floor(n/2)} return r }
function decToHex(n) { if (n===0) return '0'; const h='0123456789ABCDEF'; let r=''; while(n>0){r=h[n%16]+r;n=Math.floor(n/16)} return r }
function binToDec(b) { let r=0,p=1; for(let i=b.length-1;i>=0;i--){if(b[i]==='1')r+=p;p*=2} return r }
function hexToDec(h) { return parseInt(h,16) }

function updateBits(dec) {
  let n = dec
  bits.value = powers.map(p => { if(n>=p){n-=p;return 1} return 0 })
  bitLabel.value = `Decimal ${dec} in 8-bit binary`
}

function convertFrom(src) {
  error.value = ''
  let dec
  if (src === 'binary') {
    const v = binaryInput.value.trim()
    if (!v) { error.value = 'Enter a binary value.'; return }
    if (!/^[01]+$/.test(v)) { error.value = 'Binary only allows 0 and 1.'; return }
    dec = binToDec(v)
  } else if (src === 'decimal') {
    const v = decimalInput.value.trim()
    if (!v) { error.value = 'Enter a decimal value.'; return }
    if (!/^\d+$/.test(v)) { error.value = 'Decimal only allows digits 0-9.'; return }
    dec = parseInt(v, 10)
  } else {
    const v = hexInput.value.trim().toUpperCase()
    if (!v) { error.value = 'Enter a hex value.'; return }
    if (!/^[0-9A-F]+$/.test(v)) { error.value = 'Hex only allows 0-9 and A-F.'; return }
    dec = hexToDec(v)
  }
  if (src !== 'decimal') decimalInput.value = dec
  if (src !== 'binary')  binaryInput.value  = decToBin(dec)
  if (src !== 'hex')     hexInput.value      = decToHex(dec)
  updateBits(dec)
}

function clearAll() {
  binaryInput.value = ''; decimalInput.value = ''; hexInput.value = ''
  error.value = ''; bits.value = Array(8).fill(0)
  bitLabel.value = 'Enter a decimal value 0–255 to see bits'
}
</script>
