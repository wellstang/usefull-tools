<template>
  <ToolLayout title="PDF 转图片" description="将 PDF 每页转为 PNG/JPG 图片，纯客户端处理，不上传服务器">

    <!-- 上传区 -->
    <div v-if="!pdfFile"
      class="border-2 border-dashed border-gray-300 rounded-2xl p-16 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all"
      @click="triggerFileInput"
      @dragover.prevent
      @drop.prevent="onDrop"
    >
      <Icon icon="mdi:file-pdf-box" class="text-6xl text-red-400 mx-auto mb-4" />
      <p class="text-lg font-medium text-gray-700 mb-1">点击或拖入 PDF 文件</p>
      <p class="text-sm text-gray-400">文件在本地处理，不上传服务器</p>
      <input ref="fileInput" type="file" accept=".pdf,application/pdf" class="hidden" @change="onFileChange" />
    </div>

    <!-- 工具栏 -->
    <template v-else>
      <div class="flex flex-wrap items-center gap-3 mb-6 p-4 bg-gray-50 rounded-xl">
        <!-- 文件信息 -->
        <div class="flex items-center gap-2 text-sm text-gray-600 mr-2">
          <Icon icon="mdi:file-pdf-box" class="text-red-400 text-lg" />
          <span class="font-medium truncate max-w-xs">{{ pdfFile.name }}</span>
          <span class="text-gray-400">· {{ totalPages }} 页</span>
        </div>

        <div class="flex-1" />

        <!-- 格式选择 -->
        <label class="text-sm text-gray-600">格式</label>
        <select v-model="format" class="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
          <option value="png">PNG（无损）</option>
          <option value="jpeg">JPG（较小）</option>
        </select>

        <!-- 分辨率 -->
        <label class="text-sm text-gray-600">分辨率</label>
        <select v-model="scale" class="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
          <option :value="1">标准 (72 dpi)</option>
          <option :value="2">高清 (144 dpi)</option>
          <option :value="3">超清 (216 dpi)</option>
        </select>

        <!-- 重新渲染 -->
        <button
          v-if="rendered"
          @click="renderPages"
          :disabled="rendering"
          class="text-sm px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          <Icon icon="mdi:refresh" class="inline mr-1" />重新渲染
        </button>

        <!-- 下载全部 -->
        <button
          v-if="rendered && pages.length > 0"
          @click="downloadAll"
          :disabled="downloading"
          class="text-sm px-4 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
        >
          <Icon :icon="downloading ? 'mdi:loading' : 'mdi:download-multiple'" :class="downloading ? 'animate-spin' : ''" />
          {{ downloading ? '打包中…' : `下载全部 (${pages.length} 张)` }}
        </button>

        <!-- 重置 -->
        <button @click="reset" class="text-sm px-3 py-1.5 text-gray-500 hover:text-gray-700 transition-colors">
          <Icon icon="mdi:close" class="inline mr-1" />换文件
        </button>
      </div>

      <!-- 渲染进度 -->
      <div v-if="rendering" class="mb-6">
        <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>正在渲染第 {{ renderProgress }} / {{ totalPages }} 页…</span>
          <span>{{ Math.round(renderProgress / totalPages * 100) }}%</span>
        </div>
        <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            class="h-full bg-indigo-500 rounded-full transition-all duration-300"
            :style="{ width: `${renderProgress / totalPages * 100}%` }"
          />
        </div>
      </div>

      <!-- 渲染按钮（首次） -->
      <div v-if="!rendered && !rendering" class="text-center py-10">
        <button
          @click="renderPages"
          class="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium text-base"
        >
          <Icon icon="mdi:image-multiple-outline" class="inline mr-2 text-lg" />
          开始转换
        </button>
      </div>

      <!-- 图片网格 -->
      <div v-if="pages.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="(page, i) in pages"
          :key="i"
          class="group relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-zoom-in"
          @click="openPreview(i)"
        >
          <img :src="page.dataUrl" :alt="`第 ${i + 1} 页`" class="w-full object-contain" />

          <!-- 页码 + 下载按钮 -->
          <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
            <span class="text-white text-xs font-medium">第 {{ i + 1 }} 页</span>
            <button
              @click.stop="downloadPage(page, i + 1)"
              class="flex items-center gap-1 text-xs text-white bg-white/20 hover:bg-white/40 backdrop-blur-sm px-2 py-1 rounded-lg transition-colors"
            >
              <Icon icon="mdi:download" />下载
            </button>
          </div>

          <!-- 页码标签（非 hover 时） -->
          <div class="absolute top-2 left-2 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full group-hover:opacity-0 transition-opacity">
            {{ i + 1 }}
          </div>
        </div>
      </div>
    </template>

    <!-- 灯箱预览 -->
    <Teleport to="body">
      <div
        v-if="previewIndex !== null"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
        @click.self="closePreview"
        @keydown.esc.prevent="closePreview"
      >
        <!-- 关闭 -->
        <button
          @click="closePreview"
          class="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
        >
          <Icon icon="mdi:close" class="text-2xl" />
        </button>

        <!-- 页码指示 -->
        <div class="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
          {{ previewIndex + 1 }} / {{ pages.length }}
        </div>

        <!-- 左箭头 -->
        <button
          v-if="previewIndex > 0"
          @click="previewIndex--"
          class="absolute left-4 text-white/70 hover:text-white transition-colors p-3 rounded-full hover:bg-white/10"
        >
          <Icon icon="mdi:chevron-left" class="text-3xl" />
        </button>

        <!-- 图片 -->
        <img
          :src="pages[previewIndex].dataUrl"
          :alt="`第 ${previewIndex + 1} 页`"
          class="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
        />

        <!-- 右箭头 -->
        <button
          v-if="previewIndex < pages.length - 1"
          @click="previewIndex++"
          class="absolute right-4 text-white/70 hover:text-white transition-colors p-3 rounded-full hover:bg-white/10"
        >
          <Icon icon="mdi:chevron-right" class="text-3xl" />
        </button>

        <!-- 下载当前页 -->
        <button
          @click="downloadPage(pages[previewIndex], previewIndex + 1)"
          class="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm text-white bg-white/15 hover:bg-white/25 backdrop-blur-sm px-4 py-2 rounded-xl transition-colors"
        >
          <Icon icon="mdi:download" />下载此页
        </button>
      </div>
    </Teleport>

  </ToolLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import ToolLayout from '@/components/common/ToolLayout.vue'

