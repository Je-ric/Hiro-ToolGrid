<template>
  <ToolLayout title="URL Encoder / Decoder" subtitle="Encode special characters or decode percent-encoded text">
    <div class="utility-grid">
      <section class="tg-card utility-panel"><label for="url-mode" class="tg-label">Encoding mode</label><select id="url-mode" v-model="whole" class="tg-input"><option :value="false">Component (query value or path segment)</option><option :value="true">Full URL (preserve URL separators)</option></select><label for="url-input" class="tg-label">Input</label><textarea id="url-input" v-model="input" class="tg-input tg-mono utility-editor" spellcheck="false" placeholder="Hello world & more"></textarea><div class="utility-actions"><button class="tg-btn tg-btn-primary" @click="run(false)">Encode</button><button class="tg-btn tg-btn-secondary" @click="run(true)">Decode</button><button class="tg-btn tg-btn-ghost" :disabled="!output" @click="input = output">Use result as input</button><button class="tg-btn tg-btn-ghost" @click="input = ''">Clear</button></div><ErrorBox :message="error" /></section>
      <section class="tg-card utility-panel"><label for="url-output" class="tg-label">Result</label><textarea id="url-output" :value="output" readonly class="tg-input tg-mono utility-editor" placeholder="Encoded or decoded text appears here"></textarea><CopyBtn :text="output" /></section>
    </div>
    <template #legend><p class="text-sm">Component mode escapes separators such as &amp;, /, and ?. Full URL mode preserves these separators.</p><p class="text-sm">Spaces encode as %20. A plus sign stays a plus when decoding; this is not form-data decoding. Your input is not opened or fetched.</p></template>
  </ToolLayout>
</template>
<script setup>
import { ref, watch } from 'vue'
import ToolLayout from '../components/layouts/ToolLayout.vue'
import CopyBtn from '../components/ui/CopyBtn.vue'
import ErrorBox from '../components/ui/ErrorBox.vue'
import { transformUrl } from '../utils/developerTools.js'
const input = ref(''), output = ref(''), error = ref(''), whole = ref(false)
watch([input, whole], () => { output.value = ''; error.value = '' }, { flush: 'sync' })
function run(decode) { output.value = ''; error.value = ''; try { output.value = transformUrl(input.value, decode, whole.value) } catch (e) { error.value = e.message } }
</script>
