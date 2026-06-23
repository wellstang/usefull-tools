<template>
  <ToolLayout title="用户故事生成器" description="填写角色/目标/动机，生成标准格式用户故事和验收标准" category="product">
    <div class="max-w-2xl space-y-5">
      <div class="card space-y-4">
        <div><label class="label">角色（Who）</label><input v-model="role" placeholder="例如：新注册用户" class="input w-full mt-1" /></div>
        <div><label class="label">目标（What）</label><input v-model="goal" placeholder="例如：查看我的历史订单" class="input w-full mt-1" /></div>
        <div><label class="label">动机（Why）</label><input v-model="motivation" placeholder="例如：了解自己的消费记录" class="input w-full mt-1" /></div>
        <button @click="generate" class="btn-primary">生成用户故事</button>
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
const story = ref('')
const acceptanceCriteria = ref([])

function generate() {
  if (!role.value || !goal.value) return
  story.value = `作为一个${role.value}，我希望能够${goal.value}，以便${motivation.value || '满足我的需求'}。`
  acceptanceCriteria.value = [
    { prefix: 'Given（前提）：', text: `用户已登录系统，且有相关${goal.value}的入口` },
    { prefix: 'When（操作）：', text: `用户点击"${goal.value}"功能` },
    { prefix: 'Then（结果）：', text: `系统显示用户${goal.value}的完整信息，数据准确` },
    { prefix: 'And（补充）：', text: `加载时间不超过 3 秒，并提供适当的加载状态` },
  ]
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
