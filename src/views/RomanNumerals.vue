<template>
  <ToolLayout title="Roman Numerals Converter" subtitle="Convert between Roman numerals and decimal numbers">

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">

      <!-- Roman → Number -->
      <BentoCard :emphasis="true">
        <CardHeader icon="bx-right-arrow-alt" icon-color="text-cyan-500">Roman → Number</CardHeader>
        <input v-model="romanInput" type="text" placeholder="e.g. XIV"
          @keydown.enter="convertToNumber"
          class="tg-input tg-input-mono uppercase tracking-widest text-lg" />
        <div class="flex gap-2">
          <AppBtn @click="convertToNumber" icon="bx-transfer" cls="flex-1">Convert</AppBtn>
          <AppBtn variant="ghost" icon="bx-x" @click="romanInput=''; r2nResult='—'; r2nError=false">Clear</AppBtn>
        </div>
        <div :class="['tg-result text-4xl', r2nError ? '!text-red-500 !border-red-200 !bg-red-50' : '']">
          {{ r2nResult }}
        </div>
      </BentoCard>

      <!-- Number → Roman -->
      <BentoCard :emphasis="true">
        <CardHeader icon="bx-right-arrow-alt" icon-color="text-teal-500">Number → Roman</CardHeader>
        <input v-model="numberInput" type="number" min="1" max="3999" placeholder="e.g. 2024"
          @keydown.enter="convertToRoman"
          class="tg-input text-lg" />
        <div class="flex gap-2">
          <AppBtn @click="convertToRoman" icon="bx-transfer" cls="flex-1">Convert</AppBtn>
          <AppBtn variant="ghost" icon="bx-x" @click="numberInput=''; n2rResult='—'; n2rError=false">Clear</AppBtn>
        </div>
        <div :class="['tg-result tg-input-mono text-4xl tracking-widest', n2rError ? '!text-red-500 !border-red-200 !bg-red-50' : '']">
          {{ n2rResult }}
        </div>
      </BentoCard>

      <!-- Reference -->
      <BentoCard>
        <CardHeader icon="bx-book-open">Reference</CardHeader>
        <div class="grid grid-cols-2 gap-1.5">
          <div v-for="[r, n] in refs" :key="r"
            class="flex justify-between items-center px-2 py-1.5 bg-cyan-50 border border-cyan-100 rounded-lg text-sm">
            <span class="font-mono font-bold text-cyan-600">{{ r }}</span>
            <span class="font-semibold text-slate-600">{{ n }}</span>
          </div>
        </div>
        <p class="text-xs text-slate-400">Range: 1–3999. Subtractive notation: IV=4, IX=9, XL=40, XC=90, CD=400, CM=900.</p>
      </BentoCard>
    </div>

    <template #legend>
      <div class="flex flex-col gap-2 text-xs text-slate-500">
        <p><strong class="text-slate-600">Subtractive notation</strong> — a smaller numeral before a larger one means subtract.</p>
        <div class="tg-divider"></div>
        <div class="grid grid-cols-2 gap-1 font-mono text-[11px]">
          <span class="text-cyan-600">IV</span><span>= 4</span>
          <span class="text-cyan-600">IX</span><span>= 9</span>
          <span class="text-cyan-600">XL</span><span>= 40</span>
          <span class="text-cyan-600">XC</span><span>= 90</span>
          <span class="text-cyan-600">CD</span><span>= 400</span>
          <span class="text-cyan-600">CM</span><span>= 900</span>
        </div>
        <div class="tg-divider"></div>
        <p class="text-[10px] text-slate-400">Max value is 3999 (MMMCMXCIX). Romans had no zero.</p>
      </div>
    </template>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../components/layouts/ToolLayout.vue'
import BentoCard  from '../components/ui/BentoCard.vue'
import CardHeader from '../components/ui/CardHeader.vue'
import AppBtn     from '../components/ui/AppBtn.vue'
import { romanToNumber, numberToRoman, ROMAN_REFS } from '../utils/romanNumerals.js'

const romanInput = ref(''), numberInput = ref('')
const r2nResult = ref('—'), r2nError = ref(false)
const n2rResult = ref('—'), n2rError = ref(false)
const refs = ROMAN_REFS

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
