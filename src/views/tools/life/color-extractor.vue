<template>
  <ToolLayout title="图片取色器" description="从本地图片提取主色调和调色板，数据不上传服务器" category="life">
    <div class="max-w-2xl space-y-5">
      <!-- 上传区 -->
      <div
        @dragover.prevent @drop.prevent="onDrop"
        @click="fileInput.click()"
        class="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
      >
        <Icon icon="mdi:image-plus-outline" class="text-5xl text-gray-300 mb-3" />
        <p class="text-gray-500 font-medium">点击或拖拽图片上传</p>
        <p class="text-sm text-gray-400 mt-1">支持 JPG / PNG / WebP · 文件不会上传至服务器</p>
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFile" />
      </div>

      <!-- 图片预览 + 颜色 -->
      <div v-if="imgSrc" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <img :src="imgSrc" class="w-full rounded-xl border border-gray-200 object-cover max-h-64" />
          <canvas ref="canvas" class="hidden" />
          <div class="space-y-2">
            <p class="text-sm font-medium text-gray-700 mb-3">提取到 {{ colors.length }} 种主色</p>
            <div v-for="color in colors" :key="color" class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer" @click="copy(color)">
              <div class="w-10 h-10 rounded-lg shadow-sm border border-gray-200 shrink-0" :style="{ backgroundColor: color }" />
              <span class="font-mono text-sm text-gray-700 flex-1">{{ color }}</span>
              <Icon icon="mdi:content-copy" class="text-gray-300 hover:text-indigo-600 transition-colors" />
            </div>
          </div>
        </div>
        <!-- 调色板展示 -->
        <div class="flex rounded-xl overflow-hidden h-14 border border-gray-200">
          <div v-for="color in colors" :key="color" class="flex-1" :style="{ backgroundColor: color }" :title="color" />
        </div>
      </div>

      <Teleport to="body">
        <div v-if="toast" class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-5 py-2.5 rounded-full shadow-lg z-50">
          已复制 {{ toast }}
        </div>
      </Teleport>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import ToolLayout from '@/components/common/ToolLayout.vue'
import { extractColors } from '@/utils/color.js'

const fileInput = ref(null)
const canvas = ref(null)
const imgSrc = ref('')
const colors = ref([])
const toast = ref('')

function processImage(file) {
  if (!file?.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = e => {
    imgSrc.value = e.target.result
    const img = new Image()
    img.onload = () => {
      const c = canvas.value
      const scale = Math.min(200 / img.width, 200 / img.height, 1)
      c.width = img.width * scale; c.height = img.height * scale
      const ctx = c.getContext('2d')
      ctx.drawImage(img, 0, 0, c.width, c.height)
      colors.value = extractColors(ctx.getImageData(0, 0, c.width, c.height), 8)
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
}

function onFile(e) { processImage(e.target.files[0]) }
function onDrop(e) { processImage(e.dataTransfer.files[0]) }

async function copy(text) {
  try { await navigator.clipboard.writeText(text) } catch {}
  toast.value = text
  setTimeout(() => { toast.value = '' }, 1500)
}
</script>
