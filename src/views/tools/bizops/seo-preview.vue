<template>
  <ToolLayout title="SEO 搜索结果预览" description="模拟 Google/Bing 搜索结果片段，实时检查标题和描述" category="ops">
    <div class="max-w-2xl space-y-5">
      <div class="card space-y-4">
        <div>
          <div class="flex items-center justify-between"><label class="label">页面标题</label><span :class="['text-xs', titleLen>60?'text-red-500':'text-gray-400']">{{ titleLen }}/60</span></div>
          <input v-model="title" class="input w-full mt-1" placeholder="页面标题，建议 30-60 字符" />
        </div>
        <div>
          <div class="flex items-center justify-between"><label class="label">Meta 描述</label><span :class="['text-xs', descLen>160?'text-red-500':'text-gray-400']">{{ descLen }}/160</span></div>
          <textarea v-model="description" class="textarea mt-1 h-24" placeholder="页面描述，建议 80-160 字符" />
        </div>
        <div>
          <label class="label">URL</label>
          <input v-model="pageUrl" class="input w-full mt-1" placeholder="https://example.com/page" />
        </div>
      </div>

      <!-- Google 预览 -->
      <div class="card">
        <div class="flex items-center gap-2 mb-4">
          <Icon icon="mdi:google" class="text-2xl" />
          <span class="font-semibold text-gray-700">Google 预览</span>
        </div>
        <div class="space-y-0.5">
          <div class="text-xs text-gray-500">{{ displayUrl || 'https://example.com › page' }}</div>
          <div class="text-lg text-blue-700 hover:underline cursor-pointer">{{ truncate(title || '页面标题', 60) || '页面标题' }}</div>
          <div class="text-sm text-gray-600 leading-5">{{ truncate(description || '页面描述将显示在这里...', 160) }}</div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import ToolLayout from '@/components/common/ToolLayout.vue'

const title = ref('唐唐工具箱 — 一站式效率工具集合')
const description = ref('48 个免费在线工具，覆盖产品、运营、研发、设计、生活场景。所有工具在浏览器本地运行，零数据上传。')
const pageUrl = ref('https://wellstang.github.io/usefull-tools/')

const titleLen = computed(() => title.value.length)
const descLen = computed(() => description.value.length)
const displayUrl = computed(() => {
  try { const u = new URL(pageUrl.value); return u.hostname + ' › ' + u.pathname.replace(/\//g, ' › ').slice(2) } catch { return pageUrl.value }
})

function truncate(str, n) { return str.length > n ? str.slice(0, n) + '...' : str }
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-5; }
.label { @apply text-sm font-medium text-gray-700; }
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400; }
.textarea { @apply w-full rounded-xl border border-gray-200 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm; }
</style>
