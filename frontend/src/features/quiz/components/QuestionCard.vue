# 题目卡片组件
<template>
  <div class="question-card">
    <div class="question-number">问题 {{ currentQuestionIndex + 1 }}</div>
    <div class="question-text">{{ currentQuestion.question }}</div>
    
    <!-- 答案区域 -->
    <div v-if="showAnswer" class="answer-section">
      <div class="answer-emoji" :class="answerEmojiClass"></div>
      <h3 class="answer-title">{{ answerTitle }}</h3>
      <p class="answer-text">{{ currentQuestion.answer }}</p>
      <div v-if="currentQuestion.clubTip" class="club-tip">
        <i class="fas fa-lightbulb"></i> {{ currentQuestion.clubTip }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentQuestion: Object,
  currentQuestionIndex: Number,
  showAnswer: Boolean
});

const answerEmojiClass = computed(() => {
  return 'answer-emoji ' + (props.currentQuestion.emoji ? 'custom-emoji' : 'default-emoji');
});

const answerTitle = computed(() => {
  return props.currentQuestion.emoji ? `${props.currentQuestion.emoji} 回答正确！` : '回答正确！';
});
</script>

<style scoped>
.question-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  position: relative;
  transition: all 0.5s ease;
  min-height: 200px;
  display: flex;
  flex-direction: column;
}

.question-number {
  position: absolute;
  top: 15px;
  right: 15px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
}

.question-text {
  font-size: 1.4rem;
  line-height: 1.6;
  text-align: center;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}

.answer-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed rgba(255, 255, 255, 0.2);
  text-align: center;
  animation: fadeIn 0.5s ease;
}

.club-tip {
  margin-top: 15px;
  padding: 10px 15px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  font-size: 0.9rem;
  color: #ffcb69;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: fadeIn 1s ease;
}

.answer-emoji {
  font-size: 3rem;
  margin-bottom: 15px;
  animation: bounce 0.5s ease;
}

.default-emoji::before {
  content: '🎉';
}

.custom-emoji {
  font-size: 2.5rem;
}

.answer-title {
  color: #4cd964;
  margin-bottom: 15px;
  font-size: 1.3rem;
}

.answer-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #e0e0e0;
  padding: 0 10px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes bounce {
  0% { transform: scale(0); }
  70% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
</style>