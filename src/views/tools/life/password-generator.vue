<template>
  <ToolLayout title="密码生成器" description="生成安全随机密码，自定义规则和强度评估" category="life">
    <div class="max-w-lg space-y-5">
      <!-- 生成的密码 -->
      <div class="bg-white rounded-2xl border border-gray-200 p-5">
        <div class="flex items-center gap-3 mb-3">
          <span class="font-mono text-xl font-bold text-gray-800 flex-1 break-all tracking-widest">{{ password }}</span>
          <CopyButton :text="password" />
          <button @click="generate" class="p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50" title="重新生成">
            <Icon icon="mdi:refresh" class="text-xl" />
          </button>
        </div>
        <!-- 强度条 -->
        <div class="flex items-center gap-2">
          <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-300" :style="{ width: strength.pct + '%', backgroundColor: strength.color }" />
          </div>
          <span class="text-sm font-medium" :style="{ color: strength.color }">{{ strength.label }}</span>
        </div>
      </div>

      <!-- 配置 -->
      <div class="card space-y-4">
        <div>
          <label class="label">长度：{{ length }}</label>
          <input type="range" v-model.number="length" min="4" max="128" class="w-full mt-1" />
          <div class="flex justify-between text-xs text-gray-400 mt-0.5"><span>4</span><span>128</span></div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <label v-for="opt in options" :key="opt.key" class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="opt.enabled" class="rounded" />
            <span class="text-sm text-gray-700">{{ opt.label }}</span>
          </label>
        </div>
        <div>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="excludeAmbiguous" class="rounded" />
            <span class="text-sm text-gray-700">排除易混淆字符（0 O l 1 I）</span>
          </label>
        </div>
      </div>

      <!-- 批量生成 -->
      <div class="card">
        <div class="flex items-center justify-between mb-3">
          <label class="label">批量生成</label>
          <div class="flex gap-2 items-center">
            <input type="number" v-model.number="batchCount" min="1" max="20" class="input w-16" />
            <button @click="generateBatch" class="btn-secondary">生成</button>
            <CopyButton v-if="batch.length" :text="batch.join('\n')" label="全部复制" />
          </div>
        </div>
        <div class="space-y-1.5 max-h-40 overflow-y-auto">
          <div v-for="(p, i) in batch" :key="i" class="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-1.5">
            <span class="font-mono text-sm">{{ p }}</span>
            <CopyButton :text="p" />
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Icon } from '@iconify/vue'
import ToolLayout from '@/components/common/ToolLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'

const length = ref(16)
const excludeAmbiguous = ref(false)
const batchCount = ref(5)
const batch = ref([])

const options = ref([
  { key: 'upper', label: '大写字母 A-Z', charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', enabled: true },
  { key: 'lower', label: '小写字母 a-z', charset: 'abcdefghijklmnopqrstuvwxyz', enabled: true },
  { key: 'number', label: '数字 0-9', charset: '0123456789', enabled: true },
  { key: 'symbol', label: '特殊字符 !@#$...', charset: '!@#$%^&*()_+-=[]{}|;:,.<>?', enabled: false },
])

const AMBIGUOUS = 'OIl10'

function buildCharset() {
  let charset = options.value.filter(o => o.enabled).map(o => o.charset).join('')
  if (excludeAmbiguous.value) charset = charset.split('').filter(c => !AMBIGUOUS.includes(c)).join('')
  return charset || 'abcdefghijklmnopqrstuvwxyz'
}

function randomPass(len, charset) {
  const arr = new Uint32Array(len)
  crypto.getRandomValues(arr)
  return Array.from(arr, v => charset[v % charset.length]).join('')
}

const password = ref('')

function generate() {
  password.value = randomPass(length.value, buildCharset())
}

function generateBatch() {
  const charset = buildCharset()
  batch.value = Array.from({ length: batchCount.value }, () => randomPass(length.value, charset))
}

const strength = computed(() => {
  const p = password.value
  let score = 0
  if (p.length >= 8) score++; if (p.length >= 12) score++; if (p.length >= 16) score++
  if (/[A-Z]/.test(p)) score++; if (/[a-z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++; if (/[^A-Za-z0-9]/.test(p)) score++
  const levels = [
    { label: '极弱', color: '#ef4444', pct: 15 },
    { label: '弱', color: '#f97316', pct: 30 },
    { label: '一般', color: '#eab308', pct: 50 },
    { label: '强', color: '#22c55e', pct: 75 },
    { label: '极强', color: '#10b981', pct: 100 },
  ]
  return levels[Math.min(Math.floor(score / 1.5), 4)]
})

watch([length, options, excludeAmbiguous], generate, { deep: true })
generate()
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-5; }
.label { @apply text-sm font-medium text-gray-700; }
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400; }
.btn-secondary { @apply px-3 py-1.5 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-indigo-400 hover:text-indigo-600 transition-colors; }
</style>
