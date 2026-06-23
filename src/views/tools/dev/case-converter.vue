<template>
  <ToolLayout title="大小写格式转换" description="camelCase / PascalCase / snake_case / kebab-case 变量名互转" category="dev">
    <div class="max-w-2xl space-y-4">
      <div>
        <label class="label">输入（任意格式）</label>
        <input v-model="input" @input="convert" placeholder="helloWorld 或 hello_world 或 Hello World" class="input w-full mt-1 text-base font-mono" spellcheck="false" />
      </div>

      <div v-if="results.length" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div v-for="item in results" :key="item.label" class="card flex items-center justify-between">
          <div>
            <div class="text-xs text-gray-400 mb-1">{{ item.label }}</div>
            <div class="font-mono text-sm font-medium text-gray-800">{{ item.value }}</div>
          </div>
          <CopyButton :text="item.value" />
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '@/components/common/ToolLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'

const input = ref('')
const results = ref([])

function splitWords(str) {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/[-_]+/g, ' ')
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
}

function convert() {
  const words = splitWords(input.value)
  if (!words.length) { results.value = []; return }
  results.value = [
    { label: 'camelCase', value: words[0] + words.slice(1).map(w => w[0].toUpperCase() + w.slice(1)).join('') },
    { label: 'PascalCase', value: words.map(w => w[0].toUpperCase() + w.slice(1)).join('') },
    { label: 'snake_case', value: words.join('_') },
    { label: 'kebab-case', value: words.join('-') },
    { label: 'CONSTANT_CASE', value: words.join('_').toUpperCase() },
    { label: 'Title Case', value: words.map(w => w[0].toUpperCase() + w.slice(1)).join(' ') },
  ]
}
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-4; }
.label { @apply text-sm font-medium text-gray-700; }
.input { @apply border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent; }
</style>
