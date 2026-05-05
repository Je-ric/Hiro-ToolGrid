<template>
  <ToolLayout title="Measure Converter" subtitle="Convert between common units of measurement">

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">

      <!-- Controls -->
      <BentoCard :emphasis="true">
        <CardHeader icon="bx-ruler">Convert</CardHeader>
        <TabBar :tabs="categoryTabs" :active="currentCat" @change="switchCategory" />

        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Value</label>
          <input v-model="inputVal" type="number" placeholder="Enter value"
            @keydown.enter="convert" class="tg-input text-lg" />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">From</label>
            <select v-model="fromUnit" class="tg-input">
              <option v-for="u in unitKeys" :key="u" :value="u">{{ u }}</option>
            </select>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">To</label>
            <select v-model="toUnit" class="tg-input">
              <option v-for="u in unitKeys" :key="u" :value="u">{{ u }}</option>
            </select>
          </div>
        </div>

        <div class="flex gap-2">
          <AppBtn @click="convert" icon="bx-transfer" cls="flex-1">Convert</AppBtn>
          <AppBtn variant="secondary" @click="swapUnits" icon="bx-transfer-alt">Swap</AppBtn>
          <AppBtn variant="ghost" @click="clearAll" icon="bx-x">Clear</AppBtn>
        </div>

        <ResultBox :value="result" />
        <ErrorBox :message="error" />
      </BentoCard>

      <!-- Quick reference -->
      <BentoCard cls="lg:col-span-2">
        <CardHeader icon="bx-list-ul">Quick Reference — {{ CATEGORIES[currentCat].title }}</CardHeader>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <div v-for="item in referenceItems" :key="item"
            class="px-3 py-2 bg-cyan-50 border border-cyan-100 rounded-xl text-xs text-slate-600 text-center font-mono">
            {{ item }}
          </div>
        </div>
      </BentoCard>
    </div>

    <template #legend>
      <div class="flex flex-col gap-2 text-xs text-slate-500">
        <p class="font-semibold text-slate-600">{{ CATEGORIES[currentCat].title }}</p>
        <div class="flex flex-col gap-1">
          <div v-for="u in unitKeys.slice(0,8)" :key="u"
            class="px-2 py-1 bg-cyan-50 rounded text-[11px] font-mono text-cyan-700">{{ u }}</div>
        </div>
        <div class="tg-divider"></div>
        <p class="text-[10px] text-slate-400">Select a category tab to switch unit types.</p>
      </div>
    </template>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../components/layouts/ToolLayout.vue'
import BentoCard  from '../components/ui/BentoCard.vue'
import AppBtn     from '../components/ui/AppBtn.vue'
import TabBar     from '../components/ui/TabBar.vue'
import ResultBox  from '../components/ui/ResultBox.vue'
import ErrorBox   from '../components/ui/ErrorBox.vue'
import CardHeader from '../components/ui/CardHeader.vue'
import { CATEGORIES, convertUnits, formatResult, buildReferenceItems } from '../utils/measureConverter.js'

const categoryTabs = Object.keys(CATEGORIES).map(id => ({ id, label: CATEGORIES[id].title }))
const currentCat = ref('length')
const inputVal = ref(''), fromUnit = ref(''), toUnit = ref('')
const result = ref(''), error = ref('')

const unitKeys = computed(() => Object.keys(CATEGORIES[currentCat.value].units))

function switchCategory(cat) {
  currentCat.value = cat
  const keys = Object.keys(CATEGORIES[cat].units)
  fromUnit.value = keys[0]; toUnit.value = keys[1] || keys[0]
  result.value = ''; error.value = ''; inputVal.value = ''
}
switchCategory('length')

function convert() {
  error.value = ''; result.value = ''
  const v = parseFloat(inputVal.value)
  if (isNaN(v)) { error.value = 'Please enter a valid number.'; return }
  const res = convertUnits(v, fromUnit.value, toUnit.value, currentCat.value)
  result.value = `${v} ${fromUnit.value} = ${formatResult(res)} ${toUnit.value}`
}
function swapUnits() { const t = fromUnit.value; fromUnit.value = toUnit.value; toUnit.value = t }
function clearAll()  { inputVal.value = ''; result.value = ''; error.value = '' }
const referenceItems = computed(() => buildReferenceItems(currentCat.value))
</script>
