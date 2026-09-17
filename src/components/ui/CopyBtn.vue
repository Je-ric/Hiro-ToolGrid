<template>
  <button type="button" :disabled="!text" @click="handleCopy" class="tg-btn tg-btn-copy">
    <i :class="`bx ${copied ? 'bx-check' : 'bx-copy'}`" style="font-size:0.9em"></i>
    {{ copied ? 'Copied!' : label }}
  </button>
  <span v-if="error" role="status" class="text-sm text-red-700">{{ error }}</span>
</template>
<script setup>
import { useClipboard } from '../../composables/useClipboard.js'
const props = defineProps({ text: { type: String, default: '' }, label: { type: String, default: 'Copy' } })
const { copied, error, copy } = useClipboard()
function handleCopy() { copy(props.text) }
</script>
