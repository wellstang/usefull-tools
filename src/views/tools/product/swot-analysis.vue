<template>
  <ToolLayout title="SWOT 分析" description="四象限结构化填写，支持导出图片" category="product">
    <div class="max-w-3xl space-y-4">
      <div class="flex gap-3">
        <input v-model="title" placeholder="分析主题（如：新产品发布策略）" class="input flex-1" />
        <button @click="exportImg" class="btn-secondary flex items-center gap-1"><Icon icon="mdi:download" />导出图片</button>
      </div>

      <div id="swot-board" class="grid grid-cols-2 gap-3 bg-gray-100 p-3 rounded-2xl">
        <div v-for="quad in quads" :key="quad.key" :class="['rounded-xl p-4 space-y-2', quad.bg]">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-2xl">{{ quad.emoji }}</span>
            <div>
              <h3 class="font-bold" :class="quad.titleColor">{{ quad.label }}</h3>
              <p class="text-xs opacity-70">{{ quad.hint }}</p>
            </div>
          </div>
          <div v-for="(item, i) in items[quad.key]" :key="i" class="flex items-center gap-2">
            <span class="text-xs opacity-50">{{ i+1 }}.</span>
            <input v-model="items[quad.key][i]" class="flex-1 bg-white/70 rounded-lg px-3 py-1.5 text-sm border border-transparent focus:border-current/30 outline-none" />
            <button @click="items[quad.key].splice(i,1)" class="opacity-30 hover:opacity-70 text-xs">✕</button>
          </div>
          <button @click="items[quad.key].push('')" class="text-xs opacity-50 hover:opacity-80 transition-opacity">+ 添加</button>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import ToolLayout from '@/components/common/ToolLayout.vue'

const title = ref('产品战略分析')
const items = ref({
  S: ['用户体验出色', '技术团队强'],
  W: ['市场推广薄弱', '资金有限'],
  O: ['行业快速增长', '竞品功能单一'],
  T: ['大厂入局威胁', '用户获取成本上升'],
})

const quads = [
  { key: 'S', label: '优势 Strengths', hint: '内部积极因素', emoji: '💪', bg: 'bg-green-50', titleColor: 'text-green-700' },
  { key: 'W', label: '劣势 Weaknesses', hint: '内部消极因素', emoji: '⚠️', bg: 'bg-red-50', titleColor: 'text-red-700' },
  { key: 'O', label: '机会 Opportunities', hint: '外部积极因素', emoji: '🌟', bg: 'bg-blue-50', titleColor: 'text-blue-700' },
  { key: 'T', label: '威胁 Threats', hint: '外部消极因素', emoji: '⚡', bg: 'bg-orange-50', titleColor: 'text-orange-700' },
]

async function exportImg() {
  const { default: html2canvas } = await import('html2canvas')
  const el = document.getElementById('swot-board')
  const canvas = await html2canvas(el, { useCORS: true, backgroundColor: '#f1f5f9' })
  const link = document.createElement('a')
  link.download = 'swot.png'; link.href = canvas.toDataURL('image/png'); link.click()
}
</script>
<style scoped>
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400; }
.btn-secondary { @apply px-4 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-indigo-400 hover:text-indigo-600 transition-colors; }
</style>
