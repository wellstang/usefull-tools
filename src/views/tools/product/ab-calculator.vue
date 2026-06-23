<template>
  <ToolLayout title="AB 实验样本量" description="根据基线转化率和 MDE 计算所需实验样本量" category="product">
    <div class="max-w-lg space-y-5">
      <div class="card space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label">基线转化率 (%)</label>
            <input v-model.number="baseline" type="number" min="0.1" max="99.9" step="0.1" class="input w-full mt-1" placeholder="5" />
          </div>
          <div>
            <label class="label">最小可检测效应 MDE (%)</label>
            <input v-model.number="mde" type="number" min="0.1" max="100" step="0.1" class="input w-full mt-1" placeholder="20" />
          </div>
          <div>
            <label class="label">显著性水平 α</label>
            <select v-model.number="alpha" class="input w-full mt-1">
              <option :value="0.05">0.05（95% 置信）</option>
              <option :value="0.01">0.01（99% 置信）</option>
              <option :value="0.1">0.10（90% 置信）</option>
            </select>
          </div>
          <div>
            <label class="label">统计功效 1-β</label>
            <select v-model.number="power" class="input w-full mt-1">
              <option :value="0.8">0.80（推荐）</option>
              <option :value="0.9">0.90</option>
              <option :value="0.95">0.95</option>
            </select>
          </div>
        </div>
        <div>
          <label class="label">每日流量（可选，用于估算实验天数）</label>
          <input v-model.number="dailyTraffic" type="number" min="0" class="input w-full mt-1" placeholder="10000" />
        </div>
      </div>

      <div v-if="result" class="card">
        <h3 class="font-semibold text-gray-800 mb-4">计算结果</h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-indigo-50 rounded-xl p-4 text-center">
            <div class="text-3xl font-bold text-indigo-700">{{ result.perGroup.toLocaleString() }}</div>
            <div class="text-sm text-gray-500 mt-1">每组样本量</div>
          </div>
          <div class="bg-indigo-50 rounded-xl p-4 text-center">
            <div class="text-3xl font-bold text-indigo-700">{{ result.total.toLocaleString() }}</div>
            <div class="text-sm text-gray-500 mt-1">总样本量（双组）</div>
          </div>
          <div v-if="result.days" class="col-span-2 bg-green-50 rounded-xl p-4 text-center">
            <div class="text-3xl font-bold text-green-600">{{ result.days }}</div>
            <div class="text-sm text-gray-500 mt-1">预计实验天数</div>
          </div>
        </div>
        <div class="mt-4 text-xs text-gray-400">
          实验组转化率目标：{{ (baseline * (1 + mde / 100)).toFixed(2) }}%（相对提升 {{ mde }}%）
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '@/components/common/ToolLayout.vue'

const baseline = ref(5)
const mde = ref(20)
const alpha = ref(0.05)
const power = ref(0.8)
const dailyTraffic = ref(null)

// z-score 查表
const zAlpha = { 0.05: 1.96, 0.01: 2.576, 0.1: 1.645 }
const zBeta = { 0.8: 0.842, 0.9: 1.282, 0.95: 1.645 }

const result = computed(() => {
  if (!baseline.value || !mde.value) return null
  const p1 = baseline.value / 100
  const p2 = p1 * (1 + mde.value / 100)
  const za = zAlpha[alpha.value] || 1.96
  const zb = zBeta[power.value] || 0.842
  const n = Math.ceil(
    (za + zb) ** 2 * (p1 * (1 - p1) + p2 * (1 - p2)) / (p1 - p2) ** 2
  )
  const days = dailyTraffic.value ? Math.ceil((n * 2) / dailyTraffic.value) : null
  return { perGroup: n, total: n * 2, days }
})
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-6; }
.label { @apply text-sm font-medium text-gray-700; }
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400; }
</style>
