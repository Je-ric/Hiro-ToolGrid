<template>
  <ToolLayout title="Measure Converter" subtitle="Convert between common units of measurement" max-w="max-w-2xl">
    <div class="w-full max-w-2xl flex flex-wrap gap-2">
      <button v-for="cat in categoryKeys" :key="cat" @click="switchCategory(cat)"
        :class="`px-4 py-2 rounded-full font-semibold text-sm ${currentCat === cat ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border hover:bg-gray-200'}`">
        {{ categories[cat].title }}
      </button>
    </div>

    <div class="w-full max-w-2xl bg-white rounded-2xl shadow p-6 flex flex-col gap-5">
      <h2 class="text-xl font-bold text-blue-600">{{ categories[currentCat].title }}</h2>
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
        <button @click="convert" class="flex-1 bg-blue-500 text-white font-semibold py-2 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"><i class="bx bx-transfer"></i> Convert</button>
        <button @click="swapUnits" class="flex-1 bg-gray-200 text-gray-800 font-semibold py-2 rounded-xl hover:bg-gray-300 transition-colors flex items-center justify-center gap-1"><i class="bx bx-transfer-alt"></i> Swap</button>
        <button @click="clearAll" class="flex-1 bg-gray-300 text-gray-800 font-semibold py-2 rounded-xl hover:bg-gray-400 transition-colors flex items-center justify-center gap-1"><i class="bx bx-x"></i> Clear</button>
      </div>
      <div v-if="result" class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <p class="text-gray-500 text-sm">Result</p>
        <p class="text-2xl font-bold text-blue-600 mt-1">{{ result }}</p>
      </div>
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3 text-center text-red-600 font-medium">{{ error }}</div>
    </div>

    <div class="w-full max-w-2xl bg-white rounded-2xl shadow p-6">
      <h2 class="text-lg font-bold text-gray-700 mb-3">Quick Reference</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-600">
        <div v-for="ref in referenceItems" :key="ref" class="bg-gray-50 rounded p-2 text-center">{{ ref }}</div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../components/ToolLayout.vue'

const categories = {
  length:  { title:'Length',        base:'meter',    units:{ millimeter:0.001, centimeter:0.01, meter:1, kilometer:1000, inch:0.0254, foot:0.3048, yard:0.9144, mile:1609.344, 'nautical mile':1852 } },
  weight:  { title:'Weight / Mass', base:'kilogram', units:{ milligram:0.000001, gram:0.001, kilogram:1, 'metric ton':1000, ounce:0.0283495, pound:0.453592, stone:6.35029 } },
  temp:    { title:'Temperature',   base:null,       units:{ Celsius:1, Fahrenheit:1, Kelvin:1 } },
  area:    { title:'Area',          base:'sq meter', units:{ 'sq millimeter':0.000001, 'sq centimeter':0.0001, 'sq meter':1, 'sq kilometer':1000000, 'sq inch':0.00064516, 'sq foot':0.092903, 'sq yard':0.836127, acre:4046.86, hectare:10000 } },
  volume:  { title:'Volume',        base:'liter',    units:{ milliliter:0.001, liter:1, 'cubic meter':1000, 'cubic inch':0.0163871, 'cubic foot':28.3168, 'US gallon':3.78541, 'US quart':0.946353, 'US pint':0.473176, 'US cup':0.236588, 'US fl oz':0.0295735, tablespoon:0.0147868, teaspoon:0.00492892 } },
  speed:   { title:'Speed',         base:'m/s',      units:{ 'm/s':1, 'km/h':0.277778, mph:0.44704, knot:0.514444, 'ft/s':0.3048 } },
  time:    { title:'Time',          base:'second',   units:{ millisecond:0.001, second:1, minute:60, hour:3600, day:86400, week:604800, month:2629800, year:31557600 } },
  data:    { title:'Digital Data',  base:'byte',     units:{ bit:0.125, byte:1, kilobyte:1024, megabyte:1048576, gigabyte:1073741824, terabyte:1099511627776, petabyte:1125899906842624 } },
}

const categoryKeys = Object.keys(categories)
const currentCat = ref('length')
const inputVal = ref(''), fromUnit = ref(''), toUnit = ref('')
const result = ref(''), error = ref('')

const unitKeys = computed(() => Object.keys(categories[currentCat.value].units))

function switchCategory(cat) {
  currentCat.value = cat
  const keys = Object.keys(categories[cat].units)
  fromUnit.value = keys[0]
  toUnit.value = keys[1] || keys[0]
  result.value = ''; error.value = ''; inputVal.value = ''
}

switchCategory('length')

function convertTemp(val, from, to) {
  let c = from === 'Celsius' ? val : from === 'Fahrenheit' ? (val-32)*5/9 : val-273.15
  return to === 'Celsius' ? c : to === 'Fahrenheit' ? c*9/5+32 : c+273.15
}

function convert() {
  error.value = ''; result.value = ''
  const v = parseFloat(inputVal.value)
  if (isNaN(v)) { error.value = 'Please enter a valid number.'; return }
  let res
  if (currentCat.value === 'temp') {
    res = convertTemp(v, fromUnit.value, toUnit.value)
  } else {
    const units = categories[currentCat.value].units
    res = (v * units[fromUnit.value]) / units[toUnit.value]
  }
  const fmt = res === 0 ? '0' : Math.abs(res) >= 0.0001 && Math.abs(res) < 1e12 ? parseFloat(res.toPrecision(8)).toString() : res.toExponential(4)
  result.value = `${v} ${fromUnit.value} = ${fmt} ${toUnit.value}`
}

function swapUnits() { const t = fromUnit.value; fromUnit.value = toUnit.value; toUnit.value = t }
function clearAll() { inputVal.value = ''; result.value = ''; error.value = '' }

const referenceItems = computed(() => {
  const cat = currentCat.value
  if (cat === 'temp') return ['0°C = 32°F = 273.15K','100°C = 212°F = 373.15K','-40°C = -40°F','37°C = 98.6°F (body)','20°C = 68°F (room)','-273.15°C = 0K (abs. zero)']
  const units = categories[cat].units, base = categories[cat].base
  return Object.keys(units).filter(k => k !== base).map(k => {
    const f = units[k]
    return f >= 1 ? `1 ${base} = ${(1/f).toPrecision(4)} ${k}` : `1 ${k} = ${f.toPrecision(4)} ${base}`
  })
})
</script>
