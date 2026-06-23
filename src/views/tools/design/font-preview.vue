<template>
  <ToolLayout title="字体对比预览" description="多种字体并排对比，支持自定义文字和字号" category="design">
    <div class="space-y-5">
      <div class="card flex flex-wrap gap-4 items-end">
        <div class="flex-1 min-w-48">
          <label class="label">预览文字</label>
          <input v-model="text" class="input w-full mt-1" placeholder="输入预览文字..." />
        </div>
        <div>
          <label class="label">字号：{{ fontSize }}px</label>
          <input type="range" v-model.number="fontSize" min="12" max="72" class="w-36 mt-1" />
        </div>
        <div>
          <label class="label">颜色</label>
          <input type="color" v-model="color" class="w-10 h-10 cursor-pointer rounded border border-gray-200 mt-1" />
        </div>
      </div>

      <div class="space-y-3">
        <div v-for="font in fonts" :key="font.name" class="card">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-gray-500">{{ font.name }}</span>
            <CopyButton :text="`font-family: '${font.value}', sans-serif;`" label="复制 CSS" />
          </div>
          <div :style="{ fontFamily: font.value + ', sans-serif', fontSize: fontSize + 'px', color: color, lineHeight: 1.5 }">
            {{ text || '唐唐工具箱 — The quick brown fox jumps over the lazy dog.' }}
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '@/components/common/ToolLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'

const text = ref('')
const fontSize = ref(24)
const color = ref('#1f2937')

const fonts = [
  { name: '系统默认 (System UI)', value: '-apple-system, BlinkMacSystemFont, "Segoe UI"' },
  { name: 'PingFang SC (苹方)', value: '"PingFang SC"' },
  { name: 'Microsoft YaHei (微软雅黑)', value: '"Microsoft YaHei"' },
  { name: 'Georgia (衬线)', value: 'Georgia, serif' },
  { name: 'Courier New (等宽)', value: '"Courier New", Courier, monospace' },
  { name: 'Inter', value: 'Inter' },
  { name: 'Roboto', value: 'Roboto' },
]
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-5; }
.label { @apply text-sm font-medium text-gray-700; }
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400; }
</style>
