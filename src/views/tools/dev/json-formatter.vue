<template>
  <ToolLayout title="JSON 格式化" description="在线美化、压缩、校验 JSON 数据" category="dev">
    <div class="space-y-3">
      <!-- 工具栏 -->
      <div class="flex flex-wrap items-center gap-2">
        <button @click="format" class="btn-primary">美化</button>
        <button @click="minify" class="btn-secondary">压缩</button>
        <button @click="input = ''; output = ''; error = ''" class="btn-ghost">清空</button>
        <div class="flex items-center gap-2 ml-auto">
          <label class="text-sm text-gray-500">缩进：</label>
          <select v-model="indent" class="input-sm">
            <option :value="2">2 空格</option>
            <option :value="4">4 空格</option>
            <option :value="'\t'">Tab</option>
          </select>
          <button v-if="output && !error" @click="exportFile" class="btn-secondary text-xs">导出 .json</button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- 输入 -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">输入 JSON</label>
          <textarea
            v-model="input"
            @input="autoFormat"
            placeholder='{"name": "唐唐工具箱", "version": "1.0"}'
            class="textarea h-96 font-mono text-sm"
            spellcheck="false"
          />
        </div>

        <!-- 输出 -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700">输出结果</label>
            <CopyButton v-if="output && !error" :text="output" />
          </div>
          <div v-if="error" class="h-96 bg-red-50 border border-red-200 rounded-xl p-4 font-mono text-sm text-red-600 overflow-auto whitespace-pre-wrap">
            ❌ {{ error }}
          </div>
          <textarea
            v-else
            v-model="output"
            readonly
            class="textarea h-96 font-mono text-sm bg-gray-50"
            spellcheck="false"
          />
        </div>
      </div>

      <!-- 统计信息 -->
      <div v-if="output && !error" class="flex gap-4 text-xs text-gray-400">
        <span>节点数：{{ nodeCount }}</span>
        <span>压缩大小：{{ compressedSize }}</span>
        <span>美化大小：{{ formattedSize }}</span>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import ToolLayout from '@/components/common/ToolLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'

const input = ref('')
const output = ref('')
const error = ref('')
const indent = ref(2)

let autoFormatTimer = null

function parse() {
  error.value = ''
  try {
    return JSON.parse(input.value)
  } catch (e) {
    error.value = e.message
    return null
  }
}

function format() {
  const data = parse()
  if (data !== null) output.value = JSON.stringify(data, null, indent.value)
}

function minify() {
  const data = parse()
  if (data !== null) output.value = JSON.stringify(data)
}

function autoFormat() {
  clearTimeout(autoFormatTimer)
  if (!input.value.trim()) { output.value = ''; error.value = ''; return }
  autoFormatTimer = setTimeout(() => format(), 400)
}

// 重新格式化当输出已有内容但缩进变更
watch(indent, () => { if (output.value && !error.value) format() })

function countNodes(obj) {
  if (obj === null || typeof obj !== 'object') return 1
  const values = Object.values(obj)
  return 1 + values.reduce((sum, v) => sum + countNodes(v), 0)
}

const nodeCount = computed(() => {
  if (!output.value || error.value) return 0
  try { return countNodes(JSON.parse(input.value)) } catch { return 0 }
})

const compressedSize = computed(() => {
  if (!output.value || error.value) return ''
  try {
    const bytes = new TextEncoder().encode(JSON.stringify(JSON.parse(input.value))).length
    return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`
  } catch { return '' }
})

const formattedSize = computed(() => {
  if (!output.value || error.value) return ''
  const bytes = new TextEncoder().encode(output.value).length
  return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`
})

function exportFile() {
  const blob = new Blob([output.value], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'data.json'
  a.click()
  URL.revokeObjectURL(a.href)
}
</script>

<style scoped>
.btn-primary { @apply px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors; }
.btn-secondary { @apply px-3 py-1.5 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-indigo-400 hover:text-indigo-600 transition-colors; }
.btn-ghost { @apply px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors; }
.textarea { @apply w-full rounded-xl border border-gray-200 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent; }
.input-sm { @apply border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400; }
</style>
