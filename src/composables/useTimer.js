import { ref, computed, onUnmounted } from 'vue'

/**
 * 计时器 composable — 番茄钟和倒计时共用
 * @param {number} initialSeconds - 初始秒数
 */
export function useTimer(initialSeconds) {
  const remaining = ref(initialSeconds)
  const isRunning = ref(false)
  let interval = null

  const minutes = computed(() => Math.floor(remaining.value / 60))
  const seconds = computed(() => remaining.value % 60)
  const progress = computed(() => {
    if (initialSeconds === 0) return 0
    return ((initialSeconds - remaining.value) / initialSeconds) * 100
  })

  function start() {
    if (isRunning.value || remaining.value <= 0) return
    isRunning.value = true
    interval = setInterval(() => {
      if (remaining.value <= 0) {
        pause()
        return
      }
      remaining.value--
    }, 1000)
  }

  function pause() {
    isRunning.value = false
    clearInterval(interval)
    interval = null
  }

  function reset(seconds = initialSeconds) {
    pause()
    remaining.value = seconds
  }

  /** 用 Web Audio API 生成提示音，无需音频文件 */
  function beep(frequency = 440, duration = 300) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = ctx.createOscillator()
      const gain = ctx.createGain()
      oscillator.connect(gain)
      gain.connect(ctx.destination)
      oscillator.frequency.value = frequency
      oscillator.type = 'sine'
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000)
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + duration / 1000)
    } catch {
      // 浏览器不支持则静默跳过
    }
  }

  onUnmounted(() => clearInterval(interval))

  return { remaining, isRunning, minutes, seconds, progress, start, pause, reset, beep }
}
