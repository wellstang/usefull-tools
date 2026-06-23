<template>
  <ToolLayout title="文本统计" description="实时统计字符数、单词数、行数和段落数" category="life">
    <div class="max-w-2xl space-y-4">
      <textarea v-model="text" placeholder="在这里输入或粘贴文本..." class="w-full rounded-xl border border-gray-200 p-4 h-48 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none" />
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div v-for="s in stats" :key="s.label" class="card text-center">
          <div class="text-2xl font-bold text-indigo-700">{{ s.value }}</div>
          <div class="text-xs text-gray-500 mt-1">{{ s.label }}</div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '@/components/common/ToolLayout.vue'
import { countChars, countChinese, countWords, countLines, countParagraphs } from '@/utils/textStats.js'

const text = ref('')

const stats = computed(() => {
  const { total, noSpace } = countChars(text.value)
  const { en, zh } = countWords(text.value)
  return [
    { label: '字符（含空格）', value: total },
    { label: '字符（不含空格）', value: noSpace },
    { label: '中文字数', value: zh },
    { label: '英文单词', value: en },
    { label: '行数', value: countLines(text.value) },
    { label: '段落数', value: countParagraphs(text.value) },
  ]
})
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-4; }
</style>
