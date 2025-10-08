// # 路由守卫 - 权限验证、登录拦截
// frontend/src/router/guards.js

/**
 * 设置路由守卫
 * @param {Router} router - Vue Router 实例
 */
export function setupRouterGuards(router) {

    // 1️⃣ 全局前置守卫 - 在路由跳转前执行
    router.beforeEach((to, from, next) => {
        console.log(`🚀 路由跳转: ${from.path} → ${to.path}`)

        // ===== 页面标题更新 =====
        updatePageTitle(to)

        // ===== 权限检查 =====
        const authCheck = checkAuthentication(to)
        if (!authCheck.allowed) {
            console.warn('❌ 权限不足，跳转到登录页')
            next({ name: 'Login', query: { redirect: to.fullPath } })
            return
        }

        // ===== 显示加载动画 =====
        showLoadingIndicator()

        // ===== 允许跳转 =====
        next()
    })

    // 2️⃣ 全局后置钩子 - 在路由跳转后执行
    router.afterEach((to, from) => {
        console.log(`✅ 路由跳转完成: ${to.path}`)

        // ===== 隐藏加载动画 =====
        hideLoadingIndicator()

        // ===== 页面访问统计（可选）=====
        trackPageView(to)
    })

    // 3️⃣ 路由错误处理
    router.onError((error) => {
        console.error('❌ 路由错误:', error)
        // 可以在这里显示错误提示
    })
}

// ========== 辅助函数 ==========

/**
 * 更新页面标题
 */
function updatePageTitle(route) {
    const baseTitle = 'CQUT动漫社'
    const pageTitle = route.meta.title

    if (pageTitle) {
        document.title = `${pageTitle} - ${baseTitle}`
    } else {
        document.title = baseTitle
    }
}

/**
 * 检查用户权限
 */
function checkAuthentication(route) {
    // 检查路由是否需要登录
    const requiresAuth = route.meta.requiresAuth
    // 检查路由是否需要管理员权限
    const requiresAdmin = route.meta.requiresAdmin

    // 如果不需要权限，直接通过
    if (!requiresAuth && !requiresAdmin) {
        return { allowed: true }
    }

    // 从本地存储或状态管理获取用户信息
    const user = getUserFromStorage()

    // 需要登录但未登录
    if (requiresAuth && !user) {
        return { allowed: false, reason: 'not_logged_in' }
    }

    // 需要管理员权限但不是管理员
    if (requiresAdmin && (!user || user.role !== 'admin')) {
        return { allowed: false, reason: 'not_admin' }
    }

    return { allowed: true }
}

/**
 * 获取用户信息（从本地存储或状态管理）
 */
function getUserFromStorage() {
    try {
        const userStr = localStorage.getItem('user')
        return userStr ? JSON.parse(userStr) : null
    } catch (error) {
        console.error('获取用户信息失败:', error)
        return null
    }
}

/**
 * 显示加载指示器
 */
function showLoadingIndicator() {
    // 方案1: 使用 NProgress (需要安装 nprogress)
    // NProgress.start()

    // 方案2: 使用自定义加载动画
    const loader = document.getElementById('page-loader')
    if (loader) {
        loader.style.display = 'flex'
    }

    // 方案3: 添加 body 类名
    document.body.classList.add('page-loading')
}

/**
 * 隐藏加载指示器
 */
function hideLoadingIndicator() {
    // 延迟一点隐藏，确保新页面渲染完成
    setTimeout(() => {
        // 方案1: NProgress
        // NProgress.done()

        // 方案2: 自定义加载动画
        const loader = document.getElementById('page-loader')
        if (loader) {
            loader.style.display = 'none'
        }

        // 方案3: 移除 body 类名
        document.body.classList.remove('page-loading')
    }, 300)
}

/**
 * 页面访问统计（可选）
 */
function trackPageView(route) {
    // 如果接入了统计平台（如百度统计、Google Analytics）
    // 可以在这里上报页面访问数据

    if (window._hmt) {
        // 百度统计
        window._hmt.push(['_trackPageview', route.fullPath])
    }

    if (window.gtag) {
        // Google Analytics
        window.gtag('config', 'GA_MEASUREMENT_ID', {
            page_path: route.fullPath
        })
    }
}