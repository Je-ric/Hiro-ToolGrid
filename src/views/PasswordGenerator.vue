<template>
  <ToolLayout title="Password Generator" subtitle="Generate secure passwords and PINs with custom options">

    <!-- ── Password Section ── -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

      <!-- Options -->
      <BentoCard :emphasis="true">
        <CardHeader icon="bx-slider">Password Options</CardHeader>

        <div>
          <label class="tg-label">Length — <span style="color:var(--accent);font-weight:700">{{ length }} characters</span></label>
          <input type="range" v-model.number="length" min="4" max="64" class="w-full mt-1" style="accent-color:var(--accent)" />
          <div class="flex justify-between text-xs mt-1" style="color:var(--text-faint)"><span>4</span><span>64</span></div>
        </div>

        <div>
          <label class="tg-label">Include characters</label>
          <div class="grid grid-cols-2 gap-2 mt-1">
            <label v-for="opt in charOpts" :key="opt.key"
              class="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border text-sm font-medium transition-all"
              :style="opt.model.value
                ? 'border-color:var(--accent);background:var(--accent-bg);color:var(--accent)'
                : 'border-color:var(--border-md);background:var(--bg-card);color:var(--text-muted)'">
              <input type="checkbox" v-model="opt.model.value" class="hidden" />
              <i :class="`bx ${opt.model.value ? 'bx-check-square' : 'bx-square'} text-base`"></i>
              <span>{{ opt.label }}</span>
            </label>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <AppBtn @click="generate" icon="bx-refresh" :full="true">Generate Password</AppBtn>
          <AppBtn variant="ghost" icon="bx-x" :full="true" @click="clearPassword">Clear</AppBtn>
        </div>
      </BentoCard>

      <!-- Result -->
      <BentoCard cls="lg:col-span-2" :stretch="true">
        <CardHeader icon="bx-key">Generated Password</CardHeader>

        <div>
          <label class="tg-label">Your password</label>
          <input :value="password" readonly placeholder="Click Generate Password above"
            class="tg-input tg-mono text-base tracking-widest" style="font-size:1rem" />
        </div>

        <div v-if="password">
          <div class="flex justify-between text-xs mb-1">
            <span style="color:var(--text-muted)">Strength</span>
            <span class="font-semibold" :style="`color:${strength.color}`">{{ strength.label }}</span>
          </div>
          <div class="w-full h-2 rounded-full" style="background:var(--border)">
            <div :style="`width:${strength.width};background:${strength.color}`" class="h-full rounded-full transition-all duration-500"></div>
          </div>
          <p class="text-xs mt-1" style="color:var(--text-faint)">{{ password.length }} characters</p>
        </div>

        <AppBtn variant="copy" icon="bx-copy" :full="true" @click="copy(password)">
          {{ copied ? 'Copied!' : 'Copy Password' }}
        </AppBtn>

        <!-- Divider between sections -->
        <div class="tg-divider my-1"></div>

        <!-- PIN sub-section -->
        <CardHeader icon="bx-hash" icon-color="#0d9488">PIN Generator</CardHeader>
        <p class="text-xs" style="color:var(--text-faint)">A numeric PIN — useful for quick codes, locks, or testing.</p>

        <div>
          <label class="tg-label">PIN Length — <span style="color:#0d9488;font-weight:700">{{ pinLength }} digits</span></label>
          <input type="range" v-model.number="pinLength" min="3" max="12" class="w-full mt-1" style="accent-color:#0d9488" />
          <div class="flex justify-between text-xs mt-1" style="color:var(--text-faint)"><span>3</span><span>12</span></div>
        </div>

        <div>
          <label class="tg-label">Your PIN</label>
          <input :value="pin" readonly placeholder="Click Generate PIN"
            class="tg-input tg-mono text-2xl tracking-[0.4em] text-center" />
        </div>

        <div class="flex gap-2">
          <AppBtn variant="secondary" icon="bx-refresh" :full="true" @click="makePin">Generate PIN</AppBtn>
          <AppBtn variant="ghost" icon="bx-x" @click="pin = ''">Clear</AppBtn>
        </div>
      </BentoCard>
    </div>

    <template #legend>
      <div class="flex flex-col gap-2 text-xs" style="color:var(--text-muted)">
        <p class="font-semibold" style="color:var(--text-base)">What makes a strong password?</p>
        <div class="flex items-start gap-2"><span class="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style="background:var(--accent)"></span><span>At least 12 characters long</span></div>
        <div class="flex items-start gap-2"><span class="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style="background:var(--accent)"></span><span>Mix of uppercase, lowercase, numbers, symbols</span></div>
        <div class="flex items-start gap-2"><span class="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style="background:var(--accent)"></span><span>No dictionary words or personal info</span></div>
        <div class="tg-divider"></div>
        <p class="font-semibold" style="color:var(--text-base)">Strength guide</p>
        <div class="flex items-center gap-2"><span class="w-3 h-2 rounded-full" style="background:#ef4444"></span><span>Weak — short or single type</span></div>
        <div class="flex items-center gap-2"><span class="w-3 h-2 rounded-full" style="background:#eab308"></span><span>Medium — 8+ chars, 2 types</span></div>
        <div class="flex items-center gap-2"><span class="w-3 h-2 rounded-full" style="background:#22c55e"></span><span>Strong — 12+ chars, 3+ types</span></div>
        <div class="tg-divider"></div>
        <p style="color:var(--text-faint)">Use a password manager to store generated passwords safely.</p>
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
import { useClipboard } from '../composables/useClipboard.js'
import { generatePassword, generatePin, checkStrength } from '../utils/passwordGen.js'

const length     = ref(16)
const useUpper   = ref(true)
const useLower   = ref(true)
const useNumbers = ref(true)
const useSymbols = ref(false)
const password   = ref('')
const strength   = ref({ label: '—', color: '#94a3b8', width: '0%' })
const pinLength  = ref(4)
const pin        = ref('')
const { copied, copy } = useClipboard()

const charOpts = [
  { key: 'upper',   label: 'A–Z Uppercase', model: useUpper },
  { key: 'lower',   label: 'a–z Lowercase', model: useLower },
  { key: 'numbers', label: '0–9 Numbers',   model: useNumbers },
  { key: 'symbols', label: '!@# Symbols',   model: useSymbols },
]

function generate() {
  const pw = generatePassword({ length: length.value, useUpper: useUpper.value, useLower: useLower.value, useNumbers: useNumbers.value, useSymbols: useSymbols.value })
  if (!pw) { alert('Select at least one character type.'); return }
  password.value = pw
  strength.value = checkStrength(pw)
}
function clearPassword() { password.value = ''; strength.value = { label: '—', color: '#94a3b8', width: '0%' } }
function makePin() { pin.value = generatePin(pinLength.value) }
</script>
