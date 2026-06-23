<template>
  <ToolLayout title="需求优先级矩阵" description="RICE 评分框架，可视化需求排序" category="product">
    <div class="space-y-5">
      <!-- 添加需求 -->
      <div class="card">
        <h3 class="font-semibold text-gray-800 mb-4">添加需求</h3>
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <input v-model="newItem.name" placeholder="需求名称" class="input sm:col-span-1" />
          <div><label class="text-xs text-gray-400">触达 R</label><input v-model.number="newItem.reach" type="number" min="1" class="input w-full" placeholder="1000" /></div>
          <div><label class="text-xs text-gray-400">影响 I (1-3)</label><input v-model.number="newItem.impact" type="number" min="1" max="3" class="input w-full" /></div>
          <div><label class="text-xs text-gray-400">信心 C (%)</label><input v-model.number="newItem.confidence" type="number" min="1" max="100" class="input w-full" /></div>
          <div><label class="text-xs text-gray-400">工作量 E (人天)</label><input v-model.number="newItem.effort" type="number" min="0.1" class="input w-full" /></div>
        </div>
        <button @click="addItem" class="btn-primary mt-3">添加</button>
      </div>

      <!-- 排行榜 -->
      <div v-if="ranked.length" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-gray-500">
            <tr>
              <th class="text-left px-4 py-3">排名</th>
              <th class="text-left px-4 py-3">需求</th>
              <th class="text-center px-3 py-3">R</th>
              <th class="text-center px-3 py-3">I</th>
              <th class="text-center px-3 py-3">C%</th>
              <th class="text-center px-3 py-3">E</th>
              <th class="text-center px-4 py-3 font-semibold text-indigo-600">RICE</th>
              <th class="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in ranked" :key="item.id" class="border-t border-gray-100 hover:bg-gray-50">
              <td class="px-4 py-3">
                <span :class="['w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold', i===0?'bg-yellow-100 text-yellow-700':i===1?'bg-gray-100 text-gray-600':i===2?'bg-orange-100 text-orange-600':'text-gray-400']">{{ i+1 }}</span>
              </td>
              <td class="px-4 py-3 font-medium">{{ item.name }}</td>
              <td class="px-3 py-3 text-center text-gray-500">{{ item.reach }}</td>
              <td class="px-3 py-3 text-center text-gray-500">{{ item.impact }}</td>
              <td class="px-3 py-3 text-center text-gray-500">{{ item.confidence }}%</td>
              <td class="px-3 py-3 text-center text-gray-500">{{ item.effort }}</td>
              <td class="px-4 py-3 text-center font-bold text-indigo-600">{{ item.rice }}</td>
              <td class="px-3 py-3"><button @click="remove(item.id)" class="text-gray-300 hover:text-red-400 transition-colors">✕</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-200">
        添加需求后，系统将自动按 RICE 分数排序
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '@/components/common/ToolLayout.vue'

const items = ref([
  { id: 1, name: '示例：用户引导流程', reach: 5000, impact: 2, confidence: 80, effort: 5 },
  { id: 2, name: '示例：搜索功能优化', reach: 10000, impact: 3, confidence: 90, effort: 10 },
])
let nextId = 3

const newItem = ref({ name: '', reach: 1000, impact: 2, confidence: 80, effort: 5 })

function rice(item) {
  return +(item.reach * item.impact * (item.confidence / 100) / item.effort).toFixed(1)
}

const ranked = computed(() => [...items.value].map(i => ({ ...i, rice: rice(i) })).sort((a, b) => b.rice - a.rice))

function addItem() {
  if (!newItem.value.name) return
  items.value.push({ ...newItem.value, id: nextId++ })
  newItem.value = { name: '', reach: 1000, impact: 2, confidence: 80, effort: 5 }
}

function remove(id) { items.value = items.value.filter(i => i.id !== id) }
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-5; }
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400; }
.btn-primary { @apply px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors; }
</style>
