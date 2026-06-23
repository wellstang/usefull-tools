<template>
  <ToolLayout title="HTTP 状态码速查" description="所有 HTTP 状态码分类展示，含中文描述和使用场景" category="dev">
    <div class="max-w-3xl">
      <div class="relative mb-6">
        <Icon icon="mdi:magnify" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input v-model="query" placeholder="搜索状态码或关键词，如 404、重定向..." class="input w-full pl-9" />
      </div>

      <div v-for="group in filteredGroups" :key="group.range" class="mb-8">
        <h3 class="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span :class="['w-2 h-2 rounded-full', group.color]" />
          {{ group.range }} {{ group.label }}
        </h3>
        <div class="space-y-2">
          <div v-for="code in group.codes" :key="code.code" class="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-start gap-4 hover:border-indigo-200 transition-colors">
            <span :class="['font-mono font-bold text-lg w-12 shrink-0', group.textColor]">{{ code.code }}</span>
            <div>
              <div class="font-medium text-gray-900">{{ code.name }}</div>
              <div class="text-sm text-gray-500 mt-0.5">{{ code.desc }}</div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredGroups.length === 0 || filteredGroups.every(g => g.codes.length === 0)" class="text-center py-16 text-gray-400">
        <Icon icon="mdi:magnify-close" class="text-5xl mb-3" />
        <p>没有找到「{{ query }}」相关的状态码</p>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import ToolLayout from '@/components/common/ToolLayout.vue'

const query = ref('')

const allGroups = [
  { range: '1xx', label: '信息性响应', color: 'bg-blue-400', textColor: 'text-blue-500', codes: [
    { code: 100, name: 'Continue', desc: '客户端应继续发送请求' },
    { code: 101, name: 'Switching Protocols', desc: '服务器同意升级协议（如 WebSocket）' },
    { code: 102, name: 'Processing', desc: '服务器正在处理请求（WebDAV）' },
  ]},
  { range: '2xx', label: '成功', color: 'bg-green-400', textColor: 'text-green-600', codes: [
    { code: 200, name: 'OK', desc: '请求成功，最常用的状态码' },
    { code: 201, name: 'Created', desc: '资源创建成功，常用于 POST 请求' },
    { code: 202, name: 'Accepted', desc: '请求已接受，但处理尚未完成（异步任务）' },
    { code: 204, name: 'No Content', desc: '成功但无返回内容，常用于 DELETE 请求' },
    { code: 206, name: 'Partial Content', desc: '返回部分内容，用于断点续传' },
  ]},
  { range: '3xx', label: '重定向', color: 'bg-yellow-400', textColor: 'text-yellow-600', codes: [
    { code: 301, name: 'Moved Permanently', desc: '资源永久移动，浏览器会缓存新地址' },
    { code: 302, name: 'Found', desc: '临时重定向，不缓存' },
    { code: 304, name: 'Not Modified', desc: '资源未修改，使用缓存即可' },
    { code: 307, name: 'Temporary Redirect', desc: '临时重定向，方法不变（保持 POST）' },
    { code: 308, name: 'Permanent Redirect', desc: '永久重定向，方法不变' },
  ]},
  { range: '4xx', label: '客户端错误', color: 'bg-orange-400', textColor: 'text-orange-600', codes: [
    { code: 400, name: 'Bad Request', desc: '请求语法错误或参数非法' },
    { code: 401, name: 'Unauthorized', desc: '未认证，需要登录' },
    { code: 403, name: 'Forbidden', desc: '已认证但无权限访问' },
    { code: 404, name: 'Not Found', desc: '资源不存在' },
    { code: 405, name: 'Method Not Allowed', desc: '请求方法不被支持' },
    { code: 408, name: 'Request Timeout', desc: '请求超时' },
    { code: 409, name: 'Conflict', desc: '请求与当前资源状态冲突（如版本冲突）' },
    { code: 410, name: 'Gone', desc: '资源已永久删除' },
    { code: 413, name: 'Content Too Large', desc: '请求体超过服务器限制' },
    { code: 422, name: 'Unprocessable Entity', desc: '语义错误，常用于表单校验失败' },
    { code: 429, name: 'Too Many Requests', desc: '请求频率超过限制' },
  ]},
  { range: '5xx', label: '服务器错误', color: 'bg-red-400', textColor: 'text-red-600', codes: [
    { code: 500, name: 'Internal Server Error', desc: '服务器内部错误' },
    { code: 501, name: 'Not Implemented', desc: '服务器不支持该请求方法' },
    { code: 502, name: 'Bad Gateway', desc: '网关或代理收到无效响应' },
    { code: 503, name: 'Service Unavailable', desc: '服务器暂时不可用（维护或过载）' },
    { code: 504, name: 'Gateway Timeout', desc: '网关超时' },
  ]},
]

const filteredGroups = computed(() => {
  if (!query.value.trim()) return allGroups
  const q = query.value.trim().toLowerCase()
  return allGroups.map(g => ({
    ...g,
    codes: g.codes.filter(c => String(c.code).includes(q) || c.name.toLowerCase().includes(q) || c.desc.includes(q))
  })).filter(g => g.codes.length > 0)
})
</script>
<style scoped>
.input { @apply border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent; }
</style>
