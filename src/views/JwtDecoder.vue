<template>
  <ToolLayout title="JWT Decoder" subtitle="Paste a JWT token to decode its header and payload. Highlights expiration status.">
    <div class="w-full flex flex-col gap-5">

      <BentoCard>
        <CardHeader icon="bx-lock-open">JWT Token Input</CardHeader>
        <p class="text-xs text-gray-400">A JWT has 3 parts separated by dots: <code class="bg-red-50 text-red-500 px-1 rounded">Header</code> · <code class="bg-purple-50 text-purple-500 px-1 rounded">Payload</code> · <code class="bg-gray-100 text-gray-500 px-1 rounded">Signature</code></p>
        <div class="relative">
          <textarea v-model="rawToken" class="w-full h-28 p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 break-all"
            placeholder="Paste your JWT here... eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."></textarea>
        </div>
        <!-- Colorized token display -->
        <div v-if="parts.length === 3" class="p-3 bg-gray-900 rounded-xl font-mono text-xs break-all leading-relaxed">
          <span class="text-red-400">{{ parts[0] }}</span>
          <span class="text-gray-500">.</span>
          <span class="text-purple-400">{{ parts[1] }}</span>
          <span class="text-gray-500">.</span>
          <span class="text-gray-400">{{ parts[2] }}</span>
        </div>
        <div class="flex gap-2">
          <AppBtn @click="decode" icon="bx-code-alt">Decode</AppBtn>
          <AppBtn variant="ghost" @click="rawToken = ''; header = null; payload = null; decodeError = ''" icon="bx-x">Clear</AppBtn>
        </div>
        <div v-if="decodeError" class="text-sm text-red-500 flex items-center gap-1"><i class="bx bx-error-circle"></i> {{ decodeError }}</div>
      </BentoCard>

      <div v-if="header || payload" class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <!-- Header -->
        <BentoCard>
          <CardHeader icon="bx-file" icon-color="text-red-400">Header</CardHeader>
          <p class="text-xs text-gray-400">Contains the token type and signing algorithm.</p>
          <pre class="p-3 bg-gray-900 text-red-300 rounded-xl text-xs overflow-x-auto">{{ JSON.stringify(header, null, 2) }}</pre>
          <div class="flex gap-3 text-xs">
            <span class="px-2 py-1 bg-red-50 text-red-600 rounded-lg font-mono">alg: {{ header?.alg }}</span>
            <span class="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg font-mono">typ: {{ header?.typ }}</span>
          </div>
        </BentoCard>

        <!-- Payload -->
        <BentoCard>
          <CardHeader icon="bx-data" icon-color="text-purple-400">Payload</CardHeader>
          <p class="text-xs text-gray-400">Contains the claims — data encoded in the token.</p>
          <pre class="p-3 bg-gray-900 text-purple-300 rounded-xl text-xs overflow-x-auto">{{ JSON.stringify(payload, null, 2) }}</pre>
        </BentoCard>
      </div>

      <!-- Claims summary -->
      <div v-if="payload" class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <BentoCard v-if="payload.iss">
          <CardHeader icon="bx-building" icon-color="text-blue-400">Issuer (iss)</CardHeader>
          <p class="font-mono text-sm text-gray-700">{{ payload.iss }}</p>
        </BentoCard>
        <BentoCard v-if="payload.sub">
          <CardHeader icon="bx-user" icon-color="text-blue-400">Subject (sub)</CardHeader>
          <p class="font-mono text-sm text-gray-700">{{ payload.sub }}</p>
        </BentoCard>
        <BentoCard v-if="payload.aud">
          <CardHeader icon="bx-group" icon-color="text-blue-400">Audience (aud)</CardHeader>
          <p class="font-mono text-sm text-gray-700">{{ Array.isArray(payload.aud) ? payload.aud.join(', ') : payload.aud }}</p>
        </BentoCard>

        <!-- Expiry -->
        <BentoCard v-if="payload.exp" :cls="expiryStatus.bg">
          <CardHeader :icon="expiryStatus.icon" :icon-color="expiryStatus.iconColor">Expiration (exp)</CardHeader>
          <p class="font-mono text-sm text-gray-700">{{ formatDate(payload.exp) }}</p>
          <div :class="['inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold', expiryStatus.badge]">
            <i :class="`bx ${expiryStatus.icon}`"></i> {{ expiryStatus.label }}
          </div>
          <p class="text-xs text-gray-400">{{ expiryStatus.detail }}</p>
        </BentoCard>

        <!-- Issued at -->
        <BentoCard v-if="payload.iat">
          <CardHeader icon="bx-calendar" icon-color="text-gray-400">Issued At (iat)</CardHeader>
          <p class="font-mono text-sm text-gray-700">{{ formatDate(payload.iat) }}</p>
        </BentoCard>

        <!-- NBF -->
        <BentoCard v-if="payload.nbf">
          <CardHeader icon="bx-time" icon-color="text-gray-400">Not Before (nbf)</CardHeader>
          <p class="font-mono text-sm text-gray-700">{{ formatDate(payload.nbf) }}</p>
        </BentoCard>
      </div>

      <!-- Warning -->
      <BentoCard cls="border border-amber-200 bg-amber-50">
        <CardHeader icon="bx-shield-x" icon-color="text-amber-500">Security Notice</CardHeader>
        <p class="text-xs text-amber-700">This tool only <strong>decodes</strong> the JWT — it does NOT verify the signature. Never trust a JWT's claims without server-side signature verification using the secret key.</p>
      </BentoCard>

      <!-- Legend -->
      <BentoCard cls="text-xs text-gray-500">
        <CardHeader icon="bx-info-circle">Common JWT Claims</CardHeader>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
          <div><code class="text-purple-600">iss</code> — Issuer (who created the token)</div>
          <div><code class="text-purple-600">sub</code> — Subject (who the token is about)</div>
          <div><code class="text-purple-600">aud</code> — Audience (intended recipient)</div>
          <div><code class="text-purple-600">exp</code> — Expiration time (Unix timestamp)</div>
          <div><code class="text-purple-600">iat</code> — Issued at (creation time)</div>
          <div><code class="text-purple-600">nbf</code> — Not before (valid from)</div>
        </div>
      </BentoCard>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../components/layouts/ToolLayout.vue'
