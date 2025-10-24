<template>
  <!-- 题目页面 - 只显示题目 -->
  <div class="question-screen">
    <!-- 答对/答错动画层 -->
    <transition name="result-animation">
      <div v-if="showResultAnimation" class="result-overlay" :class="resultAnimationClass">
        <div class="result-content">
          <div class="result-icon">{{ isCorrect ? '✓' : '✗' }}</div>
          <div class="result-text">{{ isCorrect ? '回答正确！' : '回答错误！' }}</div>
        </div>
      </div>
    </transition>

    <!-- 磨砂玻璃主容器 -->
    <div class="quiz-content-container">
      <!-- 页面头部 -->
      <div class="question-header">
        <button class="back-button" @click="goBack">← 溜了溜了</button>
        <div class="category-indicator">{{ currentCategory }}</div>
      </div>

      <!-- 题目卡片 -->
      <div class="question-box">
        <!-- 题目编号 -->
        <div class="question-number">第 {{ questionCount }} 题</div>

        <!-- 题目内容 -->
        <div class="question-text">{{ currentQuestion?.question || '加载中...' }}</div>

        <!-- 选项（单选/多选题） -->
        <div v-if="hasOptions" class="options-container">
          <div
              v-for="(option, index) in currentQuestion.options"
              :key="index"
              class="option-item"
              :class="{
              'selected': isSelected(index),
              'disabled': hasAnswered
            }"
              @click="selectOption(index)"
          >
            <div class="option-checkbox" v-if="isMultipleChoice">
              <i v-if="isSelected(index)" class="fas fa-check"></i>
            </div>
            <span class="option-label">{{ option.key || String.fromCharCode(65 + index) }}.</span>
            <span class="option-text">{{ option.value || option }}</span>
          </div>
        </div>

        <!-- 🔧 新增:题目类型和难度双标签 -->
        <div class="question-badges">
          <!-- 题目类型标签 -->
          <div v-if="currentQuestion?.type" class="badge type-badge" :class="getTypeBadgeClass()">
            <i :class="getTypeIcon()"></i>
            {{ getTypeLabel() }}
          </div>

          <!-- 难度标签 -->
          <div v-if="currentQuestion?.difficulty" class="badge difficulty-badge" :class="getDifficultyBadgeClass()">
            <i class="fas fa-star"></i>
            {{ getDifficultyLabel() }}
          </div>
        </div>

        <!-- 装饰光晕 -->
        <div class="question-glow"></div>
      </div>

      <!-- 按钮区 -->
      <div class="action-buttons">
        <!-- 有选项的题目：提交答案按钮 -->
        <button
            v-if="hasOptions"
            class="action-btn primary-btn"
            @click="submitAnswer"
            :disabled="selectedOptions.length === 0"
        >
          <i class="fas fa-check-circle"></i>
          提交答案
        </button>

        <!-- 没有选项的题目：直接查看答案 -->
        <button
            v-else
            class="action-btn primary-btn"
            @click="showAnswerDirectly"
        >
          <i class="fas fa-eye"></i>
          查看答案
        </button>

        <button class="action-btn secondary-btn" @click="changeCategory">
          <i class="fas fa-exchange-alt"></i>
          换个领域
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuizState } from '../composables/useQuizState.js'
import { useComboSystem } from '../composables/useComboSystem.js'
import { Difficulty, QuestionType } from '../data/index.js'

const emit = defineEmits(['show-answer', 'back', 'change-category'])

const quizState = useQuizState()
const comboSystem = useComboSystem()

// 答题状态
const selectedOptions = ref([])
const hasAnswered = ref(false)
const isCorrect = ref(false)
const showResultAnimation = ref(false)
const resultAnimationClass = ref('')

// 计算属性
const currentCategory = computed(() => quizState.currentCategory)
const currentQuestion = computed(() => quizState.getCurrentQuestion())
const questionCount = computed(() => quizState.questionCount)

// 判断是否有选项
const hasOptions = computed(() => {
  const type = currentQuestion.value?.type
  return (
      type === QuestionType.SINGLE ||
      type === QuestionType.MULTIPLE ||
      type === QuestionType.IMAGE
  ) && currentQuestion.value?.options?.length > 0
})

// 是否为多选题
const isMultipleChoice = computed(() => {
  return currentQuestion.value?.type === QuestionType.MULTIPLE
})

