<template>
  <button
    @click="handleCopy"
    :class="[
      'inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg border transition-all',
      copied
        ? 'bg-green-50 border-green-300 text-green-600'
        : 'bg-white border-gray-300 text-gray-600 hover:border-indigo-400 hover:text-indigo-600'
    ]"
  >
    <Icon :icon="copied ? 'mdi:check' : 'mdi:content-copy'" class="text-base" />
    <span>{{ copied ? '已复制' : label }}</span>
  </button>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useClipboard } from '@/composables/useClipboard.js'

const props = defineProps({
  text: { type: String, required: true },
  label: { type: String, default: '复制' },
})

const { copied, copy } = useClipboard()
function handleCopy() { copy(props.text) }
</script>
