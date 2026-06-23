<template>
  <ToolLayout title="配色方案生成器" description="输入主色，自动生成色阶、互补色和类比色" category="design">
    <div class="max-w-2xl space-y-6">
      <div class="card flex gap-4 items-end">
        <div class="flex-1">
          <label class="label">主色</label>
          <div class="flex gap-3 mt-1">
            <input type="color" v-model="primary" class="w-12 h-10 cursor-pointer rounded border border-gray-200" />
            <input v-model="primary" class="input flex-1 font-mono" maxlength="7" />
          </div>
        </div>
        <button @click="randomColor" class="btn-secondary"><Icon icon="mdi:dice-5-outline" /></button>
      </div>

      <!-- 色阶 -->
      <div>
        <h3 class="font-semibold text-gray-800 mb-3">色阶</h3>
        <div class="flex rounded-xl overflow-hidden h-16 border border-gray-200">
          <div v-for="swatch in palette" :key="swatch.label"
            class="flex-1 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform"
            :style="{ backgroundColor: swatch.hex }"
            :title="swatch.hex"
            @click="copy(swatch.hex)">
            <span class="text-xs font-mono" :style="{ color: swatch.label > 400 ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.5)' }">{{ swatch.label }}</span>
          </div>
        </div>
        <div class="flex mt-1">
          <div v-for="swatch in palette" :key="swatch.label" class="flex-1 text-center text-xs text-gray-400 font-mono truncate px-0.5">{{ swatch.hex }}</div>
        </div>
      </div>

      <!-- 互补色 & 类比色 -->
      <div class="grid grid-cols-2 gap-5">
        <div>
          <h3 class="font-semibold text-gray-800 mb-3">互补色</h3>
          <div class="flex h-16 rounded-xl overflow-hidden border border-gray-200">
            <div class="flex-1 cursor-pointer" :style="{ backgroundColor: primary }" @click="copy(primary)" :title="primary" />
            <div class="flex-1 cursor-pointer" :style="{ backgroundColor: complementary }" @click="copy(complementary)" :title="complementary" />
          </div>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-3">类比色</h3>
          <div class="flex h-16 rounded-xl overflow-hidden border border-gray-200">
            <div v-for="c in analogous" :key="c" class="flex-1 cursor-pointer" :style="{ backgroundColor: c }" @click="copy(c)" :title="c" />
          </div>
        </div>
      </div>

      <p class="text-xs text-gray-400 text-center">点击色块复制颜色值</p>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import ToolLayout from '@/components/common/ToolLayout.vue'
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, generatePalette } from '@/utils/color.js'

const primary = ref('#4f46e5')
const toast = ref('')

const palette = computed(() => generatePalette(primary.value))

const complementary = computed(() => {
  try {
    const { r, g, b } = hexToRgb(primary.value)
    const { h, s, l } = rgbToHsl(r, g, b)
    const { r: cr, g: cg, b: cb } = hslToRgb((h + 180) % 360, s, l)
    return rgbToHex(cr, cg, cb)
  } catch { return '#000000' }
})

const analogous = computed(() => {
  try {
    const { r, g, b } = hexToRgb(primary.value)
    const { h, s, l } = rgbToHsl(r, g, b)
    return [-30, 0, 30].map(offset => {
      const { r, g, b } = hslToRgb((h + offset + 360) % 360, s, l)
      return rgbToHex(r, g, b)
    })
  } catch { return [primary.value, primary.value, primary.value] }
})

function randomColor() {
  primary.value = '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')
}

async function copy(text) {
  try { await navigator.clipboard.writeText(text) } catch {}
  toast.value = text
  setTimeout(() => { toast.value = '' }, 1200)
}
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-5; }
.label { @apply text-sm font-medium text-gray-700; }
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400; }
.btn-secondary { @apply p-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-indigo-400 hover:text-indigo-600 transition-colors text-xl; }
</style>