/**
 * 判断选项是否被选中
 */
const isSelected = (index) => {
  const optionKey = getOptionKey(index)
  return selectedOptions.value.includes(optionKey)
}

/**
 * 获取选项的 key
 */
const getOptionKey = (index) => {
  const option = currentQuestion.value?.options[index]
  return option?.key || String.fromCharCode(65 + index)
}

/**
 * 选择选项
 */
const selectOption = (index) => {
  if (hasAnswered.value) return

  const optionKey = getOptionKey(index)

  if (isMultipleChoice.value) {
    // 多选题：切换选中状态
    const idx = selectedOptions.value.indexOf(optionKey)
    if (idx > -1) {
      selectedOptions.value.splice(idx, 1)
    } else {
      selectedOptions.value.push(optionKey)
    }
  } else {
    // 单选题：只能选一个
    selectedOptions.value = [optionKey]
  }
}

/**
 * 提交答案
 */
const submitAnswer = () => {
  if (selectedOptions.value.length === 0 || hasAnswered.value) return

  hasAnswered.value = true

  // 判断答案是否正确
  const correctAnswer = currentQuestion.value?.answer

  if (isMultipleChoice.value) {
    // 多选题：需要完全匹配
    const userAnswer = selectedOptions.value.sort().join(',')
    const correct = Array.isArray(correctAnswer)
        ? correctAnswer.sort().join(',')
        : correctAnswer
    isCorrect.value = userAnswer === correct
  } else {
    // 单选题
    isCorrect.value = selectedOptions.value[0] === correctAnswer
  }

  // 显示结果动画
  showResultAnimation.value = true
  resultAnimationClass.value = isCorrect.value ? 'correct' : 'wrong'

  // 播放音效
  if (isCorrect.value) {
    comboSystem.playSound('success')

    // 答对了才触发 Combo
    const nextCount = questionCount.value
    comboSystem.triggerCombo(nextCount)

    if (currentQuestion.value?.difficulty === Difficulty.LEGENDARY) {
      comboSystem.triggerLegendaryEffect()
      comboSystem.playSound('legendary')
    }
  } else {
    comboSystem.playSound('wrong')
  }

  // 1.5秒后跳转到答案页
  setTimeout(() => {
    showResultAnimation.value = false
    quizState.showAnswer()
    emit('show-answer')

    // 重置状态（准备下一题）
    resetQuestionState()
  }, 1000)
}

/**
 * 直接查看答案（没有选项的题目）
 */
const showAnswerDirectly = () => {
  quizState.showAnswer()
  comboSystem.playSound('success')

  const nextCount = questionCount.value
  comboSystem.triggerCombo(nextCount)

  if (currentQuestion.value?.difficulty === Difficulty.LEGENDARY) {
    comboSystem.triggerLegendaryEffect()
    comboSystem.playSound('legendary')
  }

  emit('show-answer')
}

/**
 * 重置答题状态
 */
const resetQuestionState = () => {
  selectedOptions.value = []
  hasAnswered.value = false
  isCorrect.value = false
}

/**
 * 获取难度标签样式
 */
const getDifficultyBadgeClass = () => {
  const difficulty = currentQuestion.value?.difficulty
  if (difficulty === Difficulty.LEGENDARY) return 'legendary'
  if (difficulty === Difficulty.HARD) return 'hard'
  if (difficulty === Difficulty.NORMAL) return 'normal'
  return 'easy'
}

/**
 * 获取难度文字
 */
const getDifficultyLabel = () => {
  const difficulty = currentQuestion.value?.difficulty
  if (difficulty === Difficulty.LEGENDARY) return '传说'
  if (difficulty === Difficulty.HARD) return '困难'
  if (difficulty === Difficulty.NORMAL) return '普通'
  return '简单'
}

/**
 * 获取题目类型样式
 */
const getTypeBadgeClass = () => {
  const type = currentQuestion.value?.type
  console.log('[QuizScreen] 题目类型:', type) // 🔧 添加调试日志

  if (type === QuestionType.SINGLE) return 'type-single'
  if (type === QuestionType.MULTIPLE) return 'type-multiple'
  if (type === QuestionType.TRUEFALSE) return 'type-truefalse'
  if (type === QuestionType.FILLBLANK) return 'type-fill'  // 🔧 确保有这一行
  if (type === QuestionType.SHORTANSWER) return 'type-short'
  if (type === QuestionType.IMAGE) return 'type-image'

  console.warn('[QuizScreen] 未知题目类型:', type) // 🔧 添加警告日志
  return 'type-default'
}

