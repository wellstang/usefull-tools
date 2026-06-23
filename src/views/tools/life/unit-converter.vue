<template>
  <ToolLayout title="单位换算" description="长度 / 重量 / 温度 / 面积 / 体积单位换算" category="life">
    <div class="max-w-2xl space-y-5">
      <!-- 类别 Tab -->
      <div class="flex gap-2 flex-wrap">
        <button v-for="cat in categories" :key="cat.id" @click="switchCat(cat.id)"
          :class="['px-4 py-1.5 text-sm rounded-full border transition-colors', activeCategory===cat.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300']">
          {{ cat.label }}
        </button>
      </div>

      <!-- 输入 -->
      <div class="card flex gap-3 items-end">
        <div class="flex-1">
          <label class="label">数值</label>
          <input v-model.number="inputVal" type="number" class="input w-full mt-1 text-lg" @input="convert" />
        </div>
        <div class="flex-1">
          <label class="label">源单位</label>
          <select v-model="fromUnit" class="input w-full mt-1" @change="convert">
            <option v-for="u in currentUnits" :key="u.id" :value="u.id">{{ u.label }}</option>
          </select>
        </div>
      </div>

      <!-- 结果 -->
      <div class="space-y-2">
        <div v-for="u in currentUnits" :key="u.id" v-show="u.id !== fromUnit"
          class="card flex items-center justify-between hover:border-indigo-200 transition-colors">
          <span class="text-sm text-gray-500">{{ u.label }}</span>
          <div class="flex items-center gap-3">
            <span class="font-mono font-semibold text-gray-800">{{ formatResult(results[u.id]) }}</span>
            <CopyButton :text="String(results[u.id])" />
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import ToolLayout from '@/components/common/ToolLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'

const categories = [
  { id: 'length', label: '长度' },
  { id: 'weight', label: '重量' },
  { id: 'temperature', label: '温度' },
  { id: 'area', label: '面积' },
]

const unitData = {
  length: [
    { id: 'mm', label: '毫米 (mm)', toBase: 0.001 },
    { id: 'cm', label: '厘米 (cm)', toBase: 0.01 },
    { id: 'm', label: '米 (m)', toBase: 1 },
    { id: 'km', label: '千米 (km)', toBase: 1000 },
    { id: 'in', label: '英寸 (in)', toBase: 0.0254 },
    { id: 'ft', label: '英尺 (ft)', toBase: 0.3048 },
    { id: 'mi', label: '英里 (mi)', toBase: 1609.34 },
  ],
  weight: [
    { id: 'mg', label: '毫克 (mg)', toBase: 0.000001 },
    { id: 'g', label: '克 (g)', toBase: 0.001 },
    { id: 'kg', label: '千克 (kg)', toBase: 1 },
    { id: 't', label: '吨 (t)', toBase: 1000 },
    { id: 'lb', label: '磅 (lb)', toBase: 0.453592 },
    { id: 'oz', label: '盎司 (oz)', toBase: 0.0283495 },
    { id: 'jin', label: '斤', toBase: 0.5 },
  ],
  temperature: [
    { id: 'C', label: '摄氏度 (°C)' },
    { id: 'F', label: '华氏度 (°F)' },
    { id: 'K', label: '开尔文 (K)' },
  ],
  area: [
    { id: 'm2', label: '平方米 (m²)', toBase: 1 },
    { id: 'km2', label: '平方千米 (km²)', toBase: 1e6 },
    { id: 'cm2', label: '平方厘米 (cm²)', toBase: 0.0001 },
    { id: 'ha', label: '公顷 (ha)', toBase: 10000 },
    { id: 'mu', label: '亩', toBase: 666.67 },
    { id: 'ft2', label: '平方英尺 (ft²)', toBase: 0.092903 },
  ],
}

const activeCategory = ref('length')
const inputVal = ref(1)
const fromUnit = ref('m')
const results = reactive({})

const currentUnits = computed(() => unitData[activeCategory.value])

function switchCat(id) {
  activeCategory.value = id
  fromUnit.value = currentUnits.value[0].id
  convert()
}

function convertTemp(val, from) {
  let celsius
  if (from === 'C') celsius = val
  else if (from === 'F') celsius = (val - 32) * 5 / 9
  else celsius = val - 273.15
  return { C: celsius, F: celsius * 9 / 5 + 32, K: celsius + 273.15 }
}

function convert() {
  const units = currentUnits.value
  if (activeCategory.value === 'temperature') {
    const r = convertTemp(inputVal.value, fromUnit.value)
    units.forEach(u => { results[u.id] = r[u.id] })
  } else {
    const fromDef = units.find(u => u.id === fromUnit.value)
    const baseVal = inputVal.value * (fromDef?.toBase || 1)
    units.forEach(u => { results[u.id] = baseVal / u.toBase })
  }
}

function formatResult(v) {
  if (v === undefined || v === null) return '—'
  if (Math.abs(v) < 1e-6 || Math.abs(v) > 1e9) return v.toExponential(4)
  return parseFloat(v.toFixed(6)).toString()
}

convert()
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-4; }
.label { @apply text-sm font-medium text-gray-700; }
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400; }
</style>
