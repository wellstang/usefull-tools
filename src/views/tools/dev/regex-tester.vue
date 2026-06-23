<template>
  <ToolLayout title="正则表达式测试" description="实时测试正则表达式，高亮匹配结果与捕获组" category="dev">
    <div class="space-y-4">
      <!-- 正则输入 -->
      <div class="card">
        <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div class="flex items-center gap-2 flex-1">
            <span class="text-gray-400 font-mono text-lg">/</span>
            <input v-model="pattern" placeholder="正则表达式" class="input flex-1 font-mono" spellcheck="false" />
            <span class="text-gray-400 font-mono text-lg">/</span>
          </div>
          <div class="flex gap-2 flex-wrap">
            <label v-for="f in ['g','i','m','s']" :key="f" class="flex items-center gap-1 cursor-pointer">
              <input type="checkbox" v-model="flags" :value="f" class="rounded" />
              <span class="text-sm font-mono text-gray-600">{{ f }}</span>
            </label>
          </div>
          <div class="flex items-center gap-2">
            <span :class="['text-sm font-medium', error ? 'text-red-500' : matchCount > 0 ? 'text-green-600' : 'text-gray-400']">
              {{ error ? '无效正则' : matchCount > 0 ? `${matchCount} 个匹配` : '无匹配' }}
            </span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- 测试文本 -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">测试文本</label>
          <div class="relative">
            <textarea v-model="testText" placeholder="输入要测试的文本..." class="textarea h-64 font-mono text-sm" />
          </div>
        </div>

        <!-- 匹配结果 -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">匹配结果</label>
          <div class="h-64 rounded-xl border border-gray-200 p-4 overflow-auto bg-gray-50 font-mono text-sm">
            <div v-if="error" class="text-red-500">❌ {{ error }}</div>
            <div v-else-if="matches.length === 0" class="text-gray-400">无匹配</div>
            <div v-else>
              <div v-for="(m, i) in matches" :key="i" class="mb-3 p-2 bg-white rounded-lg border border-gray-200">
                <div class="text-indigo-600 font-medium">匹配 {{ i + 1 }}：「{{ m[0] }}」</div>
                <div v-if="m.length > 1" class="mt-1 text-xs text-gray-500">
                  <span v-for="(g, gi) in m.slice(1)" :key="gi" class="mr-2">捕获组{{ gi + 1 }}：{{ g ?? 'undefined' }}</span>
                </div>
                <div class="text-xs text-gray-400 mt-1">位置：{{ m.index }}–{{ m.index + m[0].length }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 高亮预览 -->
      <div v-if="highlighted" class="card">
        <label class="text-sm font-medium text-gray-700 mb-2 block">高亮预览</label>
        <div class="font-mono text-sm leading-relaxed whitespace-pre-wrap break-all" v-html="highlighted" />
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '@/components/common/ToolLayout.vue'

const pattern = ref('')
const flags = ref(['g'])
const testText = ref('Hello World\nhello world\n你好世界')
const error = ref('')

const flagStr = computed(() => flags.value.join(''))

const { matches, matchCount, highlighted } = (() => {
  const matches = computed(() => {
    if (!pattern.value) return []
    error.value = ''
    try {
      const re = new RegExp(pattern.value, flagStr.value.includes('g') ? flagStr.value : flagStr.value + 'g')
      return [...testText.value.matchAll(re)]
    } catch (e) {
      error.value = e.message
      return []
    }
  })
  const matchCount = computed(() => matches.value.length)
  const highlighted = computed(() => {
    if (!pattern.value || matches.value.length === 0) return ''
    try {
      const re = new RegExp(pattern.value, flagStr.value.includes('g') ? flagStr.value : flagStr.value + 'g')
      return testText.value.replace(/[<>&"]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]))
        .replace(re, m => `<mark class="bg-yellow-200 rounded px-0.5">${m}</mark>`)
    } catch { return '' }
  })
  return { matches, matchCount, highlighted }
})()
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-5; }
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent; }
.textarea { @apply w-full rounded-xl border border-gray-200 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent; }
</style>
