<template>
  <ToolLayout title="竞品对比表" description="自定义维度的竞品分析表，支持本地存储和导出 CSV" category="product">
    <div class="space-y-4 overflow-x-auto">
      <div class="flex gap-3 flex-wrap">
        <input v-model="newCompetitor" placeholder="添加竞品..." class="input" @keyup.enter="addCompetitor" />
        <button @click="addCompetitor" class="btn-primary">+ 竞品</button>
        <input v-model="newDimension" placeholder="添加维度..." class="input" @keyup.enter="addDimension" />
        <button @click="addDimension" class="btn-secondary">+ 维度</button>
        <button @click="exportCsv" class="btn-secondary flex items-center gap-1"><Icon icon="mdi:download" />导出 CSV</button>
        <button @click="reset" class="text-xs text-gray-400 hover:text-red-400 transition-colors ml-auto self-center">重置</button>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table class="w-full text-sm min-w-[600px]">
          <thead class="bg-gray-50">
            <tr>
              <th class="text-left px-4 py-3 text-gray-600 font-medium w-40">维度</th>
              <th v-for="(comp, ci) in competitors" :key="ci" class="px-3 py-3 text-center">
                <div class="flex items-center justify-center gap-1">
                  <span class="font-medium text-gray-800">{{ comp }}</span>
                  <button @click="competitors.splice(ci,1);data.forEach(r=>r.splice(ci,1))" class="text-gray-300 hover:text-red-400">✕</button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(dim, di) in dimensions" :key="di" class="border-t border-gray-100">
              <td class="px-4 py-2">
                <div class="flex items-center gap-1">
                  <span class="text-gray-700">{{ dim }}</span>
                  <button @click="dimensions.splice(di,1);data.splice(di,1)" class="text-gray-200 hover:text-red-400 text-xs">✕</button>
                </div>
              </td>
              <td v-for="(comp, ci) in competitors" :key="ci" class="px-3 py-2">
                <input v-model="data[di][ci]" class="w-full text-center text-sm border border-transparent rounded px-2 py-1 focus:border-indigo-300 focus:bg-indigo-50 outline-none" placeholder="—" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import ToolLayout from '@/components/common/ToolLayout.vue'
import { useStorage } from '@/composables/useStorage.js'

const DEFAULT_COMPETITORS = ['我们', '竞品A', '竞品B']
const DEFAULT_DIMENSIONS = ['核心功能', '定价', '用户体验', '市场份额']
const DEFAULT_DATA = () => DEFAULT_DIMENSIONS.map(() => Array(DEFAULT_COMPETITORS.length).fill(''))

const competitors = useStorage('tt-ct-competitors', DEFAULT_COMPETITORS)
const dimensions = useStorage('tt-ct-dimensions', DEFAULT_DIMENSIONS)
const data = useStorage('tt-ct-data', DEFAULT_DATA())

const newCompetitor = ref('')
const newDimension = ref('')

function addCompetitor() {
  if (!newCompetitor.value.trim()) return
  competitors.value.push(newCompetitor.value.trim())
  data.value.forEach(row => row.push(''))
  newCompetitor.value = ''
}

function addDimension() {
  if (!newDimension.value.trim()) return
  dimensions.value.push(newDimension.value.trim())
  data.value.push(Array(competitors.value.length).fill(''))
  newDimension.value = ''
}

function exportCsv() {
  const header = ['维度', ...competitors.value].join(',')
  const rows = dimensions.value.map((dim, i) => [dim, ...data.value[i]].join(','))
  const csv = [header, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = '竞品对比.csv'; a.click()
  URL.revokeObjectURL(url)
}

function reset() {
  competitors.value = [...DEFAULT_COMPETITORS]
  dimensions.value = [...DEFAULT_DIMENSIONS]
  data.value = DEFAULT_DATA()
}
</script>
