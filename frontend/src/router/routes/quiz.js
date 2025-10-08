// # 小程序路由 - ACGN测试相关

export default [
    {
        path: '/quiz',
        name: 'Quiz',
        component: () => import('@/features/quiz/components/QuizApp.vue'),
        meta: {
            title: 'ACGN浓度测试',
            requiresAuth: false,
            index: 50
        }
    }
]