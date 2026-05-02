<template>
  <ToolLayout title="Password Generator" subtitle="Generate secure passwords and PINs with custom options">

    <!-- Password Section -->
    <div class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-5">
      <div class="bg-white rounded-2xl shadow p-5 flex flex-col gap-4">
        <h2 class="text-lg font-semibold text-gray-700 flex items-center gap-2"><i class="bx bx-slider text-blue-500"></i> Options</h2>
        <div class="flex flex-col gap-1">
          <label class="text-sm text-gray-500">Length: <span class="font-semibold text-gray-800">{{ length }}</span></label>
          <input type="range" v-model="length" min="4" max="32" class="w-full accent-blue-500" />
        </div>
        <div class="grid grid-cols-2 gap-2 text-sm">
          <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" v-model="useUpper" class="accent-blue-500 w-4 h-4" /> Uppercase</label>
          <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" v-model="useLower" class="accent-blue-500 w-4 h-4" /> Lowercase</label>
          <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" v-model="useNumbers" class="accent-blue-500 w-4 h-4" /> Numbers</label>
          <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" v-model="useSymbols" class="accent-blue-500 w-4 h-4" /> Symbols</label>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow p-5 flex flex-col gap-4">
        <h2 class="text-lg font-semibold text-gray-700 flex items-center gap-2"><i class="bx bx-key text-blue-500"></i> Password</h2>
        <input type="text" :value="password" readonly placeholder="Click Generate"
          class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm focus:outline-none tracking-widest" />
        <div class="w-full h-2 bg-gray-200 rounded-full">
          <div :style="{ width: strengthWidth, backgroundColor: strengthColor }" class="h-full rounded-full transition-all duration-300"></div>
        </div>
        <p class="text-sm text-gray-500">Strength: <span :style="{ color: strengthColor }" class="font-semibold">{{ strengthLabel }}</span></p>
      </div>

      <div class="bg-white rounded-2xl shadow p-5 flex flex-col gap-3 justify-center">
        <h2 class="text-lg font-semibold text-gray-700 flex items-center gap-2"><i class="bx bx-bolt-circle text-blue-500"></i> Actions</h2>
        <button @click="generate" class="w-full bg-blue-500 text-white font-semibold py-2 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"><i class="bx bx-refresh"></i> Generate</button>
        <button @click="copy" class="w-full bg-green-500 text-white font-semibold py-2 rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2"><i class="bx bx-copy"></i> Copy</button>
        <button @click="password = ''; strengthWidth = '0'; strengthLabel = '—'" class="w-full bg-gray-200 text-gray-700 font-semibold py-2 rounded-xl hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"><i class="bx bx-x"></i> Clear</button>
        <p v-if="copied" class="text-green-600 text-sm text-center">Copied!</p>
      </div>
    </div>

    <!-- PIN Section -->
    <div class="w-full max-w-5xl">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">PIN Generator</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div class="bg-white rounded-2xl shadow p-5 flex flex-col gap-4">
          <h3 class="text-lg font-semibold text-gray-700 flex items-center gap-2"><i class="bx bx-slider text-purple-500"></i> Options</h3>
          <div class="flex flex-col gap-1">
            <label class="text-sm text-gray-500">Length: <span class="font-semibold text-gray-800">{{ pinLength }}</span></label>
            <input type="range" v-model="pinLength" min="3" max="12" class="w-full accent-purple-500" />
          </div>
        </div>
        <div class="bg-white rounded-2xl shadow p-5 flex flex-col gap-4">
          <h3 class="text-lg font-semibold text-gray-700 flex items-center gap-2"><i class="bx bx-hash text-purple-500"></i> PIN</h3>
          <input type="text" :value="pin" readonly placeholder="Click Generate PIN"
            class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm focus:outline-none tracking-widest" />
        </div>
        <div class="bg-white rounded-2xl shadow p-5 flex flex-col gap-3 justify-center">
          <h3 class="text-lg font-semibold text-gray-700 flex items-center gap-2"><i class="bx bx-bolt-circle text-purple-500"></i> Actions</h3>
          <button @click="generatePin" class="w-full bg-purple-500 text-white font-semibold py-2 rounded-xl hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"><i class="bx bx-refresh"></i> Generate PIN</button>
          <button @click="pin = ''" class="w-full bg-gray-200 text-gray-700 font-semibold py-2 rounded-xl hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"><i class="bx bx-x"></i> Clear</button>
        </div>
      </div>
    </div>

  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../components/ToolLayout.vue'

const length = ref(12), useUpper = ref(true), useLower = ref(true), useNumbers = ref(true), useSymbols = ref(true)
const password = ref(''), strengthWidth = ref('0%'), strengthColor = ref('#6b7280'), strengthLabel = ref('—')
const copied = ref(false)
const pinLength = ref(4), pin = ref('')

function generate() {
  let chars = ''
  if (useUpper.value)   chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (useLower.value)   chars += 'abcdefghijklmnopqrstuvwxyz'
  if (useNumbers.value) chars += '0123456789'
  if (useSymbols.value) chars += '!@#$%^&*()_+[]{}|;:,.<>?'
  if (!chars) { alert('Select at least one character type!'); return }
  let pw = ''
  for (let i = 0; i < length.value; i++) pw += chars[Math.floor(Math.random() * chars.length)]
  password.value = pw
  checkStrength(pw)
}

function checkStrength(pw) {
  const count = [/[A-Z]/, /[a-z]/, /[0-9]/, /[!@#$%^&*()_+\[\]{}|;:,.<>?]/].filter(r => r.test(pw)).length
  if (pw.length >= 12 && count >= 3) { strengthWidth.value = '100%'; strengthColor.value = '#22c55e'; strengthLabel.value = 'Strong' }
  else if (pw.length >= 8 && count >= 2) { strengthWidth.value = '60%'; strengthColor.value = '#eab308'; strengthLabel.value = 'Medium' }
  else { strengthWidth.value = '30%'; strengthColor.value = '#ef4444'; strengthLabel.value = 'Weak' }
}

function copy() {
  if (!password.value) return
  navigator.clipboard.writeText(password.value)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

function generatePin() {
  let p = ''
  for (let i = 0; i < pinLength.value; i++) p += Math.floor(Math.random() * 10)
  pin.value = p
}
</script>
