<template>
  <ToolLayout title="JSON 格式化" description="在线美化、压缩、校验 JSON 数据" category="dev">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- 输入 -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-gray-700">输入 JSON</label>
          <div class="flex gap-2">
            <button @click="format" class="btn-primary">美化</button>
            <button @click="minify" class="btn-secondary">压缩</button>
            <button @click="input = ''" class="btn-ghost">清空</button>
          </div>
        </div>
        <textarea
          v-model="input"
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
        <div v-if="error" class="h-96 bg-red-50 border border-red-200 rounded-xl p-4 font-mono text-sm text-red-600 overflow-auto">
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
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '@/components/common/ToolLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'

const input = ref('')
const output = ref('')
const error = ref('')

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
  if (data !== null) output.value = JSON.stringify(data, null, 2)
}

function minify() {
  const data = parse()
  if (data !== null) output.value = JSON.stringify(data)
}
</script>

<style scoped>
.btn-primary { @apply px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors; }
.btn-secondary { @apply px-3 py-1.5 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-indigo-400 hover:text-indigo-600 transition-colors; }
.btn-ghost { @apply px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors; }
.textarea { @apply w-full rounded-xl border border-gray-200 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent; }
</style>
