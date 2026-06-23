<template>
  <ToolLayout title="需求优先级矩阵" description="RICE / ICE 评分框架，可视化需求排序" category="product">
    <div class="space-y-5">
      <!-- 框架切换 -->
      <div class="flex gap-2">
        <button
          v-for="m in modes" :key="m.id"
          @click="mode = m.id"
          :class="['px-4 py-1.5 text-sm rounded-full border transition-colors', mode===m.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300']"
        >{{ m.label }}</button>
      </div>

      <!-- 说明 -->
      <div class="bg-indigo-50 rounded-xl px-4 py-3 text-sm text-indigo-700">
        <span v-if="mode==='rice'">
          <strong>RICE</strong> = (触达 R × 影响 I × 信心 C%) ÷ 工作量 E（人天）
        </span>
        <span v-else>
          <strong>ICE</strong> = 影响力 I × 信心 C × 易实现度 E（均为 1-10 分）
        </span>
      </div>

      <!-- 添加需求 -->
      <div class="card">
        <h3 class="font-semibold text-gray-800 mb-4">添加需求</h3>
        <div v-if="mode==='rice'" class="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <input v-model="newItem.name" placeholder="需求名称" class="input sm:col-span-1" />
          <div><label class="text-xs text-gray-400">触达 R（用户数）</label><input v-model.number="newItem.reach" type="number" min="1" class="input w-full" placeholder="1000" /></div>
          <div><label class="text-xs text-gray-400">影响 I (1-3)</label><input v-model.number="newItem.impact" type="number" min="1" max="3" class="input w-full" /></div>
          <div><label class="text-xs text-gray-400">信心 C (%)</label><input v-model.number="newItem.confidence" type="number" min="1" max="100" class="input w-full" /></div>
          <div><label class="text-xs text-gray-400">工作量 E (人天)</label><input v-model.number="newItem.effort" type="number" min="0.1" class="input w-full" /></div>
        </div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <input v-model="newItem.name" placeholder="需求名称" class="input sm:col-span-1" />
          <div><label class="text-xs text-gray-400">影响力 I (1-10)</label><input v-model.number="newItem.ice_impact" type="number" min="1" max="10" class="input w-full" /></div>
          <div><label class="text-xs text-gray-400">信心 C (1-10)</label><input v-model.number="newItem.ice_confidence" type="number" min="1" max="10" class="input w-full" /></div>
          <div><label class="text-xs text-gray-400">易实现 E (1-10)</label><input v-model.number="newItem.ice_ease" type="number" min="1" max="10" class="input w-full" /></div>
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
              <template v-if="mode==='rice'">
                <th class="text-center px-3 py-3">R</th>
                <th class="text-center px-3 py-3">I</th>
                <th class="text-center px-3 py-3">C%</th>
                <th class="text-center px-3 py-3">E</th>
                <th class="text-center px-4 py-3 font-semibold text-indigo-600">RICE</th>
              </template>
              <template v-else>
                <th class="text-center px-3 py-3">I</th>
                <th class="text-center px-3 py-3">C</th>
                <th class="text-center px-3 py-3">E</th>
                <th class="text-center px-4 py-3 font-semibold text-indigo-600">ICE</th>
              </template>
              <th class="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in ranked" :key="item.id" class="border-t border-gray-100 hover:bg-gray-50">
              <td class="px-4 py-3">
                <span :class="['w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold', i===0?'bg-yellow-100 text-yellow-700':i===1?'bg-gray-100 text-gray-600':i===2?'bg-orange-100 text-orange-600':'text-gray-400']">{{ i+1 }}</span>
              </td>
              <td class="px-4 py-3 font-medium">{{ item.name }}</td>
              <template v-if="mode==='rice'">
                <td class="px-3 py-3 text-center text-gray-500">{{ item.reach }}</td>
                <td class="px-3 py-3 text-center text-gray-500">{{ item.impact }}</td>
                <td class="px-3 py-3 text-center text-gray-500">{{ item.confidence }}%</td>
                <td class="px-3 py-3 text-center text-gray-500">{{ item.effort }}</td>
                <td class="px-4 py-3 text-center font-bold text-indigo-600">{{ item.score }}</td>
              </template>
              <template v-else>
                <td class="px-3 py-3 text-center text-gray-500">{{ item.ice_impact }}</td>
                <td class="px-3 py-3 text-center text-gray-500">{{ item.ice_confidence }}</td>
                <td class="px-3 py-3 text-center text-gray-500">{{ item.ice_ease }}</td>
                <td class="px-4 py-3 text-center font-bold text-indigo-600">{{ item.score }}</td>
              </template>
              <td class="px-3 py-3"><button @click="remove(item.id)" class="text-gray-300 hover:text-red-400 transition-colors">✕</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-200">
        添加需求后，系统将自动按分数排序
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '@/components/common/ToolLayout.vue'

const modes = [
  { id: 'rice', label: 'RICE 评分' },
  { id: 'ice', label: 'ICE 评分' },
]
const mode = ref('rice')

const items = ref([
  { id: 1, name: '示例：用户引导流程', reach: 5000, impact: 2, confidence: 80, effort: 5, ice_impact: 8, ice_confidence: 7, ice_ease: 6 },
  { id: 2, name: '示例：搜索功能优化', reach: 10000, impact: 3, confidence: 90, effort: 10, ice_impact: 9, ice_confidence: 8, ice_ease: 5 },
])
let nextId = 3

const newItem = ref({ name: '', reach: 1000, impact: 2, confidence: 80, effort: 5, ice_impact: 7, ice_confidence: 7, ice_ease: 7 })

function scoreOf(item) {
  if (mode.value === 'rice') {
    return +(item.reach * item.impact * (item.confidence / 100) / item.effort).toFixed(1)
  }
  return +(item.ice_impact * item.ice_confidence * item.ice_ease).toFixed(0)
}

const ranked = computed(() =>
  [...items.value].map(i => ({ ...i, score: scoreOf(i) })).sort((a, b) => b.score - a.score)
)

function addItem() {
  if (!newItem.value.name) return
  items.value.push({ ...newItem.value, id: nextId++ })
  newItem.value = { name: '', reach: 1000, impact: 2, confidence: 80, effort: 5, ice_impact: 7, ice_confidence: 7, ice_ease: 7 }
}

function remove(id) { items.value = items.value.filter(i => i.id !== id) }
</script>