import BentoCard  from '../components/ui/BentoCard.vue'
import CardHeader from '../components/ui/CardHeader.vue'
import AppBtn     from '../components/ui/AppBtn.vue'

const rawToken   = ref('')
const header     = ref(null)
const payload    = ref(null)
const decodeError= ref('')

const parts = computed(() => rawToken.value.trim().split('.'))

function b64decode(str) {
  const s = str.replace(/-/g, '+').replace(/_/g, '/')
  return JSON.parse(decodeURIComponent(escape(atob(s))))
}

function decode() {
  decodeError.value = ''
  header.value = null; payload.value = null
  const p = rawToken.value.trim().split('.')
  if (p.length !== 3) { decodeError.value = 'Invalid JWT: must have exactly 3 parts separated by dots.'; return }
  try { header.value  = b64decode(p[0]) } catch { decodeError.value = 'Failed to decode header.'; return }
  try { payload.value = b64decode(p[1]) } catch { decodeError.value = 'Failed to decode payload.'; return }
}

function formatDate(unix) {
  return new Date(unix * 1000).toLocaleString()
}

const expiryStatus = computed(() => {
  if (!payload.value?.exp) return {}
  const now  = Math.floor(Date.now() / 1000)
  const exp  = payload.value.exp
  const diff = exp - now
  if (diff < 0) {
    const ago = Math.abs(diff)
    const detail = ago < 3600 ? `Expired ${Math.floor(ago/60)} minutes ago` : ago < 86400 ? `Expired ${Math.floor(ago/3600)} hours ago` : `Expired ${Math.floor(ago/86400)} days ago`
    return { label: 'Expired', detail, icon: 'bx-x-circle', iconColor: 'text-red-500', badge: 'bg-red-100 text-red-600', bg: 'border border-red-200' }
  }
  const detail = diff < 3600 ? `Expires in ${Math.floor(diff/60)} minutes` : diff < 86400 ? `Expires in ${Math.floor(diff/3600)} hours` : `Expires in ${Math.floor(diff/86400)} days`
  return { label: 'Valid', detail, icon: 'bx-check-circle', iconColor: 'text-green-500', badge: 'bg-green-100 text-green-600', bg: 'border border-green-200' }
})
</script>
