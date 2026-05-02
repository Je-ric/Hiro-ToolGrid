<template>
  <ToolLayout title="BMI Calculator" subtitle="Calculate your Body Mass Index and understand what it means" max-w="max-w-4xl">
    <div class="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-5">

      <!-- Input panel -->
      <div class="bg-white rounded-2xl shadow p-5 flex flex-col gap-4">
        <CardHeader icon="bx-body">Measurements</CardHeader>

        <!-- Unit toggle -->
        <div class="flex rounded-xl overflow-hidden border border-gray-200">
          <button v-for="u in ['metric','imperial']" :key="u" @click="unit = u; result = null"
            :class="['flex-1 py-2 text-sm font-semibold transition-colors', unit === u ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50']">
            {{ u === 'metric' ? '⚖️ Metric' : '🇺🇸 Imperial' }}
          </button>
        </div>

        <!-- Weight -->
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-600">Weight <span class="text-gray-400">({{ unit === 'metric' ? 'kg' : 'lbs' }})</span></label>
          <input v-model.number="weight" type="number" min="1" :placeholder="unit === 'metric' ? 'e.g. 70' : 'e.g. 154'"
            class="p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
        </div>

        <!-- Height -->
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-600">Height <span class="text-gray-400">({{ unit === 'metric' ? 'cm' : 'inches' }})</span></label>
          <input v-model.number="height" type="number" min="1" :placeholder="unit === 'metric' ? 'e.g. 175' : 'e.g. 69'"
            class="p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
          <p v-if="unit === 'imperial'" class="text-xs text-gray-400">Tip: 5ft 9in = 69 inches</p>
        </div>

        <div class="flex gap-2">
          <AppBtn @click="calculate" icon="bx-calculator">Calculate</AppBtn>
          <AppBtn variant="ghost" icon="bx-x" @click="reset">Reset</AppBtn>
        </div>
        <ErrorBox :message="error" />
      </div>

      <!-- Result -->
      <div class="lg:col-span-2 flex flex-col gap-5">

        <div v-if="result" class="bg-white rounded-2xl shadow p-6 flex flex-col gap-5">

          <!-- BMI value + category -->
          <div :class="`rounded-xl p-5 text-center border ${result.cat.bg} ${result.cat.border}`">
            <p class="text-sm text-gray-500 mb-1">Your BMI</p>
            <p :class="`text-6xl font-bold ${result.cat.color}`">{{ result.bmi }}</p>
            <p :class="`text-lg font-semibold mt-2 ${result.cat.color}`">{{ result.cat.label }}</p>
          </div>

          <!-- Gauge bar -->
          <div class="flex flex-col gap-2">
            <div class="relative h-4 rounded-full overflow-hidden flex">
              <div class="flex-1 bg-blue-400"></div>
              <div class="flex-1 bg-green-500"></div>
              <div class="flex-1 bg-yellow-400"></div>
              <div class="flex-1 bg-orange-400"></div>
              <div class="flex-1 bg-red-500"></div>
            </div>
            <!-- needle -->
            <div class="relative h-2">
              <div class="absolute -top-5 w-0.5 h-6 bg-gray-800 rounded-full transition-all duration-500"
                :style="{ left: `calc(${Math.min(result.cat.gauge, 98)}% - 1px)` }">
                <div class="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rounded-full"></div>
              </div>
            </div>
            <div class="flex justify-between text-xs text-gray-400 mt-1">
              <span>16</span><span>18.5</span><span>25</span><span>30</span><span>35</span><span>40+</span>
            </div>
          </div>

          <!-- Stats grid -->
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-gray-50 rounded-xl p-3 text-center">
              <p class="text-xs text-gray-400 mb-1">Ideal Weight Range</p>
              <p class="text-lg font-bold text-gray-800">{{ result.ideal.min }}–{{ result.ideal.max }} {{ result.ideal.unit }}</p>
            </div>
            <div class="bg-gray-50 rounded-xl p-3 text-center">
              <p class="text-xs text-gray-400 mb-1">Weight to Normal</p>
              <p :class="`text-lg font-bold ${result.diff === 0 ? 'text-green-600' : result.diff < 0 ? 'text-blue-500' : 'text-orange-500'}`">
                {{ result.diff === 0 ? '✓ In range' : (result.diff > 0 ? '+' : '') + result.diff + ' ' + (unit === 'metric' ? 'kg' : 'lbs') }}
              </p>
            </div>
          </div>
        </div>

        <!-- BMI reference table -->
        <div class="bg-white rounded-2xl shadow p-5 flex flex-col gap-3">
          <CardHeader icon="bx-table">BMI Reference</CardHeader>
          <div class="flex flex-col gap-2">
            <div v-for="r in BMI_RANGES" :key="r.label" class="flex items-center gap-3">
              <div :class="`w-3 h-3 rounded-full flex-shrink-0 ${r.color}`"></div>
              <span class="text-sm font-mono text-gray-600 w-20">{{ r.label }}</span>
              <span class="text-sm text-gray-700">{{ r.desc }}</span>
            </div>
          </div>
          <p class="text-xs text-gray-400 mt-1">BMI is a screening tool, not a diagnostic measure. Consult a healthcare provider for medical advice.</p>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../components/layouts/ToolLayout.vue'
import CardHeader from '../components/ui/CardHeader.vue'
import AppBtn     from '../components/ui/AppBtn.vue'
import ErrorBox   from '../components/ui/ErrorBox.vue'
import { calcBMI, getCategory, idealWeight, BMI_RANGES } from '../utils/bmiCalc.js'

const unit = ref('metric'), weight = ref(null), height = ref(null)
const result = ref(null), error = ref('')

function calculate() {
  error.value = ''
  if (!weight.value || !height.value || weight.value <= 0 || height.value <= 0) {
    error.value = 'Please enter valid weight and height values.'; return
  }
  const bmi  = calcBMI(weight.value, height.value, unit.value)
  const cat  = getCategory(bmi)
  const ideal = idealWeight(height.value, unit.value)
  const midIdeal = (ideal.min + ideal.max) / 2
  const currentKg = unit.value === 'metric' ? weight.value : weight.value / 2.205
  const midKg     = unit.value === 'metric' ? midIdeal : midIdeal / 2.205
  const rawDiff   = unit.value === 'metric'
    ? Math.round((weight.value - midIdeal) * 10) / 10
    : Math.round((weight.value - midIdeal) * 10) / 10
  result.value = { bmi, cat, ideal, diff: rawDiff }
}

function reset() { weight.value = null; height.value = null; result.value = null; error.value = '' }
</script>
