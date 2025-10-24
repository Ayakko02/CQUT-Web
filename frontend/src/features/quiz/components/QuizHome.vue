<template>
  <!-- 首页 - 分类选择 -->
  <div class="home-screen" id="homeScreen">

    <!-- 磨砂玻璃主容器 -->
    <div class="quiz-main-container">
      <!-- 标题区域 -->
      <h1 class="main-title">ACGN 浓度测试</h1>
      <p class="subtitle">测测你的本命领域?</p>
      <!-- 分类卡片容器 -->
      <div class="categories-3d-space" id="categories3DSpace">
        <div
            v-for="(category, index) in categories"
            :key="index"
            class="category-card-3d"
            :class="getCategoryClass(index)"
            @click="selectCategory(category)"
        >
          <div class="category-icon">{{ getCategoryIcon(category) }}</div>
          <div class="category-name">{{ category }}</div>
        </div>
      </div>
    </div>

    <!-- 页脚信息 -->
    <div class="footer-info">
      <span class="club-name">CQUT动漫社</span> - 找到你的同好!
      <button class="join-hint-btn" @click="showQQModal = true">
        <i class="fas fa-users"></i>
        QQ群:点我点我!!
      </button>
    </div>

    <!-- QQ群二维码弹窗 -->
    <div v-if="showQQModal" class="modal-overlay" @click="showQQModal = false">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="showQQModal = false">
          <i class="fas fa-times"></i>
        </button>

        <h2 class="modal-title">加入CQUT动漫社</h2>

        <div class="qr-container">
          <!-- 溯洄QQ群 -->
          <div class="qr-card">
            <h3 class="qr-card-title">溯洄</h3>
            <div class="qr-code">
              <img src="/asset/溯洄QQ群.jpg" alt="溯洄QQ群二维码">
            </div>
            <p class="qr-desc">QQ群号:123456789</p>
          </div>

          <!-- 零域QQ群 -->
          <div class="qr-card">
            <h3 class="qr-card-title">零域</h3>
            <div class="qr-code">
              <img src="/asset/零域QQ群.jpg" alt="零域QQ群二维码">
            </div>
            <p class="qr-desc">QQ群号:987654321</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref} from 'vue'
import { questionDB } from '../data/index.js'

const emit = defineEmits(['select-category'])
const showQQModal = ref(false)

// 获取所有分类
const categories = computed(() => Object.keys(questionDB))

// 分类图标映射
const categoryIcon = {
  '游戏': '🎮',
  '动漫': '📺',
  '电子竞技': '💭',
  '音乐': '🎵',
  '梗百科': '😂',
  '声优': '🎤'
}

/**
 * 获取分类图标
 */
const getCategoryIcon = (category) => {
  return categoryIcon[category] || '✨'
}

/**
 * 获取卡片类名(用于3D定位)
 */
const getCategoryClass = (index) => {
  return `category-index-${index}`
}

/**
 * 选择分类
 */
const selectCategory = (category) => {
  console.log('[QuizHome] 选择分类:', category)
  emit('select-category', category)
}
</script>

<style scoped>
/* 首页离场动画 */
.home-screen.leaving {
  animation: homeLeave 0.6s ease forwards;
}

@keyframes homeLeave {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.9);
  }
}

/* 卡片飞出动画 */
.category-card-3d.flying-out {
  animation: cardFlyOut 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}

@keyframes cardFlyOut {
  0% {
    opacity: 1;
    transform: scale(1) translateZ(0);
  }
  100% {
    opacity: 0;
    transform: scale(0.3) translateZ(-500px);
  }
}
.home-screen {
  text-align: center;
  position: relative;
  height: 100%;
  min-height: 650px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  animation: screenFadeIn 0.8s ease;
}