/**
 * 获取题目类型文字
 */
const getTypeLabel = () => {
  const type = currentQuestion.value?.type

  if (type === QuestionType.SINGLE) return '单选题'
  if (type === QuestionType.MULTIPLE) return '多选题'
  if (type === QuestionType.TRUEFALSE) return '判断题'
  if (type === QuestionType.FILLBLANK) return '填空题'  // 🔧 确保有这一行
  if (type === QuestionType.SHORTANSWER) return '简答题'
  if (type === QuestionType.IMAGE) return '图片题'

  return '未知'
}

/**
 * 获取题目类型图标
 */
const getTypeIcon = () => {
  const type = currentQuestion.value?.type

  if (type === QuestionType.SINGLE) return 'fas fa-check-circle'
  if (type === QuestionType.MULTIPLE) return 'fas fa-check-double'
  if (type === QuestionType.TRUEFALSE) return 'fas fa-question-circle'
  if (type === QuestionType.FILLBLANK) return 'fas fa-pen'  // 🔧 确保有这一行
  if (type === QuestionType.SHORTANSWER) return 'fas fa-file-alt'
  if (type === QuestionType.IMAGE) return 'fas fa-image'

  return 'fas fa-book'
}

/**
 * 返回首页
 */
const goBack = () => {
  quizState.reset()
  comboSystem.reset()
  resetQuestionState()
  emit('back')
}

/**
 * 换分类
 */
const changeCategory = () => {
  quizState.reset()
  comboSystem.reset()
  resetQuestionState()
  emit('change-category')
}
</script>

<style scoped>
.question-screen {
  width: 100%;
  height: 100%;
  min-height: 650px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
}

/* ============ 答对/答错动画 ============ */
.result-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9000;
  backdrop-filter: blur(10px);
}

.result-overlay.correct {
  background: radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, rgba(0, 0, 0, 0.7) 100%);
}

.result-overlay.wrong {
  background: radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, rgba(0, 0, 0, 0.7) 100%);
}

.result-content {
  text-align: center;
  animation: resultPop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes resultPop {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.result-icon {
  font-size: 8rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-shadow: 0 0 30px currentColor;
}

.result-overlay.correct .result-icon {
  color: #22c55e;
  animation: correctPulse 0.6s ease-in-out;
}

.result-overlay.wrong .result-icon {
  color: #ef4444;
  animation: wrongShake 0.6s ease-in-out;
}

@keyframes correctPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

@keyframes wrongShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-20px); }
  75% { transform: translateX(20px); }
}

.result-text {
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
}

.result-animation-enter-active,
.result-animation-leave-active {
  transition: opacity 0.3s ease;
}

.result-animation-enter-from,
.result-animation-leave-to {
  opacity: 0;
}

/* 磨砂玻璃主容器 */
.quiz-content-container {
  width: 90%;
  max-width: 1000px;
  min-height: 600px;
  background: rgba(20, 25, 40, 0.4);
  border: 2px solid rgba(147, 51, 234, 0.3);
  border-radius: 30px;
  padding: 50px 40px;
  box-shadow:
      0 20px 60px rgba(0, 0, 0, 0.4),
      0 0 80px rgba(147, 51, 234, 0.15),
      inset 0 0 40px rgba(147, 51, 234, 0.08);
  animation: containerFadeIn 1s ease;
  position: relative;
  z-index: 50;
}

@keyframes containerFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 页面头部 */
.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.back-button {
  background: rgba(239, 68, 68, 0.1);
  border: 2px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  padding: 12px 25px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: #ef4444;
  color: white;
  transform: translateX(-5px);
  box-shadow: 0 5px 15px rgba(239, 68, 68, 0.3);
}

