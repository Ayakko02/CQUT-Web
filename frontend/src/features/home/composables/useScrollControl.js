// # 统一滚动控制系统

import { ref, onMounted, onUnmounted } from 'vue'

let scrollControlInstance = null

export function useScrollControl() {
    if (scrollControlInstance) {
        return scrollControlInstance
    }

    // === 滚动指示器相关状态 ===
    const isScrolledDown = ref(false)
    const scrollIndicatorThreshold = ref(0.5) // 50%视口高度

    // === 侧边栏相关状态 ===
    const isSidebarHidden = ref(false)
    const sidebarThreshold = ref(50) // 50px

    // === 通用滚动状态 ===
    const isScrolling = ref(false)
    const scrollDirection = ref('down') // 'up' | 'down'
    const currentScrollTop = ref(0)

    // 内部状态
    let scrollTimer = null
    let lastScrollTop = 0

    // 统一的滚动事件处理函数
    const handleScroll = () => {
        // 获取滚动位置
        const scrollContainer = document.querySelector('.home-page')
        const scrollTop = scrollContainer ?
            scrollContainer.scrollTop :
            (window.pageYOffset || document.documentElement.scrollTop)

        currentScrollTop.value = scrollTop

        // 判断滚动方向
        scrollDirection.value = scrollTop > lastScrollTop ? 'down' : 'up'
        isScrolling.value = true

        // 清除之前的定时器
        if (scrollTimer) {
            clearTimeout(scrollTimer)
        }

        // === 处理滚动指示器逻辑 ===
        const indicatorThreshold = window.innerHeight * scrollIndicatorThreshold.value
        isScrolledDown.value = scrollTop > indicatorThreshold;

        // === 处理侧边栏隐藏逻辑 ===
        if (scrollTop > sidebarThreshold.value) {
            isSidebarHidden.value = true
            console.log(`[ScrollControl] 侧边栏隐藏 - 滚动位置: ${scrollTop} > 阈值: ${sidebarThreshold.value}`)
        } else {
            isSidebarHidden.value = false
            console.log(`[ScrollControl] 侧边栏显示 - 滚动位置: ${scrollTop} <= 阈值: ${sidebarThreshold.value}`)
        }

        // 延迟执行，确保滚动停止后的状态
        scrollTimer = setTimeout(() => {
            isScrolling.value = false

            // 滚动停止后再次检查侧边栏状态
            if (scrollTop <= sidebarThreshold.value) {
                isSidebarHidden.value = false
            }
        }, 150)

        lastScrollTop = scrollTop

        // 详细调试信息
        console.log(`[ScrollControl] 详细状态:`, {
            scrollTop,
            sidebarThreshold: sidebarThreshold.value,
            isSidebarHidden: isSidebarHidden.value,
            indicatorThreshold,
            isScrolledDown: isScrolledDown.value,
            scrollContainer: scrollContainer ? 'home-page元素' : 'window'
        })
    }

    // === 滚动指示器相关方法 ===
    const toggleScroll = () => {
        const scrollContainer = document.querySelector('.home-page')
        const viewportHeight = window.innerHeight

        if (!isScrolledDown.value) {
            // 当前在零域，滚动到溯洄区域
            if (scrollContainer) {
                scrollContainer.scrollTo({
                    top: viewportHeight,
                    behavior: 'smooth'
                })
            } else {
                window.scrollTo({
                    top: viewportHeight,
                    behavior: 'smooth'
                })
            }
            console.log('[ScrollControl] 滚动到溯洄区域 (下半部分)')
        } else {
            // 当前在溯洄，滚动回零域区域
            if (scrollContainer) {
                scrollContainer.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
            } else {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
            }
            console.log('[ScrollControl] 滚动回零域区域 (上半部分)')
        }
    }

    // 直接滚动到指定区域
    const scrollToZero = () => {
        const scrollContainer = document.querySelector('.home-page')
        if (scrollContainer) {
            scrollContainer.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
        console.log('[ScrollControl] 强制滚动到零域区域')
    }

    const scrollToSuhui = () => {
        const scrollContainer = document.querySelector('.home-page')
        const viewportHeight = window.innerHeight
        if (scrollContainer) {
            scrollContainer.scrollTo({ top: viewportHeight, behavior: 'smooth' })
        } else {
            window.scrollTo({ top: viewportHeight, behavior: 'smooth' })
        }
        console.log('[ScrollControl] 强制滚动到溯洄区域')
    }

    const getScrollText = (currentTheme) => {
        if (isScrolledDown.value) {
            // 当前在下半部分，显示返回提示
            return currentTheme === 'suhui' ? '返回溯洄' : '返回零域'
        } else {
            // 当前在上半部分，显示"不能点"的提示（但实际上现在可以点击了）
            return currentTheme === 'suhui' ? '都说了不能点嘛！' : '这个不能点！'
        }
    }

    // 获取当前所在区域
    const getCurrentRegion = () => {
        const threshold = window.innerHeight * scrollIndicatorThreshold.value
        return currentScrollTop.value > threshold ? 'suhui' : 'zero'
    }

    // === 侧边栏相关方法 ===
    const forceShowSidebar = () => {
        isSidebarHidden.value = false
    }

    const forceHideSidebar = () => {
        isSidebarHidden.value = true
    }

    const toggleSidebar = () => {
        isSidebarHidden.value = !isSidebarHidden.value
    }

    // === 配置方法 ===
    const setSidebarThreshold = (threshold) => {
        sidebarThreshold.value = threshold
    }

    const setIndicatorThreshold = (threshold) => {
        scrollIndicatorThreshold.value = threshold
    }

    // === 状态获取方法 ===
    const getScrollState = () => {
        return {
            scrollTop: currentScrollTop.value,
            isScrolling: isScrolling.value,
            scrollDirection: scrollDirection.value,
            isScrolledDown: isScrolledDown.value,
            isSidebarHidden: isSidebarHidden.value,
            sidebarThreshold: sidebarThreshold.value,
            indicatorThreshold: window.innerHeight * scrollIndicatorThreshold.value
        }
    }

    // === 生命周期管理 ===
    const initScrollListener = () => {
        console.log('[ScrollControl] 初始化滚动监听器')

        // 清理可能存在的监听器
        cleanup()

        // 等待DOM元素加载
        setTimeout(() => {
            // 获取滚动容器
            const scrollContainer = document.querySelector('.home-page')

            if (scrollContainer) {
                console.log('[ScrollControl] 绑定到页面容器 .home-page')
                scrollContainer.addEventListener('scroll', handleScroll, { passive: true })

                // 立即执行一次来设置初始状态
                handleScroll()
            } else {
                console.log('[ScrollControl] 未找到 .home-page，绑定到window')
                window.addEventListener('scroll', handleScroll, { passive: true })

                // 立即执行一次来设置初始状态
                handleScroll()
            }
        }, 100) // 给DOM一点时间加载
    }

    const cleanup = () => {
        if (scrollTimer) {
            clearTimeout(scrollTimer)
            scrollTimer = null
        }

        // 移除所有可能的监听器
        const scrollContainer = document.querySelector('.home-page')
        if (scrollContainer) {
            scrollContainer.removeEventListener('scroll', handleScroll)
        }
        window.removeEventListener('scroll', handleScroll)
    }

    // 在composable中直接处理生命周期
    onMounted(() => {
        initScrollListener()
    })

    onUnmounted(() => {
        cleanup()
    })

    // 创建单例实例
    scrollControlInstance = {
        // === 滚动指示器相关 ===
        isScrolledDown,
        toggleScroll,
        scrollToZero,
        scrollToSuhui,
        getScrollText,
        setIndicatorThreshold,
        getCurrentRegion,

        // === 侧边栏相关 ===
        isSidebarHidden,
        forceShowSidebar,
        forceHideSidebar,
        toggleSidebar,
        setSidebarThreshold,

        // === 通用滚动状态 ===
        isScrolling,
        scrollDirection,
        currentScrollTop,

        // === 工具方法 ===
        getScrollState,
        initScrollListener,
        cleanup,
        handleScroll
    }

    return scrollControlInstance
}