@keyframes screenFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 标题区域 */
.main-title {
  font-size: 3.5em;
  font-weight: 900;
  margin-bottom: 15px;
  background: linear-gradient(90deg,
  #9333ea 0%,
  #c026d3 25%,
  #e879f9 50%,
  #9333ea 75%,
  #c026d3 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 3s ease-in-out infinite;
  filter: drop-shadow(0 5px 15px rgba(147, 51, 234, 0.3));
  position: relative;
  z-index: 100;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.3em;
  margin-bottom: 30px;
  opacity: 0;
  animation: fadeInUp 0.8s ease forwards;
  animation-delay: 0.3s;
  position: relative;
  z-index: 100;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 磨砂玻璃主容器 */
.quiz-main-container {
  width: 200%;
  top:4%;
  max-width: 1000px;
  min-height: 500px;
  background: rgba(20, 25, 40, 0.4);
  border: 2px solid rgba(147, 51, 234, 0.3);
  border-radius: 30px;
  padding: 50px 30px;
  box-shadow:
      0 20px 60px rgba(0, 0, 0, 0.4),
      0 0 80px rgba(147, 51, 234, 0.15),
      inset 0 0 40px rgba(147, 51, 234, 0.08);
  position: relative;
  z-index: 50;
}

/* 3D卡片容器 */
.categories-3d-space {
  position: relative;
  width: 100%;
  height: 380px;
  perspective: 2000px;
  transform-style: preserve-3d;
  pointer-events: none; /* 👈 容器不拦截事件 */
}

/* ============ 核心修复 ============ */
/* 3D卡片样式 */
.category-card-3d {
  position: absolute;
  width: 150px;
  height: 170px;
  background: linear-gradient(135deg,
  rgba(147, 51, 234, 0.2),
  rgba(192, 38, 211, 0.2));
  border: 2px solid rgba(147, 51, 234, 0.4);
  border-radius: 20px;
  padding: 25px 15px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); /* 👈 缩短过渡时间 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow:
      0 10px 40px rgba(147, 51, 234, 0.2),
      inset 0 0 20px rgba(147, 51, 234, 0.1);

  /* 👇 关键修复 */
  pointer-events: auto !important; /* 确保卡片可交互 */
  will-change: transform, opacity; /* 优化动画性能 */
  transform-origin: center center;
  isolation: isolate; /* 创建独立层叠上下文,防止z-index混乱 */
}

/* 👇 删除或注释掉这个伪元素,它会干扰hover */
/* .category-card-3d::before {
  ...删除这个调试边框...
} */

/* 6个卡片的不同位置和动画 - 移除动画中的z-index变化 */
.category-index-0 {
  left: 5%;
  top: 5%;
  transform: scale(0.85);
  opacity: 0.9;
  z-index: 10; /* 👈 固定z-index */
  animation: float3D-1 25s ease-in-out infinite;
}

.category-index-1 {
  left: 42%;
  top: 0%;
  transform: scale(0.92);
  opacity: 0.95;
  z-index: 20;
  animation: float3D-2 22s ease-in-out infinite;
  animation-delay: -5s;
}

.category-index-2 {
  left: 73%;
  top: 8%;
  transform: scale(0.8);
  opacity: 0.85;
  z-index: 5;
  animation: float3D-3 27s ease-in-out infinite;
  animation-delay: -10s;
}

.category-index-3 {
  left: 8%;
  top: 50%;
  transform: scale(0.95);
  opacity: 0.98;
  z-index: 25;
  animation: float3D-4 20s ease-in-out infinite;
  animation-delay: -3s;
}

.category-index-4 {
  left: 45%;
  top: 55%;
  transform: scale(0.88);
  opacity: 0.92;
  z-index: 15;
  animation: float3D-5 24s ease-in-out infinite;
  animation-delay: -8s;
}

.category-index-5 {
  left: 75%;
  top: 45%;
  transform: scale(1);
  opacity: 1;
  z-index: 30;
  animation: float3D-6 21s ease-in-out infinite;
  animation-delay: -15s;
}

/* 👇 修复后的动画 - 移除z-index和opacity变化 */
@keyframes float3D-1 {
  0%, 100% {
    transform: scale(0.85) rotateY(0deg) translateX(0) translateY(0);
  }
  25% {
    transform: scale(0.9) rotateY(10deg) translateX(30px) translateY(-20px);
  }
  50% {
    transform: scale(0.8) rotateY(-5deg) translateX(-20px) translateY(30px);
  }
  75% {
    transform: scale(0.87) rotateY(8deg) translateX(20px) translateY(10px);
  }
}

@keyframes float3D-2 {
  0%, 100% {
    transform: scale(0.92) rotateY(0deg) translateX(0) translateY(0);
  }
  33% {
    transform: scale(0.88) rotateY(-12deg) translateX(-30px) translateY(25px);
  }
  66% {
    transform: scale(0.96) rotateY(15deg) translateX(25px) translateY(-15px);
  }
}

@keyframes float3D-3 {
  0%, 100% {
    transform: scale(0.8) rotateY(0deg) translateX(0) translateY(0);
  }
  50% {
    transform: scale(0.85) rotateY(20deg) translateX(-35px) translateY(20px);
  }
}

@keyframes float3D-4 {
  0%, 100% {
    transform: scale(0.95) rotateY(0deg) translateX(0) translateY(0);
  }
  25% {
    transform: scale(0.9) rotateY(-8deg) translateX(25px) translateY(-25px);
  }
  75% {
    transform: scale(1) rotateY(6deg) translateX(-20px) translateY(15px);
  }
}

@keyframes float3D-5 {
  0%, 100% {
    transform: scale(0.88) rotateY(0deg) translateX(0) translateY(0);
  }
  40% {
    transform: scale(0.92) rotateY(12deg) translateX(-30px) translateY(-20px);
  }
  80% {
    transform: scale(0.84) rotateY(-10deg) translateX(20px) translateY(25px);
  }
}

@keyframes float3D-6 {
  0%, 100% {
    transform: scale(1) rotateY(0deg) translateX(0) translateY(0);
  }
  30% {
    transform: scale(0.95) rotateY(-15deg) translateX(-25px) translateY(-30px);
  }
  70% {
    transform: scale(0.9) rotateY(18deg) translateX(30px) translateY(20px);
  }
}

/* ============ 超级强化的Hover效果 ============ */
.category-card-3d:hover {
  /* 👇 立即停止动画 */
  animation-play-state: paused !important;

  /* 👇 强制最高层级 */
  z-index: 9999 !important;

  /* 👇 覆盖所有transform */
  transform: scale(1.35) rotateY(0deg) translateX(0) translateY(0) !important;

  /* 👇 确保完全可见 */
  opacity: 1 !important;

  /* 👇 视觉增强 */
  background: linear-gradient(135deg,
  rgba(147, 51, 234, 0.4),
  rgba(192, 38, 211, 0.4)) !important;
  border-color: #9333ea !important;
  box-shadow:
      0 20px 60px rgba(147, 51, 234, 0.5),
      0 0 100px rgba(147, 51, 234, 0.3),
      inset 0 0 30px rgba(147, 51, 234, 0.2) !important;

  /* 👇 缩短过渡让响应更快 */
  transition: all 0.2s ease !important;
}

.category-icon {
  font-size: 3em;
  margin-bottom: 15px;
  display: inline-block;
  filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.3));
  transition: transform 0.3s ease;
  pointer-events: none; /* 👈 防止图标阻挡hover */
}

