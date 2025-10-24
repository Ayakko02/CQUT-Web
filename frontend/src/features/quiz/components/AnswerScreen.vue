<template>
  <!-- 答案页面 -->
  <div class="answer-screen">
    <!-- 磨砂玻璃主容器 -->
    <div class="answer-content-container">
      <!-- 页面头部 -->
      <div class="answer-header-bar">
        <button class="back-button" @click="goBack">← 返回题目</button>
        <div class="category-indicator">{{ currentCategory }}</div>
      </div>

      <!-- 答案卡片 -->
      <div class="answer-box">
        <!-- 答案头部 -->
        <div class="answer-header">
          <div class="answer-icon">✨</div>
          <h2 class="answer-label">答案揭晓</h2>
        </div>

        <!-- 答案内容 -->
        <div class="answer-content">
          <!-- 主答案 - 🔧 修改：a → answer -->
          <div class="answer-main">
            <span class="answer-prefix">答:</span>
            <span class="answer-text">{{ currentQuestion?.answer }}</span>
          </div>

          <!-- 详细解释 - 🔧 修改：d → explanation -->
          <div v-if="currentQuestion?.explanation" class="answer-detail">
            <div class="detail-icon">💡</div>
            <div class="detail-content">
              <div class="detail-label">解析</div>
              <div class="detail-text">{{ currentQuestion?.explanation }}</div>
            </div>
          </div>

          <!-- 冷知识/趣闻 - 🔧 修改：t → trivia -->
          <div v-if="currentQuestion?.trivia" class="answer-trivia">
            <div class="trivia-icon">🎯</div>
            <div class="trivia-content">
              <div class="trivia-label">冷知识</div>
              <div class="trivia-text">{{ currentQuestion?.trivia }}</div>
            </div>
          </div>
        </div>

        <!-- 题目回顾(小字) - 🔧 修改：q → question -->
        <div class="question-recall">
          <span class="recall-label">题目:</span>
          <span class="recall-text">{{ currentQuestion?.question }}</span>
        </div>

        <!-- 装饰效果 -->
        <div class="answer-decoration"></div>
      </div>

      <!-- 按钮区 -->
      <div class="action-buttons">
        <button class="action-btn next-btn" @click="nextQuestion">
          <i class="fas fa-arrow-right"></i>
          下一题
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
import { computed } from 'vue'
import { useQuizState } from '../composables/useQuizState.js'

const emit = defineEmits(['back-to-question', 'next-question', 'change-category'])

const quizState = useQuizState()

// 计算属性
const currentCategory = computed(() => quizState.currentCategory)
const currentQuestion = computed(() => quizState.getCurrentQuestion())

/**
 * 返回题目页
 */
const goBack = () => {
  emit('back-to-question')
}

/**
 * 下一题
 */
const nextQuestion = () => {
  emit('next-question')
}

/**
 * 换分类
 */
const changeCategory = () => {
  emit('change-category')
}
</script>

<style scoped>
.answer-screen {
  width: 100%;
  height: 100%;
  min-height: 650px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  /* 👇 移除自带动画,让Vue transition控制 */
  /* animation: screenSlideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); */
  opacity: 1;
}

