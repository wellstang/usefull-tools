import { ref, watch } from 'vue'

const EYE_KEY = 'tt-eye-mode'
const eyeMode = ref(localStorage.getItem(EYE_KEY) === 'true')

function apply(val) {
  document.documentElement.classList.toggle('eye-mode', val)
}

// 初始化应用
apply(eyeMode.value)

watch(eyeMode, (val) => {
  apply(val)
  localStorage.setItem(EYE_KEY, val)
})

export function useEyeMode() {
  return { eyeMode }
}
