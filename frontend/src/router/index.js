// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// 自动导入所有 views/ 下的 .vue 文件
const modules = import.meta.glob('../views/**/*.vue')

// 映射文件路径到路由
const routes = Object.keys(modules).map((path) => {
  // 提取文件名，如 '../views/Home.vue' -> 'Home'
  const fileName = path
    .split('/')
    .pop()
    .replace(/\.\w+$/, '') // 去掉扩展名

  // 转换路径：/Home -> /
  //          /About -> /about
  //          /Admin/Dashboard -> /admin/dashboard
  const routePath = path
    .replace('../views', '')           // 去掉前缀
    .replace(/\.vue$/, '')             // 去掉 .vue
    .replace(/\/index$/i, '')          // 可选：/index -> /
    .toLowerCase()                     // 全小写
    .replace(/^\//, '/')               // 确保以 / 开头
    .replace(/\/([a-z])/g, (match) => match.toUpperCase()) // 首字母大写？不，我们用小写更合理
    // 我们决定：全部小写路由
    .toLowerCase()

  // 特殊处理：Home.vue 对应根路径 /
  if (fileName === 'Home') {
    return {
      path: '/',
      name: 'Home',
      component: modules[path]
    }
  }

  return {
    path: routePath,
    name: fileName,
    component: modules[path]
  }
})

// 确保 / 路由存在（如果没有 Home.vue，手动加一个）
const hasHomeRoute = routes.some(r => r.path === '/')
if (!hasHomeRoute) {
  console.warn('⚠️ 未找到 Home.vue，添加默认首页')
  routes.unshift({
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  })
}

// 添加 quiz 路由
routes.push({
  path: '/quiz',
  name: 'Quiz',
  component: () => import('../features/quiz/components/QuizApp.vue'),
  meta: { title: 'ACGN浓度测试' }
})

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
  // 滚动行为：切换路由时回到顶部
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router