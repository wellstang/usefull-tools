<template>
  <ToolLayout title="番茄钟" description="25/5 分钟循环计时，响铃提醒，统计专注次数" category="life">
    <div class="max-w-sm mx-auto text-center space-y-6">
      <!-- 状态标签 -->
      <div :class="['inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium', isFocus ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600']">
        <span :class="['w-2 h-2 rounded-full', isRunning ? 'animate-pulse' : '', isFocus ? 'bg-red-400' : 'bg-green-400']" />
        {{ isFocus ? '专注时间' : '休息时间' }}
      </div>

      <!-- 圆形进度 -->
      <div class="relative inline-flex items-center justify-center">
        <svg class="w-56 h-56 -rotate-90">
          <circle cx="112" cy="112" r="100" fill="none" stroke="#f1f5f9" stroke-width="10" />
          <circle cx="112" cy="112" r="100" fill="none" :stroke="isFocus ? '#ef4444' : '#22c55e'" stroke-width="10"
            stroke-linecap="round"
            :stroke-dasharray="2 * Math.PI * 100"
            :stroke-dashoffset="2 * Math.PI * 100 * (1 - progressVal)" style="transition: stroke-dashoffset 0.5s ease;" />
        </svg>
        <div class="absolute text-center">
          <div class="text-5xl font-bold font-mono text-gray-800">{{ pad(minutes) }}:{{ pad(seconds) }}</div>
          <div class="text-sm text-gray-400 mt-1">🍅 × {{ pomodoroCount }}</div>
        </div>
      </div>

      <!-- 控制按钮 -->
      <div class="flex justify-center gap-4">
        <button @click="toggle" :class="['w-14 h-14 rounded-full text-white text-xl flex items-center justify-center shadow-md transition-transform hover:scale-105', isFocus ? 'bg-red-500' : 'bg-green-500']">
          <Icon :icon="isRunning ? 'mdi:pause' : 'mdi:play'" />
        </button>
        <button @click="skipPhase" class="w-14 h-14 rounded-full bg-gray-100 text-gray-600 text-xl flex items-center justify-center hover:bg-gray-200 transition-colors" title="跳过">
          <Icon icon="mdi:skip-next" />
        </button>
        <button @click="resetAll" class="w-14 h-14 rounded-full bg-gray-100 text-gray-600 text-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
          <Icon icon="mdi:refresh" />
        </button>
      </div>

      <!-- 设置 -->
      <div class="bg-white rounded-2xl border border-gray-200 p-5 space-y-3 text-left">
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">专注时长</span>
          <div class="flex items-center gap-2">
            <input v-model.number="focusMins" type="number" min="1" max="90" class="input w-16 text-center" @change="resetAll" />
            <span class="text-sm text-gray-400">分钟</span>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">休息时长</span>
          <div class="flex items-center gap-2">
            <input v-model.number="breakMins" type="number" min="1" max="30" class="input w-16 text-center" @change="resetAll" />
            <span class="text-sm text-gray-400">分钟</span>
          </div>
        </div>
        <div class="flex justify-between items-center pt-1 border-t border-gray-100">
          <span class="text-sm text-gray-600">桌面通知</span>
          <button @click="requestNotify" :class="['text-xs px-3 py-1 rounded-lg transition-colors', notifyStatus === 'granted' ? 'bg-green-100 text-green-600' : notifyStatus === 'denied' ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600']">
            {{ notifyStatus === 'granted' ? '✅ 已开启' : notifyStatus === 'denied' ? '🚫 已拒绝' : '点击开启' }}
          </button>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import ToolLayout from '@/components/common/ToolLayout.vue'

const focusMins = ref(25)
const breakMins = ref(5)
const isFocus = ref(true)
const pomodoroCount = ref(0)
const notifyStatus = ref(typeof Notification !== 'undefined' ? Notification.permission : 'denied')

async function requestNotify() {
  if (typeof Notification === 'undefined') return
  if (Notification.permission === 'granted') return
  const result = await Notification.requestPermission()
  notifyStatus.value = result
}

function sendNotification(title, body) {
  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/favicon.ico', silent: false })
  }
}

const totalSecs = computed(() => (isFocus.value ? focusMins.value : breakMins.value) * 60)
const remaining = ref(totalSecs.value)
const isRunning = ref(false)

const minutes = computed(() => Math.floor(remaining.value / 60))
const seconds = computed(() => remaining.value % 60)
const progressVal = computed(() => (totalSecs.value - remaining.value) / totalSecs.value)

const pad = n => String(n).padStart(2, '0')

let interval = null

function toggle() {
  if (isRunning.value) { clearInterval(interval); isRunning.value = false }
  else {
    isRunning.value = true
    interval = setInterval(() => {
      if (remaining.value <= 0) { onPhaseEnd(); return }
      remaining.value--
      document.title = `${pad(minutes.value)}:${pad(seconds.value)} — ${isFocus.value ? '专注中' : '休息中'} | 唐唐工具箱`
    }, 1000)
  }
}

function onPhaseEnd() {
  clearInterval(interval); isRunning.value = false
  beep()
  if (isFocus.value) {
    pomodoroCount.value++
    sendNotification('🍅 专注结束！', `第 ${pomodoroCount.value} 个番茄完成，休息 ${breakMins.value} 分钟吧`)
  } else {
    sendNotification('⏰ 休息结束！', '准备好了吗？继续下一个专注时段')
  }
  isFocus.value = !isFocus.value
  remaining.value = totalSecs.value
}

function skipPhase() {
  clearInterval(interval); isRunning.value = false
  isFocus.value = !isFocus.value
  remaining.value = totalSecs.value
}

function resetAll() {
  clearInterval(interval); isRunning.value = false
  isFocus.value = true; pomodoroCount.value = 0
  remaining.value = totalSecs.value
  document.title = '唐唐工具箱'
}

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator(); const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.frequency.value = 880; osc.type = 'sine'
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.5)
  } catch {}
}

onUnmounted(() => { clearInterval(interval); document.title = '唐唐工具箱' })
</script>
<style scoped>
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400; }
</style>
