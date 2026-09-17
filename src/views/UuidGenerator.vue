<template>
  <ToolLayout title="UUID Generator" subtitle="Generate random version 4 UUIDs with browser cryptography">
    <div class="utility-grid">
      <section class="tg-card utility-panel"><label for="uuid-count" class="tg-label">How many? (1-100)</label><input id="uuid-count" v-model.number="count" type="number" min="1" max="100" step="1" class="tg-input" /><label class="flex items-center gap-2 text-sm"><input v-model="uppercase" type="checkbox" /> Uppercase output</label><button class="tg-btn tg-btn-primary" @click="generate">Generate UUIDs</button><ErrorBox :message="error" /><p class="utility-note">Created locally using cryptographically secure random bytes. One UUID per line.</p></section>
      <section class="tg-card utility-panel"><label for="uuid-output" class="tg-label">Generated UUIDs</label><textarea id="uuid-output" :value="output" readonly class="tg-input tg-mono utility-editor" placeholder="Click Generate UUIDs to begin"></textarea><CopyBtn :text="output" label="Copy all" /><p v-if="output" role="status" class="utility-note">{{ output.split('\n').length }} UUIDs generated.</p></section>
    </div>
  </ToolLayout>
</template>
<script setup>
import { ref, watch } from 'vue'
import ToolLayout from '../components/layouts/ToolLayout.vue'
import CopyBtn from '../components/ui/CopyBtn.vue'
import ErrorBox from '../components/ui/ErrorBox.vue'
import { generateUuids } from '../utils/developerTools.js'
const count = ref(5), uppercase = ref(false), output = ref(''), error = ref('')
watch([count, uppercase], () => { output.value = ''; error.value = '' })
function generate() { output.value = ''; error.value = ''; try { output.value = generateUuids(count.value, uppercase.value) } catch (e) { error.value = e.message } }
</script>
