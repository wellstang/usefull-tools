<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
      <RouterLink to="/" class="flex items-center gap-2 font-bold text-lg text-gray-900 hover:text-indigo-600 transition-colors">
        <span class="text-2xl">🔧</span>
        <span>唐唐工具箱</span>
      </RouterLink>

      <div class="flex items-center gap-3">
        <!-- 护眼模式开关 -->
        <button
          @click="eyeMode = !eyeMode"
          :title="eyeMode ? '关闭护眼模式' : '开启护眼模式'"
          :class="[
            'flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border transition-all',
            eyeMode
              ? 'bg-amber-50 border-amber-300 text-amber-700'
              : 'bg-white border-gray-200 text-gray-500 hover:border-amber-300 hover:text-amber-600'
          ]"
        >
          <Icon :icon="eyeMode ? 'mdi:eye-check-outline' : 'mdi:eye-outline'" class="text-base" />
          <span class="hidden sm:inline text-xs">{{ eyeMode ? '护眼中' : '护眼' }}</span>
        </button>

        <!-- GitHub -->
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
    </div>
  </header>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useEyeMode } from '@/composables/useEyeMode.js'

const { eyeMode } = useEyeMode()
</script>
