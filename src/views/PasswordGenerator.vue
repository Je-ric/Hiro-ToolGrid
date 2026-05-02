<template>
  <ToolLayout title="Password Generator" subtitle="Generate secure passwords and PINs with custom options">

    <div class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-5">
      <BentoCard>
        <CardHeader icon="bx-slider">Options</CardHeader>
        <div class="flex flex-col gap-1">
          <label class="text-sm text-gray-500">Length: <span class="font-semibold text-gray-800">{{ length }}</span></label>
          <input type="range" v-model="length" min="4" max="32" class="w-full accent-blue-500" />
        </div>
        <div class="grid grid-cols-2 gap-2 text-sm">
          <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" v-model="useUpper"   class="accent-blue-500 w-4 h-4" /> Uppercase</label>
          <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" v-model="useLower"   class="accent-blue-500 w-4 h-4" /> Lowercase</label>
          <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" v-model="useNumbers" class="accent-blue-500 w-4 h-4" /> Numbers</label>
          <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" v-model="useSymbols" class="accent-blue-500 w-4 h-4" /> Symbols</label>
        </div>
      </BentoCard>

      <BentoCard>
        <CardHeader icon="bx-key">Password</CardHeader>
        <input type="text" :value="password" readonly placeholder="Click Generate"
          class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm focus:outline-none tracking-widest" />
        <div class="w-full h-2 bg-gray-200 rounded-full">
          <div :style="{ width: strength.width, backgroundColor: strength.color }" class="h-full rounded-full transition-all duration-300"></div>
        </div>
        <p class="text-sm text-gray-500">Strength: <span :style="{ color: strength.color }" class="font-semibold">{{ strength.label }}</span></p>
      </BentoCard>

      <BentoCard cls="justify-center" gap="3">
        <CardHeader icon="bx-bolt-circle">Actions</CardHeader>
        <AppBtn @click="generate" icon="bx-refresh">Generate</AppBtn>
        <AppBtn variant="green" icon="bx-copy" @click="copy(password)">{{ copied ? 'Copied!' : 'Copy' }}</AppBtn>
        <AppBtn variant="ghost" icon="bx-x" @click="clearPassword">Clear</AppBtn>
      </BentoCard>
    </div>

    <div class="w-full max-w-5xl">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">PIN Generator</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <BentoCard>
          <CardHeader icon="bx-slider" icon-color="text-purple-500">Options</CardHeader>
          <div class="flex flex-col gap-1">
            <label class="text-sm text-gray-500">Length: <span class="font-semibold text-gray-800">{{ pinLength }}</span></label>
            <input type="range" v-model="pinLength" min="3" max="12" class="w-full accent-purple-500" />
          </div>
        </BentoCard>
        <BentoCard>
          <CardHeader icon="bx-hash" icon-color="text-purple-500">PIN</CardHeader>
          <input type="text" :value="pin" readonly placeholder="Click Generate PIN"
            class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm focus:outline-none tracking-widest" />
        </BentoCard>
        <BentoCard cls="justify-center" gap="3">
          <CardHeader icon="bx-bolt-circle" icon-color="text-purple-500">Actions</CardHeader>
          <AppBtn variant="purple" icon="bx-refresh" @click="makePin">Generate PIN</AppBtn>
          <AppBtn variant="ghost" icon="bx-x" @click="pin = ''">Clear</AppBtn>
        </BentoCard>
      </div>
    </div>

  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout  from '../components/layouts/ToolLayout.vue'
import BentoCard   from '../components/ui/BentoCard.vue'
import CardHeader  from '../components/ui/CardHeader.vue'
import AppBtn      from '../components/ui/AppBtn.vue'
import { useClipboard } from '../composables/useClipboard.js'
import { generatePassword, generatePin, checkStrength } from '../utils/passwordGen.js'

const length = ref(12), useUpper = ref(true), useLower = ref(true), useNumbers = ref(true), useSymbols = ref(true)
const password = ref(''), strength = ref({ label: '—', color: '#6b7280', width: '0%' })
const pinLength = ref(4), pin = ref('')
const { copied, copy } = useClipboard()

function generate() {
  const pw = generatePassword({ length: length.value, useUpper: useUpper.value, useLower: useLower.value, useNumbers: useNumbers.value, useSymbols: useSymbols.value })
  if (!pw) { alert('Select at least one character type!'); return }
  password.value = pw
  strength.value = checkStrength(pw)
}

function clearPassword() { password.value = ''; strength.value = { label: '—', color: '#6b7280', width: '0%' } }
function makePin() { pin.value = generatePin(pinLength.value) }
</script>
