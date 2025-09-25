# 零域组件 - 上半圆零域展示

<template>
  <!-- 零域（上半圆，0-100vh区域） -->
  <div class="zero-city">
    <!-- 水波效果 -->
    <div class="water-reflection"></div>
    <div class="water-waves">
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
    </div>

    <!-- 装饰图片 -->
    <img src="/images/rinlogo.png" alt="零域装饰" class="zero-decoration">
    <img src="/images/Lingyu.png" alt="零域艺术字" class="zero-artfont">
  </div>
</template>

<script setup>
// 零域组件的专属逻辑
</script>

<style scoped>
.zero-city {
  position: absolute;
  top: calc(100vh - 50vw);
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
  height: 50vw;
  background-image: url('/images/【哲风壁纸】-动漫-动漫人物-夜空.png');
  background-size: cover;
  background-position: center 20%;
  background-repeat: no-repeat;
  border-radius: 50vw 50vw 0 0;  /* 半圆形状 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  box-shadow:
      0 0 30px rgba(147, 51, 234, 0.4),
      inset 0 0 20px rgba(147, 51, 234, 0.1);
}

.zero-decoration {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: min(180vw, 800px);
  height: auto;
  opacity: 0.85;
  z-index: 666;
  pointer-events: none;
}

.zero-artfont {
  position: absolute;
  bottom: 60px;
  left: 8%;
  transform: translateX(-50%);
  width: min(60vw, 180px);
  height: auto;
  opacity: 0.85;
  z-index: 3;
  pointer-events: none;
}

/* 水波效果容器 */
.water-waves {
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 100%;
  height: 85px;
  overflow: hidden;
  z-index: 2;
}

/* 水波动画 */
.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background: linear-gradient(90deg,
  transparent 0%,
  rgba(147, 51, 234, 0.3) 25%,
  rgba(192, 38, 211, 0.4) 50%,
  rgba(147, 51, 234, 0.3) 75%,
  transparent 100%);
  animation: waveMove 4s ease-in-out infinite;
  border-radius: 50% 50% 0 0;
}

.wave:nth-child(2) {
  animation-delay: -2s;
  opacity: 0.7;
  height: 80%;
}

.wave:nth-child(3) {
  animation-delay: -1s;
  opacity: 0.5;
  height: 60%;
}

@keyframes waveMove {
  0%, 100% {
    transform: translateX(-50%) translateY(0px);
  }
  50% {
    transform: translateX(-50%) translateY(-10px);
  }
}

/* 水面反射效果 */
.water-reflection {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40px;
  background: linear-gradient(to top,
  rgba(147, 51, 234, 0.2) 0%,
  rgba(147, 51, 234, 0.05) 50%,
  transparent 100%);
  z-index: 1;
}
</style>