.category-card-3d:hover .category-icon {
  transform: scale(1.2) rotateZ(10deg);
}

.category-name {
  color: white;
  font-size: 1.2em;
  font-weight: bold;
  letter-spacing: 1px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  pointer-events: none; /* 👈 防止文字阻挡hover */
}

/* 页脚信息 */
.footer-info {
  text-align: center;
  margin-top: 55px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1em;
  position: relative;
  z-index: 100;
  text-shadow:
      0 2px 4px rgba(0, 0, 0, 0.8),
      0 4px 8px rgba(0, 0, 0, 0.6),
      0 0 20px rgba(0, 0, 0, 0.5);
  background: rgba(10, 14, 39, 0);
  padding: 15px 30px;
  border-radius: 12px;
  display: inline-block;
}

.club-name {
  color: #9333ea;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(147, 51, 234, 0.5);
}

/* QQ群按钮 */
.join-hint-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: 15px;
  padding: 10px 24px;
  background: linear-gradient(135deg, #9333ea, #c026d3);
  border: 1px solid rgba(147, 51, 234, 0.5);
  border-radius: 25px;
  color: white;
  font-size: 0.9em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(147, 51, 234, 0.3);
  animation: hintPulse 2s ease-in-out infinite;
}

.join-hint-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(147, 51, 234, 0.5);
  animation-play-state: paused;
}

