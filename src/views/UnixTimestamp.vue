<template>
  <ToolLayout title="Unix Timestamp Converter" subtitle="Convert timestamps and timezone-aware ISO dates">
    <div class="utility-grid">
      <section class="tg-card utility-panel"><h2 class="text-lg font-bold">Timestamp to date</h2><label for="unix-unit" class="tg-label">Unit</label><select id="unix-unit" v-model="unit" class="tg-input"><option value="seconds">Seconds</option><option value="milliseconds">Milliseconds</option></select><label for="unix-input" class="tg-label">Unix timestamp</label><input id="unix-input" v-model="timestamp" class="tg-input tg-mono" placeholder="0" /><div class="utility-actions"><button class="tg-btn tg-btn-primary" @click="convertTimestamp">Convert timestamp</button><button class="tg-btn tg-btn-ghost" @click="useNow">Use current time</button></div><ErrorBox :message="timestampError" /><template v-if="dateResult"><label for="utc-result" class="tg-label">UTC (ISO 8601)</label><input id="utc-result" :value="dateResult.iso" readonly class="tg-input tg-mono" /><CopyBtn :text="dateResult.iso" /><p class="utility-note">Browser local time: {{ dateResult.local }}</p></template></section>
      <section class="tg-card utility-panel"><h2 class="text-lg font-bold">Date to timestamp</h2><label for="iso-input" class="tg-label">ISO date with timezone</label><input id="iso-input" v-model="iso" class="tg-input tg-mono" placeholder="2026-01-01T12:00:00+08:00" /><p class="utility-note">Include seconds and Z for UTC, or an offset such as +08:00.</p><button class="tg-btn tg-btn-primary" @click="convertDate">Convert date</button><ErrorBox :message="dateError" /><template v-if="unixResult"><label for="seconds-result" class="tg-label">Seconds</label><input id="seconds-result" :value="unixResult.seconds" readonly class="tg-input tg-mono" /><CopyBtn :text="String(unixResult.seconds)" /><label for="ms-result" class="tg-label">Milliseconds</label><input id="ms-result" :value="unixResult.milliseconds" readonly class="tg-input tg-mono" /><CopyBtn :text="String(unixResult.milliseconds)" /></template></section>
    </div>
    <template #legend><p class="text-sm">Unix time counts from January 1, 1970 at 00:00:00 UTC. Negative values represent earlier dates. Seconds output rounds down when the input includes milliseconds.</p></template>
  </ToolLayout>
</template>
<script setup>
import { ref, watch } from 'vue'
import ToolLayout from '../components/layouts/ToolLayout.vue'
import CopyBtn from '../components/ui/CopyBtn.vue'
import ErrorBox from '../components/ui/ErrorBox.vue'
import { timestampToDate, isoToTimestamp } from '../utils/developerTools.js'
const timestamp = ref(''), unit = ref('seconds'), iso = ref('')
const dateResult = ref(null), unixResult = ref(null), timestampError = ref(''), dateError = ref('')
watch([timestamp, unit], () => { dateResult.value = null; timestampError.value = '' }, { flush: 'sync' })
watch(iso, () => { unixResult.value = null; dateError.value = '' }, { flush: 'sync' })
function convertTimestamp() { dateResult.value = null; timestampError.value = ''; try { const date = timestampToDate(timestamp.value, unit.value); dateResult.value = { iso: date.toISOString(), local: date.toString() } } catch (e) { timestampError.value = e.message } }
function useNow() { timestamp.value = String(unit.value === 'seconds' ? Math.floor(Date.now() / 1000) : Date.now()); convertTimestamp() }
function convertDate() { unixResult.value = null; dateError.value = ''; try { unixResult.value = isoToTimestamp(iso.value) } catch (e) { dateError.value = e.message } }
</script>
