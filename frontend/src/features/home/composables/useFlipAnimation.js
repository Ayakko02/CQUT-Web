// # 翻转动画逻辑
import { ref, computed } from 'vue'  // 添加computed导入

export function useFlipAnimation() {
    const isFlipped = ref(false)
    const isRotating = ref(false)

    const toggleFlip = () => {
        isFlipped.value = !isFlipped.value
        isRotating.value = true

        // 清理旋转效果
        setTimeout(() => {
            isRotating.value = false
        }, 2500)

        return isFlipped.value ? 'suhui' : 'zero'
    }

    const flipButtonIcon = computed(() => {
        return isFlipped.value ? '🌸' : '⚡'
    })

    return {
        isFlipped,
        isRotating,
        toggleFlip,
        flipButtonIcon
    }
}