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
import { countChars, countChinese, countWords } from '@/utils/textStats.js'

const text = ref('')
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
