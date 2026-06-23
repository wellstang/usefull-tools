<template>
  <ToolLayout title="内容日历" description="可视化内容排期，管理发布计划" category="ops">
    <div class="space-y-4">
      <!-- 顶栏 -->
      <div class="flex items-center gap-3 flex-wrap">
        <div class="flex items-center gap-2">
          <button @click="prevMonth" class="p-2 rounded-lg hover:bg-gray-100 transition-colors"><Icon icon="mdi:chevron-left" /></button>
          <span class="font-semibold text-gray-800 w-28 text-center">{{ yearMonth }}</span>
          <button @click="nextMonth" class="p-2 rounded-lg hover:bg-gray-100 transition-colors"><Icon icon="mdi:chevron-right" /></button>
        </div>
        <button @click="showAdd=true" class="btn-primary ml-auto flex items-center gap-1"><Icon icon="mdi:plus" />添加内容</button>
      </div>

      <!-- 周历头 -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div class="grid grid-cols-7 border-b border-gray-100">
          <div v-for="d in ['日','一','二','三','四','五','六']" :key="d" class="text-center text-xs text-gray-400 py-2 font-medium">{{ d }}</div>
        </div>
        <div class="grid grid-cols-7">
          <div v-for="(day, i) in calDays" :key="i"
            :class="['border-t border-l border-gray-100 p-1.5 min-h-[80px]', !day.current?'bg-gray-50':'', i%7===0?'border-l-0':'']">
            <div :class="['text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1', day.isToday?'bg-indigo-600 text-white':day.current?'text-gray-700':'text-gray-300']">
              {{ day.date }}
            </div>
            <div v-for="ev in day.events" :key="ev.id"
              :class="['text-xs px-1.5 py-0.5 rounded mb-0.5 truncate cursor-pointer', typeColors[ev.type] || 'bg-gray-100 text-gray-600']"
              @click="selectedEvent=ev">
              {{ ev.title }}
            </div>
          </div>
        </div>
      </div>

      <!-- 添加弹窗 -->
      <div v-if="showAdd" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" @click.self="showAdd=false">
        <div class="bg-white rounded-2xl p-6 w-full max-w-sm space-y-3">
          <h3 class="font-semibold text-gray-800">添加内容</h3>
          <input v-model="newEv.title" placeholder="内容标题" class="input w-full" />
          <input type="date" v-model="newEv.date" class="input w-full" />
          <select v-model="newEv.type" class="input w-full">
            <option value="article">文章</option><option value="video">视频</option>
            <option value="social">社媒</option><option value="email">邮件</option>
          </select>
          <div class="flex gap-2">
            <button @click="showAdd=false" class="flex-1 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50">取消</button>
            <button @click="addEvent" class="flex-1 btn-primary py-2">添加</button>
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
import { useStorage } from '@/composables/useStorage.js'

const now = new Date()
const year = ref(now.getFullYear())
const month = ref(now.getMonth())

const yearMonth = computed(() => `${year.value} 年 ${month.value + 1} 月`)

function prevMonth() { if (month.value === 0) { month.value = 11; year.value-- } else month.value-- }
function nextMonth() { if (month.value === 11) { month.value = 0; year.value++ } else month.value++ }

const events = useStorage('tt-calendar-events', [])

function getNextId() {
  return events.value.reduce((max, e) => Math.max(max, e.id || 0), 0) + 1
}

const typeColors = { article: 'bg-blue-100 text-blue-700', video: 'bg-red-100 text-red-700', social: 'bg-green-100 text-green-700', email: 'bg-purple-100 text-purple-700' }

const showAdd = ref(false)
const newEv = ref({ title: '', date: now.toISOString().slice(0,10), type: 'article' })
const selectedEvent = ref(null)

function addEvent() {
  if (!newEv.value.title || !newEv.value.date) return
  events.value.push({ ...newEv.value, id: getNextId() })
  newEv.value = { title: '', date: now.toISOString().slice(0,10), type: 'article' }
  showAdd.value = false
}

const calDays = computed(() => {
  const first = new Date(year.value, month.value, 1)
  const last = new Date(year.value, month.value + 1, 0)
  const startDow = first.getDay()
  const days = []
  for (let i = 0; i < startDow; i++) {
    const d = new Date(first); d.setDate(d.getDate() - (startDow - i))
    days.push({ date: d.getDate(), current: false, isToday: false, events: [] })
  }
  for (let d = 1; d <= last.getDate(); d++) {
    const dateStr = `${year.value}-${String(month.value+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    const dayEvents = events.value.filter(e => e.date === dateStr)
    const today = new Date(); const isToday = today.getFullYear()===year.value && today.getMonth()===month.value && today.getDate()===d
    days.push({ date: d, current: true, isToday, events: dayEvents })
  }
  const rem = 7 - (days.length % 7)
  if (rem < 7) for (let i = 1; i <= rem; i++) days.push({ date: i, current: false, isToday: false, events: [] })
  return days
})
</script>
