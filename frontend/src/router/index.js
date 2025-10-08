// frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// 1️⃣ 导入所有路由模块
import homeRoutes from './routes/home'
// import aboutRoutes from './routes/about'
// import adminRoutes from './routes/admin'
// import communityRoutes from './routes/community'
import eventsRoutes from './routes/events'
// import newsRoutes from './routes/news'
import quizRoutes from './routes/quiz'
// import servicesRoutes from './routes/services'

// 2️⃣ 导入路由守卫
import { setupRouterGuards } from './guards'

// 3️⃣ 合并所有路由配置
const routes = [
  ...homeRoutes,      // 首页
  // ...aboutRoutes,     // 关于页面
  ...eventsRoutes,    // 活动相关
  ...quizRoutes,      // ACGN测试
  // ...newsRoutes,      // 新闻资讯
  // ...communityRoutes, // 社区
  // ...servicesRoutes,  // 服务
  // ...adminRoutes,     // 管理后台

  // 4️⃣ 404 页面（放在最后，匹配所有未定义路由）
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/Error/NotFound.vue'),
    meta: {
      title: '页面未找到 - CQUT动漫社'
    }
  }
]

// 5️⃣ 创建路由实例
const router = createRouter({
  // 使用 HTML5 history 模式（URL不带#号）
  history: createWebHistory(import.meta.env.BASE_URL),

  // 路由配置
  routes,

  // 6️⃣ 滚动行为：页面切换时的滚动位置
  scrollBehavior(to, from, savedPosition) {
    // 如果有保存的位置（浏览器前进后退），恢复到该位置
    if (savedPosition) {
      return savedPosition
    }
    // 如果路由有 hash（锚点），滚动到该元素
    else if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    // 默认回到顶部
    else {
      return {
        top: 0,
        behavior: 'smooth'
      }
    }
  }
})

// 7️⃣ 设置路由守卫（从 guards.js 导入）
setupRouterGuards(router)

// 8️⃣ 导出路由实例
export default router