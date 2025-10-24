<template>
  <div class="subcategory-stage">
    <!-- 背景粒子 -->
    <div class="particle-bg">
      <div v-for="i in 20" :key="i" class="particle" :style="getParticleStyle(i)"></div>
    </div>

    <!-- 主容器 -->
    <div class="main-container">
      <!-- 返回按钮 - 放在主容器左上角 -->
      <button class="back-btn" @click="handleBack">
        <i class="fas fa-arrow-left"></i>
        返回
      </button>

      <!-- 标题区域 -->
      <div class="stage-header">
        <h2 class="category-title">
          <span class="title-icon">{{ getCategoryIcon() }}</span>
          {{ subcategoryState.selectedCategory.value }}
        </h2>
        <div class="title-decoration"></div>
      </div>

      <!-- 轮播选择器 -->
      <div class="carousel-container">
        <!-- 左箭头 -->
        <button
            class="carousel-arrow carousel-arrow-left"
            @click="slidePrev"
        >
          <i class="fas fa-chevron-left"></i>
        </button>

        <!-- 卡片轨道 -->
        <div class="carousel-track">
          <div
              v-for="(subcategory, index) in subcategoryState.subcategories.value"
              :key="subcategory"
              class="carousel-card"
              :class="getCardClass(index)"
              :style="getCardPosition(index)"
              @click="selectCard(index)"
          >
            <div class="card-inner">
              <div class="card-icon">{{ subcategoryState.getSubcategoryIcon(subcategory) }}</div>
              <div class="card-name">{{ subcategory }}</div>
              <div class="card-count">
                <i class="fas fa-book"></i>
                {{ getQuestionCount(subcategory) }}题
              </div>
            </div>

            <!-- 中心卡片高光 -->
            <div v-if="index === currentIndex" class="card-highlight"></div>
          </div>
        </div>

        <!-- 右箭头 -->
        <button
            class="carousel-arrow carousel-arrow-right"
            @click="slideNext"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>

      <!-- 确认按钮 -->
      <button class="confirm-btn" @click="handleConfirm">
        <i class="fas fa-check"></i>
        确认选择
      </button>

      <!-- 指示器 -->
      <div class="indicators">
        <div
            v-for="(sub, index) in subcategoryState.subcategories.value"
            :key="index"
            class="indicator-dot"
            :class="{ active: index === currentIndex }"
            @click="selectCard(index)"
        ></div>
      </div>

      <!-- 底部提示 -->
      <div class="stage-footer">
        <div class="tip-text">
          <i class="fas fa-lightbulb"></i>
          使用箭头切换或直接点击卡片选择
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSubcategoryState } from '../composables/useSubcategoryState.js'

const emit = defineEmits(['select-subcategory', 'close'])
const subcategoryState = useSubcategoryState()

const currentIndex = ref(0) // 当前中心卡片索引

const categoryIcons = {
  '二次元': '🎮',
  '番剧': '📺',
  'Galgame': '💕',
  '音乐': '🎵',
  '梗百科': '😂',
  '声优': '🎤'
}

const subcategoryPlaylistMap = {
  '重返未来:1999': 'return-to-1999',
  'FGO': 'fgo',
  'Galgame': 'galgame',
  '崩坏3': 'honkai-3',
  '崩坏:星穹铁道': 'honkai-star-rail',
  '第五人格': 'identity-v',
  '东方Project': 'touhou',
  '饥荒': 'dont-starve',
  '绝区零': 'zzz',
  '麻将/雀魂': 'mahjong',
  '鸣潮': 'wuthering-waves',
  '三国杀': 'sgs',
  '原神': 'genshin',
  '月亮计划': 'limbus',
  '守望先锋': 'overwatch',
  '泰拉瑞亚':'terraria'
}

const getCategoryIcon = () => {
  return categoryIcons[subcategoryState.selectedCategory.value] || '📚'
}

// 向前滑动(闭环)
const slidePrev = () => {
  if (currentIndex.value === 0) {
    // 到达开头,跳到末尾
    currentIndex.value = subcategoryState.subcategories.value.length - 1
  } else {
    currentIndex.value--
  }
}

// 向后滑动(闭环)
const slideNext = () => {
  if (currentIndex.value === subcategoryState.subcategories.value.length - 1) {
    // 到达末尾,跳回开头
    currentIndex.value = 0
  } else {
    currentIndex.value++
  }
}

// 选择卡片
const selectCard = (index) => {
  currentIndex.value = index
}

