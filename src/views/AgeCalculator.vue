<template>
  <ToolLayout title="Age Calculator" subtitle="Find your exact age in years, months, weeks, and days">

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">

      <!-- Input -->
      <BentoCard :emphasis="true">
        <CardHeader icon="bx-calendar-heart">Calculate Age</CardHeader>
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date of Birth</label>
          <input type="date" v-model="dob" class="tg-input" />
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Calculate Age On</label>
          <input type="date" v-model="targetDate" class="tg-input" />
        </div>
        <div class="flex flex-col gap-2">
          <AppBtn @click="calculate" icon="bx-calculator" cls="w-full">Calculate</AppBtn>
          <div class="flex gap-2">
            <AppBtn variant="secondary" @click="setToday" icon="bx-calendar" cls="flex-1" size="sm">Use Today</AppBtn>
            <AppBtn variant="ghost" @click="clearAll" icon="bx-x" cls="flex-1" size="sm">Clear</AppBtn>
          </div>
        </div>
        <ErrorBox :message="error" />
      </BentoCard>

      <!-- Result -->
      <div class="lg:col-span-2 flex flex-col gap-4">
        <div v-if="result">
          <!-- Hero result -->
          <div class="tg-card-emphasis p-6 rounded-2xl text-center mb-4" style="background:linear-gradient(135deg,#ecfeff,#cffafe)">
            <p class="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Your Age</p>
            <p class="text-3xl font-bold text-cyan-600">{{ result.mainAge }}</p>
            <p class="text-sm text-slate-400 mt-2">{{ result.nextBirthday }}</p>
          </div>

          <!-- Stat grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            <StatTile :value="result.years"       label="Years"        value-color="text-cyan-600" />
            <StatTile :value="result.totalMonths" label="Total Months" value-color="text-teal-500" />
            <StatTile :value="result.totalWeeks"  label="Total Weeks"  value-color="text-sky-500" />
            <StatTile :value="result.totalDays"   label="Total Days"   value-color="text-cyan-500" />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatTile :value="result.totalHours"   label="Total Hours"   value-color="text-teal-400"  :large="false" />
            <StatTile :value="result.totalMinutes" label="Total Minutes" value-color="text-sky-400"   :large="false" />
            <StatTile :value="result.bornDay"      label="Born on"       value-color="text-cyan-400"  :large="false" />
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="tg-card flex flex-col items-center justify-center py-16 text-slate-300">
          <i class="bx bx-calendar-heart text-5xl mb-3 text-cyan-200"></i>
          <p class="text-sm">Enter your date of birth and click Calculate</p>
        </div>
      </div>
    </div>

    <template #legend>
      <div class="flex flex-col gap-2 text-xs text-slate-500">
        <div><strong class="text-slate-600">Total Months</strong> — all months since birth, not just the remainder.</div>
        <div><strong class="text-slate-600">Total Weeks</strong> — exact weeks elapsed.</div>
        <div><strong class="text-slate-600">Total Days</strong> — accounts for leap years.</div>
        <div class="tg-divider"></div>
        <p class="text-[10px] text-slate-400">You can also calculate age between any two dates — not just today.</p>
      </div>
    </template>
  </ToolLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ToolLayout from '../components/layouts/ToolLayout.vue'
import BentoCard  from '../components/ui/BentoCard.vue'
import CardHeader from '../components/ui/CardHeader.vue'
import AppBtn     from '../components/ui/AppBtn.vue'
import ErrorBox   from '../components/ui/ErrorBox.vue'
import StatTile   from '../components/ui/StatTile.vue'
import { calcAge, todayString } from '../utils/ageCalc.js'

const dob = ref(''), targetDate = ref(''), error = ref(''), result = ref(null)

function setToday() { targetDate.value = todayString() }

function calculate() {
  error.value = ''; result.value = null
  if (!dob.value)        { error.value = 'Please enter your date of birth.'; return }
  if (!targetDate.value) { error.value = 'Please enter a target date.'; return }
  if (new Date(dob.value) > new Date(targetDate.value)) { error.value = 'Date of birth cannot be after the target date.'; return }
  const r = calcAge(dob.value, targetDate.value)
  result.value = {
    mainAge:      `${r.years} yrs, ${r.months} mos, ${r.days} days`,
    nextBirthday: r.daysToNext === 0 ? '🎂 Happy Birthday!' : `🎂 Next birthday in ${r.daysToNext} day${r.daysToNext !== 1 ? 's' : ''}`,
    years:        r.years.toLocaleString(),
    totalMonths:  r.totalMonths.toLocaleString(),
    totalWeeks:   r.totalWeeks.toLocaleString(),
    totalDays:    r.totalDays.toLocaleString(),
    totalHours:   r.totalHours.toLocaleString(),
    totalMinutes: r.totalMins.toLocaleString(),
    bornDay:      r.bornDay,
  }
}
function clearAll() { dob.value = ''; targetDate.value = ''; error.value = ''; result.value = null }
onMounted(setToday)
</script>
