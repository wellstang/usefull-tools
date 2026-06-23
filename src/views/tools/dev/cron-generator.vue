<template>
  <ToolLayout title="Cron 表达式生成器" description="可视化配置 Cron 定时任务，自动生成中文解释" category="dev">
    <div class="max-w-2xl space-y-6">
      <!-- 直接输入 -->
      <div class="card">
        <label class="label mb-2 block">Cron 表达式（5段：分 时 日 月 周）</label>
        <div class="flex gap-3 items-center">
          <input v-model="expr" class="input font-mono flex-1 text-lg" spellcheck="false" placeholder="* * * * *" />
          <CopyButton :text="expr" />
        </div>
        <p v-if="desc" class="mt-3 text-indigo-700 bg-indigo-50 rounded-lg px-4 py-2 text-sm font-medium">📅 {{ desc }}</p>
        <p v-if="exprError" class="mt-2 text-red-500 text-sm">{{ exprError }}</p>
      </div>

      <!-- 可视化配置 -->
      <div class="card space-y-4">
        <h3 class="font-semibold text-gray-800">可视化配置</h3>
        <div v-for="field in fields" :key="field.key" class="flex items-start gap-4">
          <div class="w-16 text-sm text-gray-500 pt-2">{{ field.label }}</div>
          <div class="flex-1">
            <div class="flex gap-2 flex-wrap">
              <label class="flex items-center gap-1 text-sm cursor-pointer">
                <input type="radio" :name="field.key" value="*" v-model="field.mode" /> <span>每{{ field.unit }}</span>
              </label>
              <label class="flex items-center gap-1 text-sm cursor-pointer">
                <input type="radio" :name="field.key" value="specific" v-model="field.mode" /> <span>指定</span>
              </label>
              <label class="flex items-center gap-1 text-sm cursor-pointer">
                <input type="radio" :name="field.key" value="range" v-model="field.mode" /> <span>范围</span>
              </label>
              <label class="flex items-center gap-1 text-sm cursor-pointer">
                <input type="radio" :name="field.key" value="step" v-model="field.mode" /> <span>间隔</span>
              </label>
            </div>
            <div v-if="field.mode === 'specific'" class="mt-2 flex gap-1 flex-wrap">
              <button v-for="v in field.options" :key="v"
                @click="toggleValue(field, v)"
                :class="['px-2 py-0.5 text-xs rounded border transition-colors', field.values.includes(v) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400']">
                {{ v }}
              </button>
            </div>
            <div v-if="field.mode === 'range'" class="mt-2 flex items-center gap-2 text-sm">
              <input v-model="field.rangeStart" type="number" class="input w-16" /> 到
              <input v-model="field.rangeEnd" type="number" class="input w-16" />
            </div>
            <div v-if="field.mode === 'step'" class="mt-2 flex items-center gap-2 text-sm">
              每 <input v-model="field.step" type="number" class="input w-16" /> {{ field.unit }}
            </div>
          </div>
        </div>
      </div>

      <!-- 预设 -->
      <div class="card">
        <h3 class="font-semibold text-gray-800 mb-3">常用预设</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <button v-for="p in presets" :key="p.expr" @click="applyPreset(p.expr)"
            class="text-left px-3 py-2 text-sm rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
            <div class="font-medium text-gray-800">{{ p.label }}</div>
            <div class="font-mono text-xs text-gray-400">{{ p.expr }}</div>
          </button>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import ToolLayout from '@/components/common/ToolLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'

const fields = ref([
  { key: 'min', label: '分钟', unit: '分钟', mode: '*', values: [], rangeStart: 0, rangeEnd: 59, step: 5, options: [...Array(60).keys()] },
  { key: 'hour', label: '小时', unit: '小时', mode: '*', values: [], rangeStart: 0, rangeEnd: 23, step: 1, options: [...Array(24).keys()] },
  { key: 'day', label: '日期', unit: '天', mode: '*', values: [], rangeStart: 1, rangeEnd: 31, step: 1, options: [...Array(31).keys()].map(i=>i+1) },
  { key: 'month', label: '月份', unit: '月', mode: '*', values: [], rangeStart: 1, rangeEnd: 12, step: 1, options: [...Array(12).keys()].map(i=>i+1) },
  { key: 'week', label: '星期', unit: '天', mode: '*', values: [], rangeStart: 0, rangeEnd: 6, step: 1, options: ['日','一','二','三','四','五','六'] },
])

const expr = ref('* * * * *')
const exprError = ref('')

function fieldToExpr(f) {
  if (f.mode === '*') return '*'
  if (f.mode === 'specific') return f.values.length ? f.values.join(',') : '*'
  if (f.mode === 'range') return `${f.rangeStart}-${f.rangeEnd}`
  if (f.mode === 'step') return `*/${f.step}`
  return '*'
}

watch(fields, () => {
  expr.value = fields.value.map(fieldToExpr).join(' ')
}, { deep: true })

function toggleValue(field, v) {
  const idx = field.values.indexOf(v)
  if (idx >= 0) field.values.splice(idx, 1)
  else field.values.push(v)
  field.values.sort((a, b) => a - b)
}

function applyPreset(e) { expr.value = e }

const presets = [
  { label: '每分钟', expr: '* * * * *' },
  { label: '每小时', expr: '0 * * * *' },
  { label: '每天凌晨', expr: '0 0 * * *' },
  { label: '每天中午', expr: '0 12 * * *' },
  { label: '每周一', expr: '0 9 * * 1' },
  { label: '每月1号', expr: '0 0 1 * *' },
  { label: '工作日9点', expr: '0 9 * * 1-5' },
  { label: '每5分钟', expr: '*/5 * * * *' },
  { label: '每15分钟', expr: '*/15 * * * *' },
]

const desc = computed(() => {
  const [min, hour, day, month, week] = expr.value.split(' ')
  if (!min) return ''
  const parts = []
  if (month !== '*') parts.push(`${month}月`)
  if (day !== '*') parts.push(`${day}日`)
  if (week !== '*') parts.push(`星期${week}`)
  if (hour === '*') parts.push('每小时')
  else parts.push(`${hour}点`)
  if (min === '*') parts.push('每分钟执行')
  else if (min.startsWith('*/')) parts.push(`每${min.slice(2)}分钟执行`)
  else parts.push(`${min}分执行`)
  return parts.join(' ')
})
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-5; }
.label { @apply text-sm font-medium text-gray-700; }
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400; }
</style>
