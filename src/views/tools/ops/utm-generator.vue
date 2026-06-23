<template>
  <ToolLayout title="UTM 参数生成器" description="快速构建营销追踪链接，支持批量生成多渠道" category="ops">
    <div class="max-w-2xl space-y-5">
      <div class="card space-y-4">
        <div><label class="label">目标 URL *</label><input v-model="url" class="input w-full mt-1" placeholder="https://example.com/landing" /></div>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="label">utm_source（来源）*</label><input v-model="params.source" class="input w-full mt-1" placeholder="wechat / weibo / email" /></div>
          <div><label class="label">utm_medium（媒介）</label><input v-model="params.medium" class="input w-full mt-1" placeholder="cpc / organic / post" /></div>
          <div><label class="label">utm_campaign（活动）</label><input v-model="params.campaign" class="input w-full mt-1" placeholder="summer-2026" /></div>
          <div><label class="label">utm_content（内容）</label><input v-model="params.content" class="input w-full mt-1" placeholder="banner-top" /></div>
          <div class="col-span-2"><label class="label">utm_term（关键词）</label><input v-model="params.term" class="input w-full mt-1" placeholder="产品功能" /></div>
        </div>
      </div>

      <div v-if="result" class="card">
        <div class="flex items-center justify-between mb-3">
          <label class="label">生成链接</label>
          <CopyButton :text="result" />
        </div>
        <div class="bg-gray-50 rounded-xl p-3 font-mono text-xs text-indigo-700 break-all">{{ result }}</div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '@/components/common/ToolLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'

const url = ref('https://example.com')
const params = ref({ source: '', medium: '', campaign: '', content: '', term: '' })

const result = computed(() => {
  if (!url.value || !params.value.source) return ''
  const u = new URL(url.value.startsWith('http') ? url.value : 'https://' + url.value)
  if (params.value.source) u.searchParams.set('utm_source', params.value.source)
  if (params.value.medium) u.searchParams.set('utm_medium', params.value.medium)
  if (params.value.campaign) u.searchParams.set('utm_campaign', params.value.campaign)
  if (params.value.content) u.searchParams.set('utm_content', params.value.content)
  if (params.value.term) u.searchParams.set('utm_term', params.value.term)
  return u.toString()
})
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-5; }
.label { @apply text-sm font-medium text-gray-700; }
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400; }
</style>
