<template>
  <ToolLayout title="二维码生成器" description="将文字或 URL 生成二维码，支持自定义颜色和下载" category="life">
    <div class="max-w-2xl grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 配置区 -->
      <div class="space-y-4">
        <div>
          <label class="label">内容</label>
          <textarea v-model="text" placeholder="输入文字或 URL..." class="textarea h-28 mt-1" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="label">前景色</label>
            <div class="flex gap-2 mt-1">
              <input type="color" v-model="fgColor" class="w-10 h-10 cursor-pointer rounded border border-gray-200" />
              <input v-model="fgColor" class="input flex-1 font-mono" />
            </div>
          </div>
          <div>
            <label class="label">背景色</label>
            <div class="flex gap-2 mt-1">
              <input type="color" v-model="bgColor" class="w-10 h-10 cursor-pointer rounded border border-gray-200" />
              <input v-model="bgColor" class="input flex-1 font-mono" />
            </div>
          </div>
        </div>
        <div>
          <label class="label">纠错级别</label>
          <div class="flex gap-2 mt-1">
            <button v-for="l in ['L','M','Q','H']" :key="l"
              @click="level = l"
              :class="['px-3 py-1.5 text-sm rounded-lg border transition-colors', level===l ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300']">
              {{ l }}
            </button>
          </div>
          <p class="text-xs text-gray-400 mt-1">L=7% H=30% 纠错率，图案越复杂选越高级</p>
        </div>
        <div>
          <label class="label">尺寸：{{ size }}px</label>
          <input type="range" v-model.number="size" min="128" max="512" step="32" class="w-full mt-1" />
        </div>
      </div>

      <!-- 预览区 -->
      <div class="flex flex-col items-center gap-4">
        <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 min-h-[200px] flex items-center justify-center">
          <canvas ref="canvas" class="block" />
        </div>
        <div v-if="genError" class="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2 w-full text-center">
          ❌ {{ genError }}
        </div>
        <div v-else-if="text" class="flex gap-2">
          <button @click="download" class="btn-primary flex items-center gap-2">
            <Icon icon="mdi:download" />下载 PNG
          </button>
        </div>
        <p v-else class="text-gray-400 text-sm">输入内容后自动生成</p>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import QRCode from 'qrcode'
import { Icon } from '@iconify/vue'
import ToolLayout from '@/components/common/ToolLayout.vue'

const text = ref('https://wellstang.github.io/usefull-tools/')
const fgColor = ref('#000000')
const bgColor = ref('#ffffff')
const level = ref('M')
const size = ref(256)
const canvas = ref(null)
const genError = ref('')

let debounceTimer = null

async function generate() {
  genError.value = ''
  if (!canvas.value) return
  if (!text.value) return
  try {
    await QRCode.toCanvas(canvas.value, text.value, {
      width: size.value,
      color: { dark: fgColor.value, light: bgColor.value },
      errorCorrectionLevel: level.value,
    })
  } catch (e) {
    genError.value = e.message
  }
}

function debouncedGenerate() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(generate, 300)
}

// 所有影响输出的参数统一 watch，防抖触发
watch([text, fgColor, bgColor, level, size], debouncedGenerate)

function download() {
  const link = document.createElement('a')
  link.download = 'qrcode.png'
  link.href = canvas.value.toDataURL('image/png')
  link.click()
}

onMounted(generate)
</script>
