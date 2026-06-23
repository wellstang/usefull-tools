<template>
  <ToolLayout title="JSON / YAML / CSV 互转" description="三种数据格式任意互相转换" category="dev">
    <div class="space-y-4">
      <div class="flex flex-wrap gap-4 items-end bg-white rounded-xl border border-gray-200 p-4">
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">源格式</label>
          <select v-model="srcFmt" class="input">
            <option value="json">JSON</option>
            <option value="yaml">YAML</option>
            <option value="csv">CSV</option>
          </select>
        </div>
        <Icon icon="mdi:arrow-right" class="text-gray-400 text-xl" />
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">目标格式</label>
          <select v-model="dstFmt" class="input">
            <option value="json">JSON</option>
            <option value="yaml">YAML</option>
            <option value="csv">CSV</option>
          </select>
        </div>
        <button @click="convert" class="btn-primary">转换</button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label class="label">输入（{{ srcFmt.toUpperCase() }}）</label>
          <textarea v-model="input" class="textarea h-64 font-mono text-sm mt-1" spellcheck="false" />
        </div>
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="label">输出（{{ dstFmt.toUpperCase() }}）</label>
            <CopyButton v-if="output && !error" :text="output" />
          </div>
          <div v-if="error" class="h-64 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">❌ {{ error }}</div>
          <textarea v-else v-model="output" readonly class="textarea h-64 font-mono text-sm bg-gray-50" />
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import yaml from 'js-yaml'
import Papa from 'papaparse'
import ToolLayout from '@/components/common/ToolLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'

const srcFmt = ref('json')
const dstFmt = ref('yaml')
const input = ref('')
const output = ref('')
const error = ref('')

function parse(text, fmt) {
  if (fmt === 'json') return JSON.parse(text)
  if (fmt === 'yaml') return yaml.load(text)
  if (fmt === 'csv') {
    const { data } = Papa.parse(text.trim(), { header: true, skipEmptyLines: true })
    return data
  }
}

function stringify(data, fmt) {
  if (fmt === 'json') return JSON.stringify(data, null, 2)
  if (fmt === 'yaml') return yaml.dump(data)
  if (fmt === 'csv') return Papa.unparse(data)
}

function convert() {
  error.value = ''
  try {
    const data = parse(input.value, srcFmt.value)
    output.value = stringify(data, dstFmt.value)
  } catch (e) {
    error.value = e.message
    output.value = ''
  }
}
</script>
<style scoped>
.label { @apply text-sm font-medium text-gray-700; }
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400; }
.btn-primary { @apply px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors; }
.textarea { @apply w-full rounded-xl border border-gray-200 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent; }
</style>
