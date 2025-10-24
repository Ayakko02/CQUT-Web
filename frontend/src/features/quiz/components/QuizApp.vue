<template>
  <div class="quiz-page">
    <!-- Loading层 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-character">
          <img src="/asset/loading.gif" alt="加载中...">
        </div>
        <div class="loading-text">正在加载题目...</div>
      </div>
    </div>

    <!-- 照片墙背景 -->
    <PhotoWallBackground
        :layer1Photos="layer1Photos"
        :layer2Photos="layer2Photos"
        :layer3Photos="layer3Photos"
        :speed="0.5"
    />

    <!-- 背景滤镜 -->
    <div class="background-filter"></div>

    <!-- 主容器 -->
    <div class="quiz-container">
      <!-- 首页 -->
      <QuizHome
          v-if="currentView === 'home'"
          @select-category="handleSelectCategory"
      />

      <!-- 二级标签轨道 -->
      <SubcategoryOrbital
          v-if="currentView === 'subcategory'"
          @select-subcategory="handleSelectSubcategory"
          @close="handleCloseSubcategory"
      />

      <!-- 题目页 -->
      <QuizScreen
          v-if="currentView === 'question'"
          @show-answer="handleShowAnswer"
          @back="handleBackHome"
          @change-category="handleChangeCategory"
      />

      <!-- 答案页 -->
      <AnswerScreen
          v-if="currentView === 'answer'"
          @back-to-question="handleBackToQuestion"
          @next-question="handleNextQuestion"
          @change-category="handleChangeCategory"
      />

      <!-- Combo和特效 -->
      <ComboPopup />

      <!-- 弹幕系统 -->
      <DanmakuLayer />

      <!-- 音乐开关控制 -->
      <MusicToggle />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import QuizHome from './QuizHome.vue'
import SubcategoryOrbital from './SubcategoryOrbital.vue'
import QuizScreen from './QuizScreen.vue'
import AnswerScreen from './AnswerScreen.vue'
import ComboPopup from './ComboPopup.vue'
import DanmakuLayer from './DanmakuLayer.vue'
import { useQuizState } from '../composables/useQuizState.js'
import { useSubcategoryState } from '../composables/useSubcategoryState.js'
import { quizConfig } from '../data/index.js'
import PhotoWallBackground from './PhotoWallBackground.vue'
import { useQuizStore } from '@/stores/quiz'
import { useMusicPlayer } from '@/features/home/composables/useMusicPlayer'
import MusicToggle from './MusicToggle.vue'

// 照片墙照片列表
const layer1Photos = ref([
  '/asset/鸽子图/鸽子1.jpg',
  '/asset/鸽子图/鸽子2.jpg',
  '/asset/鸽子图/鸽子3.png',
  '/asset/鸽子图/鸽子4.png',
  '/asset/鸽子图/鸽子5.jpg',
  '/asset/鸽子图/鸽子6.jpg',
  '/asset/鸽子图/鸽子7.jpg',
  '/asset/鸽子图/鸽子25.jpg',
  '/asset/鸽子图/鸽子9.jpg',
  '/asset/鸽子图/鸽子10.png',
  '/asset/鸽子图/鸽子11.png',
  '/asset/鸽子图/鸽子12.jpg',
  '/asset/鸽子图/鸽子13.jpg',
  '/asset/鸽子图/鸽子14.jpg',
  '/asset/鸽子图/鸽子15.png',
  '/asset/鸽子图/鸽子26.jpg',
  '/asset/鸽子图/鸽子27.jpg',
  '/asset/鸽子图/鸽子18.jpg',
  '/asset/鸽子图/鸽子19.jpg',
  '/asset/鸽子图/鸽子20.png',
  '/asset/鸽子图/鸽子21.jpg',
  '/asset/鸽子图/鸽子22.jpg',
  '/asset/鸽子图/鸽子23.jpg',
  '/asset/鸽子图/鸽子24.jpg',
])

const layer2Photos = ref([
  '/asset/希尔图/希尔1.png',
  '/asset/希尔图/希尔2.jpg',
  '/asset/希尔图/希尔3.png',
  '/asset/希尔图/希尔4.png',
  '/asset/希尔图/希尔5.jpg',
  '/asset/希尔图/希尔6.png',
  '/asset/希尔图/希尔7.png',
  '/asset/希尔图/希尔8.jpg',
  '/asset/希尔图/希尔9.png',
  '/asset/希尔图/希尔10.jpg',
  '/asset/希尔图/希尔11.jpg',
  '/asset/希尔图/希尔12.png',
  '/asset/希尔图/希尔13.jpg',
  '/asset/希尔图/希尔14.png',
  '/asset/希尔图/希尔15.jpeg',
  '/asset/希尔图/希尔16.png',
  '/asset/希尔图/希尔17.png',
  '/asset/希尔图/希尔18.png',
  '/asset/希尔图/希尔19.jpg',
  '/asset/希尔图/希尔20.jpg',
  '/asset/希尔图/希尔21.png',
  '/asset/希尔图/希尔22.jpg',
  '/asset/希尔图/希尔23.png',
  '/asset/希尔图/希尔24.jpg',
])

