// # 二级标签状态管理 - 单例模式

import { ref } from 'vue'
import { questionDB, subcategoryIcons } from '../data/index.js'

// 创建单例实例
let instance = null

export function useSubcategoryState() {
    // 如果已经有实例,直接返回
    if (instance) {
        return instance
    }

    // 选中的一级标签
    const isTransitioning = ref(false)
    const selectedCategory = ref('')

    // 选中的二级标签
    const selectedSubcategory = ref('')

    // 动画状态
    const isExpanded = ref(false)

    // 二级标签列表
    const subcategories = ref([])

    /**
     * 展开二级标签
     */
    const expandSubcategories = (category) => {
        selectedCategory.value = category
        subcategories.value = Object.keys(questionDB[category] || {})
        isExpanded.value = true
        console.log('[useSubcategoryState] 展开二级标签:', category, subcategories.value)
    }

    /**
     * 获取二级标签图标
     */
    const getSubcategoryIcon = (subcategory) => {
        return subcategoryIcons[subcategory] || '📚'
    }

    /**
     * 获取二级标签下的题目
     */
    const getQuestionsForSubcategory = (subcategory) => {
        return questionDB[selectedCategory.value]?.[subcategory] || []
    }

    /**
     * 选择二级标签
     */
    const selectSubcategory = (subcategory) => {
        selectedSubcategory.value = subcategory
        console.log('[useSubcategoryState] 选择二级标签:', subcategory)
    }

    /**
     * 收起二级标签
     */
    const collapseSubcategories = () => {
        isExpanded.value = false  // 先关闭
        isTransitioning.value = true

        setTimeout(() => {
            selectedCategory.value = ''
            selectedSubcategory.value = ''
            subcategories.value = []
            isTransitioning.value = false
        }, 600) // 延迟清空
    }

    /**
     * 重置状态
     */
    const reset = () => {
        selectedCategory.value = ''
        selectedSubcategory.value = ''
        isExpanded.value = false
        subcategories.value = []
    }

    /**
     * 获取状态快照
     */
    const getState = () => {
        return {
            selectedCategory: selectedCategory.value,
            selectedSubcategory: selectedSubcategory.value,
            isExpanded: isExpanded.value,
            subcategories: subcategories.value
        }
    }

    // 创建并保存单例实例
    instance = {
        // 响应式状态
        selectedCategory,
        selectedSubcategory,
        isExpanded,
        subcategories,

        // 方法
        expandSubcategories,
        selectSubcategory,
        collapseSubcategories,
        getSubcategoryIcon,
        getQuestionsForSubcategory,
        reset,
        getState
    }

    return instance
}