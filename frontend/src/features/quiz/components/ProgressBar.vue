# 进度条组件
<template>
  <div class="progress-container">
    <span class="time current-time">{{ formattedCurrentTime }}</span>
    <div class="progress-bar" @click="seek">
      <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
      <div class="progress-handle" :style="{ left: progressPercent + '%' }"></div>
    </div>
    <span class="time duration">{{ formattedDuration }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentTime: Number,
  duration: Number
});

const emit = defineEmits(['seek']);

const progressPercent = computed(() => {
  if (!props.duration) return 0;
  return Math.min(100, Math.max(0, (props.currentTime / props.duration) * 100));
});

const formattedCurrentTime = computed(() => {
  return formatTime(props.currentTime);
});

const formattedDuration = computed(() => {
  return formatTime(props.duration || 0);
});

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' + secs : secs}`;
};

const seek = (e) => {
  if (!props.duration) return;
  
  const rect = e.currentTarget.getBoundingClientRect();
  const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  emit('seek', pos * props.duration);
};
</script>

<style scoped>
.progress-container {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
}

.time {
  font-size: 0.7rem;
  color: var(--text-secondary);
  width: 36px;
  text-align: center;
  flex-shrink: 0;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  position: relative;
  cursor: pointer;
  transition: var(--transition);
}

.progress-bar:hover {
  height: 6px;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  border-radius: 2px;
  transition: width 0.1s linear;
}

.progress-handle {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: var(--transition);
}

.progress-bar:hover .progress-handle {
  opacity: 1;
}
</style>