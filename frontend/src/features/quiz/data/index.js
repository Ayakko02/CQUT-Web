// frontend/src/features/quiz/data/index.js

/**
 * ============================================
 * 数据层统一导出入口
 * ============================================
 */

// 导出所有常量
export * from './constants'

// 导出所有分类配置
export * from './categories'

// 导出题库相关
export {
    questionDB,
    getAllQuestions,
    getQuestionsByCategory,
    getQuestionById,
    getLegendaryQuestions,
    getQuestionsByDifficulty,
    getQuestionsByType,
    getRandomQuestions,
    getQuestionsByTag,
    searchQuestions,
    getQuestionStats,
    getQuestionCount,
    validateQuestion,
    validateQuestions,
    getRecommendedQuestions
} from './questions'

export { default as quizQuestions } from './questions'

// ============================================
// 额外的便捷导出
// ============================================
import {
    allSubcategories,
    primaryCategories
} from './categories'

import {
    DEFAULT_CONFIG,
    COMBO_LEVELS,
    COMBO_CONFIG,
    DANMAKU_CONFIG,
    ANIMATION_DURATION,
    STORAGE_KEYS,
    SOUND_EFFECTS
} from './constants'

// 二级分类图标映射
export const subcategoryIcons = {}
Object.values(allSubcategories).forEach(categorySubcats => {
    Object.entries(categorySubcats).forEach(([name, config]) => {
        subcategoryIcons[name] = config.icon || config.emoji || '❓'
    })
})

// 导出配置对象
export const quizConfig = DEFAULT_CONFIG
export const comboLevels = COMBO_LEVELS
export const comboConfig = COMBO_CONFIG
export const danmakuConfig = DANMAKU_CONFIG
export const animationDuration = ANIMATION_DURATION
export const storageKeys = STORAGE_KEYS
export const soundEffects = SOUND_EFFECTS

// 导出分类相关
export {
    allSubcategories,
    primaryCategories
}