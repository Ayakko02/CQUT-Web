// # 弹幕逻辑
// # 弹幕系统

import { ref } from 'vue'
import { quizConfig } from '../data/index.js'

let danmakuSystemInstance = null

export function useDanmaku() {
    if (danmakuSystemInstance) {
        return danmakuSystemInstance
    }

    // 弹幕容器引用
    const danmakuContainer = ref(null)

    // 输入框值
    const danmakuInput = ref('')

    // 活跃弹幕列表（用于清理）
    const activeDanmaku = ref([])

    /**
     * 弹幕类 - 单个弹幕对象
     */
    class Danmaku {
        constructor(text, isUser = false) {
            this.text = text
            this.isUser = isUser
            this.element = null
            this.timeout = null
        }

        /**
         * 创建并显示弹幕
         */
        create(container) {
            if (!container) return

            this.element = document.createElement('div')
            this.element.className = 'danmaku'
            this.element.textContent = this.text

            // 设置样式
            const colors = [
                '#ffeb3b', '#ff6b6b', '#bb86fc', '#03dac6',
                '#4fc3f7', '#81c784', '#ff8a65', '#f06292'
            ]

            this.element.style.color = this.isUser
                ? '#ffd700'
                : colors[Math.floor(Math.random() * colors.length)]
            this.element.style.top = Math.random() * 70 + 10 + '%'
            this.element.style.animationDuration = Math.random() * 4 + 10 + 's'
            this.element.style.fontSize = (Math.random() * 0.6 + 1.2) + 'em'

            container.appendChild(this.element)

            // 动画结束后移除
            const animationDuration = (Math.random() * 4 + 10) * 1000
            this.timeout = setTimeout(() => {
                this.remove()
            }, animationDuration)

            console.log('[useDanmaku] 弹幕已创建:', this.text)
        }

        /**
         * 移除弹幕
         */
        remove() {
            if (this.timeout) {
                clearTimeout(this.timeout)
            }
            if (this.element && this.element.parentNode) {
                this.element.remove()
            }
            this.element = null
        }
    }

    /**
     * 发送用户弹幕
     */
    const sendDanmaku = () => {
        const text = danmakuInput.value.trim()

        if (!text || !danmakuContainer.value) return

        const danmaku = new Danmaku(text, true)
        danmaku.create(danmakuContainer.value)
        activeDanmaku.value.push(danmaku)

        danmakuInput.value = ''

        console.log('[useDanmaku] 用户发送弹幕:', text)
    }

    /**
     * 创建系统弹幕（非用户输入）
     */
    const createSystemDanmaku = (text) => {
        if (!danmakuContainer.value) return

        const danmaku = new Danmaku(text, false)
        danmaku.create(danmakuContainer.value)
        activeDanmaku.value.push(danmaku)

        console.log('[useDanmaku] 系统弹幕:', text)
    }

    /**
     * 处理Enter键提交
     */
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            sendDanmaku()
        }
    }

    /**
     * 清空所有弹幕
     */
    const clearAllDanmaku = () => {
        activeDanmaku.value.forEach(danmaku => {
            danmaku.remove()
        })
        activeDanmaku.value = []
        console.log('[useDanmaku] 清空所有弹幕')
    }

    /**
     * 重置弹幕系统
     */
    const reset = () => {
        clearAllDanmaku()
        danmakuInput.value = ''
    }

    /**
     * 设置容器引用
     */
    const setContainer = (container) => {
        danmakuContainer.value = container
    }

    /**
     * 获取系统状态
     */
    const getState = () => {
        return {
            inputValue: danmakuInput.value,
            activeDanmakuCount: activeDanmaku.value.length,
            hasContainer: !!danmakuContainer.value
        }
    }

    // 创建单例实例
    danmakuSystemInstance = {
        // 响应式状态
        danmakuContainer,
        danmakuInput,
        activeDanmaku,

        // 方法
        sendDanmaku,
        createSystemDanmaku,
        handleKeyPress,
        clearAllDanmaku,
        reset,
        setContainer,
        getState
    }

    return danmakuSystemInstance
}