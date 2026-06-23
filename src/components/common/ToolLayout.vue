<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <!-- 面包屑 -->
    <nav class="flex items-center gap-2 text-sm text-gray-400 mb-6">
      <RouterLink to="/" class="hover:text-indigo-600 transition-colors flex items-center gap-1">
        <Icon icon="mdi:home-outline" />
        <span>首页</span>
      </RouterLink>
      <Icon icon="mdi:chevron-right" />
      <span class="text-gray-500">{{ categoryLabel }}</span>
      <Icon icon="mdi:chevron-right" />
      <span class="text-gray-700 font-medium">{{ title }}</span>
    </nav>

    <!-- 标题区 -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ title }}</h1>
      <p class="text-gray-500">{{ description }}</p>
    </div>

    <!-- 工具主体（error boundary） -->
    <div v-if="hasError" class="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
      <Icon icon="mdi:alert-circle-outline" class="text-4xl text-red-400 mb-3" />
      <p class="text-red-600 font-medium">工具出现了问题，请刷新页面重试</p>
      <p class="text-red-400 text-sm mt-1">{{ errorMsg }}</p>
    </div>
    <slot v-else />
  </div>
</template>

<script setup>
import { ref, computed, onErrorCaptured } from 'vue'
import { Icon } from '@iconify/vue'
import { categories } from '@/data/tools.js'

/**
 * @prop {string} title       - 工具名称
 * @prop {string} description - 工具描述
 * @prop {string} [category]  - 分类 id（用于面包屑）
 */
const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, default: '' },
})

const categoryLabel = computed(() => {
  const cat = categories.find(c => c.id === props.category)
  return cat ? cat.label : '工具'
})

const hasError = ref(false)
const errorMsg = ref('')

onErrorCaptured((err) => {
  hasError.value = true
  errorMsg.value = err.message
  console.error('[ToolLayout] 工具异常:', err)
  return false
})
</script>
