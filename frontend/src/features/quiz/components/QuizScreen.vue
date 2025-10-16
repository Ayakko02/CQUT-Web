<template>
  <div class="quiz-screen">
    <!-- 顶部导航 -->
    <div class="quiz-header">
      <button 
        class="back-button" 
        @click="handleBack"
      >
        <i class="fas fa-arrow-left"></i>
        <span class="back-text">返回分类</span>
      </button>
      
      <div class="quiz-progress">
        <div class="progress-info">
          <span class="category-name">{{ selectedCategory.name }} - {{ selectedSubcategory.name }}</span>
          <span class="question-count">第 {{ currentQuestionIndex + 1 }} 题</span>
        </div>
        <div class="progress-stats">
          <div class="stat-item correct">
            <i class="fas fa-check"></i>
            <span>{{ correctAnswers }} 正确</span>
          </div>
          <div class="stat-item combo" v-if="comboCount > 1">
            <i class="fas fa-fire"></i>
            <span>{{ comboCount }} Combo!</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 题目卡片 -->
    <QuestionCard
      :current-question="currentQuestion"
      :current-question-index="currentQuestionIndex"
      :show-answer="showAnswer"
      :user-answer-result="userAnswerResult"
      @option-select="handleOptionSelect"
      @judge-select="handleJudgeSelect"
      @answer-submitted="handleAnswerSubmitted"
    />
    
    <!-- 操作按钮 -->
    <div class="quiz-actions">
      <button 
        v-if="!showAnswer && currentQuestion.type !== 'completed'" 
        class="action-button show-answer"
        @click="handleShowAnswer"
      >
        <i class="fas fa-eye"></i> 查看答案
      </button>
      
      <button 
        v-if="showAnswer && currentQuestion.type !== 'completed'" 
        class="action-button continue"
        @click="handleContinue"
      >
        下一题 <i class="fas fa-arrow-right"></i>
      </button>
      
      <button 
        v-if="currentQuestion.type === 'completed'" 
        class="action-button restart"
        @click="handleBack"
      >
        <i class="fas fa-redo"></i> 返回分类选择
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import QuestionCard from './QuestionCard.vue';

const props = defineProps({
  selectedCategory: Object,
  selectedSubcategory: Object,
  currentQuestion: Object,
  currentQuestionIndex: Number,
  correctAnswers: Number,
  comboCount: Number,
  showAnswer: Boolean
});

const userAnswerResult = ref(null);

const emit = defineEmits([
  'retry-question', 
  'show-answer', 
  'continue', 
  'back-to-subcategories',
  'update-correct-count',
  'update-combo',
  'answer-submitted'
]);

// 监听题目变化，重置答题状态
watch(() => props.currentQuestion.id, () => {
  resetAnswerState();
});

// 监听显示答案状态变化
watch(() => props.showAnswer, (newVal) => {
  if (!newVal) {
    resetAnswerState();
  }
});

// 重置答题状态
const resetAnswerState = () => {
  userAnswerResult.value = null;
};

// 处理返回
const handleBack = () => {
  resetAnswerState();
  emit('back-to-subcategories');
};

// 处理显示答案
const handleShowAnswer = () => {
  emit('show-answer');
};

// 处理继续下一题
const handleContinue = () => {
  resetAnswerState();
  emit('continue');
};

// 处理选择题选择
const handleOptionSelect = (result) => {
  userAnswerResult.value = {
    isCorrect: result.isCorrect,
    selectedIndex: result.selectedIndex,
    correctIndex: result.correctOptionIndex
  };
  
  if (result.autoShowAnswer) {
    emit('show-answer');
    emit('update-correct-count', result.isCorrect);
  }
};

// 处理判断题选择
const handleJudgeSelect = (result) => {
  userAnswerResult.value = {
    isCorrect: result.isCorrect,
    selectedAnswer: result.selectedAnswer,
    correctAnswer: result.correctAnswer
  };
  
  if (result.autoShowAnswer) {
    emit('show-answer');
    emit('update-correct-count', result.isCorrect);
  }
};

// 处理题目回答完成事件
const handleAnswerSubmitted = (questionId, isCorrect) => {
  emit('answer-submitted', questionId, isCorrect);
};
</script>

<style scoped>
.quiz-screen {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.back-button {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(-3px);
}

.back-text {
  font-size: 0.9rem;
}

.quiz-progress {
  flex: 1;
  padding: 0 20px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.category-name {
  color: #ffcb69;
  font-weight: 500;
}

.question-count {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.progress-stats {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
}

.stat-item.correct {
  background: rgba(76, 217, 100, 0.2);
  color: #4cd964;
}

.stat-item.combo {
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
  animation: pulse 1.5s infinite;
}

.quiz-actions {
  display: flex;
  justify-content: center;
  padding: 10px 0 20px;
}

.action-button {
  background: rgba(102, 187, 255, 0.2);
  color: #66bbff;
  border: none;
  padding: 12px 30px;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 180px;
  justify-content: center;
}

.action-button:hover {
  background: rgba(102, 187, 255, 0.3);
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(102, 187, 255, 0.2);
}

.action-button.show-answer {
  background: rgba(255, 203, 105, 0.2);
  color: #ffcb69;
}

.action-button.show-answer:hover {
  background: rgba(255, 203, 105, 0.3);
  box-shadow: 0 4px 15px rgba(255, 203, 105, 0.2);
}

.action-button.restart {
  background: rgba(76, 217, 100, 0.2);
  color: #4cd964;
}

.action-button.restart:hover {
  background: rgba(76, 217, 100, 0.3);
  box-shadow: 0 4px 15px rgba(76, 217, 100, 0.2);
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@media (max-width: 768px) {
  .quiz-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .progress-stats {
    justify-content: flex-start;
  }
}
</style>