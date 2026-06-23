<template>
  <ToolLayout title="活动 ROI 计算器" description="计算活动投入产出比、CPA、ROAS 等核心指标" category="ops">
    <div class="max-w-lg space-y-5">
      <div class="card space-y-4">
        <h3 class="font-semibold text-gray-800">投入</h3>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="label">广告费用（元）</label><input v-model.number="costs.ad" type="number" min="0" class="input w-full mt-1" /></div>
          <div><label class="label">人力成本（元）</label><input v-model.number="costs.labor" type="number" min="0" class="input w-full mt-1" /></div>
          <div><label class="label">物料费用（元）</label><input v-model.number="costs.material" type="number" min="0" class="input w-full mt-1" /></div>
          <div><label class="label">其他费用（元）</label><input v-model.number="costs.other" type="number" min="0" class="input w-full mt-1" /></div>
        </div>
        <h3 class="font-semibold text-gray-800">收益</h3>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="label">活动收入（元）</label><input v-model.number="revenue" type="number" min="0" class="input w-full mt-1" /></div>
          <div><label class="label">转化用户数</label><input v-model.number="conversions" type="number" min="0" class="input w-full mt-1" /></div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div v-for="m in metrics" :key="m.label" class="card text-center">
          <div class="text-2xl font-bold" :class="m.color">{{ m.value }}</div>
          <div class="text-xs text-gray-500 mt-1">{{ m.label }}</div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '@/components/common/ToolLayout.vue'

const costs = ref({ ad: 5000, labor: 2000, material: 1000, other: 500 })
const revenue = ref(30000)
const conversions = ref(150)

const totalCost = computed(() => Object.values(costs.value).reduce((s, v) => s + (v || 0), 0))
const profit = computed(() => revenue.value - totalCost.value)
const roi = computed(() => totalCost.value ? ((profit.value / totalCost.value) * 100).toFixed(1) : '—')
const roas = computed(() => costs.value.ad ? (revenue.value / costs.value.ad).toFixed(2) : '—')
const cpa = computed(() => conversions.value ? (totalCost.value / conversions.value).toFixed(1) : '—')

const metrics = computed(() => [
  { label: '总投入（元）', value: totalCost.value.toLocaleString(), color: 'text-gray-700' },
  { label: '净利润（元）', value: profit.value.toLocaleString(), color: profit.value >= 0 ? 'text-green-600' : 'text-red-500' },
  { label: 'ROI（%）', value: roi.value + '%', color: Number(roi.value) >= 0 ? 'text-indigo-600' : 'text-red-500' },
  { label: 'ROAS', value: roas.value, color: 'text-indigo-600' },
  { label: 'CPA（元）', value: cpa.value, color: 'text-gray-700' },
  { label: '转化用户', value: conversions.value, color: 'text-gray-700' },
])
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-5; }
.label { @apply text-sm font-medium text-gray-700; }
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400; }
</style>
