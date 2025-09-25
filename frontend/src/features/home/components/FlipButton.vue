# 翻转按钮

<template>
  <div>
    <div class="rotation-effect" :class="{ active: isRotating }"></div>
    <button
        class="flip-button"
        :class="{ rotating: isRotating }"
        @click="$emit('flip')"
    >
      <div class="flip-button-content">{{ flipButtonIcon }}</div>
    </button>
  </div>
</template>

<script setup>
defineProps({
  isRotating: {
    type: Boolean,
    default: false
  },
  flipButtonIcon: {
    type: String,
    default: '⚡'
  }
})

defineEmits(['flip'])
</script>

<style scoped>
.flip-button {
  position: absolute;
  top: 100vh;
  left: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
  z-index: 1000;
  background: linear-gradient(135deg, #9333ea, #daa520);
  border: none;
  width: min(6vw, 50px);
  height: min(6vw, 50px);
  color: white;
  font-size: min(2vw, 1.2em);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  /* 确保文字不跟着旋转 */
}

/* 按钮内容反向旋转，保持文字正向 */
.flip-button-content {
  transform: rotate(-45deg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.flip-button:hover {
  transform: translate(-50%, -50%) rotate(45deg) scale(1.15);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
}

.flip-button:active {
  transform: translate(-50%, -50%) rotate(45deg) scale(0.95);
}

.flip-button.rotating {
  animation: buttonRotateSquare 2.5s ease-in-out;
}

@keyframes buttonRotateSquare {
  0% { transform: translate(-50%, -50%) rotate(45deg); }
  100% { transform: translate(-50%, -50%) rotate(405deg); }
}

/* 旋转特效 - 围绕按钮位置，跟随页面滚动 */
.rotation-effect {
  position: absolute;
  top: 100vh;
  left: 50%;
  width: min(80vw, 400px);
  height: min(80vw, 400px);
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 999;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.rotation-effect.active {
  opacity: 1;
  animation: rotationPulse 2.5s ease-in-out;
}

@keyframes rotationPulse {
  0% {
    transform: translate(-50%, -50%) scale(0.5) rotate(0deg);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.3) rotate(180deg);
  }
  100% {
    transform: translate(-50%, -50%) scale(1) rotate(360deg);
  }
}

.rotation-effect::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-image: linear-gradient(45deg, #9333ea, #daa520, #9333ea, #daa520) 1;
  border-radius: 50%;
  animation: rotateBorder 2.5s linear;
}

@keyframes rotateBorder {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>