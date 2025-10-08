// # 首页路由 - 双城页面路由
// frontend/src/router/guards.js

// frontend/src/router/routes/home.js

export default [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
        meta: {
            title: '首页',
            requiresAuth: false,
            theme: 'zero',
            keepAlive: true,
            index: 0,
            description: 'CQUT动漫社官方网站 - 零域·溯洄双城展示',
            keywords: ['CQUT', '动漫社', '零域', '溯洄', 'ACGN']
        }
    }
]