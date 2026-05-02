<template>
  <ToolLayout title="Age Calculator" subtitle="Find your exact age in years, months, weeks, and days" max-w="max-w-xl">

    <BentoCard cls="w-full max-w-xl" gap="4" padding="6">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="flex flex-col gap-1">
          <label class="font-medium text-gray-700">Date of Birth</label>
          <input type="date" v-model="dob" class="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-medium text-gray-700">Calculate Age On</label>
          <input type="date" v-model="targetDate" class="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
      </div>
      <div class="flex gap-3">
        <AppBtn @click="calculate" icon="bx-calculator">Calculate</AppBtn>
        <AppBtn variant="secondary" @click="setToday" icon="bx-calendar">Use Today</AppBtn>
        <AppBtn variant="ghost" @click="clearAll" icon="bx-x">Clear</AppBtn>
      </div>
      <ErrorBox :message="error" />
    </BentoCard>

    <BentoCard v-if="result" cls="w-full max-w-xl" gap="5" padding="6">
      <div class="text-center bg-blue-50 rounded-xl p-5">
        <p class="text-gray-500 text-sm mb-1">Your Age</p>
        <p class="text-4xl font-bold text-blue-600">{{ result.mainAge }}</p>
        <p class="text-sm text-gray-400 mt-2">{{ result.nextBirthday }}</p>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatTile :value="result.years"       label="Years"        value-color="text-blue-600" />
        <StatTile :value="result.totalMonths" label="Total Months" value-color="text-green-600" />
        <StatTile :value="result.totalWeeks"  label="Total Weeks"  value-color="text-purple-600" />
        <StatTile :value="result.totalDays"   label="Total Days"   value-color="text-orange-500" />
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatTile :value="result.totalHours"   label="Total Hours"   value-color="text-teal-600"   :large="false" />
        <StatTile :value="result.totalMinutes" label="Total Minutes" value-color="text-pink-500"   :large="false" />
        <StatTile :value="result.bornDay"      label="Born on"       value-color="text-indigo-500" :large="false" />
      </div>
    </BentoCard>

  </ToolLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ToolLayout  from '../components/layouts/ToolLayout.vue'
import BentoCard   from '../components/ui/BentoCard.vue'
import AppBtn      from '../components/ui/AppBtn.vue'
import ErrorBox    from '../components/ui/ErrorBox.vue'
import StatTile    from '../components/ui/StatTile.vue'
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
