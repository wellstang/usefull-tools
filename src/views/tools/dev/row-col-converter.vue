<template>
  <ToolLayout title="行列转换" description="表格数据行转列、列转行，支持自定义分隔符" category="dev">
    <div class="space-y-4">
      <div class="flex flex-wrap gap-4 items-center bg-white rounded-xl border border-gray-200 p-4">
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">列分隔符</label>
          <select v-model="delimiter" class="input text-sm">
            <option value="\t">Tab</option>
            <option value=",">逗号 ,</option>
            <option value="|">竖线 |</option>
            <option value=" ">空格</option>
          </select>
        </div>
        <div class="flex gap-2">
          <button @click="transpose" class="btn-primary">行列转换</button>
          <button @click="input='';output=''" class="btn-ghost">清空</button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label class="label">输入数据</label>
          <textarea v-model="input" placeholder="粘贴表格数据（可从 Excel/Google Sheets 直接复制）" class="textarea h-72 font-mono text-sm mt-1" spellcheck="false" />
        </div>
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="label">转换结果</label>
            <CopyButton v-if="output" :text="output" />
          </div>
          <textarea v-model="output" readonly class="textarea h-72 font-mono text-sm bg-gray-50" />
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '@/components/common/ToolLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'

const input = ref('')
const output = ref('')
const delimiter = ref('\t')

function transpose() {
  const rows = input.value.split('\n').filter(r => r.trim())
  const matrix = rows.map(r => r.split(delimiter.value))
  const maxCols = Math.max(...matrix.map(r => r.length))
  const transposed = Array.from({ length: maxCols }, (_, c) =>
    matrix.map(row => row[c] ?? '').join(delimiter.value)
  )
  output.value = transposed.join('\n')
}
</script>
<style scoped>
.label { @apply text-sm font-medium text-gray-700; }
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400; }
.btn-primary { @apply px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors; }
.btn-ghost { @apply px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors; }
.textarea { @apply w-full rounded-xl border border-gray-200 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent; }
</style>