const layer3Photos = ref([
  '/asset/九月图/九月1.jpg',
  '/asset/九月图/九月2.jpg',
  '/asset/九月图/九月3.jpg',
  '/asset/九月图/九月4.jpg',
  '/asset/九月图/九月5.jpg',
  '/asset/九月图/九月6.jpg',
  '/asset/九月图/九月7.jpg',
  '/asset/九月图/九月8.jpg',
  '/asset/九月图/九月9.jpg',
  '/asset/九月图/九月10.jpg',
  '/asset/九月图/九月11.jpg',
  '/asset/九月图/九月12.jpg',
  '/asset/九月图/九月13.jpg',
  '/asset/九月图/九月14.jpg',
  '/asset/九月图/九月15.jpg',
  '/asset/九月图/九月16.jpg',
  '/asset/九月图/九月17.jpg',
  '/asset/九月图/九月18.png',
  '/asset/九月图/九月19.png',
])

// 使用composables
const quizState = useQuizState()
const quizStore = useQuizStore()
const subcategoryState = useSubcategoryState()

// 当前视图状态: 'home' | 'subcategory' | 'question' | 'answer'
const currentView = ref('home')
const isLoading = ref(false)

/**
 * 处理一级分类选择 - 展开二级标签
 */
const handleSelectCategory = (category) => {
  console.log('[QuizApp] 选择一级分类:', category)

  subcategoryState.expandSubcategories(category)
  currentView.value = 'subcategory'
}

/**
 * 处理二级标签选择 - 加载题目
 */
const handleSelectSubcategory = (payload) => {
  console.log('[QuizApp] 选择二级标签:', payload)
  console.log('[QuizApp] 当前视图:', currentView.value)

  // 显示Loading
  isLoading.value = true
  console.log('[QuizApp] 显示 Loading')

  // 初始化分类状态(传入一级和二级标签)
  quizState.initializeCategory(payload.category, payload.subcategory)
  quizStore.confirmSubcategory(payload.playlistId)

  // 获取第一题
  const question = quizState.getNextQuestion()
  console.log('[QuizApp] 获取到的题目:', question)

  const musicPlayer = useMusicPlayer()
  musicPlayer.switchPlaylist(payload.playlistId)
  console.log('[QuizApp] 直接调用 MusicPlayer 切换歌单:', payload.playlistId)

  // 延迟后隐藏Loading并显示题目页
  setTimeout(() => {
    console.log('[QuizApp] Loading 完成，准备切换视图')
    isLoading.value = false
    currentView.value = 'question'
    console.log('[QuizApp] 视图已切换到:', currentView.value)
    console.log('[QuizApp] 当前题目:', quizState.getCurrentQuestion())
  }, quizConfig.animations.loadingDuration)

  console.log('[QuizApp] Loading 延迟时间:', quizConfig.animations.loadingDuration, 'ms')
}

/**
 * 处理关闭二级标签
 */
const handleCloseSubcategory = () => {
  console.log('[QuizApp] 关闭二级标签')
  currentView.value = 'home'
}

/**
 * 处理显示答案 - 从题目页切换到答案页
 */
const handleShowAnswer = () => {
  console.log('[QuizApp] 切换到答案页')
  currentView.value = 'answer'
}

/**
 * 处理返回题目页 - 从答案页返回题目页
 */
const handleBackToQuestion = () => {
  console.log('[QuizApp] 返回题目页')
  currentView.value = 'question'
}

/**
 * 处理下一题 - 从答案页加载下一题
 */
const handleNextQuestion = () => {
  console.log('[QuizApp] 加载下一题')

  // 获取下一题
  quizState.getNextQuestion()

  // 切换回题目页
  currentView.value = 'question'
}

/**
 * 处理返回首页
 */
const handleBackHome = () => {
  console.log('[QuizApp] 返回首页')
  currentView.value = 'home'
  subcategoryState.collapseSubcategories()
}

/**
 * 处理切换分类
 */
const handleChangeCategory = () => {
  console.log('[QuizApp] 切换分类')
  currentView.value = 'home'
  subcategoryState.collapseSubcategories()
}
</script>

<style scoped>
.quiz-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: #0a0e27;
  overflow: hidden;
}

.quiz-container {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  z-index: 10;
}

/* Loading层 */
.loading-overlay {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(10, 14, 39, 0.9);
  z-index: 8000;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.loading-content {
  text-align: center;
}

.loading-character {
  width: 180px;
  height: 180px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-character img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.loading-text {
  color: white;
  font-size: 1.5em;
  opacity: 0.8;
  animation: loadingBlink 1s ease-in-out infinite;
}

@keyframes loadingBlink {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* 题目和答案页面容器 */
.question-screen-wrapper,
.answer-screen-wrapper {
  width: 100%;
  height: 100%;
}

/* 题目页淡出过渡 */
.fade-out-enter-active {
  transition: all 0.3s ease;
}

.fade-out-leave-active {
  transition: all 0.3s ease;
}

.fade-out-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-out-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* 答案页淡入过渡 */
.fade-in-enter-active {
  transition: all 0.5s ease;
}

.fade-in-leave-active {
  transition: all 0.3s ease;
}

.fade-in-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-in-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* 响应式 */
@media (max-width: 768px) {
  .loading-character {
    width: 120px;
    height: 120px;
  }

  .loading-text {
    font-size: 1.2em;
  }
}
</style>