<template>
  <ToolLayout title="时间戳转换" description="Unix 时间戳与人类可读时间互转，支持秒/毫秒及时区" category="dev">
    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 时间戳 → 日期 -->
        <div class="card">
          <h3 class="section-title">时间戳 → 日期</h3>
          <div class="flex gap-2 mb-3">
            <input v-model="tsInput" type="number" placeholder="Unix 时间戳" class="input flex-1" @input="tsToDateLive" />
            <select v-model="tsUnit" class="input w-24" @change="tsToDateLive">
              <option value="s">秒</option>
              <option value="ms">毫秒</option>
            </select>
          </div>
          <button @click="setNow" class="text-sm text-indigo-600 hover:text-indigo-700 mb-3 block">获取当前时间戳</button>
          <div v-if="tsResult" class="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <div class="flex justify-between"><span class="text-gray-500">本地时间</span><span class="font-mono font-medium">{{ tsResult.local }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">UTC 时间</span><span class="font-mono">{{ tsResult.utc }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">ISO 8601</span><span class="font-mono text-xs">{{ tsResult.iso }}</span></div>
            <div v-if="selectedTz" class="flex justify-between">
              <span class="text-gray-500">{{ selectedTz }}</span>
              <span class="font-mono text-xs">{{ tsResult.tz }}</span>
            </div>
          </div>
        </div>

        <!-- 日期 → 时间戳 -->
        <div class="card">
          <h3 class="section-title">日期 → 时间戳</h3>
          <input v-model="dateInput" type="datetime-local" class="input w-full mb-3" @input="dateToTsLive" />
          <div v-if="dateResult" class="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <div class="flex justify-between items-center">
              <span class="text-gray-500">秒级时间戳</span>
              <div class="flex items-center gap-2">
                <span class="font-mono font-medium">{{ dateResult.s }}</span>
                <CopyButton :text="String(dateResult.s)" label="复制" />
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-500">毫秒时间戳</span>
              <div class="flex items-center gap-2">
                <span class="font-mono">{{ dateResult.ms }}</span>
                <CopyButton :text="String(dateResult.ms)" label="复制" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 时区选择 -->
      <div class="card">
        <div class="flex flex-wrap items-center gap-3">
          <span class="text-sm font-medium text-gray-700 shrink-0">时区对照</span>
          <select v-model="selectedTz" class="input flex-1 max-w-xs" @change="tsResult && tsToDateLive()">
            <option value="">不显示额外时区</option>
            <option v-for="tz in TIMEZONES" :key="tz.value" :value="tz.value">{{ tz.label }}</option>
          </select>
        </div>
      </div>

      <!-- 当前时间实时显示 -->
      <div class="text-center text-gray-400 text-sm">
        当前时间戳：<span class="font-mono text-gray-600">{{ nowTs }}</span>（秒）·
        <span class="font-mono text-gray-600">{{ nowTsMs }}</span>（毫秒）
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ToolLayout from '@/components/common/ToolLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'

const tsInput = ref('')
const tsUnit = ref('s')
const tsResult = ref(null)
const dateInput = ref('')
const dateResult = ref(null)
const nowTs = ref(Math.floor(Date.now() / 1000))
const nowTsMs = ref(Date.now())
const selectedTz = ref('')

const TIMEZONES = [
  { value: 'Asia/Shanghai', label: 'UTC+8 北京/上海' },
  { value: 'Asia/Tokyo', label: 'UTC+9 东京' },
  { value: 'America/New_York', label: 'UTC-5/4 纽约' },
  { value: 'America/Los_Angeles', label: 'UTC-8/7 洛杉矶' },
  { value: 'Europe/London', label: 'UTC+0/1 伦敦' },
  { value: 'Europe/Paris', label: 'UTC+1/2 巴黎' },
  { value: 'Asia/Singapore', label: 'UTC+8 新加坡' },
  { value: 'Asia/Dubai', label: 'UTC+4 迪拜' },
  { value: 'Australia/Sydney', label: 'UTC+10/11 悉尼' },
]

let timer = null
onMounted(() => {
  timer = setInterval(() => {
    nowTs.value = Math.floor(Date.now() / 1000)
    nowTsMs.value = Date.now()
  }, 1000)
})
onUnmounted(() => clearInterval(timer))

function tsToDateLive() {
  if (!tsInput.value) { tsResult.value = null; return }
  const ms = tsUnit.value === 's' ? Number(tsInput.value) * 1000 : Number(tsInput.value)
  const d = new Date(ms)
  if (isNaN(d.getTime())) { tsResult.value = null; return }
  const result = {
    local: d.toLocaleString('zh-CN'),
    utc: d.toUTCString(),
    iso: d.toISOString(),
    tz: ''
  }
  if (selectedTz.value) {
    try {
      result.tz = d.toLocaleString('zh-CN', { timeZone: selectedTz.value, hour12: false })
    } catch { result.tz = '' }
  }
  tsResult.value = result
}

function dateToTsLive() {
  if (!dateInput.value) { dateResult.value = null; return }
  const ms = new Date(dateInput.value).getTime()
  if (isNaN(ms)) { dateResult.value = null; return }
  dateResult.value = { s: Math.floor(ms / 1000), ms }
}

function setNow() {
  tsInput.value = String(Math.floor(Date.now() / 1000))
  tsUnit.value = 's'
  tsToDateLive()
}
</script>
<style scoped>
.section-title { @apply text-base font-semibold text-gray-800 mb-4; }
.card { @apply bg-white rounded-xl border border-gray-200 p-5; }
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400; }
</style>
