<template>
  <ToolLayout title="用户故事生成器" description="填写角色/目标/动机，生成标准格式用户故事和验收标准" category="product">
    <div class="max-w-2xl space-y-5">
      <div class="card space-y-4">
        <div><label class="label">角色（Who）</label><input v-model="role" placeholder="例如：新注册用户" class="input w-full mt-1" /></div>
        <div><label class="label">目标（What）</label><input v-model="goal" placeholder="例如：查看我的历史订单" class="input w-full mt-1" /></div>
        <div><label class="label">动机（Why）</label><input v-model="motivation" placeholder="例如：了解自己的消费记录" class="input w-full mt-1" /></div>
        <div>
          <label class="label">场景前提（可选，用于 Given）</label>
          <input v-model="context" placeholder="例如：用户已完成至少一笔订单" class="input w-full mt-1" />
        </div>
        <div>
          <label class="label">成功标准（可选，用于 Then）</label>
          <input v-model="successCriteria" placeholder="例如：显示订单列表，包含时间、金额、状态" class="input w-full mt-1" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label">性能要求（可选）</label>
            <input v-model="perfReq" placeholder="例如：3 秒内加载完成" class="input w-full mt-1" />
          </div>
          <div>
            <label class="label">异常处理（可选）</label>
            <input v-model="errorHandling" placeholder="例如：空数据时显示引导提示" class="input w-full mt-1" />
          </div>
        </div>
        <button @click="generate" :disabled="!role || !goal" class="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">生成用户故事</button>
      </div>

      <div v-if="story" class="card space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold text-gray-800">生成结果</h3>
          <CopyButton :text="fullText" label="复制全部" />
        </div>
        <div class="bg-indigo-50 rounded-xl p-4">
          <p class="font-medium text-indigo-800 leading-relaxed">{{ story }}</p>
        </div>
        <div>
          <h4 class="text-sm font-medium text-gray-700 mb-2">验收标准（Given/When/Then）</h4>
          <div class="space-y-2">
            <div v-for="(ac, i) in acceptanceCriteria" :key="i" class="bg-gray-50 rounded-lg p-3 text-sm">
              <span class="font-medium text-gray-600">{{ ac.prefix }}</span> {{ ac.text }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '@/components/common/ToolLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'

const role = ref('注册用户')
const goal = ref('查看历史订单')
const motivation = ref('了解消费记录')
const context = ref('')
const successCriteria = ref('')
const perfReq = ref('')
const errorHandling = ref('')

const story = ref('')
const acceptanceCriteria = ref([])

function generate() {
  if (!role.value || !goal.value) return
  story.value = `作为一个${role.value}，我希望能够${goal.value}，以便${motivation.value || '满足我的需求'}。`

  const given = context.value.trim()
    ? `用户为${role.value}，且${context.value}`
    : `用户已作为${role.value}登录系统，并有访问"${goal.value}"的权限入口`

  const then = successCriteria.value.trim()
    ? successCriteria.value
    : `系统正确展示与"${goal.value}"相关的完整信息，且数据准确无误`

  const criteria = [
    { prefix: 'Given（前提）：', text: given },
    { prefix: 'When（操作）：', text: `用户触发"${goal.value}"功能（点击按钮 / 进入页面 / 提交表单等）` },
    { prefix: 'Then（结果）：', text: then },
  ]

  if (perfReq.value.trim()) {
    criteria.push({ prefix: 'And（性能）：', text: perfReq.value })
  } else {
    criteria.push({ prefix: 'And（性能）：', text: '关键操作响应时间不超过 3 秒，并在等待期间展示适当的加载状态' })
  }

  if (errorHandling.value.trim()) {
    criteria.push({ prefix: 'And（异常）：', text: errorHandling.value })
  } else {
    criteria.push({ prefix: 'And（异常）：', text: `当"${goal.value}"不可用或数据为空时，展示友好的提示信息而非空白或报错` })
  }

  acceptanceCriteria.value = criteria
}

const fullText = computed(() => {
  if (!story.value) return ''
  return story.value + '\n\n验收标准：\n' + acceptanceCriteria.value.map(a => a.prefix + a.text).join('\n')
})

generate()
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-5; }
.label { @apply text-sm font-medium text-gray-700; }
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full; }
.btn-primary { @apply px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors; }
</style>
