<template>
  <ToolLayout title="OKR 制定助手" description="O + KR 结构化拆解，跟踪完成进度" category="product">
    <div class="max-w-2xl space-y-5">
      <div class="card">
        <label class="label">目标（Objective）</label>
        <input v-model="objective" placeholder="例如：提升用户留存率，打造用户价值感知" class="input w-full mt-1 text-base" />
      </div>

      <div class="space-y-3">
        <div v-for="(kr, i) in krs" :key="i" class="card space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm font-semibold text-indigo-600">KR {{ i + 1 }}</span>
            <button @click="krs.splice(i,1)" class="text-gray-300 hover:text-red-400 transition-colors text-sm">删除</button>
          </div>
          <input v-model="kr.text" placeholder="关键结果，可量化，如：7 日留存率从 30% 提升至 45%" class="input w-full" />
          <div class="flex gap-3 items-center">
            <span class="text-sm text-gray-500">当前进度</span>
            <input v-model.number="kr.progress" type="range" min="0" max="100" class="flex-1" />
            <span class="text-sm font-medium text-gray-700 w-10 text-right">{{ kr.progress }}%</span>
          </div>
        </div>
      </div>

      <button @click="krs.push({ text:'', progress:0 })" class="btn-secondary w-full">+ 添加关键结果</button>

      <div v-if="objective && krs.length" class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gray-800">整体完成度</h3>
          <span class="text-2xl font-bold text-indigo-600">{{ overallProgress }}%</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-3">
          <div class="bg-indigo-600 h-3 rounded-full transition-all duration-500" :style="{ width: overallProgress + '%' }" />
        </div>
        <div class="mt-4 bg-gray-50 rounded-xl p-4 space-y-2">
          <p class="font-medium text-gray-800">🎯 {{ objective }}</p>
          <p v-for="(kr, i) in krs" :key="i" class="text-sm text-gray-600 flex items-start gap-2">
            <span class="text-indigo-400 shrink-0">KR{{ i+1 }}</span>
            <span>{{ kr.text }} <span class="text-gray-400">（{{ kr.progress }}%）</span></span>
          </p>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '@/components/common/ToolLayout.vue'

const objective = ref('提升用户留存率，打造用户价值感知')
const krs = ref([
  { text: '7 日留存率从 30% 提升至 45%', progress: 40 },
  { text: '用户 NPS 从 20 提升至 50', progress: 25 },
  { text: '月活用户增长 30%', progress: 60 },
])

const overallProgress = computed(() => {
  if (!krs.value.length) return 0
  return Math.round(krs.value.reduce((s, kr) => s + kr.progress, 0) / krs.value.length)
})
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-5; }
.label { @apply text-sm font-medium text-gray-700; }
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400; }
.btn-secondary { @apply px-4 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-indigo-400 hover:text-indigo-600 transition-colors; }
</style>
