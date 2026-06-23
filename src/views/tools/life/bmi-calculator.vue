<template>
  <ToolLayout title="BMI 计算器" description="计算 BMI 体质指数，展示健康分级和建议" category="life">
    <div class="max-w-lg space-y-5">
      <div class="card grid grid-cols-2 gap-4">
        <div>
          <label class="label">身高</label>
          <div class="flex gap-2 mt-1">
            <input v-model.number="height" type="number" min="50" max="250" class="input flex-1" placeholder="170" />
            <span class="py-2 text-sm text-gray-500">cm</span>
          </div>
        </div>
        <div>
          <label class="label">体重</label>
          <div class="flex gap-2 mt-1">
            <input v-model.number="weight" type="number" min="1" max="300" class="input flex-1" placeholder="65" />
            <span class="py-2 text-sm text-gray-500">kg</span>
          </div>
        </div>
      </div>

      <div v-if="bmi" class="card text-center">
        <div class="text-5xl font-bold mb-2" :style="{ color: result.color }">{{ bmi }}</div>
        <div class="text-xl font-semibold mb-1" :style="{ color: result.color }">{{ result.label }}</div>
        <p class="text-sm text-gray-500 mb-4">{{ result.desc }}</p>

        <!-- BMI 刻度条 -->
        <div class="relative h-4 rounded-full overflow-hidden bg-gradient-to-r from-blue-300 via-green-400 via-yellow-400 to-red-500 mb-2">
          <div class="absolute top-0 w-1 h-full bg-white shadow" :style="{ left: bmiPct + '%', transform: 'translateX(-50%)' }" />
        </div>
        <div class="flex justify-between text-xs text-gray-400 mb-4">
          <span>18.5</span><span>24</span><span>28</span><span>32</span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div v-for="level in levels" :key="level.label" :class="['rounded-lg p-2', level.label === result.label ? 'bg-opacity-20 ring-2 ring-current' : 'bg-gray-50']" :style="level.label === result.label ? { backgroundColor: result.color + '20', color: result.color } : {}">
            <div class="font-medium">{{ level.label }}</div>
            <div class="text-gray-400">{{ level.range }}</div>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '@/components/common/ToolLayout.vue'

const height = ref(170)
const weight = ref(65)

const levels = [
  { label: '偏瘦', range: '< 18.5', color: '#60a5fa', desc: '建议适当增重，注意营养均衡', min: 0, max: 18.5 },
  { label: '正常', range: '18.5–24', color: '#22c55e', desc: '体重在健康范围内，继续保持', min: 18.5, max: 24 },
  { label: '超重', range: '24–28', color: '#f59e0b', desc: '建议通过饮食和运动控制体重', min: 24, max: 28 },
  { label: '肥胖', range: '≥ 28', color: '#ef4444', desc: '建议咨询医生制定减重计划', min: 28, max: Infinity },
]

const bmi = computed(() => {
  if (!height.value || !weight.value) return null
  return (weight.value / (height.value / 100) ** 2).toFixed(1)
})

const result = computed(() => levels.find(l => bmi.value >= l.min && bmi.value < l.max) || levels[3])

const bmiPct = computed(() => {
  if (!bmi.value) return 0
  const v = Math.min(Math.max(bmi.value, 14), 38)
  return ((v - 14) / (38 - 14)) * 100
})
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-6; }
.label { @apply text-sm font-medium text-gray-700; }
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400; }
</style>
