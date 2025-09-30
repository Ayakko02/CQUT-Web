<template>
  <div class="quiz-screen">
    <div class="quiz-header">
      <div class="quiz-category-badge">
        <i :class="selectedSubcategory?.icon || selectedCategory?.icon"></i> 
        {{ selectedSubcategory ? `${selectedCategory?.name} - ${selectedSubcategory.name}` : selectedCategory?.name }}
      </div>
      <div class="quiz-stats">
        <span>已答对: {{ correctAnswers }}题</span>
        <span v-if="comboCount > 0" class="combo-stat">| {{ comboCount }} Combo</span>
      </div>
    </div>
    
    <QuestionCard
      :current-question="currentQuestion"
      :current-question-index="currentQuestionIndex"
      :show-answer="showAnswer"
    />
    
    <div class="quiz-actions">
      <button 
        class="quiz-btn action-retry" 
        @click="handleRetryQuestion"
        :disabled="showAnswer"
      >
        <i class="fas fa-redo"></i> 换一题
      </button>
      
      <button 
        class="quiz-btn action-answer" 
        @click="handleShowAnswer"
        v-if="!showAnswer"
      >
        <i class="fas fa-lightbulb"></i> 看答案
      </button>
      
      <button 
        class="quiz-btn action-continue" 
        @click="handleContinue"
        v-if="showAnswer"
      >
        <i class="fas fa-arrow-right"></i> 继续
      </button>
      
      <button class="quiz-btn action-back" @click="handleBackToSubcategories">
        <i class="fas fa-arrow-left"></i> 返回
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
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

const emit = defineEmits([
  'retry-question',
  'show-answer',
  'continue',
  'back-to-subcategories'
]);

const handleRetryQuestion = () => {
  emit('retry-question');
};

const handleShowAnswer = () => {
  emit('show-answer');
};

const handleContinue = () => {
  emit('continue');
};

const handleBackToSubcategories = () => {
  emit('back-to-subcategories');
};
</script>

<style scoped>
.quiz-screen {
  padding: 10px 20px;
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.quiz-category-badge {
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 15px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.quiz-stats {
  color: #ffcb69;
  font-weight: 500;
}

.combo-stat {
  color: #ffd700;
  text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
}

.quiz-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.quiz-btn {
  padding: 12px 25px;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.action-retry {
  background: rgba(102, 187, 255, 0.2);
  color: #66bbff;
}

.action-retry:hover {
  background: rgba(102, 187, 255, 0.3);
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(102, 187, 255, 0.2);
}

.action-answer {
  background: rgba(76, 217, 100, 0.2);
  color: #4cd964;
}

.action-answer:hover {
  background: rgba(76, 217, 100, 0.3);
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(76, 217, 100, 0.2);
}

.action-continue {
  background: rgba(255, 203, 105, 0.2);
  color: #ffcb69;
}

.action-continue:hover {
  background: rgba(255, 203, 105, 0.3);
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(255, 203, 105, 0.2);
}

.action-back {
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
}

.action-back:hover {
  background: rgba(255, 107, 107, 0.3);
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.2);
}

.quiz-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

@media (max-width: 480px) {
  .quiz-actions {
    flex-direction: column;
    gap: 10px;
  }
  
  .quiz-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>