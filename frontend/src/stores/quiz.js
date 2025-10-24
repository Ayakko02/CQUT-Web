// frontend/src/stores/quiz.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useMusicStore } from './music'

export const useQuizStore = defineStore('quiz', () => {
    // ============ 状态定义 ============

    // 一级分类（如 'anime', 'game' 等）
    const selectedCategory = ref(null)

    // 二级分类（如 'honkai-3', 'genshin' 等）
    const selectedSubcategory = ref(null)

    // ============ Actions ============

    /**
     * 用户选择了二级标签（但未确认）
     * 此时只更新状态，不切换歌单
     * @param {string} category - 一级分类
     * @param {string} subcategory - 二级分类
     */
    const selectSubcategory = (category, subcategory) => {
        console.log(`[QuizStore] 用户选择二级标签: ${category} -> ${subcategory}`)
        selectedCategory.value = category
        selectedSubcategory.value = subcategory
    }

    /**
     * 用户点击"确认选择"按钮
     * 此时需要：
     * 1. 更新小程序歌单
     * 2. 触发音乐播放器的歌单切换
     * @param {string} playlistId - 对应的歌单ID (如 'honkai-3')
     */
    const confirmSubcategory = (playlistId) => {
        console.log(`[QuizStore] 用户确认选择二级标签，歌单ID: ${playlistId}`)

        // 获取音乐 store
        const musicStore = useMusicStore()

        // 更新小程序歌单
        musicStore.updateMiniGamePlaylist(playlistId)

        console.log(`[QuizStore] 小程序歌单已更新为: ${playlistId}`)
    }

    /**
     * 重置分类选择状态
     * 调用时机：用户返回首页或重新开始测试
     */
    const resetCategory = () => {
        console.log('[QuizStore] 重置分类选择状态')
        selectedCategory.value = null
        selectedSubcategory.value = null
    }

    // ============ 导出 ============
    return {
        // 状态
        selectedCategory,
        selectedSubcategory,

        // 方法
        selectSubcategory,
        confirmSubcategory,
        resetCategory
    }
})