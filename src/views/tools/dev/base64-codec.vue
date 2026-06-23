<template>
  <ToolLayout title="Base64 编解码" description="文本与 Base64 互相编解码，支持中文" category="dev">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="flex flex-col gap-4">
        <div>
          <label class="label">输入内容</label>
          <textarea v-model="input" placeholder="输入要编码/解码的内容..." class="textarea h-48 font-mono text-sm mt-1" spellcheck="false" />
        </div>
        <div class="flex gap-3">
          <button @click="encode" class="btn-primary flex-1">编码 → Base64</button>
          <button @click="decode" class="btn-secondary flex-1">解码 ← Base64</button>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <label class="label">输出结果</label>
          <CopyButton v-if="output && !error" :text="output" />
        </div>
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600 mt-1">❌ {{ error }}</div>
        <textarea v-else v-model="output" readonly class="textarea h-48 font-mono text-sm bg-gray-50 mt-1" />
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

function encode() {
  error.value = ''
  try { output.value = btoa(unescape(encodeURIComponent(input.value))) }
  catch (e) { error.value = e.message }
}
function decode() {
  error.value = ''
  try { output.value = decodeURIComponent(escape(atob(input.value.trim()))) }
  catch (e) { error.value = '无效的 Base64 字符串：' + e.message }
}
</script>
<style scoped>
.label { @apply text-sm font-medium text-gray-700; }
.btn-primary { @apply px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors; }
.btn-secondary { @apply px-4 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-indigo-400 hover:text-indigo-600 transition-colors; }
.textarea { @apply w-full rounded-xl border border-gray-200 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent; }
</style>