.join-hint-btn i {
  font-size: 1.2em;
}

/* 弹窗遮罩 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 弹窗内容 */
.modal-content {
  background: rgba(20, 25, 40, 0.95);
  border-radius: 30px;
  border: 2px solid rgba(147, 51, 234, 0.4);
  padding: 40px 30px;
  max-width: 900px;
  width: 90%;
  position: relative;
  box-shadow:
      0 20px 60px rgba(0, 0, 0, 0.5),
      0 0 80px rgba(147, 51, 234, 0.2),
      inset 0 0 40px rgba(147, 51, 234, 0.1);
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 关闭按钮 */
.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(147, 51, 234, 0.2);
  border: 1px solid rgba(147, 51, 234, 0.4);
  color: rgba(255, 255, 255, 0.8);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 1.3rem;
}

.modal-close:hover {
  background: rgba(147, 51, 234, 0.4);
  color: white;
  transform: rotate(90deg);
  box-shadow: 0 0 20px rgba(147, 51, 234, 0.5);
}

/* 弹窗标题 */
.modal-title {
  text-align: center;
  color: #e879f9;
  font-size: 2rem;
  margin-bottom: 30px;
  text-shadow: 0 0 20px rgba(232, 121, 249, 0.5);
  font-weight: bold;
}

/* 二维码容器 */
.qr-container {
  display: flex;
  gap: 30px;
  justify-content: center;
  align-items: stretch;
}

/* 二维码卡片 */
.qr-card {
  flex: 1;
  max-width: 400px;
  padding: 0;
  text-align: center;
  background: none;
  border: none;
  transition: all 0.3s ease;
}

.qr-card:hover {
  transform: translateY(-8px);
  filter: drop-shadow(0 15px 40px rgba(147, 51, 234, 0.4));
}

.qr-card-title {
  color: #c026d3;
  font-size: 1.8rem;
  margin-bottom: 15px;
  font-weight: bold;
  text-shadow: 0 0 15px rgba(192, 38, 211, 0.5);
}

/* 二维码图片 */
.qr-code {
  width: 100%;
  height: auto;
  margin: 0 auto 15px;
  background: none;
  border-radius: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
}

.qr-code img {
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 10px;
}

/* 二维码描述 */
.qr-desc {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

@keyframes hintPulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

/* 响应式 */
@media (max-width: 768px) {
  .modal-content {
    padding: 30px 20px;
  }

  .qr-container {
    flex-direction: column;
    gap: 20px;
  }

  .qr-card {
    max-width: 100%;
  }

  .modal-title {
    font-size: 1.6rem;
    margin-bottom: 25px;
  }

  .qr-card-title {
    font-size: 1.4rem;
  }

  .qr-desc {
    font-size: 1rem;
  }

  .join-hint-btn {
    margin-left: 10px;
    padding: 8px 18px;
    font-size: 0.9em;
  }
}
</style>