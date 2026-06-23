<template>
  <ToolLayout title="SQL 格式化" description="美化、压缩 SQL 语句，支持 MySQL / PostgreSQL / BigQuery / SQLite" category="dev">
    <div class="space-y-3">
      <!-- 工具栏 -->
      <div class="flex flex-wrap items-center gap-3 bg-white rounded-xl border border-gray-200 px-4 py-3">
        <div class="flex items-center gap-2">
          <label class="label">方言</label>
          <select v-model="dialect" class="input">
            <option value="sql">通用 SQL</option>
            <option value="mysql">MySQL</option>
            <option value="postgresql">PostgreSQL</option>
            <option value="bigquery">BigQuery</option>
            <option value="sqlite">SQLite</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <label class="label">缩进</label>
          <select v-model="indentSize" class="input">
            <option :value="2">2 空格</option>
            <option :value="4">4 空格</option>
          </select>
        </div>
        <div class="flex gap-2 ml-auto">
          <button @click="format" class="btn-primary">美化</button>
          <button @click="minify" class="btn-secondary">压缩</button>
          <button @click="input = ''; output = ''; error = ''" class="btn-ghost">清空</button>
        </div>
      </div>

      <!-- 双列编辑器 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="flex flex-col gap-2">
          <label class="label">输入 SQL</label>
          <textarea
            v-model="input"
            placeholder="SELECT u.id, u.name, COUNT(o.id) AS order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.created_at > '2024-01-01' GROUP BY u.id ORDER BY order_count DESC LIMIT 20"
            class="textarea h-96 font-mono text-sm"
            spellcheck="false"
          />
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <label class="label">输出结果</label>
            <CopyButton v-if="output && !error" :text="output" />
          </div>
          <div v-if="error" class="h-96 bg-red-50 border border-red-200 rounded-xl p-4 font-mono text-sm text-red-600 overflow-auto">
            ❌ {{ error }}
          </div>
          <textarea
            v-else
            v-model="output"
            readonly
            class="textarea h-96 font-mono text-sm bg-gray-50"
            spellcheck="false"
          />
        </div>
      </div>

      <!-- 快捷示例 -->
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <p class="text-xs font-medium text-gray-500 mb-2">示例 SQL</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="ex in examples"
            :key="ex.label"
            @click="input = ex.sql; format()"
            class="text-xs px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            {{ ex.label }}
          </button>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import { format as sqlFormat } from 'sql-formatter'
import ToolLayout from '@/components/common/ToolLayout.vue'
import CopyButton from '@/components/common/CopyButton.vue'

const dialect = ref('mysql')
const indentSize = ref(2)
const input = ref('')
const output = ref('')
const error = ref('')

function format() {
  error.value = ''
  if (!input.value.trim()) return
  try {
    output.value = sqlFormat(input.value, {
      language: dialect.value,
      tabWidth: indentSize.value,
      keywordCase: 'upper',
      linesBetweenQueries: 1,
    })
  } catch (e) {
    error.value = e.message
    output.value = ''
  }
}

function minify() {
  error.value = ''
  if (!input.value.trim()) return
  try {
    // 先格式化再压缩，确保语法合法性
    const formatted = sqlFormat(input.value, { language: dialect.value })
    output.value = formatted
      .replace(/\s+/g, ' ')
      .replace(/\s*,\s*/g, ', ')
      .replace(/\s*=\s*/g, ' = ')
      .trim()
  } catch (e) {
    error.value = e.message
    output.value = ''
  }
}

const examples = [
  {
    label: 'SELECT + JOIN',
    sql: "SELECT u.id,u.name,COUNT(o.id) AS order_count FROM users u LEFT JOIN orders o ON u.id=o.user_id WHERE u.created_at>'2024-01-01' GROUP BY u.id ORDER BY order_count DESC LIMIT 20",
  },
  {
    label: 'INSERT',
    sql: "INSERT INTO users(name,email,role,created_at) VALUES('张三','zhang@example.com','admin',NOW())",
  },
  {
    label: 'UPDATE',
    sql: "UPDATE products SET price=price*0.9,updated_at=NOW() WHERE category_id=5 AND stock>0 AND is_active=1",
  },
  {
    label: 'CREATE TABLE',
    sql: "CREATE TABLE orders(id BIGINT PRIMARY KEY AUTO_INCREMENT,user_id BIGINT NOT NULL,amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,status TINYINT NOT NULL DEFAULT 0,created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,INDEX idx_user(user_id),INDEX idx_status(status))",
  },
  {
    label: '子查询',
    sql: "SELECT * FROM products WHERE id IN(SELECT product_id FROM order_items WHERE order_id IN(SELECT id FROM orders WHERE user_id=1 AND status=2))",
  },
]
</script>
