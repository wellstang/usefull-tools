<template>
  <div class="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
    <button
      v-for="cat in categories"
      :key="cat.id"
      @click="$emit('update:modelValue', cat.id)"
      :class="[
        'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
        modelValue === cat.id
          ? 'bg-indigo-600 text-white shadow-sm'
          : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
      ]"
    >
      <Icon :icon="cat.icon" class="text-base" />
      <span>{{ cat.label }}</span>
      <span
        v-if="counts[cat.id]"
        :class="[
          'text-xs px-1.5 py-0.5 rounded-full ml-0.5',
          modelValue === cat.id ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-500'
        ]"
      >
        {{ counts[cat.id] }}
      </span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { categories, tools } from '@/data/tools.js'

defineProps({
  modelValue: { type: String, default: 'all' },
})
defineEmits(['update:modelValue'])

const counts = computed(() => {
  const onlineTools = tools.filter(t => t.status === 'online')
  const result = { all: onlineTools.length }
  categories.slice(1).forEach(cat => {
    result[cat.id] = onlineTools.filter(t => t.category === cat.id).length
  })
  return result
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
