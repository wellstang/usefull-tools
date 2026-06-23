<template>
  <ToolLayout title="占位图生成器" description="输入宽高和颜色，生成纯色占位图并下载" category="design">
    <div class="max-w-lg space-y-5">
      <div class="card space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label">宽度 (px)</label>
            <input v-model.number="width" type="number" min="1" max="4000" class="input w-full mt-1" />
          </div>
          <div>
            <label class="label">高度 (px)</label>
            <input v-model.number="height" type="number" min="1" max="4000" class="input w-full mt-1" />
          </div>
          <div>
            <label class="label">背景色</label>
            <div class="flex gap-2 mt-1">
              <input type="color" v-model="bgColor" class="w-10 h-10 cursor-pointer rounded border border-gray-200" />
              <input v-model="bgColor" class="input flex-1 font-mono" />
            </div>
          </div>
          <div>
            <label class="label">文字颜色</label>
            <div class="flex gap-2 mt-1">
              <input type="color" v-model="textColor" class="w-10 h-10 cursor-pointer rounded border border-gray-200" />
              <input v-model="textColor" class="input flex-1 font-mono" />
            </div>
          </div>
          <div class="col-span-2">
            <label class="label">文字（可选）</label>
            <input v-model="text" class="input w-full mt-1" :placeholder="`${width}×${height}`" />
          </div>
        </div>

        <!-- 快捷尺寸 -->
        <div>
          <label class="label mb-2 block">常用尺寸</label>
          <div class="flex flex-wrap gap-2">
            <button v-for="s in presets" :key="s.label" @click="width=s.w;height=s.h" class="px-3 py-1 text-xs rounded-full border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors bg-white text-gray-600">
              {{ s.label }} {{ s.w }}×{{ s.h }}
            </button>
          </div>
        </div>

        <div class="flex gap-3">
          <button @click="generate" class="btn-primary flex-1">生成预览</button>
          <button v-if="dataUrl" @click="download" class="btn-secondary">下载 PNG</button>
        </div>
      </div>

      <!-- 预览 -->
      <div v-if="dataUrl" class="text-center">
        <img :src="dataUrl" class="max-w-full border border-gray-200 rounded-xl mx-auto" style="max-height: 300px;" />
      </div>
      <canvas ref="canvas" class="hidden" />
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ToolLayout from '@/components/common/ToolLayout.vue'

const width = ref(800)
const height = ref(400)
const bgColor = ref('#e2e8f0')
const textColor = ref('#94a3b8')
const text = ref('')
const canvas = ref(null)
const dataUrl = ref('')

const presets = [
  { label: '横图', w: 800, h: 400 }, { label: '方图', w: 600, h: 600 },
  { label: '头像', w: 200, h: 200 }, { label: '封面', w: 1200, h: 630 },
  { label: '竖图', w: 400, h: 600 },
]

function generate() {
  const c = canvas.value
  c.width = width.value; c.height = height.value
  const ctx = c.getContext('2d')
  ctx.fillStyle = bgColor.value
  ctx.fillRect(0, 0, c.width, c.height)
  ctx.fillStyle = textColor.value
  const label = text.value || `${width.value}×${height.value}`
  const size = Math.max(12, Math.min(c.width / 10, c.height / 5, 48))
  ctx.font = `${size}px -apple-system, sans-serif`
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillText(label, c.width / 2, c.height / 2)
  dataUrl.value = c.toDataURL('image/png')
}

function download() {
  const link = document.createElement('a')
  link.download = `placeholder-${width.value}x${height.value}.png`
  link.href = dataUrl.value; link.click()
}

onMounted(generate)
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-5; }
.label { @apply text-sm font-medium text-gray-700; }
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400; }
.btn-primary { @apply px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors; }
.btn-secondary { @apply px-4 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-indigo-400 hover:text-indigo-600 transition-colors; }
</style>
