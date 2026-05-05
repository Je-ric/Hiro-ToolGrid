<template>
  <ToolLayout title="BMI Calculator" subtitle="Calculate your Body Mass Index and understand what it means">

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">

      <!-- Input -->
      <BentoCard :emphasis="true">
        <CardHeader icon="bx-body">Measurements</CardHeader>
        <div class="flex rounded-xl overflow-hidden border border-cyan-200">
          <button v-for="u in ['metric','imperial']" :key="u" @click="unit = u; result = null"
            :class="['flex-1 py-2 text-sm font-semibold transition-colors',
              unit === u ? 'bg-cyan-500 text-white' : 'bg-white text-slate-500 hover:bg-cyan-50']">
            {{ u === 'metric' ? '⚖️ Metric' : '🇺🇸 Imperial' }}
          </button>
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Weight <span class="text-slate-300 font-normal normal-case">({{ unit === 'metric' ? 'kg' : 'lbs' }})</span>
          </label>
          <input v-model.number="weight" type="number" min="1" :placeholder="unit === 'metric' ? 'e.g. 70' : 'e.g. 154'"
            class="tg-input" />
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Height <span class="text-slate-300 font-normal normal-case">({{ unit === 'metric' ? 'cm' : 'inches' }})</span>
          </label>
          <input v-model.number="height" type="number" min="1" :placeholder="unit === 'metric' ? 'e.g. 175' : 'e.g. 69'"
            class="tg-input" />
          <p v-if="unit === 'imperial'" class="text-xs text-slate-400">Tip: 5ft 9in = 69 inches</p>
        </div>
        <div class="flex gap-2">
          <AppBtn @click="calculate" icon="bx-calculator" cls="flex-1">Calculate</AppBtn>
          <AppBtn variant="ghost" icon="bx-x" @click="reset">Reset</AppBtn>
        </div>
        <ErrorBox :message="error" />
      </BentoCard>

      <!-- Result -->
      <div class="lg:col-span-2 flex flex-col gap-4">
        <div v-if="result" class="flex flex-col gap-4">
          <!-- BMI hero -->
          <div :class="['tg-card-emphasis p-6 rounded-2xl text-center border-2', result.cat.border]"
            :style="`background:${result.cat.bgGrad}`">
            <p class="text-xs text-slate-400 uppercase tracking-wider mb-1">Your BMI</p>
            <p :class="['text-6xl font-bold', result.cat.color]">{{ result.bmi }}</p>
            <p :class="['text-lg font-semibold mt-2', result.cat.color]">{{ result.cat.label }}</p>
          </div>

          <!-- Gauge -->
          <BentoCard>
            <CardHeader icon="bx-bar-chart">BMI Scale</CardHeader>
            <div class="relative h-4 rounded-full overflow-hidden flex">
              <div class="flex-1 bg-sky-400"></div>
              <div class="flex-1 bg-cyan-500"></div>
              <div class="flex-1 bg-yellow-400"></div>
              <div class="flex-1 bg-orange-400"></div>
              <div class="flex-1 bg-red-500"></div>
            </div>
            <div class="relative h-3">
              <div class="absolute -top-5 w-0.5 h-6 bg-slate-800 rounded-full transition-all duration-500"
                :style="{ left: `calc(${Math.min(result.cat.gauge, 98)}% - 1px)` }">
                <div class="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rounded-full"></div>
              </div>
            </div>
            <div class="flex justify-between text-xs text-slate-400 font-mono">
              <span>16</span><span>18.5</span><span>25</span><span>30</span><span>35</span><span>40+</span>
            </div>
          </BentoCard>

          <!-- Stats -->
          <div class="grid grid-cols-2 gap-3">
            <div class="tg-stat text-left px-4">
              <p class="text-xs text-slate-400 mb-1">Ideal Weight Range</p>
              <p class="text-lg font-bold text-slate-700">{{ result.ideal.min }}–{{ result.ideal.max }} {{ result.ideal.unit }}</p>
            </div>
            <div class="tg-stat text-left px-4">
              <p class="text-xs text-slate-400 mb-1">Weight to Normal</p>
              <p :class="['text-lg font-bold', result.diff === 0 ? 'text-cyan-600' : result.diff < 0 ? 'text-sky-500' : 'text-orange-500']">
                {{ result.diff === 0 ? '✓ In range' : (result.diff > 0 ? '+' : '') + result.diff + ' ' + (unit === 'metric' ? 'kg' : 'lbs') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Empty state + reference always visible -->
        <BentoCard>
          <CardHeader icon="bx-table">BMI Reference</CardHeader>
          <div class="flex flex-col gap-2">
            <div v-for="r in BMI_RANGES" :key="r.label" class="flex items-center gap-3 p-2 rounded-lg bg-cyan-50/50">
              <div :class="`w-3 h-3 rounded-full shrink-0 ${r.color}`"></div>
              <span class="text-xs font-mono text-slate-500 w-20">{{ r.label }}</span>
              <span class="text-xs text-slate-600">{{ r.desc }}</span>
            </div>
          </div>
          <p class="text-xs text-slate-400">BMI is a screening tool, not a diagnostic measure.</p>
        </BentoCard>
      </div>
    </div>

    <template #legend>
      <div class="flex flex-col gap-2 text-xs text-slate-500">
        <p><strong class="text-slate-600">BMI Formula</strong></p>
        <p class="font-mono text-[11px] bg-cyan-50 p-2 rounded-lg text-cyan-700">weight(kg) / height(m)²</p>
        <div class="tg-divider"></div>
        <div v-for="r in BMI_RANGES" :key="r.label" class="flex items-center gap-2">
          <div :class="`w-2 h-2 rounded-full shrink-0 ${r.color}`"></div>
          <span>{{ r.label }} — {{ r.desc }}</span>
        </div>
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
import ErrorBox   from '../components/ui/ErrorBox.vue'
import { calcBMI, getCategory, idealWeight, BMI_RANGES } from '../utils/bmiCalc.js'

const unit = ref('metric'), weight = ref(null), height = ref(null)
const result = ref(null), error = ref('')

function calculate() {
  error.value = ''
  if (!weight.value || !height.value || weight.value <= 0 || height.value <= 0) {
    error.value = 'Please enter valid weight and height values.'; return
  }
  const bmi   = calcBMI(weight.value, height.value, unit.value)
  const cat   = getCategory(bmi)
  const ideal = idealWeight(height.value, unit.value)
  const mid   = (ideal.min + ideal.max) / 2
  const diff  = unit.value === 'metric'
    ? Math.round((weight.value - mid) * 10) / 10
    : Math.round((weight.value - mid) * 10) / 10
  // patch cat with gradient bg
  cat.bgGrad  = cat.label === 'Normal' ? 'linear-gradient(135deg,#ecfeff,#cffafe)' :
                cat.label === 'Underweight' ? 'linear-gradient(135deg,#eff6ff,#dbeafe)' :
                cat.label === 'Overweight' ? 'linear-gradient(135deg,#fffbeb,#fef3c7)' :
                'linear-gradient(135deg,#fff7ed,#fed7aa)'
  result.value = { bmi, cat, ideal, diff }
}
function reset() { weight.value = null; height.value = null; result.value = null; error.value = '' }
</script>
