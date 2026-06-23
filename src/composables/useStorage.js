import { ref, watch } from 'vue'

/**
 * 带 localStorage 持久化的响应式状态
 * @param {string} key         - localStorage 键名（建议加前缀，如 'tt-okr-data'）
 * @param {*}      defaultValue - 初始默认值
 * @returns Vue ref，自动同步读写 localStorage
 */
export function useStorage(key, defaultValue) {
  function read() {
    try {
      const raw = localStorage.getItem(key)
      return raw !== null ? JSON.parse(raw) : defaultValue
    } catch {
      return defaultValue
    }
  }

  const data = ref(read())

  watch(data, (val) => {
    try {
      localStorage.setItem(key, JSON.stringify(val))
    } catch {
      // localStorage 满或无权限时静默跳过
    }
  }, { deep: true })

  return data
}
