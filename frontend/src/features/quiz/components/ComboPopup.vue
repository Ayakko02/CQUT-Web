<template>
  <!-- Combo弹窗 -->
  <div v-if="isComboVisible" class="combo-popup" :class="{ active: isComboVisible }">
    {{ comboText }}
  </div>

  <!-- 传说级特效 -->
  <div v-if="isLegendaryTriggered" class="legendary-overlay" :class="{ active: isLegendaryTriggered }">
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useComboSystem } from '../composables/useComboSystem.js'

const comboSystem = useComboSystem()

// 计算属性
const isComboVisible = computed(() => comboSystem.isComboVisible.value)
const comboText = computed(() => comboSystem.comboText.value)
const isLegendaryTriggered = computed(() => comboSystem.isLegendaryTriggered.value)
</script>

<style scoped>
/* Combo弹窗 */
.combo-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 5em;
  font-weight: 900;
  color: #fbbf24;
  text-shadow:
      0 0 30px rgba(251, 191, 36, 0.8),
      0 0 60px rgba(251, 191, 36, 0.5);
  pointer-events: none;
  opacity: 0;
  z-index: 8000;
}

.combo-popup.active {
  animation: comboEffect 1.5s ease;
}

@keyframes comboEffect {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5) rotate(-10deg);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.2) rotate(5deg);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1) rotate(0deg);
  }
}

/* 传说级特效 */
.legendary-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center,
  rgba(251, 191, 36, 0.2),
  transparent);
  pointer-events: none;
  opacity: 0;
  z-index: 7000;
}

.legendary-overlay.active {
  animation: legendaryPulse 2s ease;
}

@keyframes legendaryPulse {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}
</style>