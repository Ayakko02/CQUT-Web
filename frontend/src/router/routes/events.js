// # 活动路由

// frontend/src/router/routes/events.js

export default [
    {
        // 活动中心首页
        path: '/events',
        name: 'Events',
        component: () => import('@/views/Events/index.vue'),
        meta: {
            title: '活动中心',
            requiresAuth: false,
            theme: 'zero', // 零域主题
            index: 10,
            description: '探索CQUT动漫社的精彩活动',
            keepAlive: true // 缓存页面状态
        }
    },

    {
        // 活动列表页（可选，如果首页就是列表可以省略）
        path: '/events/list',
        name: 'EventsList',
        component: () => import('@/views/Events/EventsList.vue'),
        meta: {
            title: '活动列表',
            requiresAuth: false,
            index: 11,
            breadcrumb: [
                { name: '活动中心', path: '/events' },
                { name: '活动列表' }
            ]
        }
    },

    {
        // 活动详情页
        path: '/events/:id',
        name: 'EventDetail',
        component: () => import('@/views/Events/EventDetail.vue'),
        meta: {
            title: '活动详情',
            requiresAuth: false,
            index: 12,
            breadcrumb: [
                { name: '活动中心', path: '/events' },
                { name: '活动详情' }
            ]
        },
        // 路由参数校验
        props: (route) => ({
            id: Number(route.params.id) || null
        }),
        // 路由守卫：检查活动是否存在
        beforeEnter: (to, from, next) => {
            const eventId = Number(to.params.id)

            // 简单校验 ID 是否有效
            if (!eventId || eventId < 1) {
                console.warn('❌ 无效的活动ID:', to.params.id)
                next({ name: 'Events' }) // 跳转回活动列表
                return
            }

            // 这里可以添加更复杂的校验，比如检查活动是否存在
            // const eventExists = checkEventExists(eventId)
            // if (!eventExists) {
            //   next({ name: 'NotFound' })
            //   return
            // }

            next()
        }
    },

    {
        // 活动日历页
        path: '/events/calendar',
        name: 'EventCalendar',
        component: () => import('@/views/Events/EventCalendar.vue'),
        meta: {
            title: '活动日历',
            requiresAuth: false,
            index: 13,
            breadcrumb: [
                { name: '活动中心', path: '/events' },
                { name: '活动日历' }
            ]
        }
    }]

//     {
//         // 活动报名页（需要登录）
//         path: '/events/:id/register',
//         name: 'EventRegister',
//         component: () => import('@/views/Events/EventRegister.vue'),
//         meta: {
//             title: '活动报名',
//             requiresAuth: true, // 需要登录
//             index: 14,
//             breadcrumb: [
//                 { name: '活动中心', path: '/events' },
//                 { name: '活动详情', path: '/events/:id' },
//                 { name: '报名' }
//             ]
//         },
//         props: true
//     },
//
//     {
//         // 我的活动页（需要登录）
//         path: '/events/my',
//         name: 'MyEvents',
//         component: () => import('@/views/Events/MyEvents.vue'),
//         meta: {
//             title: '我的活动',
//             requiresAuth: true, // 需要登录
//             index: 15,
//             breadcrumb: [
//                 { name: '活动中心', path: '/events' },
//                 { name: '我的活动' }
//             ]
//         }
//     },
//
//     {
//         // 活动创建/编辑页（需要管理员权限）
//         path: '/events/create',
//         name: 'EventCreate',
//         component: () => import('@/views/Events/EventCreate.vue'),
//         meta: {
//             title: '创建活动',
//             requiresAuth: true,
//             requiresAdmin: true, // 需要管理员权限
//             index: 16,
//             breadcrumb: [
//                 { name: '活动中心', path: '/events' },
//                 { name: '创建活动' }
//             ]
//         }
//     },
//
//     {
//         path: '/events/:id/edit',
//         name: 'EventEdit',
//         component: () => import('@/views/Events/EventCreate.vue'), // 复用创建页组件
//         meta: {
//             title: '编辑活动',
//             requiresAuth: true,
//             requiresAdmin: true,
//             index: 17,
//             breadcrumb: [
//                 { name: '活动中心', path: '/events' },
//                 { name: '活动详情', path: '/events/:id' },
//                 { name: '编辑' }
//             ]
//         },
//         props: true
//     }
// ]