<template>
  <div class="flex flex-col items-center gap-1">
    <AppBtn variant="green" icon="bx-copy" @click="handleCopy">{{ copied ? 'Copied!' : label }}</AppBtn>
  </div>
</template>

<script setup>
import AppBtn from './AppBtn.vue'
import { useClipboard } from '../../composables/useClipboard.js'

const props = defineProps({
  text:  { type: String, default: '' },
  label: { type: String, default: 'Copy' },
})

const { copied, copy } = useClipboard()
function handleCopy() { copy(props.text) }
</script>
