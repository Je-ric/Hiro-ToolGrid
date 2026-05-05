<template>
  <ToolLayout title="Password Generator" subtitle="Generate secure passwords and PINs with custom options">

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <!-- Options -->
      <BentoCard :emphasis="true">
        <CardHeader icon="bx-slider">Password Options</CardHeader>
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Length: <span class="text-cyan-600">{{ length }}</span></label>
          <input type="range" v-model="length" min="4" max="64" class="w-full accent-cyan-500" />
        </div>
        <div class="grid grid-cols-2 gap-2">
          <label class="flex items-center gap-2 cursor-pointer text-sm text-slate-600 p-2 rounded-lg border border-cyan-100 bg-cyan-50/50 hover:bg-cyan-100 transition-colors">
            <input type="checkbox" v-model="useUpper"   class="accent-cyan-500 w-4 h-4" /> A–Z
          </label>
          <label class="flex items-center gap-2 cursor-pointer text-sm text-slate-600 p-2 rounded-lg border border-cyan-100 bg-cyan-50/50 hover:bg-cyan-100 transition-colors">
            <input type="checkbox" v-model="useLower"   class="accent-cyan-500 w-4 h-4" /> a–z
          </label>
          <label class="flex items-center gap-2 cursor-pointer text-sm text-slate-600 p-2 rounded-lg border border-cyan-100 bg-cyan-50/50 hover:bg-cyan-100 transition-colors">
            <input type="checkbox" v-model="useNumbers" class="accent-cyan-500 w-4 h-4" /> 0–9
          </label>
          <label class="flex items-center gap-2 cursor-pointer text-sm text-slate-600 p-2 rounded-lg border border-cyan-100 bg-cyan-50/50 hover:bg-cyan-100 transition-colors">
            <input type="checkbox" v-model="useSymbols" class="accent-cyan-500 w-4 h-4" /> !@#…
          </label>
        </div>
        <div class="flex flex-col gap-2">
          <AppBtn @click="generate" icon="bx-refresh" cls="w-full">Generate</AppBtn>
          <AppBtn variant="ghost" icon="bx-x" @click="clearPassword" cls="w-full">Clear</AppBtn>
        </div>
      </BentoCard>

      <!-- Result -->
      <BentoCard cls="lg:col-span-2">
        <CardHeader icon="bx-key">Generated Password</CardHeader>
        <input type="text" :value="password" readonly placeholder="Click Generate"
          class="tg-input tg-input-mono text-base tracking-widest" />
        <div class="flex flex-col gap-1">
          <div class="flex justify-between text-xs text-slate-400">
            <span>Strength</span>
            <span :style="{ color: strength.color }" class="font-semibold">{{ strength.label }}</span>
          </div>
          <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div :style="{ width: strength.width, backgroundColor: strength.color }" class="h-full rounded-full transition-all duration-500"></div>
          </div>
        </div>
        <AppBtn variant="copy" icon="bx-copy" cls="w-full" @click="copy(password)">{{ copied ? 'Copied!' : 'Copy Password' }}</AppBtn>

        <div class="tg-divider"></div>
        <CardHeader icon="bx-hash" icon-color="text-teal-500">PIN Generator</CardHeader>
        <div class="flex items-center gap-3">
          <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0">Length: <span class="text-teal-500">{{ pinLength }}</span></label>
          <input type="range" v-model="pinLength" min="3" max="12" class="flex-1 accent-teal-500" />
        </div>
        <input type="text" :value="pin" readonly placeholder="Click Generate PIN"
          class="tg-input tg-input-mono text-xl tracking-[0.3em] text-center" />
        <div class="flex gap-2">
          <AppBtn variant="secondary" icon="bx-refresh" @click="makePin" cls="flex-1">Generate PIN</AppBtn>
          <AppBtn variant="ghost" icon="bx-x" @click="pin = ''">Clear</AppBtn>
        </div>
      </BentoCard>
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