@keyframes screenSlideIn {
  from {
    opacity: 0;
    transform: translateX(50px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

/* 磨砂玻璃主容器 */
.answer-content-container {
  width: 90%;
  max-width: 1000px;
  min-height: 600px;
  background: rgba(20, 25, 40, 0.75); /* 👈 从 0.4 提高到 0.75 */
  backdrop-filter: blur(25px); /* 👈 增加模糊度 */
  border: 2px solid rgba(236, 72, 153, 0.4); /* 👈 增强边框 */
  border-radius: 30px;
  padding: 50px 40px;
  box-shadow:
      0 20px 60px rgba(0, 0, 0, 0.5),
      0 0 80px rgba(236, 72, 153, 0.25),
      inset 0 0 40px rgba(236, 72, 153, 0.1);
  animation: containerPulse 0.8s ease;
  position: relative;
  z-index: 50;
}

@keyframes containerPulse {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 页面头部 */
.answer-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.back-button {
  background: rgba(147, 51, 234, 0.1);
  border: 2px solid rgba(147, 51, 234, 0.3);
  color: #9333ea;
  padding: 12px 25px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: #9333ea;
  color: white;
  transform: translateX(-5px);
  box-shadow: 0 5px 15px rgba(147, 51, 234, 0.4);
}

.category-indicator {
  background: linear-gradient(135deg, #ec4899, #8b5cf6);
  color: white;
  padding: 12px 25px;
  border-radius: 25px;
  font-weight: bold;
  box-shadow: 0 5px 15px rgba(236, 72, 153, 0.3);
}

/* ============ 答案卡片 ============ */
.answer-box {
  background: linear-gradient(135deg,
  rgba(236, 72, 153, 0.18), /* 👈 从 0.12 提高到 0.18 */
  rgba(139, 92, 246, 0.18)); /* 👈 从 0.12 提高到 0.18 */
  border: 2px solid rgba(236, 72, 153, 0.4); /* 👈 从 0.3 提高到 0.4 */
  border-radius: 25px;
  padding: 40px;
  margin-bottom: 30px;
  position: relative;
  overflow: hidden;
  box-shadow:
      0 10px 40px rgba(236, 72, 153, 0.25),
      inset 0 0 30px rgba(236, 72, 153, 0.08);
}

/* 答案装饰背景 */
.answer-decoration {
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle,
  rgba(236, 72, 153, 0.15) 0%,
  transparent 50%);
  animation: rotate 30s linear infinite;
  pointer-events: none;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 答案头部 */
.answer-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 35px;
  position: relative;
  z-index: 2;
  padding-bottom: 20px;
  border-bottom: 2px solid rgba(236, 72, 153, 0.2);
}

.answer-icon {
  font-size: 2.5em;
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1);
  }
  50% {
    transform: scale(1.15) rotate(180deg);
    filter: brightness(1.4);
  }
}

.answer-label {
  color: #ec4899;
  font-size: 2em;
  font-weight: bold;
  margin: 0;
  text-shadow: 0 2px 15px rgba(236, 72, 153, 0.4);
}

/* 答案内容区 */
.answer-content {
  position: relative;
  z-index: 2;
}

/* 主答案 */
.answer-main {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 30px;
  padding: 25px;
  background: rgba(236, 72, 153, 0.15); /* 👈 从 0.08 提高到 0.15 */
  border-radius: 18px;
  border-left: 5px solid #ec4899;
  box-shadow: 0 5px 20px rgba(236, 72, 153, 0.15);
}

.answer-prefix {
  color: #ec4899;
  font-size: 2em;
  font-weight: bold;
  line-height: 1.2;
  flex-shrink: 0;
}

.answer-text {
  color: white;
  font-size: 1.6em;
  font-weight: 600;
  line-height: 1.5;
  flex: 1;
}

/* 详细解释 */
.answer-detail {
  display: flex;
  gap: 15px;
  padding: 20px 25px;
  background: rgba(139, 92, 246, 0.15); /* 👈 从 0.08 提高到 0.15 */
  border-radius: 18px;
  margin-bottom: 25px;
  border-left: 4px solid #8b5cf6;
}

.detail-icon {
  font-size: 1.5em;
  flex-shrink: 0;
  margin-top: 3px;
}

.detail-content {
  flex: 1;
}

.detail-label {
  color: #8b5cf6;
  font-size: 0.95em;
  font-weight: bold;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-text {
  color: rgba(255, 255, 255, 0.95);
  font-size: 1.2em;
  line-height: 1.7;
}

/* 冷知识 */
.answer-trivia {
  display: flex;
  gap: 15px;
  padding: 20px 25px;
  background: rgba(245, 158, 11, 0.15); /* 👈 从 0.08 提高到 0.15 */
  border-radius: 18px;
  border-left: 4px solid #f59e0b;
}

.trivia-icon {
  font-size: 1.5em;
  flex-shrink: 0;
  margin-top: 3px;
}

.trivia-content {
  flex: 1;
}

.trivia-label {
  color: #f59e0b;
  font-size: 0.95em;
  font-weight: bold;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.trivia-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1em;
  line-height: 1.7;
  font-style: italic;
}

/* 题目回顾 */
.question-recall {
  margin-top: 30px;
  padding: 18px 25px;
  background: rgba(255, 255, 255, 0.06); /* 👈 从 0.03 提高到 0.06 */
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.15); /* 👈 从 0.1 提高到 0.15 */
  position: relative;
  z-index: 2;
}

.recall-label {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9em;
  font-weight: 600;
  margin-right: 10px;
}

.recall-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95em;
  line-height: 1.6;
}

/* ============ 按钮区 ============ */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  /* 👇 添加淡入动画 */
  animation: buttonsFadeIn 0.6s ease 0.6s both;
}

/* 👇 新增按钮区淡入动画 */
@keyframes buttonsFadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

.action-btn i {
  font-size: 1em;
}

/* 下一题按钮 */
.next-btn {
  background: linear-gradient(135deg, #10b981, #3b82f6);
  box-shadow: 0 5px 20px rgba(16, 185, 129, 0.3);
}

.next-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 30px rgba(16, 185, 129, 0.5);
}

/* 次要按钮 */
.secondary-btn {
  background: linear-gradient(135deg, #9333ea, #c026d3);
  box-shadow: 0 5px 20px rgba(147, 51, 234, 0.3);
}

.secondary-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 30px rgba(147, 51, 234, 0.5);
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
  .answer-content-container {
    width: 95%;
    padding: 40px 30px;
  }

  .answer-text {
    font-size: 1.4em;
  }

  .detail-text {
    font-size: 1.1em;
  }
}

@media (max-width: 768px) {
  .answer-screen {
    min-height: 550px;
    padding: 20px 10px;
  }

  .answer-content-container {
    width: 98%;
    padding: 30px 20px;
    min-height: 480px;
  }

  .answer-header-bar {
    flex-direction: column;
    gap: 15px;
    margin-bottom: 30px;
  }

  .back-button,
  .category-indicator {
    width: 100%;
    text-align: center;
  }

  .answer-box {
    padding: 25px 20px;
  }

  .answer-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding-bottom: 15px;
  }

  .answer-label {
    font-size: 1.6em;
  }

  .answer-main {
    flex-direction: column;
    gap: 12px;
    padding: 20px;
  }

  .answer-prefix {
    font-size: 1.6em;
  }

  .answer-text {
    font-size: 1.3em;
  }

  .detail-text,
  .trivia-text {
    font-size: 1em;
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
}
</style>