<template>
  <ToolLayout title="渐变色生成器" description="可视化配置 CSS 渐变，实时预览并生成代码" category="design">
    <div class="max-w-2xl space-y-5">
      <!-- 预览 -->
      <div class="h-32 rounded-2xl border border-gray-200 transition-all" :style="{ background: cssGradient }" />

      <div class="card space-y-4">
        <!-- 类型 & 角度 -->
        <div class="flex gap-3 items-center flex-wrap">
          <div class="flex gap-2">
            <button @click="type='linear'" :class="['px-3 py-1.5 text-sm rounded-lg border', type==='linear'?'bg-indigo-600 text-white border-indigo-600':'bg-white text-gray-600 border-gray-200']">线性</button>
            <button @click="type='radial'" :class="['px-3 py-1.5 text-sm rounded-lg border', type==='radial'?'bg-indigo-600 text-white border-indigo-600':'bg-white text-gray-600 border-gray-200']">径向</button>
          </div>
          <div v-if="type==='linear'" class="flex items-center gap-2">
            <label class="text-sm text-gray-500">角度</label>
            <input v-model.number="angle" type="range" min="0" max="360" class="w-28" />
            <span class="text-sm font-mono text-gray-600 w-12">{{ angle }}°</span>
          </div>
        </div>

        <!-- 色标 -->
        <div>
          <label class="label mb-2 block">色标（最多6个）</label>
          <div class="space-y-2">
            <div v-for="(stop, i) in stops" :key="i" class="flex items-center gap-3">
              <input type="color" v-model="stop.color" class="w-10 h-8 cursor-pointer rounded border border-gray-200" />
              <input v-model="stop.color" class="input font-mono w-28" />
              <input v-model.number="stop.pos" type="range" min="0" max="100" class="flex-1" />
              <span class="text-sm font-mono text-gray-500 w-10">{{ stop.pos }}%</span>
              <button v-if="stops.length > 2" @click="stops.splice(i,1)" class="text-gray-300 hover:text-red-400">✕</button>
            </div>
          </div>
          <button v-if="stops.length < 6" @click="stops.push({ color:'#ffffff', pos:100 })" class="mt-2 text-sm text-indigo-600 hover:text-indigo-700">+ 添加色标</button>
        </div>
      </div>

      <!-- CSS 代码 -->
      <div class="card">
        <div class="flex items-center justify-between mb-2">
          <label class="label">CSS 代码</label>
          <CopyButton :text="`background: ${cssGradient};`" />
        </div>
        <code class="block bg-gray-50 rounded-xl p-4 text-sm font-mono text-indigo-700 break-all">background: {{ cssGradient }};</code>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '@/components/common/ToolLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'

const type = ref('linear')
const angle = ref(135)
const stops = ref([
  { color: '#667eea', pos: 0 },
  { color: '#764ba2', pos: 100 },
])

const cssGradient = computed(() => {
  const sorted = [...stops.value].sort((a, b) => a.pos - b.pos)
  const colorStops = sorted.map(s => `${s.color} ${s.pos}%`).join(', ')
  if (type.value === 'radial') return `radial-gradient(circle, ${colorStops})`
  return `linear-gradient(${angle.value}deg, ${colorStops})`
})
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-5; }
.label { @apply text-sm font-medium text-gray-700; }
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400; }
</style>
