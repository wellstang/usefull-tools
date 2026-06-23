<template>
  <ToolLayout title="UUID 生成器" description="批量生成 UUID v4，支持大小写与去横线格式" category="dev">
    <div class="card max-w-2xl">
      <div class="flex flex-wrap gap-4 mb-5 items-end">
        <div>
          <label class="label mb-1 block">生成数量</label>
          <input v-model.number="count" type="number" min="1" max="100" class="input w-24" />
        </div>
        <div class="flex gap-3">
          <label class="flex items-center gap-1.5 cursor-pointer">
            <input type="radio" v-model="format" value="standard" /> <span class="text-sm">标准（小写）</span>
          </label>
          <label class="flex items-center gap-1.5 cursor-pointer">
            <input type="radio" v-model="format" value="upper" /> <span class="text-sm">大写</span>
          </label>
          <label class="flex items-center gap-1.5 cursor-pointer">
            <input type="radio" v-model="format" value="nodash" /> <span class="text-sm">去横线</span>
          </label>
        </div>
        <div class="flex gap-2">
          <button @click="generate" class="btn-primary">生成</button>
          <CopyButton v-if="uuids.length" :text="uuids.join('\n')" label="全部复制" />
        </div>
      </div>

      <div class="space-y-1.5 max-h-96 overflow-y-auto">
        <div v-for="(uuid, i) in uuids" :key="i" class="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2 group">
          <span class="font-mono text-sm text-gray-700">{{ uuid }}</span>
          <CopyButton :text="uuid" />
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '@/components/common/ToolLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'

const count = ref(5)
const format = ref('standard')
const uuids = ref([])

function genUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

function generate() {
  uuids.value = Array.from({ length: Math.min(count.value, 100) }, () => {
    let u = genUUID()
    if (format.value === 'upper') u = u.toUpperCase()
    if (format.value === 'nodash') u = u.replace(/-/g, '')
    return u
  })
}

generate()
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-6; }
.label { @apply text-sm font-medium text-gray-700; }
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400; }
.btn-primary { @apply px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors; }
</style>
