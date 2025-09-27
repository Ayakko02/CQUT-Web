// # 城市切换逻辑

import { ref } from 'vue'

export function useCityTransition() {
    const isFlipped = ref(false)
    const isTransitioning = ref(false)

    const toggleCityTransition = () => {
        // 移除防重复点击的限制
        // if (isTransitioning.value) return  // 删除这行

        // 每次点击都更新状态
        isFlipped.value = !isFlipped.value
        isTransitioning.value = true

        // 重新设置动画结束时间
        setTimeout(() => {
            isTransitioning.value = false
        }, 2500)

        return {
            newTheme: isFlipped.value ? 'suhui' : 'zero',
            isFlipped: isFlipped.value
        }
    }

    const getDualCityClass = () => {
        const classes = []
        if (isFlipped.value) classes.push('flipped')
        if (isTransitioning.value) classes.push('transitioning')
        return classes
    }

    return {
        isFlipped,
        isTransitioning,
        toggleCityTransition,
        getDualCityClass
    }
}