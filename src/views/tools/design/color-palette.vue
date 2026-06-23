<template>
  <ToolLayout title="配色方案生成器" description="输入主色，自动生成色阶、互补色、类比色、三等分色和四色方案" category="design">
    <div class="max-w-2xl space-y-6">
      <div class="card flex gap-4 items-end">
        <div class="flex-1">
          <label class="label">主色</label>
          <div class="flex gap-3 mt-1">
            <input type="color" v-model="primary" class="w-12 h-10 cursor-pointer rounded border border-gray-200" />
            <input v-model="primary" class="input flex-1 font-mono" maxlength="7" />
          </div>
        </div>
        <button @click="randomColor" class="btn-secondary" title="随机颜色"><Icon icon="mdi:dice-5-outline" /></button>
        <button @click="exportCss" class="btn-secondary text-xs px-3" title="导出 CSS 变量">导出 CSS</button>
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
          <div class="flex mt-1 text-xs text-gray-400 font-mono">
            <div class="flex-1">{{ primary }}</div>
            <div class="flex-1 text-right">{{ complementary }}</div>
          </div>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-3">类比色（±30°）</h3>
          <div class="flex h-16 rounded-xl overflow-hidden border border-gray-200">
            <div v-for="c in analogous" :key="c" class="flex-1 cursor-pointer" :style="{ backgroundColor: c }" @click="copy(c)" :title="c" />
          </div>
          <div class="flex mt-1 text-xs text-gray-400 font-mono justify-between">
            <span v-for="c in analogous" :key="c">{{ c }}</span>
          </div>
        </div>
      </div>

      <!-- 三等分色 & 四色方案 -->
      <div class="grid grid-cols-2 gap-5">
        <div>
          <h3 class="font-semibold text-gray-800 mb-3">三等分色（120°）</h3>
          <div class="flex h-16 rounded-xl overflow-hidden border border-gray-200">
            <div v-for="c in triadic" :key="c" class="flex-1 cursor-pointer" :style="{ backgroundColor: c }" @click="copy(c)" :title="c" />
          </div>
          <div class="flex mt-1 text-xs text-gray-400 font-mono justify-between">
            <span v-for="c in triadic" :key="c">{{ c }}</span>
          </div>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-3">四色方案（90°）</h3>
          <div class="flex h-16 rounded-xl overflow-hidden border border-gray-200">
            <div v-for="c in tetradic" :key="c" class="flex-1 cursor-pointer" :style="{ backgroundColor: c }" @click="copy(c)" :title="c" />
          </div>
          <div class="flex mt-1 text-xs text-gray-400 font-mono justify-between">
            <span v-for="c in tetradic" :key="c" class="truncate">{{ c }}</span>
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

const palette = computed(() => generatePalette(primary.value))

function hslOffset(hex, offset) {
  try {
    const { r, g, b } = hexToRgb(hex)
    const { h, s, l } = rgbToHsl(r, g, b)
    const { r: nr, g: ng, b: nb } = hslToRgb((h + offset + 360) % 360, s, l)
    return rgbToHex(nr, ng, nb)
  } catch { return hex }
}

const complementary = computed(() => hslOffset(primary.value, 180))

const analogous = computed(() => [-30, 0, 30].map(o => hslOffset(primary.value, o)))

const triadic = computed(() => [0, 120, 240].map(o => hslOffset(primary.value, o)))

const tetradic = computed(() => [0, 90, 180, 270].map(o => hslOffset(primary.value, o)))

function randomColor() {
  primary.value = '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')
}

async function copy(text) {
  try { await navigator.clipboard.writeText(text) } catch {}
}

function exportCss() {
  const levels = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  const lines = [':root {']
  palette.value.forEach(s => {
    lines.push(`  --color-primary-${s.label}: ${s.hex};`)
  })
  lines.push(`  --color-primary: ${primary.value};`)
  lines.push(`  --color-complementary: ${complementary.value};`)
  triadic.value.forEach((c, i) => lines.push(`  --color-triadic-${i + 1}: ${c};`))
  tetradic.value.forEach((c, i) => lines.push(`  --color-tetradic-${i + 1}: ${c};`))
  lines.push('}')
  const blob = new Blob([lines.join('\n')], { type: 'text/css' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'palette.css'
  a.click()
  URL.revokeObjectURL(a.href)
}
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-5; }
.label { @apply text-sm font-medium text-gray-700; }
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400; }
.btn-secondary { @apply p-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-indigo-400 hover:text-indigo-600 transition-colors text-xl; }
</style>