// 确认选择
const handleConfirm = () => {
  const selected = subcategoryState.subcategories.value[currentIndex.value]
  console.log('[SubcategoryOrbital] 选择二级标签:', selected)

  subcategoryState.selectSubcategory(selected)

  // ⭐ 新增：获取对应的歌单ID
  const playlistId = subcategoryPlaylistMap[selected]

  emit('select-subcategory', {
    category: subcategoryState.selectedCategory.value,
    subcategory: selected,
    playlistId: playlistId  // ⭐ 新增：传递歌单ID
  })
}

// 获取卡片类名(环形)
const getCardClass = (index) => {
  const total = subcategoryState.subcategories.value.length
  let diff = index - currentIndex.value

  // 计算环形距离(选择最短路径)
  if (Math.abs(diff) > total / 2) {
    if (diff > 0) {
      diff = diff - total
    } else {
      diff = diff + total
    }
  }

  if (diff === 0) return 'center'
  if (diff === -1) return 'left-1'
  if (diff === -2) return 'left-2'
  if (diff === 1) return 'right-1'
  if (diff === 2) return 'right-2'
  if (diff < -2) return 'far-left'
  if (diff > 2) return 'far-right'
}

// 计算卡片位置(环形)
const getCardPosition = (index) => {
  const total = subcategoryState.subcategories.value.length
  let diff = index - currentIndex.value

  // 计算环形距离(选择最短路径)
  if (Math.abs(diff) > total / 2) {
    if (diff > 0) {
      diff = diff - total
    } else {
      diff = diff + total
    }
  }

  let translateX = 0
  let scale = 0.7
  let opacity = 0
  let zIndex = 0

  switch(diff) {
    case 0: // 中心
      translateX = 0
      scale = 1.2
      opacity = 1
      zIndex = 50
      break
    case -1: // 左1
      translateX = -240
      scale = 0.85
      opacity = 0.8
      zIndex = 40
      break
    case 1: // 右1
      translateX = 240
      scale = 0.85
      opacity = 0.8
      zIndex = 40
      break
    case -2: // 左2
      translateX = -450
      scale = 0.7
      opacity = 0.5
      zIndex = 30
      break
    case 2: // 右2
      translateX = 450
      scale = 0.7
      opacity = 0.5
      zIndex = 30
      break
    default: // 更远
      if (diff < 0) {
        translateX = -600
      } else {
        translateX = 600
      }
      scale = 0.5
      opacity = 0
      zIndex = 10
  }

  return {
    transform: `translateX(${translateX}px) scale(${scale})`,
    opacity: opacity,
    zIndex: zIndex
  }
}

const getQuestionCount = (subcategory) => {
  const questions = subcategoryState.getQuestionsForSubcategory(subcategory)
  return questions.length
}

const handleBack = () => {
  console.log('[SubcategoryOrbital] 返回')
  // 不重置 currentIndex,直接返回
  emit('close')
}

