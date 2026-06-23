<template>
  <ToolLayout title="AARRR 漏斗计算器" description="输入各环节用户数，可视化用户增长漏斗与转化率" category="ops">
    <div class="max-w-lg space-y-5">
      <div class="card space-y-4">
        <div v-for="stage in stages" :key="stage.key" class="flex items-center gap-4">
          <div :class="['w-3 h-3 rounded-full shrink-0', stage.color]" />
          <label class="text-sm font-medium text-gray-700 w-28">{{ stage.label }}</label>
          <input v-model.number="stage.value" type="number" min="0" class="input flex-1" :placeholder="stage.placeholder" />
        </div>
      </div>

      <!-- 漏斗可视化 -->
      <div class="card space-y-2">
        <div v-for="(stage, i) in stages" :key="stage.key" class="space-y-1">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600 font-medium">{{ stage.label }}</span>
            <div class="flex items-center gap-4">
              <span class="font-mono">{{ (stage.value || 0).toLocaleString() }} 人</span>
              <span v-if="i > 0 && stages[i-1].value" :class="['text-xs px-2 py-0.5 rounded-full', convRate(i) >= 50 ? 'bg-green-100 text-green-600' : convRate(i) >= 20 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-500']">
                转化 {{ convRate(i) }}%
              </span>
            </div>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-6 overflow-hidden">
            <div :class="['h-full rounded-full transition-all duration-500', stage.bg]" :style="{ width: barWidth(i) + '%' }" />
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '@/components/common/ToolLayout.vue'

const stages = ref([
  { key: 'A1', label: 'Acquisition 获客', value: 10000, placeholder: '10000', color: 'bg-blue-400', bg: 'bg-blue-400' },
  { key: 'A2', label: 'Activation 激活', value: 3000, placeholder: '3000', color: 'bg-indigo-400', bg: 'bg-indigo-400' },
  { key: 'R', label: 'Retention 留存', value: 1500, placeholder: '1500', color: 'bg-purple-400', bg: 'bg-purple-400' },
  { key: 'Re', label: 'Revenue 付费', value: 300, placeholder: '300', color: 'bg-pink-400', bg: 'bg-pink-400' },
  { key: 'Re2', label: 'Referral 传播', value: 100, placeholder: '100', color: 'bg-red-400', bg: 'bg-red-400' },
])

const maxVal = computed(() => Math.max(...stages.value.map(s => s.value || 0), 1))

function barWidth(i) {
  return Math.round((stages.value[i].value || 0) / maxVal.value * 100)
}

function convRate(i) {
  const prev = stages.value[i - 1]?.value
  const curr = stages.value[i]?.value
  if (!prev) return 0
  return Math.round(curr / prev * 100)
}
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-5; }
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400; }
</style>
