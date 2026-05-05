<template>
  <button @click="handleCopy" class="tg-btn tg-btn-copy">
    <i :class="`bx ${copied ? 'bx-check' : 'bx-copy'}`" style="font-size:0.9em"></i>
    {{ copied ? 'Copied!' : label }}
  </button>
</template>
<script setup>
import { useClipboard } from '../../composables/useClipboard.js'
const props = defineProps({ text: { type: String, default: '' }, label: { type: String, default: 'Copy' } })
const { copied, copy } = useClipboard()
function handleCopy() { copy(props.text) }
</script>
