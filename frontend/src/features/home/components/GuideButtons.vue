# 右侧引导按钮组

<template>
  <div class="right-guides">
    <div class="guide-item">
      <button class="guide-button" @click="showContent('社团简介')">社团简介</button>
      <div class="guide-line guide-line-short"></div>
    </div>
    <div class="guide-item">
      <button class="guide-button" @click="showContent('社团成就')">社团成就</button>
      <div class="guide-line guide-line-medium"></div>
    </div>
    <div class="guide-item">
      <button class="guide-button" @click="showContent('社团文化')">社团文化</button>
      <div class="guide-line guide-line-long"></div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['show-content'])

const showContent = (contentType) => {
  emit('show-content', contentType)
}
</script>

<style scoped>
/* 保持原有样式不变 */
.guide-line {
  height: 2px;
  background: linear-gradient(90deg,
  transparent 0%,
  #9333ea 25%,
  #c026d3 75%,
  transparent 100%
  );
  margin-right: 20px;
  position: relative;
}

.guide-line-long { width: 530px; }
.guide-line-medium { width: 350px; }
.guide-line-short { width: 170px; }

.guide-item:nth-child(1) {
  position: absolute;
  right: 90px;
  top: -80px;
}

.guide-item:nth-child(2) {
  position: absolute;
  top: 100px;
}

.guide-item:nth-child(2) {
  right: 0;
}

.guide-item:nth-child(3) {
  position: absolute;
  right: -90px;
  top: 280px;
}

.guide-line::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 30%;
  height: 100%;
  background: linear-gradient(90deg,
  transparent 0%,
  rgba(255, 255, 255, 0.3) 20%,
  rgba(255, 255, 255, 0.8) 50%,
  rgba(255, 255, 255, 0.3) 80%,
  transparent 100%
  );
  animation: lightBarMove 8s ease-in-out infinite;
}

@keyframes lightBarMove {
  0% { left: 0; opacity: 0; }
  10% { opacity: 0.8; }
  50% { left: 70%; opacity: 1; }
  90% { opacity: 0.8; }
  100% { left: 0; opacity: 0; }
}

.guide-line-long::before { animation: lightBarMove 3.5s ease-in-out infinite; }
.guide-line-medium::before { animation: lightBarMove 2.8s ease-in-out infinite; animation-delay: -1s; }
.guide-line-short::before { animation: lightBarMove 2.2s ease-in-out infinite; animation-delay: -1.8s; }

.guide-button {
  background: rgba(147, 51, 234, 0.1);
  border: 2px solid rgba(147, 51, 234, 0.4);
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  backdrop-filter: blur(10px);
  min-width: 120px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.guide-button:hover {
  background: rgba(147, 51, 234, 0.3);
  border-color: #9333ea;
  transform: translateX(-5px);
}

.guide-item {
  position: absolute;
  display: flex;
  align-items: center;
}

.right-guides {
  position: absolute;
  right: 5%;
  top: 55%;
  transform: translateY(-50%);
  width: 300px;
  height: 200px;
  z-index: 50;
}
</style>