<template>
  <ToolLayout title="Measure Converter" subtitle="Convert between common units of measurement" max-w="max-w-2xl">

    <TabBar :tabs="categoryTabs" :active="currentCat" @change="switchCategory" />

    <BentoCard cls="w-full max-w-2xl" gap="5" padding="6">
      <h2 class="text-xl font-bold text-blue-600">{{ CATEGORIES[currentCat].title }}</h2>
      <div class="flex flex-col gap-2">
        <label class="font-medium">Value</label>
        <input v-model="inputVal" type="number" placeholder="Enter value" @keydown.enter="convert"
          class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-2">
          <label class="font-medium">From</label>
          <select v-model="fromUnit" class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option v-for="u in unitKeys" :key="u" :value="u">{{ u }}</option>
          </select>
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium">To</label>
          <select v-model="toUnit" class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option v-for="u in unitKeys" :key="u" :value="u">{{ u }}</option>
          </select>
        </div>
      </div>
      <div class="flex gap-3">
        <AppBtn @click="convert" icon="bx-transfer">Convert</AppBtn>
        <AppBtn variant="secondary" @click="swapUnits" icon="bx-transfer-alt">Swap</AppBtn>
        <AppBtn variant="ghost" @click="clearAll" icon="bx-x">Clear</AppBtn>
      </div>
      <ResultBox :value="result" />
      <ErrorBox :message="error" />
    </BentoCard>

    <BentoCard cls="w-full max-w-2xl" padding="6">
      <h2 class="text-lg font-bold text-gray-700 mb-3">Quick Reference</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-600">
        <div v-for="item in referenceItems" :key="item" class="bg-gray-50 rounded p-2 text-center">{{ item }}</div>
      </div>
    </BentoCard>

  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout  from '../components/layouts/ToolLayout.vue'
import BentoCard   from '../components/ui/BentoCard.vue'
import AppBtn      from '../components/ui/AppBtn.vue'
import TabBar      from '../components/ui/TabBar.vue'
import ResultBox   from '../components/ui/ResultBox.vue'
import ErrorBox    from '../components/ui/ErrorBox.vue'
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
