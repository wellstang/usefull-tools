<template>
  <ToolLayout title="URL 编解码" description="URL 编码与解码转换，支持参数解析" category="dev">
    <!-- 模式切换 -->
    <div class="flex gap-2 mb-4">
      <button @click="mode='codec'" :class="['px-4 py-1.5 text-sm rounded-lg transition-colors', mode==='codec' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:border-indigo-400']">编解码</button>
      <button @click="mode='parse'" :class="['px-4 py-1.5 text-sm rounded-lg transition-colors', mode==='parse' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:border-indigo-400']">URL 参数解析</button>
    </div>

    <!-- 编解码模式 -->
    <div v-if="mode === 'codec'" class="space-y-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label class="label">输入内容</label>
          <textarea v-model="input" @input="onInput" placeholder="输入 URL 或文本..." class="textarea h-48 font-mono text-sm mt-1" spellcheck="false" />
        </div>
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="label">输出结果</label>
            <CopyButton v-if="output" :text="output" />
          </div>
          <textarea v-model="output" readonly class="textarea h-48 font-mono text-sm bg-gray-50" />
        </div>
      </div>
      <div class="flex flex-wrap gap-3">
        <button @click="encode('component')" class="btn-primary">编码（组件）</button>
        <button @click="encode('full')" class="btn-secondary">编码（完整 URL）</button>
        <button @click="decode" class="btn-secondary">解码</button>
        <button @click="input='';output=''" class="btn-ghost">清空</button>
        <div class="flex items-center gap-2 ml-auto">
          <input type="checkbox" id="auto-decode" v-model="autoDetect" class="rounded" />
          <label for="auto-decode" class="text-sm text-gray-600 cursor-pointer">输入时自动解码</label>
        </div>
      </div>
      <p class="text-xs text-gray-400">组件编码：对 URL 的一个参数值编码（encodeURIComponent）；完整 URL：对整个 URL 编码保留协议和路径（encodeURI）</p>
    </div>

    <!-- URL 参数解析模式 -->
    <div v-else class="space-y-4">
      <div>
        <label class="label">输入 URL</label>
        <input v-model="parseUrl" @input="parseParams" placeholder="https://example.com/page?utm_source=wechat&id=123" class="input w-full mt-1 font-mono text-sm" />
      </div>

      <div v-if="parsedBase" class="card space-y-3">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div><span class="text-gray-500 text-xs block mb-0.5">协议</span><span class="font-mono font-medium">{{ parsedBase.protocol }}</span></div>
          <div><span class="text-gray-500 text-xs block mb-0.5">主机</span><span class="font-mono font-medium">{{ parsedBase.host }}</span></div>
          <div><span class="text-gray-500 text-xs block mb-0.5">路径</span><span class="font-mono font-medium">{{ parsedBase.pathname }}</span></div>
        </div>
        <div v-if="parsedBase.hash" class="text-sm">
          <span class="text-gray-500 text-xs block mb-0.5">Hash</span>
          <span class="font-mono font-medium text-indigo-600">{{ parsedBase.hash }}</span>
        </div>
      </div>

      <div v-if="parsedParams.length" class="card">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-gray-800">Query 参数（{{ parsedParams.length }} 个）</h3>
          <button @click="copyParams" class="text-sm text-indigo-600 hover:text-indigo-700">复制为 JSON</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead><tr class="border-b border-gray-100">
              <th class="text-left text-gray-500 font-medium pb-2 pr-4">参数名</th>
              <th class="text-left text-gray-500 font-medium pb-2 pr-4">原始值</th>
              <th class="text-left text-gray-500 font-medium pb-2">解码值</th>
            </tr></thead>
            <tbody>
              <tr v-for="p in parsedParams" :key="p.key" class="border-b border-gray-50 last:border-0">
                <td class="py-2 pr-4 font-mono text-indigo-600 font-medium">{{ p.key }}</td>
                <td class="py-2 pr-4 font-mono text-gray-500 break-all max-w-xs">{{ p.raw }}</td>
                <td class="py-2 font-mono text-gray-800 break-all max-w-xs">{{ p.decoded }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else-if="parseUrl && !parsedBase" class="text-sm text-red-500">无效的 URL 格式</div>
      <div v-else-if="parseUrl && parsedParams.length === 0" class="text-sm text-gray-400">该 URL 没有 Query 参数</div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '@/components/common/ToolLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'

const mode = ref('codec')
const input = ref('')
const output = ref('')
const autoDetect = ref(false)

const parseUrl = ref('')
const parsedBase = ref(null)
const parsedParams = ref([])

function onInput() {
  if (autoDetect.value && input.value) decode()
}

function encode(m) {
  try { output.value = m === 'component' ? encodeURIComponent(input.value) : encodeURI(input.value) }
  catch (e) { output.value = '错误：' + e.message }
}
function decode() {
  try { output.value = decodeURIComponent(input.value) }
  catch { try { output.value = decodeURI(input.value) } catch (e) { output.value = '错误：' + e.message } }
}

function parseParams() {
  parsedBase.value = null
  parsedParams.value = []
  if (!parseUrl.value.trim()) return
  try {
    const urlStr = parseUrl.value.startsWith('http') ? parseUrl.value : 'https://' + parseUrl.value
    const u = new URL(urlStr)
    parsedBase.value = {
      protocol: u.protocol,
      host: u.host,
      pathname: u.pathname,
      hash: u.hash,
    }
    const params = []
    u.searchParams.forEach((value, key) => {
      params.push({ key, raw: value, decoded: decodeURIComponent(value) })
    })
    parsedParams.value = params
  } catch { /* invalid url */ }
}

async function copyParams() {
  const obj = Object.fromEntries(parsedParams.value.map(p => [p.key, p.decoded]))
  try { await navigator.clipboard.writeText(JSON.stringify(obj, null, 2)) } catch {}
}
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-5; }
.label { @apply text-sm font-medium text-gray-700; }
.btn-primary { @apply px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors; }
.btn-secondary { @apply px-4 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-indigo-400 hover:text-indigo-600 transition-colors; }
.btn-ghost { @apply px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors; }
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent; }
.textarea { @apply w-full rounded-xl border border-gray-200 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent; }
</style>
