<template>
  <ToolLayout title="年龄计算器" description="精确计算年龄，下次生日倒计时，附星座生肖" category="life">
    <div class="max-w-lg space-y-5">
      <div class="card">
        <label class="label">出生日期</label>
        <input type="date" v-model="birthday" :max="today" class="input w-full mt-1" />
      </div>

      <div v-if="result" class="space-y-3">
        <div class="card text-center">
          <div class="text-5xl font-bold text-indigo-600 mb-1">{{ result.years }}</div>
          <div class="text-gray-500 mb-4">岁</div>
          <div class="grid grid-cols-3 gap-3 text-center">
            <div class="bg-indigo-50 rounded-xl p-3">
              <div class="text-xl font-bold text-indigo-700">{{ result.months }}</div>
              <div class="text-xs text-gray-500 mt-0.5">个月</div>
            </div>
            <div class="bg-indigo-50 rounded-xl p-3">
              <div class="text-xl font-bold text-indigo-700">{{ result.days }}</div>
              <div class="text-xs text-gray-500 mt-0.5">天</div>
            </div>
            <div class="bg-indigo-50 rounded-xl p-3">
              <div class="text-xl font-bold text-indigo-700">{{ result.totalDays.toLocaleString() }}</div>
              <div class="text-xs text-gray-500 mt-0.5">总天数</div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="card text-center">
            <div class="text-2xl mb-1">{{ result.zodiac }}</div>
            <div class="text-sm font-medium text-gray-700">{{ result.zodiacName }}</div>
            <div class="text-xs text-gray-400">星座</div>
          </div>
          <div class="card text-center">
            <div class="text-2xl mb-1">{{ result.shengxiaoEmoji }}</div>
            <div class="text-sm font-medium text-gray-700">{{ result.shengxiao }}</div>
            <div class="text-xs text-gray-400">生肖</div>
          </div>
        </div>

        <div class="card text-center">
          <div class="text-sm text-gray-500 mb-1">距下次生日</div>
          <div class="text-2xl font-bold text-pink-500">{{ result.daysToNextBirthday }}</div>
          <div class="text-sm text-gray-400">天</div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '@/components/common/ToolLayout.vue'

const today = new Date().toISOString().slice(0, 10)
const birthday = ref('1990-01-01')

const ZODIACS = [
  { name: '摩羯座', emoji: '♑', start: [12, 22] },{ name: '水瓶座', emoji: '♒', start: [1, 20] },
  { name: '双鱼座', emoji: '♓', start: [2, 19] },{ name: '白羊座', emoji: '♈', start: [3, 21] },
  { name: '金牛座', emoji: '♉', start: [4, 20] },{ name: '双子座', emoji: '♊', start: [5, 21] },
  { name: '巨蟹座', emoji: '♋', start: [6, 21] },{ name: '狮子座', emoji: '♌', start: [7, 23] },
  { name: '处女座', emoji: '♍', start: [8, 23] },{ name: '天秤座', emoji: '♎', start: [9, 23] },
  { name: '天蝎座', emoji: '♏', start: [10, 23] },{ name: '射手座', emoji: '♐', start: [11, 22] },
]
const SHENGXIAO = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪']
const SHENGXIAO_EMOJI = ['🐀','🐂','🐯','🐰','🐲','🐍','🐴','🐑','🐵','🐔','🐶','🐷']

function getZodiac(m, d) {
  for (let i = ZODIACS.length - 1; i >= 0; i--) {
    const [sm, sd] = ZODIACS[i].start
    if (m > sm || (m === sm && d >= sd)) return ZODIACS[i]
  }
  return ZODIACS[0]
}

const result = computed(() => {
  if (!birthday.value) return null
  const b = new Date(birthday.value)
  const now = new Date()
  let years = now.getFullYear() - b.getFullYear()
  let months = now.getMonth() - b.getMonth()
  let days = now.getDate() - b.getDate()
  if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate() }
  if (months < 0) { years--; months += 12 }
  const totalDays = Math.floor((now - b) / 864e5)

  // Next birthday
  let next = new Date(now.getFullYear(), b.getMonth(), b.getDate())
  if (next <= now) next.setFullYear(next.getFullYear() + 1)
  const daysToNextBirthday = Math.ceil((next - now) / 864e5)

  const zodiac = getZodiac(b.getMonth() + 1, b.getDate())
  const sxIdx = (b.getFullYear() - 1900) % 12

  return { years, months, days, totalDays, daysToNextBirthday,
    zodiacName: zodiac.name, zodiac: zodiac.emoji,
    shengxiao: SHENGXIAO[sxIdx] + '年', shengxiaoEmoji: SHENGXIAO_EMOJI[sxIdx] }
})
</script>
<style scoped>
.card { @apply bg-white rounded-xl border border-gray-200 p-5; }
.label { @apply text-sm font-medium text-gray-700; }
.input { @apply border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400; }
</style>
