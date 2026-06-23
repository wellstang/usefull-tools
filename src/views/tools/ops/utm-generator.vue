<template>
  <ToolLayout title="UTM 参数生成器" description="快速构建营销追踪链接，支持批量生成多渠道" category="ops">
    <div class="max-w-3xl space-y-5">
      <!-- 基础配置 -->
      <div class="card space-y-4">
        <div><label class="label">目标 URL *</label><input v-model="url" class="input w-full mt-1" placeholder="https://example.com/landing" /></div>
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2"><label class="label">utm_campaign（活动名称）</label><input v-model="params.campaign" class="input w-full mt-1" placeholder="summer-2026" /></div>
          <div><label class="label">utm_medium（媒介）</label><input v-model="params.medium" class="input w-full mt-1" placeholder="cpc / organic / post" /></div>
          <div><label class="label">utm_content（内容）</label><input v-model="params.content" class="input w-full mt-1" placeholder="banner-top" /></div>
          <div class="col-span-2"><label class="label">utm_term（关键词）</label><input v-model="params.term" class="input w-full mt-1" placeholder="产品功能" /></div>
        </div>
      </div>

      <!-- 模式切换 -->
      <div class="flex gap-2">
        <button @click="mode='single'" :class="['px-4 py-1.5 text-sm rounded-lg transition-colors', mode==='single' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:border-indigo-400']">单条生成</button>
        <button @click="mode='batch'" :class="['px-4 py-1.5 text-sm rounded-lg transition-colors', mode==='batch' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:border-indigo-400']">批量多渠道</button>
      </div>

      <!-- 单条模式 -->
      <div v-if="mode === 'single'">
        <div class="card space-y-3">
          <div><label class="label">utm_source（来源）*</label><input v-model="params.source" class="input w-full mt-1" placeholder="wechat / weibo / email" /></div>
          <div v-if="singleResult" class="flex items-center justify-between">
            <label class="label">生成链接</label>
            <CopyButton :text="singleResult" />
          </div>
          <div v-if="singleResult" class="bg-gray-50 rounded-xl p-3 font-mono text-xs text-indigo-700 break-all">{{ singleResult }}</div>
        </div>
      </div>

      <!-- 批量模式 -->
      <div v-else class="card space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold text-gray-800">渠道列表</h3>
          <button @click="addChannel" class="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            <Icon icon="mdi:plus" /> 添加渠道
          </button>
        </div>
        <div class="space-y-2">
          <div v-for="(ch, i) in channels" :key="i" class="flex gap-2 items-center">
            <input v-model="ch.source" class="input flex-1" placeholder="utm_source（如 wechat）" />
            <input v-model="ch.label" class="input w-28" placeholder="备注（可选）" />
            <button @click="removeChannel(i)" class="text-gray-400 hover:text-red-500 transition-colors p-1">
              <Icon icon="mdi:close" />
            </button>
          </div>
        </div>

        <div v-if="batchResults.length" class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700">生成结果</span>
            <button @click="copyAll" class="text-sm text-indigo-600 hover:text-indigo-700">复制全部</button>
          </div>
          <div v-for="r in batchResults" :key="r.source" class="bg-gray-50 rounded-xl p-3">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-medium text-gray-500">{{ r.label || r.source }}</span>
              <CopyButton :text="r.url" />
            </div>
            <div class="font-mono text-xs text-indigo-700 break-all">{{ r.url }}</div>
          </div>
        </div>

        <button v-if="url && channels.some(c => c.source)" @click="generateBatch" class="btn-primary w-full">批量生成</button>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import ToolLayout from '@/components/common/ToolLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'

const mode = ref('single')
const url = ref('https://example.com')
const params = ref({ source: '', medium: '', campaign: '', content: '', term: '' })

const PRESET_CHANNELS = [
  { source: 'wechat', label: '微信' },
  { source: 'weibo', label: '微博' },
  { source: 'douyin', label: '抖音' },
  { source: 'xiaohongshu', label: '小红书' },
  { source: 'email', label: '邮件' },
  { source: 'zhihu', label: '知乎' },
]
const channels = ref(PRESET_CHANNELS.map(c => ({ ...c })))
const batchResults = ref([])

function buildUrl(source) {
  try {
    const u = new URL(url.value.startsWith('http') ? url.value : 'https://' + url.value)
    if (source) u.searchParams.set('utm_source', source)
    if (params.value.medium) u.searchParams.set('utm_medium', params.value.medium)
    if (params.value.campaign) u.searchParams.set('utm_campaign', params.value.campaign)
    if (params.value.content) u.searchParams.set('utm_content', params.value.content)
    if (params.value.term) u.searchParams.set('utm_term', params.value.term)
    return u.toString()
  } catch { return '' }
}

const singleResult = computed(() => {
  if (!url.value || !params.value.source) return ''
  return buildUrl(params.value.source)
})

function generateBatch() {
  batchResults.value = channels.value
    .filter(c => c.source.trim())
    .map(c => ({ source: c.source, label: c.label, url: buildUrl(c.source) }))
}

function addChannel() {
  channels.value.push({ source: '', label: '' })
}

function removeChannel(i) {
  channels.value.splice(i, 1)
}

async function copyAll() {
  const text = batchResults.value.map(r => `${r.label || r.source}: ${r.url}`).join('\n')
  try { await navigator.clipboard.writeText(text) } catch {}
}
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-5; }
.label { @apply text-sm font-medium text-gray-700; }
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400; }
.btn-primary { @apply px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors; }
</style>
