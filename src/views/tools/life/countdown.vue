<template>
  <ToolLayout title="倒计时" description="自定义目标时间倒计时，显示剩余天时分秒" category="life">
    <div class="max-w-lg mx-auto space-y-6">
      <div class="card space-y-3">
        <div>
          <label class="label">倒计时名称</label>
          <input v-model="name" placeholder="例如：距离元旦" class="input w-full mt-1" />
        </div>
        <div>
          <label class="label">目标时间</label>
          <input type="datetime-local" v-model="target" class="input w-full mt-1" />
        </div>
        <button @click="start" class="btn-primary w-full">开始倒计时</button>
      </div>

      <div v-if="started" class="card text-center">
        <h3 class="text-lg font-semibold text-gray-700 mb-6">{{ name || '倒计时' }}</h3>
        <div v-if="isExpired" class="text-3xl text-green-500 font-bold">🎉 时间到！</div>
        <div v-else class="grid grid-cols-4 gap-3">
          <div v-for="(unit, i) in timeUnits" :key="i" class="bg-indigo-50 rounded-xl p-4">
            <div class="text-3xl sm:text-4xl font-bold font-mono text-indigo-700">{{ unit.value }}</div>
            <div class="text-xs text-gray-500 mt-1">{{ unit.label }}</div>
          </div>
        </div>
        <p class="text-sm text-gray-400 mt-4">目标：{{ new Date(target).toLocaleString('zh-CN') }}</p>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import ToolLayout from '@/components/common/ToolLayout.vue'

const name = ref('距离新年')
const target = ref(new Date(new Date().getFullYear() + 1, 0, 1).toISOString().slice(0, 16))
const started = ref(false)
const now = ref(Date.now())
let timer = null

function start() {
  started.value = true
  if (timer) clearInterval(timer)
  timer = setInterval(() => { now.value = Date.now() }, 1000)
}

const remaining = computed(() => Math.max(0, new Date(target.value) - now.value))
const isExpired = computed(() => remaining.value === 0)

const timeUnits = computed(() => {
  const total = Math.floor(remaining.value / 1000)
  return [
    { value: String(Math.floor(total / 86400)).padStart(2, '0'), label: '天' },
    { value: String(Math.floor((total % 86400) / 3600)).padStart(2, '0'), label: '时' },
    { value: String(Math.floor((total % 3600) / 60)).padStart(2, '0'), label: '分' },
    { value: String(total % 60).padStart(2, '0'), label: '秒' },
  ]
})

onUnmounted(() => clearInterval(timer))
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-6; }
.label { @apply text-sm font-medium text-gray-700; }
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400; }
.btn-primary { @apply px-4 py-2.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium; }
</style>
