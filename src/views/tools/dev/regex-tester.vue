<template>
  <ToolLayout title="正则表达式测试" description="实时测试正则表达式，高亮匹配结果与捕获组，支持替换模式" category="dev">
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
          <div class="flex items-center gap-3">
            <span :class="['text-sm font-medium', error ? 'text-red-500' : matchCount > 0 ? 'text-green-600' : 'text-gray-400']">
              {{ error ? '无效正则' : matchCount > 0 ? `${matchCount} 个匹配` : '无匹配' }}
            </span>
            <!-- 模式切换 -->
            <div class="flex gap-1">
              <button @click="mode='match'" :class="['px-2.5 py-1 text-xs rounded-lg transition-colors', mode==='match' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600']">匹配</button>
              <button @click="mode='replace'" :class="['px-2.5 py-1 text-xs rounded-lg transition-colors', mode==='replace' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600']">替换</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 替换模式输入框 -->
      <div v-if="mode === 'replace'" class="card">
        <label class="text-sm font-medium text-gray-700 mb-2 block">替换为</label>
        <input v-model="replacement" placeholder="替换字符串（支持 $1 $2 等引用捕获组）" class="input w-full font-mono" spellcheck="false" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- 测试文本 -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">测试文本</label>
          <textarea v-model="testText" placeholder="输入要测试的文本..." class="textarea h-64 font-mono text-sm" />
        </div>

        <!-- 匹配详情 / 替换结果 -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700">{{ mode === 'match' ? '匹配详情' : '替换结果' }}</label>
            <CopyButton v-if="mode === 'replace' && replacedText" :text="replacedText" />
          </div>
          <div class="h-64 rounded-xl border border-gray-200 p-4 overflow-auto bg-gray-50 font-mono text-sm">
            <!-- 替换模式 -->
            <template v-if="mode === 'replace'">
              <div v-if="error" class="text-red-500">❌ {{ error }}</div>
              <div v-else-if="!pattern" class="text-gray-400">请输入正则表达式</div>
              <div v-else class="whitespace-pre-wrap break-all text-gray-800">{{ replacedText }}</div>
            </template>
            <!-- 匹配模式 -->
            <template v-else>
              <div v-if="error" class="text-red-500">❌ {{ error }}</div>
              <div v-else-if="matches.length === 0" class="text-gray-400">无匹配</div>
              <div v-else>
                <div v-for="(m, i) in matches" :key="i" class="mb-3 p-2 bg-white rounded-lg border border-gray-200">
                  <div class="text-indigo-600 font-medium">匹配 {{ i + 1 }}：「{{ m[0] }}」</div>
                  <div v-if="m.length > 1" class="mt-1 text-xs text-gray-500">
                    <span v-for="(g, gi) in m.slice(1)" :key="gi" class="mr-2">
                      捕获组{{ gi + 1 }}：{{ g ?? '未匹配' }}
                    </span>
                  </div>
                  <div class="text-xs text-gray-400 mt-1">位置：{{ m.index }}–{{ m.index + m[0].length }}</div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- 高亮预览（匹配模式） -->
      <div v-if="mode === 'match' && highlighted" class="card">
        <label class="text-sm font-medium text-gray-700 mb-2 block">高亮预览</label>
        <div class="font-mono text-sm leading-relaxed whitespace-pre-wrap break-all" v-html="highlighted" />
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '@/components/common/ToolLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'

const pattern = ref('')
const flags = ref(['g'])
const testText = ref('Hello World\nhello world\n你好世界')
const error = ref('')
const mode = ref('match')
const replacement = ref('')

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

const replacedText = computed(() => {
  if (!pattern.value || !testText.value) return testText.value
  error.value = ''
  try {
    const re = new RegExp(pattern.value, flagStr.value.includes('g') ? flagStr.value : flagStr.value + 'g')
    return testText.value.replace(re, replacement.value)
  } catch (e) {
    error.value = e.message
    return testText.value
  }
})
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-5; }
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent; }
.textarea { @apply w-full rounded-xl border border-gray-200 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent; }
</style>