.category-indicator {
  background: linear-gradient(135deg, #9333ea, #c026d3);
  color: white;
  padding: 12px 25px;
  border-radius: 25px;
  font-weight: bold;
  box-shadow: 0 5px 15px rgba(147, 51, 234, 0.3);
}

/* ============ 题目卡片 ============ */
.question-box {
  background: linear-gradient(135deg,
  rgba(147, 51, 234, 0.08),
  rgba(192, 38, 211, 0.08));
  border: 2px solid rgba(147, 51, 234, 0.25);
  border-radius: 25px;
  padding: 60px 40px;
  margin-bottom: 40px;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* 题目编号 */
.question-number {
  position: absolute;
  top: 25px;
  right: 30px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1em;
  font-weight: 600;
  z-index: 2;
}

/* 题目文本 */
.question-text {
  color: white;
  font-size: 2.2em;
  text-align: center;
  line-height: 1.6;
  position: relative;
  z-index: 2;
  animation: questionFadeIn 0.6s ease;
  padding: 0 20px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
  font-weight: 500;
  margin-bottom: 30px;
}

@keyframes questionFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 选项容器 */
.options-container {
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
  margin-bottom: 30px;
  position: relative;
  z-index: 2;
  animation: optionsFadeIn 0.6s ease 0.2s both;
}

@keyframes optionsFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.option-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 25px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(147, 51, 234, 0.2);
  border-radius: 15px;
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: left;
}

.option-item:not(.disabled):hover {
  background: rgba(147, 51, 234, 0.15);
  border-color: rgba(147, 51, 234, 0.5);
  transform: translateX(5px);
  box-shadow: 0 5px 20px rgba(147, 51, 234, 0.3);
}

.option-item.selected {
  background: rgba(236, 72, 153, 0.2);
  border-color: rgba(236, 72, 153, 0.6);
  box-shadow: 0 5px 20px rgba(236, 72, 153, 0.4);
}

.option-item.disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.option-checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(147, 51, 234, 0.5);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  color: #ec4899;
  font-size: 1em;
  flex-shrink: 0;
}

.option-item.selected .option-checkbox {
  background: rgba(236, 72, 153, 0.3);
  border-color: #ec4899;
}

.option-label {
  color: #ec4899;
  font-size: 1.3em;
  font-weight: bold;
  flex-shrink: 0;
  min-width: 30px;
}

.option-text {
  color: rgba(255, 255, 255, 0.95);
  font-size: 1.2em;
  line-height: 1.5;
  flex: 1;
}

/* ============ 题目类型和难度双标签 ============ */
.question-badges {
  margin-top: 10px;
  position: absolute;
  bottom: 25px;
  left: 30px;
  display: flex;
  gap: 12px;
  z-index: 2;
  animation: badgesSlideIn 0.6s ease 0.3s both;
}

@keyframes badgesSlideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.badge i {
  font-size: 0.9em;
}

.badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

/* 题目类型标签样式 */
.type-badge.type-single {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(37, 99, 235, 0.25));
  border: 1px solid rgba(59, 130, 246, 0.6);
  color: #60a5fa;
}

.type-badge.type-multiple {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(126, 34, 206, 0.25));
  border: 1px solid rgba(168, 85, 247, 0.6);
  color: #a78bfa;
}

.type-badge.type-truefalse {
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.25), rgba(6, 182, 212, 0.25));
  border: 1px solid rgba(34, 211, 238, 0.6);
  color: #22d3ee;
}

.type-badge.type-fill {
  background: linear-gradient(135deg, rgba(251, 146, 60, 0.25), rgba(249, 115, 22, 0.25));
  border: 1px solid rgba(251, 146, 60, 0.6);
  color: #fb923c;
}

.type-badge.type-short {
  background: linear-gradient(135deg, rgba(250, 204, 21, 0.25), rgba(234, 179, 8, 0.25));
  border: 1px solid rgba(250, 204, 21, 0.6);
  color: #facc15;
}

.type-badge.type-image {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.25), rgba(219, 39, 119, 0.25));
  border: 1px solid rgba(236, 72, 153, 0.6);
  color: #ec4899;
}

/* 难度标签样式 */
.difficulty-badge.easy {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.25), rgba(22, 163, 74, 0.25));
  border: 1px solid rgba(34, 197, 94, 0.6);
  color: #4ade80;
}

.difficulty-badge.normal {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(37, 99, 235, 0.25));
  border: 1px solid rgba(59, 130, 246, 0.6);
  color: #60a5fa;
}

.difficulty-badge.hard {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(217, 119, 6, 0.25));
  border: 1px solid rgba(245, 158, 11, 0.6);
  color: #fbbf24;
}

