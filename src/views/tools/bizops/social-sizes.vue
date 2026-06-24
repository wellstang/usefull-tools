<template>
  <ToolLayout title="社交平台图片尺寸" description="各平台封面/头像/帖子图尺寸规范速查" category="ops">
    <div class="max-w-3xl space-y-4">
      <div class="flex gap-2 flex-wrap">
        <button v-for="p in platforms" :key="p.id" @click="active=p.id"
          :class="['px-4 py-1.5 text-sm rounded-full border transition-colors', active===p.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300']">
          {{ p.label }}
        </button>
      </div>

      <div v-if="currentPlatform" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div v-for="item in currentPlatform.sizes" :key="item.name" class="card flex gap-4 items-center">
          <div class="bg-gray-100 rounded-lg flex items-center justify-center shrink-0" :style="{ width: previewW(item) + 'px', height: previewH(item) + 'px', minWidth: previewW(item) + 'px' }">
            <span class="text-xs text-gray-400 font-mono">{{ item.w }}×{{ item.h }}</span>
          </div>
          <div>
            <div class="font-medium text-gray-800 text-sm">{{ item.name }}</div>
            <div class="text-xs text-gray-500 mt-0.5">{{ item.w }} × {{ item.h }} px</div>
            <div v-if="item.note" class="text-xs text-indigo-600 mt-0.5">{{ item.note }}</div>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '@/components/common/ToolLayout.vue'

const active = ref('wechat')

const platforms = [
  { id: 'wechat', label: '微信', sizes: [
    { name: '公众号头图', w: 900, h: 383, note: '2.35:1 横图' },
    { name: '公众号方图', w: 900, h: 900 },
    { name: '微信头像', w: 640, h: 640 },
    { name: '朋友圈横图', w: 1080, h: 608 },
    { name: '微信视频号封面', w: 1280, h: 720 },
  ]},
  { id: 'weibo', label: '微博', sizes: [
    { name: '微博头像', w: 180, h: 180 },
    { name: '微博封面', w: 1296, h: 372 },
    { name: '单图帖子', w: 1280, h: 1024 },
    { name: '多图帖子', w: 1080, h: 1080 },
  ]},
  { id: 'xiaohongshu', label: '小红书', sizes: [
    { name: '封面图（竖）', w: 1242, h: 1660, note: '3:4 推荐' },
    { name: '封面图（方）', w: 1080, h: 1080 },
    { name: '头像', w: 200, h: 200 },
  ]},
  { id: 'douyin', label: '抖音', sizes: [
    { name: '竖版视频封面', w: 1080, h: 1920, note: '9:16' },
    { name: '头像', w: 200, h: 200 },
    { name: '背景图', w: 1125, h: 633 },
  ]},
  { id: 'linkedin', label: 'LinkedIn', sizes: [
    { name: '个人头像', w: 400, h: 400 },
    { name: '封面图', w: 1584, h: 396 },
    { name: '帖子图片', w: 1200, h: 627 },
    { name: '公司 Logo', w: 300, h: 300 },
  ]},
]

const currentPlatform = computed(() => platforms.find(p => p.id === active.value))

function previewW(item) {
  const ratio = item.w / item.h
  return ratio >= 1 ? 80 : Math.round(80 * ratio)
}
function previewH(item) {
  const ratio = item.w / item.h
  return ratio >= 1 ? Math.round(80 / ratio) : 80
}
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-4; }
</style>
