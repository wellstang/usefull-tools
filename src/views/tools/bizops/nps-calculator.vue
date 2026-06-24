<template>
  <ToolLayout title="NPS 计算器" description="输入各评分段人数，自动计算净推荐值和分布图" category="product">
    <div class="max-w-lg space-y-5">
      <div class="card space-y-3">
        <div v-for="i in 11" :key="i-1" class="flex items-center gap-3">
          <span :class="['w-8 text-center text-sm font-medium rounded', scoreColor(i-1)]">{{ i-1 }}</span>
          <input v-model.number="scores[i-1]" type="number" min="0" class="input flex-1" placeholder="0" />
          <span class="text-xs text-gray-400 w-12">{{ scoreLabel(i-1) }}</span>
        </div>
      </div>

      <div v-if="total > 0" class="card">
        <div class="text-center mb-6">
          <div class="text-6xl font-bold" :style="{ color: npsColor }">{{ nps }}</div>
          <div class="text-gray-500 mt-1">NPS 净推荐值</div>
          <div class="text-sm font-medium mt-1" :style="{ color: npsColor }">{{ npsLevel }}</div>
        </div>
        <div class="grid grid-cols-3 gap-3 text-center text-sm mb-4">
          <div class="bg-green-50 rounded-xl p-3">
            <div class="text-xl font-bold text-green-600">{{ promoterPct }}%</div>
            <div class="text-xs text-gray-500">推荐者（9-10）</div>
          </div>
          <div class="bg-yellow-50 rounded-xl p-3">
            <div class="text-xl font-bold text-yellow-600">{{ passivePct }}%</div>
            <div class="text-xs text-gray-500">中立者（7-8）</div>
          </div>
          <div class="bg-red-50 rounded-xl p-3">
            <div class="text-xl font-bold text-red-500">{{ detractorPct }}%</div>
            <div class="text-xs text-gray-500">贬损者（0-6）</div>
          </div>
        </div>
        <!-- 可视化条 -->
        <div class="flex h-4 rounded-full overflow-hidden">
          <div class="bg-red-400 transition-all" :style="{ width: detractorPct + '%' }" />
          <div class="bg-yellow-400 transition-all" :style="{ width: passivePct + '%' }" />
          <div class="bg-green-400 transition-all" :style="{ width: promoterPct + '%' }" />
        </div>
        <div class="text-xs text-gray-400 text-right mt-1">总回收 {{ total }} 份</div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '@/components/common/ToolLayout.vue'

const scores = ref(Array(11).fill(0))

const total = computed(() => scores.value.reduce((s, v) => s + (v || 0), 0))
const promoters = computed(() => (scores.value[9] || 0) + (scores.value[10] || 0))
const passives = computed(() => (scores.value[7] || 0) + (scores.value[8] || 0))
const detractors = computed(() => scores.value.slice(0, 7).reduce((s, v) => s + (v || 0), 0))

const promoterPct = computed(() => total.value ? Math.round(promoters.value / total.value * 100) : 0)
const passivePct = computed(() => total.value ? Math.round(passives.value / total.value * 100) : 0)
const detractorPct = computed(() => total.value ? Math.round(detractors.value / total.value * 100) : 0)

const nps = computed(() => promoterPct.value - detractorPct.value)
const npsColor = computed(() => nps.value >= 50 ? '#22c55e' : nps.value >= 0 ? '#f59e0b' : '#ef4444')
const npsLevel = computed(() => {
  if (nps.value >= 70) return '卓越'
  if (nps.value >= 50) return '优秀'
  if (nps.value >= 0) return '良好'
  return '需要改善'
})

function scoreColor(i) {
  if (i >= 9) return 'bg-green-100 text-green-700'
  if (i >= 7) return 'bg-yellow-100 text-yellow-700'
  return 'bg-red-100 text-red-700'
}
function scoreLabel(i) {
  if (i >= 9) return '推荐者'
  if (i >= 7) return '中立'
  return '贬损者'
}
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-5; }
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400; }
</style>
