// frontend/src/features/quiz/composables/useQuizState.js

import { ref } from 'vue'
import { getQuestionsByCategory } from '../data/index.js'

let quizStateInstance = null

export function useQuizState() {
    if (quizStateInstance) {
        return quizStateInstance
    }

    // 当前一级分类
    const currentCategory = ref('')

    // 当前二级分类
    const currentSubcategory = ref('')

    // 已使用的题目索引数组（避免重复）
    const usedQuestionIndices = ref([])

    // 当前题目索引
    const currentQuestionIndex = ref(0)

    // 当前题目对象
    const currentQuestion = ref(null)

    // 答案显示状态
    const isAnswerShown = ref(false)

    // 题目计数（用于Combo判定）
    const questionCount = ref(0)

    /**
     * 获取当前分类的题目列表
     */
    const getCurrentCategoryQuestions = () => {
        const questions = getQuestionsByCategory(
            currentCategory.value,
            currentSubcategory.value
        )

        console.log('[useQuizState] 获取题目列表:', {
            category: currentCategory.value,
            subcategory: currentSubcategory.value,
            count: questions.length,
            questions: questions
        })

        return questions
    }

    /**
     * 获取当前题目
     */
    const getCurrentQuestion = () => {
        return currentQuestion.value
    }

    /**
     * 初始化分类（选择分类和二级标签时调用）
     */
    const initializeCategory = (category, subcategory) => {
        currentCategory.value = category
        currentSubcategory.value = subcategory
        usedQuestionIndices.value = []
        currentQuestionIndex.value = 0
        currentQuestion.value = null
        questionCount.value = 0
        isAnswerShown.value = false

        console.log('[useQuizState] 分类初始化:', {
            category,
            subcategory,
            questionsAvailable: getCurrentCategoryQuestions().length
        })
    }

    /**
     * 获取下一道题目
     * 确保不重复，如果题目用完则重置
     */
    const getNextQuestion = () => {
        const questions = getCurrentCategoryQuestions()

        if (questions.length === 0) {
            console.error('[useQuizState] 题库为空!')
            return null
        }

        // 如果已使用的题目数等于总数，重置
        if (usedQuestionIndices.value.length >= questions.length) {
            usedQuestionIndices.value = []
            console.log('[useQuizState] 题目池已用完，重置')
        }

        // 生成随机索引，确保不在已使用列表中
        let randomIndex
        let attempts = 0
        do {
            randomIndex = Math.floor(Math.random() * questions.length)
            attempts++

            // 防止无限循环
            if (attempts > 100) {
                console.error('[useQuizState] 无法找到未使用的题目')
                randomIndex = 0
                break
            }
        } while (usedQuestionIndices.value.includes(randomIndex))

        usedQuestionIndices.value.push(randomIndex)
        currentQuestionIndex.value = randomIndex
        currentQuestion.value = questions[randomIndex]
        questionCount.value++
        isAnswerShown.value = false

        console.log('[useQuizState] 获取下一题:', {
            index: randomIndex,
            count: questionCount.value,
            question: currentQuestion.value
        })

        return currentQuestion.value
    }

    /**
     * 显示答案
     */
    const showAnswer = () => {
        isAnswerShown.value = true
        console.log('[useQuizState] 显示答案')
    }

    /**
     * 隐藏答案
     */
    const hideAnswer = () => {
        isAnswerShown.value = false
    }

    /**
     * 获取题目计数（用于Combo判定）
     */
    const getQuestionCount = () => {
        return questionCount.value
    }

    /**
     * 重置状态（返回首页时调用）
     */
    const reset = () => {
        currentCategory.value = ''
        currentSubcategory.value = ''
        usedQuestionIndices.value = []
        currentQuestionIndex.value = 0
        currentQuestion.value = null
        questionCount.value = 0
        isAnswerShown.value = false
        console.log('[useQuizState] 状态已重置')
    }

    /**
     * 获取当前状态快照
     */
    const getState = () => {
        return {
            currentCategory: currentCategory.value,
            currentSubcategory: currentSubcategory.value,
            currentQuestion: currentQuestion.value,
            questionCount: questionCount.value,
            isAnswerShown: isAnswerShown.value,
            usedCount: usedQuestionIndices.value.length
        }
    }

    // 创建单例实例
    quizStateInstance = {
        // 响应式状态
        currentCategory,
        currentSubcategory,
        usedQuestionIndices,
        currentQuestionIndex,
        currentQuestion,
        isAnswerShown,
        questionCount,

        // 方法
        initializeCategory,
        getNextQuestion,
        getCurrentCategoryQuestions,
        getCurrentQuestion,
        showAnswer,
        hideAnswer,
        getQuestionCount,
        reset,
        getState
    }

    return quizStateInstance
}