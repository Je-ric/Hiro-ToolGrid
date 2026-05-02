import { ref } from 'vue'

export function useClipboard(timeout = 2000) {
  const copied = ref(false)

  async function copy(text) {
    if (!text) return
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => { copied.value = false }, timeout)
  }

  return { copied, copy }
}
