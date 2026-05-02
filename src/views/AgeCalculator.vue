<template>
  <ToolLayout title="Age Calculator" subtitle="Find your exact age in years, months, weeks, and days" max-w="max-w-xl">
    <div class="w-full max-w-xl bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
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
        <button @click="calculate" class="flex-1 bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition-colors">Calculate</button>
        <button @click="setToday" class="flex-1 bg-gray-200 text-gray-800 font-semibold py-2 rounded hover:bg-gray-300 transition-colors">Use Today</button>
        <button @click="clearAll" class="flex-1 bg-gray-300 text-gray-800 font-semibold py-2 rounded hover:bg-gray-400 transition-colors">Clear</button>
      </div>
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3 text-center text-red-600 font-medium text-sm">{{ error }}</div>
    </div>

    <div v-if="result" class="w-full max-w-xl bg-white rounded-2xl shadow p-6 flex flex-col gap-5">
      <div class="text-center bg-blue-50 rounded-xl p-5">
        <p class="text-gray-500 text-sm mb-1">Your Age</p>
        <p class="text-4xl font-bold text-blue-600">{{ result.mainAge }}</p>
        <p class="text-sm text-gray-400 mt-2">{{ result.nextBirthday }}</p>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div class="bg-gray-50 rounded-xl p-3"><p class="text-2xl font-bold text-blue-600">{{ result.years }}</p><p class="text-xs text-gray-500 mt-1">Years</p></div>
        <div class="bg-gray-50 rounded-xl p-3"><p class="text-2xl font-bold text-green-600">{{ result.totalMonths }}</p><p class="text-xs text-gray-500 mt-1">Total Months</p></div>
        <div class="bg-gray-50 rounded-xl p-3"><p class="text-2xl font-bold text-purple-600">{{ result.totalWeeks }}</p><p class="text-xs text-gray-500 mt-1">Total Weeks</p></div>
        <div class="bg-gray-50 rounded-xl p-3"><p class="text-2xl font-bold text-orange-500">{{ result.totalDays }}</p><p class="text-xs text-gray-500 mt-1">Total Days</p></div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
        <div class="bg-gray-50 rounded-xl p-3"><p class="text-lg font-bold text-teal-600">{{ result.totalHours }}</p><p class="text-xs text-gray-500 mt-1">Total Hours</p></div>
        <div class="bg-gray-50 rounded-xl p-3"><p class="text-lg font-bold text-pink-500">{{ result.totalMinutes }}</p><p class="text-xs text-gray-500 mt-1">Total Minutes</p></div>
        <div class="bg-gray-50 rounded-xl p-3"><p class="text-lg font-bold text-indigo-500">{{ result.bornDay }}</p><p class="text-xs text-gray-500 mt-1">Born on</p></div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ToolLayout from '../components/ToolLayout.vue'

const dob = ref(''), targetDate = ref(''), error = ref(''), result = ref(null)
const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

function pad(n) { return n < 10 ? '0' + n : '' + n }

function setToday() {
  const t = new Date()
  targetDate.value = `${t.getFullYear()}-${pad(t.getMonth()+1)}-${pad(t.getDate())}`
}

function daysInMonth(month, year) {
  if (month === 2) return (year%400===0 || (year%100!==0 && year%4===0)) ? 29 : 28
  return [4,6,9,11].includes(month) ? 30 : 31
}

function calculate() {
  error.value = ''; result.value = null
  if (!dob.value) { error.value = 'Please enter your date of birth.'; return }
  if (!targetDate.value) { error.value = 'Please enter a target date.'; return }
  const d = new Date(dob.value), t = new Date(targetDate.value)
  if (d > t) { error.value = 'Date of birth cannot be after the target date.'; return }

  const dobY = d.getFullYear(), dobM = d.getMonth()+1, dobD = d.getDate()
  const tarY = t.getFullYear(), tarM = t.getMonth()+1, tarD = t.getDate()

  let years = tarY - dobY, months = tarM - dobM, days = tarD - dobD
  if (days < 0) { months--; days += daysInMonth(tarM-1===0?12:tarM-1, tarM-1===0?tarY-1:tarY) }
  if (months < 0) { years--; months += 12 }

  const diffMs = t - d
  const totalDays = Math.floor(diffMs / 86400000)
  const totalWeeks = Math.floor(totalDays / 7)
  const totalMonths = years * 12 + months
  const totalHours = totalDays * 24
  const totalMins = totalHours * 60

  const nextBday = new Date(tarY, dobM-1, dobD)
  if (nextBday <= t) nextBday.setFullYear(tarY + 1)
  const daysToNext = Math.round((nextBday - t) / 86400000)

  result.value = {
    mainAge: `${years} yrs, ${months} mos, ${days} days`,
    nextBirthday: daysToNext === 0 ? '🎂 Happy Birthday!' : `🎂 Next birthday in ${daysToNext} day${daysToNext !== 1 ? 's' : ''}`,
    years: years.toLocaleString(),
    totalMonths: totalMonths.toLocaleString(),
    totalWeeks: totalWeeks.toLocaleString(),
    totalDays: totalDays.toLocaleString(),
    totalHours: totalHours.toLocaleString(),
    totalMinutes: totalMins.toLocaleString(),
    bornDay: dayNames[d.getDay()]
  }
}

function clearAll() { dob.value = ''; targetDate.value = ''; error.value = ''; result.value = null }

onMounted(setToday)
</script>
