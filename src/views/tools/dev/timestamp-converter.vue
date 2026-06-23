<template>
  <ToolLayout title="时间戳转换" description="Unix 时间戳与人类可读时间互转，支持秒/毫秒" category="dev">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- 时间戳 → 日期 -->
      <div class="card">
        <h3 class="section-title">时间戳 → 日期</h3>
        <div class="flex gap-2 mb-3">
          <input v-model="tsInput" type="number" placeholder="Unix 时间戳" class="input flex-1" />
          <select v-model="tsUnit" class="input w-24">
            <option value="s">秒</option>
            <option value="ms">毫秒</option>
          </select>
        </div>
        <button @click="tsToDate" class="btn-primary w-full mb-4">转换</button>
        <div v-if="tsResult" class="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
          <div class="flex justify-between"><span class="text-gray-500">本地时间</span><span class="font-mono font-medium">{{ tsResult.local }}</span></div>
          <div class="flex justify-between"><span class="text-gray-500">UTC 时间</span><span class="font-mono">{{ tsResult.utc }}</span></div>
          <div class="flex justify-between"><span class="text-gray-500">ISO 8601</span><span class="font-mono text-xs">{{ tsResult.iso }}</span></div>
        </div>
        <button @click="setNow" class="mt-3 text-sm text-indigo-600 hover:text-indigo-700">获取当前时间戳</button>
      </div>

      <!-- 日期 → 时间戳 -->
      <div class="card">
        <h3 class="section-title">日期 → 时间戳</h3>
        <input v-model="dateInput" type="datetime-local" class="input w-full mb-3" />
        <button @click="dateToTs" class="btn-primary w-full mb-4">转换</button>
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

    <!-- 当前时间实时显示 -->
    <div class="mt-6 text-center text-gray-400 text-sm">
      当前时间戳：<span class="font-mono text-gray-600">{{ nowTs }}</span>（秒）·
      <span class="font-mono text-gray-600">{{ nowTsMs }}</span>（毫秒）
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

let timer = null
onMounted(() => { timer = setInterval(() => { nowTs.value = Math.floor(Date.now() / 1000); nowTsMs.value = Date.now() }, 1000) })
onUnmounted(() => clearInterval(timer))

function tsToDate() {
  if (!tsInput.value) return
  const ms = tsUnit.value === 's' ? Number(tsInput.value) * 1000 : Number(tsInput.value)
  const d = new Date(ms)
  tsResult.value = {
    local: d.toLocaleString('zh-CN'),
    utc: d.toUTCString(),
    iso: d.toISOString(),
  }
}

function dateToTs() {
  if (!dateInput.value) return
  const ms = new Date(dateInput.value).getTime()
  dateResult.value = { s: Math.floor(ms / 1000), ms }
}

function setNow() {
  tsInput.value = String(Math.floor(Date.now() / 1000))
  tsUnit.value = 's'
  tsToDate()
}
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-6; }
.section-title { @apply text-base font-semibold text-gray-800 mb-4; }
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent; }
.btn-primary { @apply px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors; }
</style>
