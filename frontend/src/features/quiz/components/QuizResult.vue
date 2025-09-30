# 结果页面 - 结果展示
<template>
  <div class="quiz-result">
    <div class="result-header">
      <h2>答题完成！</h2>
      <div class="result-stats">
        <div class="stat-item">
          <div class="stat-value">{{ correctAnswers }}</div>
          <div class="stat-label">答对题数</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ comboCount }}</div>
          <div class="stat-label">最高连击</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ accuracy }}%</div>
          <div class="stat-label">准确率</div>
        </div>
      </div>
    </div>

    <div class="result-actions">
      <button class="result-btn primary" @click="handleRestart">
        <i class="fas fa-redo"></i> 重新开始
      </button>
      <button class="result-btn secondary" @click="handleBackToCategories">
        <i class="fas fa-home"></i> 返回首页
      </button>
      <button class="result-btn share" @click="handleShare">
        <i class="fas fa-share"></i> 分享成绩
      </button>
    </div>

    <div class="achievements">
      <h3>获得的成就</h3>
      <div class="achievements-list">
        <div 
          v-for="achievement in unlockedAchievements" 
          :key="achievement.id"
          class="achievement-item"
        >
          <i :class="achievement.icon" class="achievement-icon"></i>
          <div class="achievement-info">
            <div class="achievement-name">{{ achievement.name }}</div>
            <div class="achievement-desc">{{ achievement.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  correctAnswers: Number,
  totalQuestions: Number,
  comboCount: Number,
  unlockedAchievements: Array
});

const emit = defineEmits(['restart', 'back-to-categories', 'share']);

const accuracy = computed(() => {
  if (props.totalQuestions === 0) return 0;
  return Math.round((props.correctAnswers / props.totalQuestions) * 100);
});

const handleRestart = () => {
  emit('restart');
};

const handleBackToCategories = () => {
  emit('back-to-categories');
};

const handleShare = () => {
  emit('share');
};
</script>

<style scoped>
.quiz-result {
  padding: 20px;
  text-align: center;
}

.result-header {
  margin-bottom: 30px;
}

.result-header h2 {
  color: #ffcb69;
  margin-bottom: 20px;
  font-size: 2rem;
}

.result-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #4cd964;
  margin-bottom: 5px;
}

.stat-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.result-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.result-btn {
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

.result-btn.primary {
  background: rgba(76, 217, 100, 0.2);
  color: #4cd964;
}

.result-btn.primary:hover {
  background: rgba(76, 217, 100, 0.3);
  transform: translateY(-3px);
}

.result-btn.secondary {
  background: rgba(102, 187, 255, 0.2);
  color: #66bbff;
}

.result-btn.secondary:hover {
  background: rgba(102, 187, 255, 0.3);
  transform: translateY(-3px);
}

.result-btn.share {
  background: rgba(255, 203, 105, 0.2);
  color: #ffcb69;
}

.result-btn.share:hover {
  background: rgba(255, 203, 105, 0.3);
  transform: translateY(-3px);
}

.achievements {
  margin-top: 30px;
}

.achievements h3 {
  color: #ffcb69;
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.achievements-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  max-width: 600px;
  margin: 0 auto;
}

.achievement-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border-left: 3px solid #ffcb69;
}

.achievement-icon {
  font-size: 1.5rem;
  color: #ffcb69;
  margin-right: 15px;
}

.achievement-info {
  text-align: left;
}

.achievement-name {
  font-weight: 600;
  color: white;
  margin-bottom: 5px;
}

.achievement-desc {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 768px) {
  .result-stats {
    gap: 20px;
  }
  
  .stat-value {
    font-size: 2rem;
  }
  
  .result-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .result-btn {
    width: 200px;
    justify-content: center;
  }
}
</style>