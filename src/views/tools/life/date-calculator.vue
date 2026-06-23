<template>
  <ToolLayout title="日期计算器" description="两日期差值、日期加减、工作日计算" category="life">
    <div class="max-w-2xl">
      <!-- 模式切换 -->
      <div class="flex gap-2 mb-6">
        <button v-for="m in modes" :key="m.id" @click="mode=m.id"
          :class="['px-4 py-2 text-sm rounded-full border transition-colors', mode===m.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300']">
          {{ m.label }}
        </button>
      </div>

      <!-- 模式1：两日期差 -->
      <div v-if="mode==='diff'" class="card space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div><label class="label">开始日期</label><input type="date" v-model="d1" class="input w-full mt-1" /></div>
          <div><label class="label">结束日期</label><input type="date" v-model="d2" class="input w-full mt-1" /></div>
        </div>
        <div v-if="diffResult" class="bg-indigo-50 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div v-for="r in diffResult" :key="r.label">
            <div class="text-2xl font-bold text-indigo-700">{{ r.value }}</div>
            <div class="text-xs text-gray-500">{{ r.label }}</div>
          </div>
        </div>
        <div>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="showWorkdays" class="rounded" />
            <span class="text-sm text-gray-700">计算工作日（排除周末）</span>
          </label>
          <div v-if="showWorkdays && workdays !== null" class="mt-2 text-sm text-gray-600">工作日：<span class="font-semibold text-indigo-600">{{ workdays }}</span> 天</div>
        </div>
      </div>

      <!-- 模式2：日期加减 -->
      <div v-if="mode==='add'" class="card space-y-4">
        <div><label class="label">起始日期</label><input type="date" v-model="base" class="input w-full mt-1" /></div>
        <div class="flex gap-3 items-center">
          <button @click="sign=1" :class="['px-3 py-2 rounded-lg border text-sm', sign===1?'bg-indigo-600 text-white border-indigo-600':'bg-white text-gray-600 border-gray-200']">+ 加</button>
          <button @click="sign=-1" :class="['px-3 py-2 rounded-lg border text-sm', sign===-1?'bg-red-500 text-white border-red-500':'bg-white text-gray-600 border-gray-200']">- 减</button>
          <input v-model.number="days" type="number" min="0" class="input w-24" />
          <span class="text-sm text-gray-500">天</span>
        </div>
        <div v-if="addResult" class="bg-indigo-50 rounded-xl p-4 text-center">
          <div class="text-xl font-bold text-indigo-700">{{ addResult }}</div>
          <div class="text-xs text-gray-500 mt-1">{{ addResultWeekday }}</div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '@/components/common/ToolLayout.vue'

const mode = ref('diff')
const modes = [{ id: 'diff', label: '日期差值' }, { id: 'add', label: '日期加减' }]
const WEEKDAYS = ['周日','周一','周二','周三','周四','周五','周六']

const d1 = ref(new Date().toISOString().slice(0, 10))
const d2 = ref(new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10))
const showWorkdays = ref(false)

const diffResult = computed(() => {
  if (!d1.value || !d2.value) return null
  const ms = Math.abs(new Date(d2.value) - new Date(d1.value))
  const totalDays = Math.round(ms / 864e5)
  return [
    { value: totalDays, label: '天' },
    { value: Math.floor(totalDays / 7), label: '周' },
    { value: parseFloat((totalDays / 30.44).toFixed(1)), label: '月' },
    { value: parseFloat((totalDays / 365.25).toFixed(2)), label: '年' },
  ]
})

const workdays = computed(() => {
  if (!showWorkdays.value || !d1.value || !d2.value) return null
  let start = new Date(d1.value), end = new Date(d2.value)
  if (start > end) [start, end] = [end, start]
  let count = 0
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    if (d.getDay() !== 0 && d.getDay() !== 6) count++
  }
  return count
})

const base = ref(new Date().toISOString().slice(0, 10))
const days = ref(7)
const sign = ref(1)

const addResult = computed(() => {
  if (!base.value) return null
  const d = new Date(base.value)
  d.setDate(d.getDate() + sign.value * days.value)
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
})
const addResultWeekday = computed(() => {
  if (!base.value) return ''
  const d = new Date(base.value)
  d.setDate(d.getDate() + sign.value * days.value)
  return WEEKDAYS[d.getDay()]
})
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-6; }
.label { @apply text-sm font-medium text-gray-700; }
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400; }
</style>
