// # Combo连击系统

import { ref } from 'vue'
import { quizConfig } from '../data/index.js'

let comboSystemInstance = null

export function useComboSystem() {
    if (comboSystemInstance) {
        return comboSystemInstance
    }

    // Combo显示状态
    const isComboVisible = ref(false)

    // Combo文本内容
    const comboText = ref('')

    // 是否触发Legendary特效
    const isLegendaryTriggered = ref(false)

    const checkCombo = (questionCount) => {
        const thresholds = quizConfig.combo.thresholds

        for (const [threshold, text] of Object.entries(thresholds)) {
            if (questionCount === parseInt(threshold)) {
                return text
            }
        }

        return null
    }

    const triggerCombo = (questionCount) => {
        const text = checkCombo(questionCount)

        if (!text) return

        comboText.value = text
        isComboVisible.value = true

        setTimeout(() => {
            hideCombo()
        }, quizConfig.animations.comboDisplayDuration)

        console.log('[useComboSystem] Combo触发:', text)
    }

    const hideCombo = () => {
        isComboVisible.value = false
    }

    const triggerLegendaryEffect = () => {
        isLegendaryTriggered.value = true

        setTimeout(() => {
            isLegendaryTriggered.value = false
        }, 2000)

        console.log('[useComboSystem] Legendary特效触发')
    }

    const playSound = (type = 'click') => {
        if (typeof AudioContext === 'undefined') return

        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)()
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()

            osc.connect(gain)
            gain.connect(ctx.destination)

            switch (type) {
                case 'click':
                    osc.frequency.value = 800
                    gain.gain.value = 0.1
                    break
                case 'success':
                    osc.frequency.value = 1200
                    gain.gain.value = 0.15
                    break
                case 'legendary':
                    osc.frequency.value = 1600
                    gain.gain.value = 0.2
                    break
            }

            osc.type = 'sine'
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
            osc.start()
            osc.stop(ctx.currentTime + 0.1)
        } catch (error) {
            console.warn('[useComboSystem] 音效播放失败:', error)
        }
    }

    const reset = () => {
        isComboVisible.value = false
        comboText.value = ''
        isLegendaryTriggered.value = false
    }

    const getState = () => {
        return {
            isComboVisible: isComboVisible.value,
            comboText: comboText.value,
            isLegendaryTriggered: isLegendaryTriggered.value
        }
    }

    comboSystemInstance = {
        isComboVisible,
        comboText,
        isLegendaryTriggered,
        checkCombo,
        triggerCombo,
        hideCombo,
        triggerLegendaryEffect,
        playSound,
        reset,
        getState
    }

    return comboSystemInstance
}