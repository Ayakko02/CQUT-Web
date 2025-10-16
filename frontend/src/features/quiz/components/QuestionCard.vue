# 题目卡片组件
<<template>
  <div class="question-card">
    <div class="question-number">问题 {{ currentQuestionIndex + 1 }}</div>
    
    <!-- 题目内容 -->
    <div class="question-content">
      <div v-if="currentQuestion.imageUrl" class="question-image">
        <img :src="currentQuestion.imageUrl" :alt="currentQuestion.question" loading="lazy">
      </div>
      <div class="question-text">{{ currentQuestion.question }}</div>
    </div>

    <!-- 选择题选项 -->
    <div v-if="currentQuestion.type === 'choice' && !showAnswer" class="option-list">
      <div 
        v-for="(option, index) in currentQuestion.options" 
        :key="index"
        class="option-item"
        :class="{ selected: selectedOptionIndex === index, disabled: selectedOptionIndex !== -1 }"
        @click="handleOptionSelect(index)"
        :disabled="selectedOptionIndex !== -1"
      >
        <span class="option-label">{{ String.fromCharCode(65 + index) }}. </span>
        <span class="option-text">{{ option }}</span>
      </div>
    </div>

    <!-- 判断题选项 -->
    <div v-if="currentQuestion.type === 'judge' && !showAnswer" class="judge-option-list">
      <div 
        class="judge-option"
        :class="{ selected: selectedJudgeAnswer === true, disabled: selectedJudgeAnswer !== null }"
        @click="handleJudgeSelect(true)"
        :disabled="selectedJudgeAnswer !== null"
      >
        <i class="fas fa-check"></i> 正确
      </div>
      <div 
        class="judge-option"
        :class="{ selected: selectedJudgeAnswer === false, disabled: selectedJudgeAnswer !== null }"
        @click="handleJudgeSelect(false)"
        :disabled="selectedJudgeAnswer !== null"
      >
        <i class="fas fa-times"></i> 错误
      </div>
    </div>

    <!-- 完成提示（所有题目答完时显示） -->
    <div v-if="currentQuestion.type === 'completed'" class="completed-section">
      <div class="completed-emoji">🎉</div>
      <h3 class="completed-title">{{ currentQuestion.question }}</h3>
      <p class="completed-message">{{ currentQuestion.answer }}</p>
    </div>

    <!-- 答案区域 -->
    <div v-if="showAnswer && currentQuestion.type !== 'completed'" class="answer-section">
      <div v-if="userAnswerResult" class="answer-result" :class="answerResultClass">
        {{ answerResultText }}
      </div>
      
      <div class="answer-emoji" :class="answerEmojiClass"></div>
      <h3 class="answer-title" :class="answerTitleClass">{{ answerTitle }}</h3>
      
      <div class="answer-detail">
        <div v-if="currentQuestion.type === 'choice'">
          <p class="correct-option">正确选项：{{ String.fromCharCode(65 + currentQuestion.correctOptionIndex) }}. {{ currentQuestion.options[currentQuestion.correctOptionIndex] }}</p>
        </div>
        <div v-if="currentQuestion.type === 'judge'">
          <p class="correct-judge">正确结果：{{ currentQuestion.correctAnswer ? '正确' : '错误' }}</p>
        </div>
        <div v-else>
          <p class="answer-text">{{ currentQuestion.answer }}</p>
          <div v-if="currentQuestion.imageUrl" class="answer-image">
            <img :src="currentQuestion.imageUrl" :alt="currentQuestion.question" loading="lazy">
          </div>
        </div>
      </div>

      <div v-if="currentQuestion.clubTip" class="club-tip">
        <i class="fas fa-lightbulb"></i> {{ currentQuestion.clubTip }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, defineEmits, watch } from 'vue';

const props = defineProps({
  currentQuestion: Object,
  currentQuestionIndex: Number,
  showAnswer: Boolean,
  userAnswerResult: Object
});

const emit = defineEmits(['option-select', 'judge-select', 'answer-submitted']);

const selectedOptionIndex = ref(-1);
const selectedJudgeAnswer = ref(null);

// 选择题处理
const handleOptionSelect = (index) => {
  selectedOptionIndex.value = index;
  const isCorrect = index === props.currentQuestion.correctOptionIndex;
  emit('option-select', {
    selectedIndex: index,
    correctOptionIndex: props.currentQuestion.correctOptionIndex,
    isCorrect,
    autoShowAnswer: true
  });
  
  // 通知父组件该题目已回答
  emit('answer-submitted', props.currentQuestion.id, isCorrect);
};

// 判断题处理
const handleJudgeSelect = (answer) => {
  selectedJudgeAnswer.value = answer;
  const isCorrect = answer === props.currentQuestion.correctAnswer;
  emit('judge-select', {
    selectedAnswer: answer,
    correctAnswer: props.currentQuestion.correctAnswer,
    isCorrect,
    autoShowAnswer: true
  });
  
  // 通知父组件该题目已回答
  emit('answer-submitted', props.currentQuestion.id, isCorrect);
};

