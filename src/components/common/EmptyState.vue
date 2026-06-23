<template>
  <div class="flex flex-col items-center justify-center py-20 text-center">
    <Icon icon="mdi:magnify-close" class="text-6xl text-gray-300 mb-4" />
    <p class="text-gray-500 font-medium text-lg mb-1">{{ title }}</p>
    <p class="text-gray-400 text-sm">{{ subtitle }}</p>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  title: { type: String, default: '没有找到相关工具' },
  subtitle: { type: String, default: '换个关键词试试？' },
})
</script>
