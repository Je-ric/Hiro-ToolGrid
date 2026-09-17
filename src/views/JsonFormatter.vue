<template>
  <ToolLayout title="JSON Formatter & Validator" subtitle="Format, validate, or minify JSON locally">
    <div class="utility-grid">
      <section class="tg-card utility-panel">
        <label for="json-input" class="tg-label">JSON input</label>
        <textarea id="json-input" v-model="input" class="tg-input tg-mono utility-editor" spellcheck="false" placeholder='{"hello":"world"}'></textarea>
        <div class="utility-actions"><button class="tg-btn tg-btn-primary" @click="run(false)">Format & validate</button><button class="tg-btn tg-btn-secondary" @click="run(true)">Minify</button><button class="tg-btn tg-btn-ghost" @click="input = sample">Example</button><button class="tg-btn tg-btn-ghost" @click="input = ''">Clear</button></div>
        <ErrorBox :message="error" /><p v-if="output" role="status" class="utility-note">Valid JSON. {{ outputBytes }} bytes in the output.</p>
      </section>
      <section class="tg-card utility-panel"><label for="json-output" class="tg-label">Result</label><textarea id="json-output" :value="output" readonly class="tg-input tg-mono utility-editor" placeholder="Formatted JSON appears here"></textarea><CopyBtn :text="output" /></section>
    </div>
    <template #legend><p class="text-sm">Supports objects, arrays, and JSON primitives. Formatting uses two spaces. Comments and trailing commas are not valid JSON.</p><p class="text-sm">Numbers use JavaScript precision. Keep large identifiers as strings. Duplicate object keys keep their last value.</p></template>
  </ToolLayout>
</template>
<script setup>
import { computed, ref, watch } from 'vue'
import ToolLayout from '../components/layouts/ToolLayout.vue'
import CopyBtn from '../components/ui/CopyBtn.vue'
import ErrorBox from '../components/ui/ErrorBox.vue'
import { formatJson } from '../utils/developerTools.js'
const sample = '{"project":"ToolGrid","tools":["JSON","UUID"],"ready":true}'
const input = ref(''), output = ref(''), error = ref('')
const outputBytes = computed(() => new TextEncoder().encode(output.value).length)
watch(input, () => { output.value = ''; error.value = '' }, { flush: 'sync' })
function run(compact) { output.value = ''; error.value = ''; try { output.value = formatJson(input.value, compact) } catch (e) { error.value = e.message } }
</script>
