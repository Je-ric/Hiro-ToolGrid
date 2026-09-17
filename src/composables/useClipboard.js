import { onScopeDispose, ref } from 'vue'

export function useClipboard(timeout = 2000) {
  const copied = ref(false), error = ref('')
  let timer, request = 0
  async function copy(text) {
    const current = ++request
    clearTimeout(timer)
    copied.value = false; error.value = ''
    if (!text) return
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Unavailable')
      await navigator.clipboard.writeText(text)
      if (current !== request) return
      copied.value = true
      timer = setTimeout(() => { copied.value = false }, timeout)
    } catch { if (current === request) error.value = 'Could not copy. Select the result and copy it manually.' }
  }
  onScopeDispose(() => { clearTimeout(timer); request++ })
  return { copied, error, copy }
}
