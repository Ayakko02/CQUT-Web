// # 城市切换逻辑

import { ref } from 'vue'

export function useCityTransition() {
    const isFlipped = ref(false)
    const isTransitioning = ref(false)

    const toggleCityTransition = () => {
        if (isTransitioning.value) return // 防止重复点击

        isTransitioning.value = true
        isFlipped.value = !isFlipped.value

        // 转换完成后重置状态
        setTimeout(() => {
            isTransitioning.value = false
        }, 2500) // 与CSS动画时间一致

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