// pdfjs-dist worker：复制到 public/ 目录，通过 BASE_URL 引用（兼容 GitHub Pages 子路径）
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs'
pdfjsLib.GlobalWorkerOptions.workerSrc = `${import.meta.env.BASE_URL}pdf.worker.min.mjs`

const fileInput = ref(null)
const pdfFile = ref(null)
const totalPages = ref(0)
const pages = ref([])           // [{ dataUrl, filename }]
const rendering = ref(false)
const rendered = ref(false)
const renderProgress = ref(0)
const downloading = ref(false)
const format = ref('png')
const scale = ref(2)            // 默认高清
const previewIndex = ref(null)  // 当前灯箱预览的页面索引

let pdfDoc = null

function triggerFileInput() {
  fileInput.value?.click()
}

function onDrop(e) {
  const file = e.dataTransfer.files[0]
  if (file?.type === 'application/pdf' || file?.name?.endsWith('.pdf')) {
    loadPdf(file)
  }
}

function onFileChange(e) {
  const file = e.target.files[0]
  if (file) loadPdf(file)
}

async function loadPdf(file) {
  pdfFile.value = file
  pages.value = []
  rendered.value = false
  renderProgress.value = 0

  const arrayBuffer = await file.arrayBuffer()
  pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  totalPages.value = pdfDoc.numPages
}

async function renderPages() {
  if (!pdfDoc || rendering.value) return
  rendering.value = true
  renderProgress.value = 0
  pages.value = []

  const mime = format.value === 'jpeg' ? 'image/jpeg' : 'image/png'
  const ext = format.value === 'jpeg' ? 'jpg' : 'png'
  const baseName = pdfFile.value.name.replace(/\.pdf$/i, '')

  for (let i = 1; i <= totalPages.value; i++) {
    const page = await pdfDoc.getPage(i)
    const viewport = page.getViewport({ scale: scale.value })

    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    const ctx = canvas.getContext('2d')

    await page.render({ canvasContext: ctx, viewport }).promise

    const quality = format.value === 'jpeg' ? 0.92 : undefined
    const dataUrl = canvas.toDataURL(mime, quality)

    pages.value.push({
      dataUrl,
      filename: `${baseName}-p${String(i).padStart(2, '0')}.${ext}`,
    })
    renderProgress.value = i
  }

  rendering.value = false
  rendered.value = true
}

function downloadPage(page, _idx) {
  const a = document.createElement('a')
  a.href = page.dataUrl
  a.download = page.filename
  a.click()
}

async function downloadAll() {
  if (pages.value.length === 0 || downloading.value) return
  downloading.value = true

  try {
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()
    const baseName = pdfFile.value.name.replace(/\.pdf$/i, '')

    for (const page of pages.value) {
      const base64 = page.dataUrl.split(',')[1]
      zip.file(page.filename, base64, { base64: true })
    }

    const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${baseName}-images.zip`
    a.click()
    URL.revokeObjectURL(url)
  } finally {
    downloading.value = false
  }
}

function openPreview(index) {
  previewIndex.value = index
  document.body.style.overflow = 'hidden'
}

function closePreview() {
  previewIndex.value = null
  document.body.style.overflow = ''
}

function onKeydown(e) {
  if (previewIndex.value === null) return
  if (e.key === 'Escape') closePreview()
  if (e.key === 'ArrowLeft' && previewIndex.value > 0) previewIndex.value--
  if (e.key === 'ArrowRight' && previewIndex.value < pages.value.length - 1) previewIndex.value++
}

function reset() {
  pdfFile.value = null
  pdfDoc = null
  pages.value = []
  rendered.value = false
  rendering.value = false
  renderProgress.value = 0
  totalPages.value = 0
  if (fileInput.value) fileInput.value.value = ''
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
  pdfDoc?.destroy?.()
})
</script>