// 粒子样式
const getParticleStyle = (index) => {
  const size = Math.random() * 4 + 2
  const x = Math.random() * 100
  const y = Math.random() * 100
  const duration = Math.random() * 3 + 2
  const delay = Math.random() * 2

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${x}%`,
    top: `${y}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`
  }
}
</script>

<style scoped>
/* 二级标签页面入场动画 */
.subcategory-orbital {
  animation: orbitalEnter 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes orbitalEnter {
  0% {
    opacity: 0;
    transform: scale(1.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 边框容器入场 */
.main-container {
  animation: borderFadeIn 0.8s ease forwards;
  animation-delay: 0.2s;
  opacity: 0;
}

@keyframes borderFadeIn {
  0% {
    opacity: 0;
    transform: scale(0.8); /* 👈 删除 translate(-50%, -50%) */
  }
  100% {
    opacity: 1;
    transform: scale(1); /* 👈 删除 translate(-50%, -50%) */
  }
}

/* 中心卡片入场 */
.center-category {
  animation: centerZoomIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
  animation-delay: 0.3s;
  opacity: 0;
}

@keyframes centerZoomIn {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* 二级标签卡片依次入场 */
.subcategory-card {
  animation: subcategoryFadeIn 0.6s ease forwards;
  opacity: 0;
}

/* 为每个卡片设置不同的延迟 */
.subcategory-card:nth-child(1) { animation-delay: 0.4s; }
.subcategory-card:nth-child(2) { animation-delay: 0.5s; }
.subcategory-card:nth-child(3) { animation-delay: 0.6s; }
.subcategory-card:nth-child(4) { animation-delay: 0.7s; }
.subcategory-card:nth-child(5) { animation-delay: 0.8s; }

@keyframes subcategoryFadeIn {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.subcategory-stage {
  position: fixed; /* 👈 改成 fixed */
  top: 0;          /* 👈 添加 */
  left: 0;         /* 👈 添加 */
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  overflow: hidden;
}

/* 背景粒子 */
.particle-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8), transparent);
  border-radius: 50%;
  animation: particleFloat 3s ease-in-out infinite;
}

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px) scale(1.2);
    opacity: 0.8;
  }
}

/* 返回按钮 - 在主容器左上角 */
.back-btn {
  position: absolute;
  left: 20px;
  top: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  z-index: 100;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
}

/* 主容器 - 透明 */
.main-container {
  position: relative;
  width: 100%;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  z-index: 10;
  padding: 20px;
  border: 2px solid rgba(147, 51, 234, 0.3);
  border-radius: 30px;
  background: rgba(20, 25, 40, 0.4);
  box-shadow:
      inset 0 0 40px rgba(147, 51, 234, 0.05);

}

/* 头部 */
.stage-header {
  text-align: center;
  animation: slideDown 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.category-title {
  font-size: 2.5rem;
  color: white;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  text-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
}

.title-icon {
  font-size: 3rem;
  animation: iconBounce 2s ease-in-out infinite;
}

@keyframes iconBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.title-decoration {
  width: 200px;
  height: 3px;
  background: linear-gradient(90deg,
  transparent,
  #9333ea,
  transparent
  );
  margin: 15px auto 0;
  border-radius: 2px;
}

/* 轮播容器 */
.carousel-container {
  position: relative;
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 2000px;
}

/* 卡片轨道 */
.carousel-track {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 轮播卡片 */
.carousel-card {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 220px;
  height: 280px;
  margin-left: -110px;
  margin-top: -140px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

/* 中心卡片 */
.carousel-card.center {
  border-color: rgba(147, 51, 234, 0.8);
  background: rgba(147, 51, 234, 0.15);
  box-shadow:
      0 20px 60px rgba(0, 0, 0, 0.4),
      0 0 40px rgba(147, 51, 234, 0.5);
}

.card-inner {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 25px;
  position: relative;
  z-index: 2;
}

.card-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.3));
  transition: transform 0.3s ease;
}

.carousel-card.center .card-icon {
  transform: scale(1.1);
  animation: iconFloat 2s ease-in-out infinite;
}

@keyframes iconFloat {
  0%, 100% { transform: scale(1.1) translateY(0); }
  50% { transform: scale(1.1) translateY(-10px); }
}

.card-name {
  font-size: 1.3rem;
  font-weight: bold;
  color: white;
  text-align: center;
  margin-bottom: 15px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.card-count {
  display: flex;
  align-items: center;
  gap: 5px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 5px 12px;
  border-radius: 15px;
}

/* 中心卡片高光 */
.card-highlight {
  position: absolute;
  inset: 0;
  background: linear-gradient(
      135deg,
      transparent 0%,
      rgba(147, 51, 234, 0.2) 50%,
      transparent 100%
  );
  border-radius: 20px;
  animation: highlight 3s linear infinite;
  pointer-events: none;
}

@keyframes highlight {
  from { transform: translateX(-100%) rotate(45deg); }
  to { transform: translateX(200%) rotate(45deg); }
}

/* 箭头按钮 */
.carousel-arrow {
  position: absolute;
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-arrow:hover {
  background: rgba(147, 51, 234, 0.3);
  border-color: rgba(147, 51, 234, 0.6);
  transform: scale(1.1);
  box-shadow: 0 5px 20px rgba(147, 51, 234, 0.4);
}

.carousel-arrow-left {
  left: 50px;
}

.carousel-arrow-right {
  right: 50px;
}

/* 确认按钮 */
.confirm-btn {
  background: linear-gradient(135deg, #9333ea, #c026d3);
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(147, 51, 234, 0.4);
}

.confirm-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(147, 51, 234, 0.6);
}

.confirm-btn:active {
  transform: translateY(-1px);
}

/* 指示器 */
.indicators {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.indicator-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator-dot.active {
  background: #9333ea;
  transform: scale(1.3);
  box-shadow: 0 0 15px rgba(147, 51, 234, 0.8);
}

.indicator-dot:hover {
  background: rgba(147, 51, 234, 0.6);
  transform: scale(1.2);
}

/* 底部提示 */
.stage-footer {
  margin-top: 20px;
}

.tip-text {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 响应式 */
@media (max-width: 768px) {
  .back-btn {
    left: 10px;
    top: 10px;
    padding: 8px 16px;
    font-size: 0.9rem;
  }

  .main-container {
    padding: 15px;
  }

  .carousel-arrow-left {
    left: 10px;
  }

  .carousel-arrow-right {
    right: 10px;
  }

  .carousel-card {
    width: 180px;
    height: 240px;
    margin-left: -90px;
    margin-top: -120px;
  }

  .card-icon {
    font-size: 3rem;
  }

  .card-name {
    font-size: 1.1rem;
  }
}
</style>