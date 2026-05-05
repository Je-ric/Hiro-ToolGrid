<template>
  <ToolLayout title="JWT Decoder" subtitle="Paste a JWT token to decode its header, payload, and expiration status">

    <!-- Input -->
    <BentoCard :emphasis="true">
      <CardHeader icon="bx-lock-open">JWT Token Input</CardHeader>
      <p class="text-xs" style="color:var(--text-faint)">
        A JWT has 3 parts separated by dots:
        <code style="background:#fef2f2;color:#dc2626;padding:1px 4px;border-radius:4px">Header</code> ·
        <code style="background:#faf5ff;color:#7c3aed;padding:1px 4px;border-radius:4px">Payload</code> ·
        <code style="background:#f1f5f9;color:#64748b;padding:1px 4px;border-radius:4px">Signature</code>
      </p>
      <textarea v-model="rawToken" class="tg-input tg-mono w-full resize-none text-xs break-all" style="min-height:80px"
        placeholder="Paste your JWT here… eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"></textarea>

      <!-- Colorized token -->
      <div v-if="parts.length === 3" class="tg-code break-all leading-relaxed">
        <span style="color:#f87171">{{ parts[0] }}</span><span style="color:#475569">.</span>
        <span style="color:#c084fc">{{ parts[1] }}</span><span style="color:#475569">.</span>
        <span style="color:#94a3b8">{{ parts[2] }}</span>
      </div>

      <div class="flex gap-2">
        <AppBtn @click="decode" icon="bx-code-alt">Decode Token</AppBtn>
        <AppBtn variant="ghost" icon="bx-x" @click="rawToken=''; header=null; payload=null; decodeError=''">Clear</AppBtn>
      </div>
      <ErrorBox :message="decodeError" />
    </BentoCard>

    <!-- Decoded sections -->
    <div v-if="header || payload" class="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
      <BentoCard>
        <CardHeader icon="bx-file" icon-color="#dc2626">Header</CardHeader>
        <p class="text-xs" style="color:var(--text-faint)">Token type and signing algorithm.</p>
        <pre class="tg-code" style="color:#fca5a5">{{ JSON.stringify(header, null, 2) }}</pre>
        <div class="flex gap-2 flex-wrap">
          <span class="text-xs px-2 py-1 rounded-lg tg-mono" style="background:#fef2f2;color:#dc2626">alg: {{ header?.alg }}</span>
          <span class="text-xs px-2 py-1 rounded-lg tg-mono" style="background:#f1f5f9;color:#64748b">typ: {{ header?.typ }}</span>
        </div>
      </BentoCard>
      <BentoCard>
        <CardHeader icon="bx-data" icon-color="#7c3aed">Payload</CardHeader>
        <p class="text-xs" style="color:var(--text-faint)">The claims — data encoded in the token.</p>
        <pre class="tg-code" style="color:#c084fc">{{ JSON.stringify(payload, null, 2) }}</pre>
      </BentoCard>
    </div>

    <!-- Claims + expiry -->
    <div v-if="payload" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
      <BentoCard v-if="payload.exp"
        :cls="expiryStatus.expired ? 'border-red-200' : 'border-green-200'"
        :emphasis="true">
        <CardHeader :icon="expiryStatus.icon" :icon-color="expiryStatus.iconColor">Expiration (exp)</CardHeader>
        <p class="tg-mono text-sm" style="color:var(--text-base)">{{ formatDate(payload.exp) }}</p>
        <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold"
          :style="expiryStatus.expired ? 'background:#fef2f2;color:#dc2626' : 'background:#f0fdf4;color:#16a34a'">
          <i :class="`bx ${expiryStatus.icon}`"></i> {{ expiryStatus.label }}
        </span>
        <p class="text-xs" style="color:var(--text-faint)">{{ expiryStatus.detail }}</p>
      </BentoCard>
      <BentoCard v-if="payload.iat">
        <CardHeader icon="bx-calendar">Issued At (iat)</CardHeader>
        <p class="tg-mono text-sm" style="color:var(--text-base)">{{ formatDate(payload.iat) }}</p>
      </BentoCard>
      <BentoCard v-if="payload.iss">
        <CardHeader icon="bx-building">Issuer (iss)</CardHeader>
        <p class="tg-mono text-sm break-all" style="color:var(--text-base)">{{ payload.iss }}</p>
      </BentoCard>
      <BentoCard v-if="payload.sub">
        <CardHeader icon="bx-user">Subject (sub)</CardHeader>
        <p class="tg-mono text-sm break-all" style="color:var(--text-base)">{{ payload.sub }}</p>
      </BentoCard>
      <BentoCard v-if="payload.aud">
        <CardHeader icon="bx-group">Audience (aud)</CardHeader>
        <p class="tg-mono text-sm break-all" style="color:var(--text-base)">{{ Array.isArray(payload.aud) ? payload.aud.join(', ') : payload.aud }}</p>
      </BentoCard>
    </div>

    <!-- Security notice -->
    <div class="flex items-start gap-3 p-4 rounded-xl border text-sm" style="background:#fffbeb;border-color:#fde68a;color:#92400e">
      <i class="bx bx-shield-x text-xl shrink-0 mt-0.5" style="color:#d97706"></i>
      <p><strong>Security Notice:</strong> This tool only <strong>decodes</strong> the JWT — it does NOT verify the signature. Never trust a JWT's claims without server-side signature verification.</p>
    </div>

    <template #legend>
      <div class="flex flex-col gap-2 text-xs" style="color:var(--text-muted)">
        <p class="font-semibold" style="color:var(--text-base)">Common JWT Claims</p>
        <div class="flex flex-col gap-1.5">
          <div><code class="tg-mono" style="color:var(--accent)">iss</code> — Issuer (who created it)</div>
          <div><code class="tg-mono" style="color:var(--accent)">sub</code> — Subject (who it's about)</div>
          <div><code class="tg-mono" style="color:var(--accent)">aud</code> — Audience (intended for)</div>
          <div><code class="tg-mono" style="color:var(--accent)">exp</code> — Expiration (Unix timestamp)</div>
          <div><code class="tg-mono" style="color:var(--accent)">iat</code> — Issued at (creation time)</div>
          <div><code class="tg-mono" style="color:var(--accent)">nbf</code> — Not before (valid from)</div>
        </div>
        <div class="tg-divider"></div>
        <p style="color:var(--text-faint)">JWT = JSON Web Token. Used for authentication and data exchange.</p>
      </div>
    </template>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../components/layouts/ToolLayout.vue'
import BentoCard  from '../components/ui/BentoCard.vue'
import CardHeader from '../components/ui/CardHeader.vue'
import AppBtn     from '../components/ui/AppBtn.vue'
import ErrorBox   from '../components/ui/ErrorBox.vue'

const rawToken = ref(''), header = ref(null), payload = ref(null), decodeError = ref('')
const parts = computed(() => rawToken.value.trim().split('.'))

function b64decode(s) { return JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g,'+').replace(/_/g,'/'))))) }
function decode() {
  decodeError.value=''; header.value=null; payload.value=null
  const p = rawToken.value.trim().split('.')
  if (p.length !== 3) { decodeError.value='Invalid JWT: needs exactly 3 dot-separated parts.'; return }
  try { header.value = b64decode(p[0]) } catch { decodeError.value='Failed to decode header.'; return }
  try { payload.value = b64decode(p[1]) } catch { decodeError.value='Failed to decode payload.'; return }
}
function formatDate(unix) { return new Date(unix * 1000).toLocaleString() }

const expiryStatus = computed(() => {
  if (!payload.value?.exp) return {}
  const diff = payload.value.exp - Math.floor(Date.now() / 1000)
  if (diff < 0) {
    const ago = Math.abs(diff)
    return { expired: true, label: 'Expired', icon: 'bx-x-circle', iconColor: '#dc2626',
      detail: ago < 3600 ? `${Math.floor(ago/60)} min ago` : ago < 86400 ? `${Math.floor(ago/3600)} hrs ago` : `${Math.floor(ago/86400)} days ago` }
  }
  return { expired: false, label: 'Valid', icon: 'bx-check-circle', iconColor: '#16a34a',
    detail: diff < 3600 ? `Expires in ${Math.floor(diff/60)} min` : diff < 86400 ? `Expires in ${Math.floor(diff/3600)} hrs` : `Expires in ${Math.floor(diff/86400)} days` }
})
</script>
