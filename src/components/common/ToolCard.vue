<template>
  <RouterLink
    :to="tool.route"
    class="group bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 hover:shadow-md hover:border-indigo-200 transition-all duration-200"
  >
    <div class="flex items-start justify-between">
      <div class="w-12 h-12 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
        <Icon :icon="tool.icon" class="text-2xl text-indigo-600" />
      </div>
      <span class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
        {{ categoryLabel }}
      </span>
    </div>
    <div>
      <h3 class="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
        {{ tool.name }}
      </h3>
      <p class="text-sm text-gray-500 line-clamp-2">{{ tool.description }}</p>
    </div>
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { categories } from '@/data/tools.js'

const props = defineProps({
  tool: { type: Object, required: true },
})

const categoryLabel = computed(() => {
  const cat = categories.find(c => c.id === props.tool.category)
  return cat ? cat.label : ''
})
</script>
