<template>
  <ToolLayout title="CSS 单位换算" description="px ↔ rem ↔ em ↔ vw ↔ vh，可设置基准字号" category="design">
    <div class="max-w-lg space-y-5">
      <div class="card">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label">根字号（rem 基准）</label>
            <input v-model.number="rootFontSize" type="number" min="1" class="input w-full mt-1" /> <span class="text-xs text-gray-400">默认 16px</span>
          </div>
          <div>
            <label class="label">视口宽度（vw 基准）</label>
            <input v-model.number="viewportW" type="number" min="1" class="input w-full mt-1" /> <span class="text-xs text-gray-400">默认 1440px</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex gap-3 items-end mb-4">
          <div class="flex-1">
            <label class="label">输入值</label>
            <input v-model.number="inputVal" type="number" min="0" class="input w-full mt-1 text-lg" />
          </div>
          <div>
            <label class="label">单位</label>
            <select v-model="inputUnit" class="input mt-1">
              <option v-for="u in units" :key="u" :value="u">{{ u }}</option>
            </select>
          </div>
        </div>

        <div class="space-y-2">
          <div v-for="u in units" :key="u" v-if="u !== inputUnit"
            class="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            <span class="text-sm text-gray-500 w-12 font-mono font-medium">{{ u }}</span>
            <span class="font-mono text-gray-800 flex-1 text-right">{{ convert(u) }}</span>
            <CopyButton class="ml-3" :text="convert(u)" />
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '@/components/common/ToolLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'

const rootFontSize = ref(16)
const viewportW = ref(1440)
const viewportH = ref(900)
const inputVal = ref(16)
const inputUnit = ref('px')
const units = ['px', 'rem', 'em', 'vw', 'vh', '%']

function toPx(val, unit) {
  switch (unit) {
    case 'px': return val
    case 'rem': return val * rootFontSize.value
    case 'em': return val * rootFontSize.value
    case 'vw': return val * viewportW.value / 100
    case 'vh': return val * viewportH.value / 100
    case '%': return val * viewportW.value / 100
  }
}

function fromPx(px, unit) {
  switch (unit) {
    case 'px': return px
    case 'rem': return px / rootFontSize.value
    case 'em': return px / rootFontSize.value
    case 'vw': return px / viewportW.value * 100
    case 'vh': return px / viewportH.value * 100
    case '%': return px / viewportW.value * 100
  }
}

function convert(toUnit) {
  const px = toPx(inputVal.value, inputUnit.value)
  const val = fromPx(px, toUnit)
  return parseFloat(val.toFixed(4)) + toUnit
}
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-5; }
.label { @apply text-sm font-medium text-gray-700; }
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400; }
</style>
