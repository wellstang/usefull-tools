<template>
  <ToolLayout title="文本统计分析" description="实时统计字数/词频，并展示各平台字数限制对比" category="ops">
    <div class="max-w-2xl space-y-5">
      <textarea v-model="text" placeholder="在这里输入文案内容..." class="textarea h-40" />

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div v-for="s in stats" :key="s.label" class="card text-center">
          <div class="text-2xl font-bold text-indigo-700">{{ s.value }}</div>
          <div class="text-xs text-gray-500 mt-1">{{ s.label }}</div>
        </div>
      </div>

      <!-- 词频分析 -->
      <div v-if="text.trim()" class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gray-800">词频分析 Top 20</h3>
          <div class="flex gap-2">
            <button @click="freqMode='zh'" :class="['px-3 py-1 text-xs rounded-lg transition-colors', freqMode==='zh' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']">中文字</button>
            <button @click="freqMode='en'" :class="['px-3 py-1 text-xs rounded-lg transition-colors', freqMode==='en' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']">英文词</button>
          </div>
        </div>
        <div v-if="topFreq.length === 0" class="text-gray-400 text-sm text-center py-4">
          {{ freqMode === 'zh' ? '没有检测到中文字符' : '没有检测到英文单词' }}
        </div>
        <div v-else class="space-y-2">
          <div v-for="item in topFreq" :key="item.word" class="flex items-center gap-3">
            <span class="text-sm font-mono text-gray-700 w-20 shrink-0 truncate">{{ item.word }}</span>
            <div class="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
              <div class="h-full bg-indigo-400 rounded-full transition-all duration-300"
                :style="{ width: (item.count / topFreq[0].count * 100) + '%' }" />
            </div>
            <span class="text-xs font-mono text-gray-500 w-8 text-right">{{ item.count }}</span>
          </div>
        </div>
      </div>

      <!-- 平台限制 -->
      <div class="card">
        <h3 class="font-semibold text-gray-800 mb-4">平台字数限制对比</h3>
        <div class="space-y-2">
          <div v-for="p in platforms" :key="p.name" class="flex items-center gap-3">
            <span class="text-sm text-gray-600 w-24 shrink-0">{{ p.name }}</span>
            <div class="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
              <div :class="['h-full rounded-full transition-all duration-500', charCount > p.limit ? 'bg-red-400' : 'bg-indigo-400']"
                :style="{ width: Math.min(charCount / p.limit * 100, 100) + '%' }" />
            </div>
            <span :class="['text-xs w-16 text-right font-mono', charCount > p.limit ? 'text-red-500' : 'text-gray-500']">
              {{ charCount }}/{{ p.limit }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '@/components/common/ToolLayout.vue'
import { countChars, countWords } from '@/utils/textStats.js'

const text = ref('')
const freqMode = ref('zh')
const charCount = computed(() => text.value.length)

const stats = computed(() => {
  const { total, noSpace } = countChars(text.value)
  const { en, zh } = countWords(text.value)
  return [
    { label: '总字符', value: total },
    { label: '中文字数', value: zh },
    { label: '英文单词', value: en },
    { label: '不含空格', value: noSpace },
  ]
})

const topFreq = computed(() => {
  if (!text.value.trim()) return []
  const map = new Map()
  if (freqMode.value === 'zh') {
    // 统计中文字符频率
    const zhChars = text.value.match(/[\u4e00-\u9fa5]/g) || []
    zhChars.forEach(c => map.set(c, (map.get(c) || 0) + 1))
  } else {
    // 统计英文单词频率（忽略大小写）
    const words = text.value.toLowerCase().match(/[a-z]{2,}/g) || []
    words.forEach(w => map.set(w, (map.get(w) || 0) + 1))
  }
  return Array.from(map.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)
})

const platforms = [
  { name: '微信文章标题', limit: 64 },
  { name: '微博', limit: 140 },
  { name: '小红书标题', limit: 20 },
  { name: '小红书正文', limit: 1000 },
  { name: 'Twitter/X', limit: 280 },
  { name: '抖音简介', limit: 80 },
]
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-4; }
.textarea { @apply w-full rounded-xl border border-gray-200 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm; }
</style>
