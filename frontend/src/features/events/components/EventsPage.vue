<!--活动主页（主要组件）-->

<template>
  <div class="events-page">
    <!-- 背景装饰 -->
    <div class="events-background">
      <div class="grid-lines"></div>
      <div class="glow-orbs"></div>
    </div>

    <!-- 页面头部 -->
    <div class="events-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="title-icon">🎯</span>
          <span class="title-text">活动中心</span>
          <span class="title-accent">Event Center</span>
        </h1>
        <p class="page-subtitle">探索精彩活动，参与社团互动</p>
      </div>

      <!-- 快捷入口 -->
      <div class="quick-actions">
        <button class="action-btn" @click="goToQuiz">
          <i class="fas fa-gamepad"></i>
          <span>ACGN测试</span>
        </button>
        <button class="action-btn" @click="showCalendar = true">
          <i class="fas fa-calendar"></i>
          <span>活动日历</span>
        </button>
      </div>
    </div>

    <!-- 活动列表 -->
    <div class="events-container">
      <!-- 筛选器 -->
      <div class="filters-bar">
        <button
            v-for="category in categories"
            :key="category.id"
            :class="['filter-btn', { active: activeCategory === category.id }]"
            @click="activeCategory = category.id"
        >
          {{ category.name }}
        </button>
      </div>

      <!-- 活动卡片列表 -->
      <div class="events-grid">
        <EventCard
            v-for="event in filteredEvents"
            :key="event.id"
            :event="event"
            @click="goToEventDetail(event.id)"
        />
      </div>

      <!-- 空状态 -->
      <div v-if="filteredEvents.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <p class="empty-text">暂无相关活动</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import EventCard from './EventCard.vue'
import { mockEvents } from '../data/events-mock'

const router = useRouter()

// 分类数据
const categories = [
  { id: 'all', name: '全部' },
  { id: 'cosplay', name: 'Cosplay' },
  { id: 'movie', name: '观影会' },
  { id: 'game', name: '游戏' },
  { id: 'draw', name: '绘画' },
  { id: 'music', name: '音乐' }
]

// 状态
const activeCategory = ref('all')
const showCalendar = ref(false)
const events = ref(mockEvents)

// 筛选后的活动
const filteredEvents = computed(() => {
  if (activeCategory.value === 'all') {
    return events.value
  }
  return events.value.filter(e => e.category === activeCategory.value)
})

// 跳转到测试页面
const goToQuiz = () => {
  router.push('/quiz')
}

// 跳转到活动详情
const goToEventDetail = (id) => {
  // 如果是测试活动，跳转到测试页面
  if (id === 'quiz') {
    router.push('/quiz')
  } else {
    router.push(`/events/${id}`)
  }
}
</script>

<style scoped>
/* 零域风格 - 紫色科技感 */
.events-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1a3e 50%, #0a0e27 100%);
  color: white;
  position: relative;
  overflow: hidden;
  padding: 60px 20px;
}

/* 背景装饰 */
.events-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.grid-lines {
  width: 100%;
  height: 100%;
  background-image:
      linear-gradient(rgba(138, 97, 255, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(138, 97, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 20s linear infinite;
}

@keyframes gridMove {
  0% { transform: translateY(0); }
  100% { transform: translateY(50px); }
}

.glow-orbs {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glow-orbs::before,
.glow-orbs::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.3;
  animation: float 10s ease-in-out infinite;
}

.glow-orbs::before {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #8a61ff, transparent);
  top: 20%;
  left: 10%;
}

.glow-orbs::after {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #ff61dc, transparent);
  bottom: 20%;
  right: 10%;
  animation-delay: -5s;
}

@keyframes float {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-30px) translateX(30px); }
}

/* 页面头部 */
.events-header {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto 60px;
  text-align: center;
}

.header-content {
  margin-bottom: 30px;
}

.page-title {
  font-size: 3rem;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.title-icon {
  font-size: 2.5rem;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.title-text {
  background: linear-gradient(135deg, #8a61ff, #ff61dc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
}

.title-accent {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: normal;
}

.page-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
}

/* 快捷操作 */
.quick-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  padding: 12px 30px;
  background: rgba(138, 97, 255, 0.2);
  border: 2px solid rgba(138, 97, 255, 0.5);
  border-radius: 50px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(138, 97, 255, 0.4);
  border-color: #8a61ff;
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(138, 97, 255, 0.3);
}

/* 活动容器 */
.events-container {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
}

/* 筛选器 */
.filters-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 40px;
  justify-content: center;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 10px 25px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.filter-btn.active {
  background: linear-gradient(135deg, #8a61ff, #ff61dc);
  border-color: transparent;
  color: white;
  font-weight: bold;
}

/* 活动网格 */
.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: rgba(255, 255, 255, 0.5);
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-text {
  font-size: 1.2rem;
}

/* 响应式 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .events-grid {
    grid-template-columns: 1fr;
  }
}
</style>