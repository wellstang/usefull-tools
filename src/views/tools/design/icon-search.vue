<template>
  <ToolLayout title="图标搜索" description="搜索 Iconify 图标库，一键复制 SVG 或组件代码" category="design">
    <div class="max-w-3xl space-y-5">
      <div class="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 flex items-start gap-2">
        <Icon icon="mdi:wifi-off" class="text-xl mt-0.5 shrink-0" />
        <span>此工具需要联网，从 Iconify API 搜索图标（api.iconify.design）。</span>
      </div>

      <div class="flex gap-3">
        <div class="relative flex-1">
          <Icon icon="mdi:magnify" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input v-model="query" @keyup.enter="search" placeholder="搜索图标，如 home、user、star..." class="input w-full pl-9" />
        </div>
        <button @click="search" class="btn-primary">搜索</button>
      </div>

      <div v-if="loading" class="text-center py-12 text-gray-400">
        <Icon icon="mdi:loading" class="text-4xl animate-spin mb-2" />
        <p>搜索中...</p>
      </div>

      <div v-else-if="icons.length" class="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-10 gap-2">
        <div v-for="icon in icons" :key="icon" @click="select(icon)"
          :class="['flex flex-col items-center gap-1 p-2 rounded-xl cursor-pointer border transition-all', selected===icon ? 'border-indigo-500 bg-indigo-50' : 'border-transparent hover:border-gray-200 hover:bg-gray-50']">
          <Icon :icon="icon" class="text-2xl text-gray-700" />
          <span class="text-xs text-gray-400 truncate w-full text-center">{{ icon.split(':')[1] }}</span>
        </div>
      </div>

      <div v-if="selected" class="card">
        <div class="flex items-center gap-4">
          <Icon :icon="selected" class="text-5xl text-gray-700" />
          <div class="flex-1">
            <p class="font-mono text-sm text-gray-700 mb-3">{{ selected }}</p>
            <div class="flex gap-2 flex-wrap">
              <CopyButton :text="selected" label="复制 icon name" />
              <CopyButton :text="`<Icon icon=&quot;${selected}&quot; />`" label="复制 Vue 组件" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import ToolLayout from '@/components/common/ToolLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'

const query = ref('')
const icons = ref([])
const selected = ref('')
const loading = ref(false)

async function search() {
  if (!query.value.trim()) return
  loading.value = true
  icons.value = []; selected.value = ''
  try {
    const res = await fetch(`https://api.iconify.design/search?query=${encodeURIComponent(query.value)}&limit=50`)
    const data = await res.json()
    icons.value = data.icons || []
  } catch {
    icons.value = []
  } finally {
    loading.value = false
  }
}

function select(icon) { selected.value = icon }
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-5; }
.input { @apply border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent; }
.btn-primary { @apply px-4 py-2.5 text-sm bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors; }
</style>
