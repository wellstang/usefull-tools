<template>
  <ToolLayout title="颜色格式转换" description="HEX / RGB / HSL / HSB 四种颜色格式互转，实时预览" category="dev">
    <div class="max-w-2xl">
      <!-- 颜色预览 -->
      <div class="h-24 rounded-2xl mb-6 shadow-inner transition-colors duration-200 border border-gray-200" :style="{ backgroundColor: hex }" />

      <!-- 拾色器 -->
      <div class="flex items-center gap-4 mb-6">
        <input type="color" v-model="hex" class="w-12 h-10 cursor-pointer rounded border border-gray-200" />
        <span class="text-sm text-gray-500">点击取色器选色，或在下方直接输入</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- HEX -->
        <div class="card">
          <div class="flex justify-between items-center mb-2">
            <label class="format-label">HEX</label>
            <CopyButton :text="hex" />
          </div>
          <input v-model="hex" @input="onHex" class="input font-mono w-full" placeholder="#4f46e5" spellcheck="false" />
        </div>

        <!-- RGB -->
        <div class="card">
          <div class="flex justify-between items-center mb-2">
            <label class="format-label">RGB</label>
            <CopyButton :text="`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`" />
          </div>
          <div class="flex gap-2">
            <div v-for="k in ['r','g','b']" :key="k">
              <label class="text-xs text-gray-400 uppercase">{{ k }}</label>
              <input v-model.number="rgb[k]" @input="onRgb" type="number" min="0" max="255" class="input w-full font-mono" />
            </div>
          </div>
        </div>

        <!-- HSL -->
        <div class="card">
          <div class="flex justify-between items-center mb-2">
            <label class="format-label">HSL</label>
            <CopyButton :text="`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`" />
          </div>
          <div class="flex gap-2">
            <div v-for="(k, label) in {h:'H°',s:'S%',l:'L%'}" :key="k">
              <label class="text-xs text-gray-400">{{ label }}</label>
              <input v-model.number="hsl[k]" @input="onHsl" type="number" :min="k==='h'?0:0" :max="k==='h'?360:100" class="input w-full font-mono" />
            </div>
          </div>
        </div>

        <!-- HSB -->
        <div class="card">
          <div class="flex justify-between items-center mb-2">
            <label class="format-label">HSB / HSV</label>
            <CopyButton :text="`hsb(${hsb.h}, ${hsb.s}%, ${hsb.b}%)`" />
          </div>
          <div class="flex gap-2">
            <div v-for="(k, label) in {h:'H°',s:'S%',b:'B%'}" :key="k">
              <label class="text-xs text-gray-400">{{ label }}</label>
              <input v-model.number="hsb[k]" @input="onHsb" type="number" :min="0" :max="k==='h'?360:100" class="input w-full font-mono" />
            </div>
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
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, rgbToHsb } from '@/utils/color.js'

const hex = ref('#4f46e5')
const rgb = ref({ r: 79, g: 70, b: 229 })
const hsl = ref({ h: 243, s: 75, l: 59 })
const hsb = ref({ h: 243, s: 69, b: 90 })

function sync(r, g, b) {
  rgb.value = { r, g, b }
  const h = rgbToHsl(r, g, b); hsl.value = h
  const hs = rgbToHsb(r, g, b); hsb.value = hs
  hex.value = rgbToHex(r, g, b)
}
function onHex() { try { const { r, g, b } = hexToRgb(hex.value); sync(r, g, b) } catch {} }
function onRgb() { sync(rgb.value.r, rgb.value.g, rgb.value.b) }
function onHsl() { const { r, g, b } = hslToRgb(hsl.value.h, hsl.value.s, hsl.value.l); sync(r, g, b) }
function onHsb() {
  // HSB to RGB
  const { h, s, b: bv } = hsb.value
  const S = s / 100, B = bv / 100
  const f = (n) => { const k = (n + h / 60) % 6; return B - B * S * Math.max(0, Math.min(k, 4 - k, 1)) }
  sync(Math.round(f(5) * 255), Math.round(f(3) * 255), Math.round(f(1) * 255))
}
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-4; }
.format-label { @apply text-sm font-semibold text-gray-700; }
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400; }
</style>
