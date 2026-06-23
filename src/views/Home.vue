<template>
  <div class="max-w-6xl mx-auto px-4 py-10">
    <!-- Hero -->
    <div class="text-center mb-10">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">
        唐唐工具箱 🔧
      </h1>
      <p class="text-lg text-gray-500 mb-1">趁手好用的一站式效率工具集合</p>
      <p class="text-sm text-gray-400">{{ onlineCount }} 个工具 · 全部免费 · 数据不离开浏览器</p>
    </div>

    <!-- 搜索框 -->
    <div class="relative max-w-xl mx-auto mb-8">
      <Icon icon="mdi:magnify" class="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400 pointer-events-none" />
      <input
        v-model="query"
        type="text"
        placeholder="搜索工具名称、功能描述..."
        class="w-full pl-11 pr-10 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-gray-800 placeholder-gray-400"
      />
      <button v-if="query" @click="query = ''" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
        <Icon icon="mdi:close-circle" class="text-xl" />
      </button>
    </div>

    <!-- 分类 Tab -->
    <div class="mb-8">
      <CategoryTabs v-model="activeCategory" />
    </div>

    <!-- 工具卡片 Grid -->
    <template v-if="filteredTools.length > 0">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ToolCard v-for="tool in filteredTools" :key="tool.id" :tool="tool" />
      </div>
    </template>
    <EmptyState
      v-else
      :title="query ? `没有找到「${query}」相关工具` : '该分类暂无工具'"
      :subtitle="query ? '换个关键词试试？' : ''"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { tools, categories } from '@/data/tools.js'
import CategoryTabs from '@/components/common/CategoryTabs.vue'
import ToolCard from '@/components/common/ToolCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const route = useRoute()
const query = ref('')

// 从 ?category=dev 初始化分类；URL 变化时同步更新
const validIds = categories.map(c => c.id)
const activeCategory = ref(validIds.includes(route.query.category) ? route.query.category : 'all')
watch(() => route.query.category, (val) => {
  activeCategory.value = validIds.includes(val) ? val : 'all'
})

const onlineTools = computed(() => tools.filter(t => t.status === 'online'))
const onlineCount = computed(() => onlineTools.value.length)

const filteredTools = computed(() => {
  let list = onlineTools.value

  if (activeCategory.value !== 'all') {
    list = list.filter(t => t.category === activeCategory.value)
  }

  if (query.value.trim()) {
    const q = query.value.trim().toLowerCase()
    list = list.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.toLowerCase().includes(q))
    )
  }

  return list
})
</script>
