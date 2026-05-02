<template>
  <ToolLayout title="Roman Numerals Converter" subtitle="Convert between Roman numerals and decimal numbers">
    <div class="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-5">

      <!-- Roman → Number -->
      <div class="bg-white rounded-2xl shadow p-5 flex flex-col gap-4">
        <h2 class="text-lg font-semibold text-blue-600 flex items-center gap-2"><i class="bx bx-right-arrow-alt"></i> Roman → Number</h2>
        <input v-model="romanInput" type="text" placeholder="e.g. XIV" @keydown.enter="convertToNumber"
          class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl uppercase font-mono focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm tracking-widest" />
        <button @click="convertToNumber" class="w-full bg-blue-500 text-white font-semibold py-2 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"><i class="bx bx-transfer"></i> Convert</button>
        <button @click="romanInput = ''; r2nResult = '—'; r2nError = false" class="w-full bg-gray-200 text-gray-700 font-semibold py-2 rounded-xl hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"><i class="bx bx-x"></i> Clear</button>
        <div class="bg-blue-50 rounded-xl p-4 text-center">
          <p class="text-xs text-gray-400 mb-1">Result</p>
          <p :class="`text-3xl font-bold ${r2nError ? 'text-red-500' : 'text-blue-600'}`">{{ r2nResult }}</p>
        </div>
      </div>

      <!-- Number → Roman -->
      <div class="bg-white rounded-2xl shadow p-5 flex flex-col gap-4">
        <h2 class="text-lg font-semibold text-green-600 flex items-center gap-2"><i class="bx bx-right-arrow-alt"></i> Number → Roman</h2>
        <input v-model="numberInput" type="number" min="1" max="3999" placeholder="e.g. 2024" @keydown.enter="convertToRoman"
          class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-sm" />
        <button @click="convertToRoman" class="w-full bg-green-500 text-white font-semibold py-2 rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2"><i class="bx bx-transfer"></i> Convert</button>
        <button @click="numberInput = ''; n2rResult = '—'; n2rError = false" class="w-full bg-gray-200 text-gray-700 font-semibold py-2 rounded-xl hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"><i class="bx bx-x"></i> Clear</button>
        <div class="bg-green-50 rounded-xl p-4 text-center">
          <p class="text-xs text-gray-400 mb-1">Result</p>
          <p :class="`text-3xl font-bold ${n2rError ? 'text-red-500' : 'text-green-600'}`">{{ n2rResult }}</p>
        </div>
      </div>

      <!-- Reference -->
      <div class="bg-white rounded-2xl shadow p-5 flex flex-col gap-3">
        <h2 class="text-lg font-semibold text-gray-700 flex items-center gap-2"><i class="bx bx-book-open text-gray-400"></i> Reference</h2>
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div v-for="[r, n] in refs" :key="r" class="bg-gray-50 rounded-lg p-2 flex justify-between">
            <span class="text-gray-500">{{ r }}</span><span class="font-semibold text-gray-800">{{ n }}</span>
          </div>
        </div>
        <p class="text-xs text-gray-400 font-light">Range: 1 – 3999. Subtractive notation applies (e.g. IV = 4, IX = 9).</p>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../components/ToolLayout.vue'

const romanInput = ref(''), numberInput = ref('')
const r2nResult = ref('—'), r2nError = ref(false)
const n2rResult = ref('—'), n2rError = ref(false)

const romanMap = { M:1000, CM:900, D:500, CD:400, C:100, XC:90, L:50, XL:40, X:10, IX:9, V:5, IV:4, I:1 }
const refs = [['I',1],['V',5],['X',10],['L',50],['C',100],['D',500],['M',1000]]

function romanToNumber(roman) {
  roman = roman.toUpperCase(); let i = 0, result = 0
  while (i < roman.length) {
    const two = roman.substring(i, i+2)
    if (romanMap[two]) { result += romanMap[two]; i += 2 }
    else if (romanMap[roman[i]]) { result += romanMap[roman[i]]; i++ }
    else return null
  }
  return result
}

function numberToRoman(num) {
  if (num < 1 || num > 3999) return null
  let result = ''
  for (const key in romanMap) { while (num >= romanMap[key]) { result += key; num -= romanMap[key] } }
  return result
}

function convertToNumber() {
  const val = romanInput.value.trim()
  if (!val) { r2nResult.value = '—'; return }
  const res = romanToNumber(val)
  r2nError.value = res === null
  r2nResult.value = res === null ? 'Invalid' : res
}

function convertToRoman() {
  const val = parseInt(numberInput.value)
  const res = numberToRoman(val)
  n2rError.value = res === null
  n2rResult.value = res === null ? 'Invalid (1–3999)' : res
}
</script>
