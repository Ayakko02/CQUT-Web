// # 城市切换逻辑

import { ref } from 'vue'

export function useCityTransition() {
    const isFlipped = ref(false)
    const isTransitioning = ref(false)

    const toggleCityTransition = () => {
        console.log('[useCityTransition] 翻转函数被调用')
        console.log('[useCityTransition] 翻转前 isFlipped:', isFlipped.value)

        isFlipped.value = !isFlipped.value
        isTransitioning.value = true

        console.log('[useCityTransition] 翻转后 isFlipped:', isFlipped.value)

        setTimeout(() => {
            isTransitioning.value = false
            console.log('[useCityTransition] 动画完成')
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