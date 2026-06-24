<template>
  <ToolLayout title="产品路线图" description="时间轴式功能规划，可视化各阶段进展，支持导出图片" category="product">
    <div class="max-w-3xl space-y-4">
      <div class="flex gap-3">
        <input v-model="title" class="input flex-1" placeholder="产品名称" />
        <button @click="addPhase" class="btn-secondary">+ 阶段</button>
        <button @click="exportImg" class="btn-primary flex items-center gap-1"><Icon icon="mdi:download" />导出</button>
      </div>

      <div id="roadmap-board" class="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
        <h2 class="text-xl font-bold text-gray-800">{{ title || '产品路线图' }}</h2>
        <div class="space-y-4">
          <div v-for="(phase, pi) in phases" :key="pi" class="relative pl-8">
            <div class="absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-indigo-600 bg-white" />
            <div v-if="pi < phases.length - 1" class="absolute left-[7px] top-5 bottom-0 w-0.5 bg-indigo-200" style="height: calc(100% + 16px)" />
            <div class="bg-gray-50 rounded-xl p-4">
              <div class="flex items-center gap-3 mb-3">
                <input v-model="phase.name" class="font-semibold text-gray-800 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-indigo-400 outline-none flex-1" />
                <select v-model="phase.status" class="text-xs border border-gray-200 rounded-full px-2 py-1">
                  <option value="planned">计划中</option>
                  <option value="active">进行中</option>
                  <option value="done">已完成</option>
                </select>
                <button @click="phases.splice(pi,1)" class="text-gray-300 hover:text-red-400 text-xs">删除</button>
              </div>
              <div class="space-y-1.5">
                <div v-for="(feat, fi) in phase.features" :key="fi" class="flex items-center gap-2">
                  <span :class="['w-2 h-2 rounded-full shrink-0', statusColor(phase.status)]" />
                  <input v-model="phase.features[fi]" class="flex-1 text-sm text-gray-700 bg-transparent border-b border-transparent hover:border-gray-200 focus:border-indigo-300 outline-none" />
                  <button @click="phase.features.splice(fi,1)" class="text-gray-200 hover:text-red-400 text-xs">✕</button>
                </div>
                <button @click="phase.features.push('')" class="text-xs text-indigo-500 hover:text-indigo-700 mt-1">+ 添加功能</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import ToolLayout from '@/components/common/ToolLayout.vue'
import { useStorage } from '@/composables/useStorage.js'

const title = useStorage('tt-roadmap-title', '')
const phases = useStorage('tt-roadmap-phases', [
  { name: 'Q3 2026 — Phase 1', status: 'active', features: ['研发工具（16个）', '生活工具（10个）', '首页搜索与分类'] },
  { name: 'Q4 2026 — Phase 2', status: 'planned', features: ['产品工具（8个）', '运营工具（7个）', '移动端优化'] },
  { name: '2027 Q1 — Phase 3', status: 'planned', features: ['设计工具（8个）', '质量优化', 'GitHub Actions 自动部署'] },
])

function addPhase() {
  phases.value.push({ name: '新阶段', status: 'planned', features: ['功能一', '功能二'] })
}

function statusColor(s) {
  return { active: 'bg-green-400', planned: 'bg-gray-300', done: 'bg-indigo-400' }[s]
}

async function exportImg() {
  const { default: html2canvas } = await import('html2canvas')
  const el = document.getElementById('roadmap-board')
  const canvas = await html2canvas(el, { useCORS: true })
  const link = document.createElement('a')
  link.download = 'roadmap.png'; link.href = canvas.toDataURL('image/png'); link.click()
}
</script>
