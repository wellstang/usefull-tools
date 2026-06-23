<template>
  <ToolLayout title="HTML 字符转义" description="HTML 特殊字符编码与解码（&amp;amp; &amp;lt; &amp;gt; 等）" category="dev">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <label class="label">输入内容</label>
        <textarea v-model="input" placeholder='<div class="hello">你好 & 世界</div>' class="textarea h-64 font-mono text-sm mt-1" spellcheck="false" />
      </div>
      <div>
        <div class="flex items-center justify-between mb-1">
          <label class="label">输出结果</label>
          <CopyButton v-if="output" :text="output" />
        </div>
        <textarea v-model="output" readonly class="textarea h-64 font-mono text-sm bg-gray-50" />
      </div>
    </div>
    <div class="flex gap-3 mt-4">
      <button @click="escape_" class="btn-primary">转义（HTML 实体）</button>
      <button @click="unescape_" class="btn-secondary">反转义</button>
      <button @click="input='';output=''" class="btn-ghost">清空</button>
    </div>
    <div class="mt-4 bg-gray-50 rounded-xl p-4">
      <p class="text-xs text-gray-500 font-medium mb-2">常用转义对照</p>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div v-for="pair in charMap" :key="pair[0]" class="flex items-center gap-2 text-gray-600">
          <span class="text-gray-800">{{ pair[0] }}</span>
          <span class="text-gray-400">→</span>
          <span>{{ pair[1] }}</span>
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

const charMap = [['&','&amp;'],['<','&lt;'],['>','&gt;'],['"','&quot;'],["'",'&#39;'],['©','&copy;'],['®','&reg;'],[' ','&nbsp;']]
const escapeMap = Object.fromEntries(charMap)
const unescapeMap = Object.fromEntries(charMap.map(([k,v])=>[v,k]))

function escape_() {
  output.value = input.value.replace(/[&<>"' ©®]/g, c => escapeMap[c] || c)
}
function unescape_() {
  output.value = input.value.replace(/&[a-z#0-9]+;/gi, e => unescapeMap[e] || e)
}
</script>
<style scoped>
.label { @apply text-sm font-medium text-gray-700; }
.btn-primary { @apply px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors; }
.btn-secondary { @apply px-4 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-indigo-400 hover:text-indigo-600 transition-colors; }
.btn-ghost { @apply px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors; }
.textarea { @apply w-full rounded-xl border border-gray-200 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent; }
</style>
