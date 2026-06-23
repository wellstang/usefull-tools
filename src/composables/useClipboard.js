import { ref } from 'vue'

export function useClipboard() {
  const copied = ref(false)
  let timer = null

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // 降级方案
      const el = document.createElement('textarea')
      el.value = text
      el.style.position = 'fixed'
      el.style.opacity = '0'
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    copied.value = true
    clearTimeout(timer)
    timer = setTimeout(() => { copied.value = false }, 1500)
  }

  return { copied, copy }
}