.difficulty-badge.legendary {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.3), rgba(139, 92, 246, 0.3));
  border: 1px solid rgba(236, 72, 153, 0.7);
  color: #ec4899;
  animation: legendaryPulse 2s ease-in-out infinite;
}

@keyframes legendaryPulse {
  0%, 100% {
    box-shadow: 0 0 15px rgba(236, 72, 153, 0.4);
  }
  50% {
    box-shadow: 0 0 25px rgba(236, 72, 153, 0.8);
  }
}

@keyframes badgeSlideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }

}

.question-type-badge.easy {
  background: rgba(34, 197, 94, 0.2);
  border: 1px solid rgba(34, 197, 94, 0.5);
  color: #4ade80;
}

.question-type-badge.normal {
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.5);
  color: #60a5fa;
}

.question-type-badge.hard {
  background: rgba(245, 158, 11, 0.2);
  border: 1px solid rgba(245, 158, 11, 0.5);
  color: #fbbf24;
}

.question-type-badge.legendary {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.25), rgba(139, 92, 246, 0.25));
  border: 1px solid rgba(236, 72, 153, 0.6);
  color: #ec4899;
  animation: badgeSlideIn 0.6s ease 0.3s both, legendaryPulse 2s ease-in-out infinite;
}

@keyframes legendaryPulse {
  0%, 100% {
    box-shadow: 0 0 15px rgba(236, 72, 153, 0.4);
  }
  50% {
    box-shadow: 0 0 25px rgba(236, 72, 153, 0.8);
  }
}

/* 装饰光晕 */
.question-glow {
  position: absolute;
  width: 150%;
  height: 150%;
  background: radial-gradient(circle,
  rgba(147, 51, 234, 0.12) 0%,
  transparent 70%);
  animation: rotate 25s linear infinite;
  pointer-events: none;
  z-index: 1;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ============ 按钮区 ============ */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.action-btn {
  color: white;
  border: none;
  padding: 16px 40px;
  border-radius: 25px;
  font-size: 1.15em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 10px;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.action-btn i {
  font-size: 1em;
}

/* 主按钮(提交/查看答案) */
.primary-btn {
  background: linear-gradient(135deg, #ec4899, #8b5cf6);
  box-shadow: 0 5px 20px rgba(236, 72, 153, 0.35);
}

.primary-btn:not(:disabled):hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 30px rgba(236, 72, 153, 0.55);
}

/* 次要按钮(换领域) */
.secondary-btn {
  background: linear-gradient(135deg, #9333ea, #c026d3);
  box-shadow: 0 5px 20px rgba(147, 51, 234, 0.35);
}

.secondary-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 30px rgba(147, 51, 234, 0.55);
}

/* 按钮点击波纹 */
.action-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.action-btn:active::after {
  width: 300px;
  height: 300px;
}

/* ============ 响应式 ============ */
@media (max-width: 1024px) {
  .quiz-content-container {
    width: 95%;
    padding: 40px 30px;
  }

  .question-text {
    font-size: 1.9em;
  }

  .option-text {
    font-size: 1.1em;
  }
}

@media (max-width: 768px) {
  .question-screen {
    min-height: 550px;
    padding: 20px 10px;
  }

  .quiz-content-container {
    width: 98%;
    padding: 30px 20px;
  }

  .question-header {
    flex-direction: column;
    gap: 15px;
    margin-bottom: 30px;
  }

  .back-button,
  .category-indicator {
    width: 100%;
    text-align: center;
  }

  .question-box {
    padding: 45px 25px;
  }

  .question-text {
    font-size: 1.5em;
    margin-bottom: 20px;
  }

  .options-container {
    gap: 12px;
  }

  .option-item {
    padding: 15px 20px;
  }

  .option-label {
    font-size: 1.1em;
  }

  .option-text {
    font-size: 1em;
  }

  .result-icon {
    font-size: 5rem;
  }

  .result-text {
    font-size: 1.8rem;
  }

  .action-buttons {
    flex-wrap: wrap;
    gap: 12px;
  }

  .action-btn {
    flex: 1;
    min-width: 140px;
    padding: 14px 30px;
    font-size: 1em;
  }
  .question-badges {
    bottom: 15px;
    left: 15px;
    flex-direction: column;
    gap: 8px;
  }

  .badge {
    padding: 6px 12px;
    font-size: 0.75em;
  }
}
</style>