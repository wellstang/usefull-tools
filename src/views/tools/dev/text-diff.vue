<template>
  <ToolLayout title="文本 Diff 对比" description="两段文本对比，逐行高亮新增与删除差异" category="dev">
    <div class="space-y-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label class="label">原文本</label>
          <textarea v-model="left" placeholder="原始内容..." class="textarea h-48 font-mono text-sm mt-1" spellcheck="false" />
        </div>
        <div>
          <label class="label">新文本</label>
          <textarea v-model="right" placeholder="修改后内容..." class="textarea h-48 font-mono text-sm mt-1" spellcheck="false" />
        </div>
      </div>

      <div v-if="diffResult.length" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span class="text-sm font-medium text-gray-700">对比结果</span>
          <div class="flex gap-4 text-xs">
            <span class="text-green-600">+ 新增 {{ addCount }} 行</span>
            <span class="text-red-500">- 删除 {{ removeCount }} 行</span>
          </div>
        </div>
        <div class="overflow-x-auto">
          <div v-for="(part, i) in diffResult" :key="i"
            :class="['px-4 py-1 font-mono text-sm whitespace-pre-wrap',
              part.added ? 'bg-green-50 text-green-800' :
              part.removed ? 'bg-red-50 text-red-700 line-through opacity-75' :
              'text-gray-600']">
            <span class="select-none mr-2 opacity-50">{{ part.added ? '+' : part.removed ? '-' : ' ' }}</span>{{ part.value }}
          </div>
        </div>
      </div>

      <div v-else-if="left && right" class="text-center py-8 text-green-600 bg-green-50 rounded-xl border border-green-200">
        ✅ 两段文本完全相同
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { diffLines } from 'diff'
import ToolLayout from '@/components/common/ToolLayout.vue'

const left = ref('')
const right = ref('')

const diffResult = computed(() => {
  if (!left.value && !right.value) return []
  return diffLines(left.value, right.value)
})

const addCount = computed(() => diffResult.value.filter(p => p.added).reduce((s, p) => s + (p.count || 1), 0))
const removeCount = computed(() => diffResult.value.filter(p => p.removed).reduce((s, p) => s + (p.count || 1), 0))
</script>
<style scoped>
.label { @apply text-sm font-medium text-gray-700; }
.textarea { @apply w-full rounded-xl border border-gray-200 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent; }
</style>
