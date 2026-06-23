<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
      <RouterLink to="/" class="flex items-center gap-2 font-bold text-lg text-gray-900 hover:text-indigo-600 transition-colors">
        <span class="text-2xl">🔧</span>
        <span>唐唐工具箱</span>
      </RouterLink>

      <a
        href="https://github.com/wellstang/usefull-tools"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <Icon icon="mdi:github" class="text-xl" />
        <span class="hidden sm:inline">GitHub</span>
      </a>
    </div>
  </header>
</template>

<script setup>
import { Icon } from '@iconify/vue'
</script>