// 答题结果样式和文本
const answerResultClass = computed(() => {
  if (!props.userAnswerResult) return '';
  return props.userAnswerResult.isCorrect ? 'answer-result-correct' : 'answer-result-wrong';
});

const answerResultText = computed(() => {
  if (!props.userAnswerResult) return '';
  return props.userAnswerResult.isCorrect ? '✅ 回答正确！' : '❌ 回答错误~';
});

// 标题和表情样式
const answerTitleClass = computed(() => {
  return props.userAnswerResult && !props.userAnswerResult.isCorrect ? 'wrong-title' : '';
});

const answerTitle = computed(() => {
  if (props.userAnswerResult) {
    return props.userAnswerResult.isCorrect 
      ? `${props.currentQuestion.emoji || '🎉'} 回答正确！`
      : '答案解析';
  }
  return '答案解析';
});

const answerEmojiClass = computed(() => {
  if (props.userAnswerResult) {
    return props.userAnswerResult.isCorrect 
      ? `answer-emoji ${props.currentQuestion.emoji ? 'custom-emoji' : 'default-emoji'}`
      : 'answer-emoji wrong-emoji';
  }
  return 'answer-emoji default-emoji';
});

// 切换题目重置状态
watch(() => props.currentQuestion.id, () => {
  selectedOptionIndex.value = -1;
  selectedJudgeAnswer.value = null;
});

// 显示答案时重置选择状态
watch(() => props.showAnswer, (newVal) => {
  if (newVal) {
    selectedOptionIndex.value = -1;
    selectedJudgeAnswer.value = null;
  }
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

.question-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.question-image {
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  margin: 0 auto;
  max-width: 400px;
}

.question-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.question-text {
  font-size: 1.4rem;
  line-height: 1.6;
  text-align: center;
  padding: 10px 0;
}

.option-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 20px 0;
  padding: 0 20px;
}

.option-item {
  background: rgba(255, 255, 255, 0.08);
  padding: 15px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.option-item:hover {
  background: rgba(255, 255, 255, 0.12);
}

.option-item.selected {
  background: rgba(102, 187, 255, 0.2);
  border: 1px solid rgba(102, 187, 255, 0.5);
}

.option-item.disabled, .judge-option.disabled {
  opacity: 0.7;
  cursor: not-allowed;
  pointer-events: none;
}

.option-label {
  font-weight: bold;
  color: #66bbff;
}

.judge-option-list {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin: 20px 0;
  padding: 0 20px;
}

.judge-option {
  background: rgba(255, 255, 255, 0.08);
  padding: 15px 40px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.judge-option:hover {
  background: rgba(255, 255, 255, 0.12);
}

.judge-option.selected:nth-child(1) {
  background: rgba(76, 217, 100, 0.2);
  border-color: rgba(76, 217, 100, 0.5);
  color: #4cd964;
}

.judge-option.selected:nth-child(2) {
  background: rgba(255, 107, 107, 0.2);
  border-color: rgba(255, 107, 107, 0.5);
  color: #ff6b6b;
}

.answer-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed rgba(255, 255, 255, 0.2);
  text-align: center;
  animation: fadeIn 0.5s ease;
}

.answer-result {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 10px;
  padding: 5px 0;
}

.answer-result-correct {
  color: #4cd964;
}

.answer-result-wrong {
  color: #ff6b6b;
}

.answer-detail {
  margin: 15px 0;
  line-height: 1.8;
}

.correct-option {
  color: #4cd964;
  font-weight: 500;
  margin-bottom: 10px;
}

.correct-judge {
  color: #4cd964;
  font-weight: 500;
  margin-bottom: 10px;
}

.answer-text {
  font-size: 1.1rem;
  color: #e0e0e0;
  padding: 0 10px;
}

.answer-image {
  width: 100%;
  max-width: 300px;
  margin: 15px auto 0;
  border-radius: 8px;
  overflow: hidden;
}

.answer-image img {
  width: 100%;
  height: auto;
  opacity: 0.9;
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

.wrong-emoji::before {
  content: '📝';
  color: #e0e0e0;
}

.wrong-title {
  color: #e0e0e0;
}

.answer-title {
  margin-bottom: 15px;
  font-size: 1.3rem;
}

/* 完成状态样式 */
.completed-section {
  text-align: center;
  padding: 30px 20px;
  animation: fadeIn 0.5s ease;
}

.completed-emoji {
  font-size: 4rem;
  margin-bottom: 20px;
  animation: bounce 0.8s ease;
}

.completed-title {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #ffcb69;
}

.completed-message {
  color: #e0e0e0;
  margin-bottom: 30px;
  line-height: 1.6;
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

@media (max-width: 480px) {
  .question-text {
    font-size: 1.2rem;
  }
  
  .judge-option-list {
    flex-direction: column;
  }
  
  .option-list {
    padding: 0 10px;
  }
}
</style>
