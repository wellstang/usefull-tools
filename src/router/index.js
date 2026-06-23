import { createRouter, createWebHashHistory } from 'vue-router'
import tools from '@/data/tools.js'

// import.meta.glob 预加载所有工具组件（kebab-case 文件名与路由末段一致）
const modules = import.meta.glob('/src/views/tools/**/*.vue')

const toolRoutes = tools.map(tool => ({
  path: tool.route,
  // route: '/tools/dev/json-formatter' → key: '/src/views/tools/dev/json-formatter.vue'
  component: modules[`/src/views${tool.route}.vue`],
}))

const routes = [
  {
    path: '/',
    component: () => import('@/views/Home.vue'),
  },
  ...toolRoutes,
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
