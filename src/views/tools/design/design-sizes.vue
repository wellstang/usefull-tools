<template>
  <ToolLayout title="设计尺寸速查" description="iOS / Android / Web 各平台图标和图片尺寸规范" category="design">
    <div class="max-w-3xl">
      <div class="flex gap-2 flex-wrap mb-5">
        <button v-for="p in platforms" :key="p.id" @click="active=p.id"
          :class="['px-4 py-1.5 text-sm rounded-full border transition-colors', active===p.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300']">
          {{ p.label }}
        </button>
      </div>

      <div v-if="current" class="space-y-6">
        <div v-for="section in current.sections" :key="section.name">
          <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Icon :icon="section.icon" class="text-indigo-500" />{{ section.name }}
          </h3>
          <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 text-xs text-gray-500">
                <tr>
                  <th class="text-left px-4 py-2">用途</th>
                  <th class="text-center px-4 py-2">尺寸（px）</th>
                  <th class="text-left px-4 py-2">备注</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in section.items" :key="item.name" class="border-t border-gray-100 hover:bg-gray-50">
                  <td class="px-4 py-2.5 text-gray-700">{{ item.name }}</td>
                  <td class="px-4 py-2.5 text-center font-mono text-indigo-600">{{ item.size }}</td>
                  <td class="px-4 py-2.5 text-gray-400 text-xs">{{ item.note || '' }}</td>
                </tr>
              </tbody>
            </table>
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

const active = ref('ios')

const platforms = [
  { id: 'ios', label: 'iOS', sections: [
    { name: 'App 图标', icon: 'mdi:apple', items: [
      { name: 'App Store', size: '1024×1024' },
      { name: 'iPhone 主屏幕', size: '180×180', note: '@3x' },
      { name: 'iPad 主屏幕', size: '167×167', note: '@2x' },
      { name: 'Spotlight', size: '120×120', note: '@3x' },
      { name: '通知', size: '60×60', note: '@3x' },
    ]},
    { name: '启动图', icon: 'mdi:image', items: [
      { name: 'iPhone 14 Pro Max', size: '1290×2796', note: '6.7"' },
      { name: 'iPhone 14', size: '1170×2532', note: '6.1"' },
      { name: 'iPhone SE', size: '750×1334', note: '4.7"' },
    ]},
  ]},
  { id: 'android', label: 'Android', sections: [
    { name: '应用图标', icon: 'mdi:android', items: [
      { name: 'xxxhdpi', size: '192×192' },
      { name: 'xxhdpi', size: '144×144' },
      { name: 'xhdpi', size: '96×96' },
      { name: 'hdpi', size: '72×72' },
      { name: 'mdpi', size: '48×48' },
      { name: 'Google Play', size: '512×512' },
    ]},
    { name: '通知图标', icon: 'mdi:bell', items: [
      { name: 'xxxhdpi', size: '96×96' },
      { name: 'xxhdpi', size: '72×72' },
      { name: 'xhdpi', size: '48×48' },
    ]},
  ]},
  { id: 'web', label: 'Web', sections: [
    { name: 'Favicon', icon: 'mdi:web', items: [
      { name: 'ICO', size: '16×16 / 32×32' },
      { name: 'Apple Touch Icon', size: '180×180' },
      { name: 'Android Chrome', size: '192×192' },
    ]},
    { name: 'Open Graph', icon: 'mdi:share-variant', items: [
      { name: 'OG Image', size: '1200×630', note: '推荐' },
      { name: 'Twitter Card', size: '1200×628' },
    ]},
  ]},
]

const current = computed(() => platforms.find(p => p.id === active.value))
</script>
