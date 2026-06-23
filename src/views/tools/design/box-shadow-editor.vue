<template>
  <ToolLayout title="Box Shadow 编辑器" description="可视化调整阴影和圆角，实时预览并复制 CSS" category="design">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 预览 -->
      <div class="card flex items-center justify-center min-h-64 bg-gray-100">
        <div class="w-32 h-32 bg-white" :style="previewStyle" />
      </div>

      <!-- 控制 -->
      <div class="space-y-4">
        <div class="card space-y-3">
          <div v-for="ctrl in controls" :key="ctrl.key" class="flex items-center gap-3">
            <label class="text-sm text-gray-600 w-20 shrink-0">{{ ctrl.label }}</label>
            <input type="range" v-model.number="shadow[ctrl.key]" :min="ctrl.min" :max="ctrl.max" class="flex-1" />
            <span class="text-sm font-mono text-gray-500 w-12 text-right">{{ shadow[ctrl.key] }}px</span>
          </div>
          <div class="flex items-center gap-3">
            <label class="text-sm text-gray-600 w-20 shrink-0">颜色</label>
            <input type="color" v-model="shadow.color" class="w-10 h-8 cursor-pointer rounded border border-gray-200" />
            <input v-model="shadow.color" class="input font-mono flex-1" />
          </div>
          <div class="flex items-center gap-3">
            <label class="text-sm text-gray-600 w-20 shrink-0">透明度</label>
            <input type="range" v-model.number="shadow.opacity" min="1" max="100" class="flex-1" />
            <span class="text-sm font-mono text-gray-500 w-12 text-right">{{ shadow.opacity }}%</span>
          </div>
          <div class="flex items-center gap-3">
            <label class="text-sm text-gray-600 w-20 shrink-0">圆角</label>
            <input type="range" v-model.number="borderRadius" min="0" max="80" class="flex-1" />
            <span class="text-sm font-mono text-gray-500 w-12 text-right">{{ borderRadius }}px</span>
          </div>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="inset" /> <span class="text-sm text-gray-600">内阴影（inset）</span>
          </label>
        </div>

        <div class="card">
          <div class="flex items-center justify-between mb-2">
            <label class="label">CSS 代码</label>
            <CopyButton :text="cssCode" />
          </div>
          <code class="block bg-gray-50 rounded-xl p-3 text-xs font-mono text-indigo-700 break-all">{{ cssCode }}</code>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '@/components/common/ToolLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'

const shadow = ref({ x: 4, y: 8, blur: 16, spread: 0, color: '#000000', opacity: 20 })
const borderRadius = ref(8)
const inset = ref(false)

const controls = [
  { key: 'x', label: '水平偏移', min: -50, max: 50 },
  { key: 'y', label: '垂直偏移', min: -50, max: 50 },
  { key: 'blur', label: '模糊半径', min: 0, max: 100 },
  { key: 'spread', label: '扩展', min: -30, max: 50 },
]

function hexToRgba(hex, opacity) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${(opacity / 100).toFixed(2)})`
}

const shadowValue = computed(() => {
  const { x, y, blur, spread, color, opacity } = shadow.value
  const rgba = hexToRgba(color, opacity)
  return `${inset.value ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px ${rgba}`
})

const previewStyle = computed(() => ({
  boxShadow: shadowValue.value,
  borderRadius: borderRadius.value + 'px',
}))

const cssCode = computed(() =>
  `box-shadow: ${shadowValue.value};\nborder-radius: ${borderRadius.value}px;`
)
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-5; }
.label { @apply text-sm font-medium text-gray-700; }
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400; }
</style>
