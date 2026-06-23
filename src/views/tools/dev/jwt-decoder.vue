<template>
  <ToolLayout title="JWT 解码器" description="解析 JWT Token 的 Header 和 Payload，纯客户端，不验签" category="dev">
    <div class="max-w-3xl space-y-4">
      <div class="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 flex items-start gap-2">
        <Icon icon="mdi:shield-alert-outline" class="text-xl mt-0.5 shrink-0" />
        <span>此工具仅解码 JWT，<strong>不验证签名</strong>，解码结果仅供调试参考，不可用于安全校验。</span>
      </div>

      <div>
        <label class="label">粘贴 JWT Token</label>
        <textarea v-model="token" @input="decode" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." class="textarea h-24 font-mono text-xs mt-1" spellcheck="false" />
      </div>

      <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">❌ {{ error }}</div>

      <div v-if="header || payload" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="card">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-gray-800">Header</h3>
            <CopyButton :text="JSON.stringify(header, null, 2)" />
          </div>
          <pre class="font-mono text-xs bg-gray-50 rounded-lg p-3 overflow-auto">{{ JSON.stringify(header, null, 2) }}</pre>
        </div>
        <div class="card">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-gray-800">Payload</h3>
            <CopyButton :text="JSON.stringify(payload, null, 2)" />
          </div>
          <pre class="font-mono text-xs bg-gray-50 rounded-lg p-3 overflow-auto">{{ JSON.stringify(payload, null, 2) }}</pre>
          <div v-if="expInfo" :class="['mt-3 text-sm px-3 py-2 rounded-lg', expInfo.expired ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600']">
            {{ expInfo.expired ? '⚠️ Token 已过期：' : '✅ Token 有效，过期时间：' }} {{ expInfo.time }}
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import ToolLayout from '@/components/common/ToolLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'

const token = ref('')
const header = ref(null)
const payload = ref(null)
const error = ref('')

function b64decode(str) {
  const pad = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = pad + '='.repeat((4 - pad.length % 4) % 4)
  return JSON.parse(decodeURIComponent(escape(atob(padded))))
}

function decode() {
  error.value = ''; header.value = null; payload.value = null
  const t = token.value.trim().replace(/^Bearer\s+/i, '')
  if (!t) return
  const parts = t.split('.')
  if (parts.length !== 3) { error.value = '无效的 JWT 格式，应为三段（header.payload.signature）'; return }
  try { header.value = b64decode(parts[0]) } catch (e) { error.value = 'Header 解码失败：' + e.message; return }
  try { payload.value = b64decode(parts[1]) } catch (e) { error.value = 'Payload 解码失败：' + e.message }
}

const expInfo = computed(() => {
  if (!payload.value?.exp) return null
  const d = new Date(payload.value.exp * 1000)
  return { expired: Date.now() > payload.value.exp * 1000, time: d.toLocaleString('zh-CN') }
})
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-5; }
.label { @apply text-sm font-medium text-gray-700; }
.textarea { @apply w-full rounded-xl border border-gray-200 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent; }
</style>
