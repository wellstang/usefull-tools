<template>
  <ToolLayout title="竞品对比表" description="自定义维度的竞品分析表，支持本地存储和导出 CSV" category="product">
    <div class="space-y-4 overflow-x-auto">
      <div class="flex gap-3 flex-wrap">
        <input v-model="newCompetitor" placeholder="添加竞品..." class="input" @keyup.enter="addCompetitor" />
        <button @click="addCompetitor" class="btn-primary">+ 竞品</button>
        <input v-model="newDimension" placeholder="添加维度..." class="input" @keyup.enter="addDimension" />
        <button @click="addDimension" class="btn-secondary">+ 维度</button>
        <button @click="exportCsv" class="btn-secondary flex items-center gap-1"><Icon icon="mdi:download" />导出 CSV</button>
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
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import ToolLayout from '@/components/common/ToolLayout.vue'

const competitors = ref(['我们', '竞品A', '竞品B'])
const dimensions = ref(['核心功能', '定价', '用户体验', '市场份额'])
const data = ref(dimensions.value.map(() => Array(competitors.value.length).fill('')))

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
</script>
<style scoped>
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400; }
.btn-primary { @apply px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors; }
.btn-secondary { @apply px-4 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-indigo-400 hover:text-indigo-600 transition-colors; }
</style>
