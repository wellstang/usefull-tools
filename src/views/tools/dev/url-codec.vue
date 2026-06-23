<template>
  <ToolLayout title="URL 编解码" description="URL 编码与解码转换" category="dev">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <label class="label">输入内容</label>
        <textarea v-model="input" placeholder="输入 URL 或文本..." class="textarea h-48 font-mono text-sm mt-1" spellcheck="false" />
      </div>
      <div>
        <div class="flex items-center justify-between mb-1">
          <label class="label">输出结果</label>
          <CopyButton v-if="output" :text="output" />
        </div>
        <textarea v-model="output" readonly class="textarea h-48 font-mono text-sm bg-gray-50" />
      </div>
    </div>
    <div class="flex gap-3 mt-4">
      <button @click="encode('component')" class="btn-primary">编码（组件）</button>
      <button @click="encode('full')" class="btn-secondary">编码（完整 URL）</button>
      <button @click="decode" class="btn-secondary">解码</button>
      <button @click="input='';output=''" class="btn-ghost">清空</button>
    </div>
    <p class="text-xs text-gray-400 mt-2">组件编码：对 URL 的一个参数值编码（encodeURIComponent）；完整 URL：对整个 URL 编码保留协议和路径（encodeURI）</p>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '@/components/common/ToolLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'

const input = ref('')
const output = ref('')

function encode(mode) {
  try { output.value = mode === 'component' ? encodeURIComponent(input.value) : encodeURI(input.value) }
  catch (e) { output.value = '错误：' + e.message }
}
function decode() {
  try { output.value = decodeURIComponent(input.value) }
  catch { try { output.value = decodeURI(input.value) } catch (e) { output.value = '错误：' + e.message } }
}
</script>
<style scoped>
.label { @apply text-sm font-medium text-gray-700; }
.btn-primary { @apply px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors; }
.btn-secondary { @apply px-4 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-indigo-400 hover:text-indigo-600 transition-colors; }
.btn-ghost { @apply px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors; }
.textarea { @apply w-full rounded-xl border border-gray-200 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent; }
</style>
