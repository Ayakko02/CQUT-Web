# 弧形公告栏

<template>
  <!-- 1/4圆弧公告栏 -->
  <div class="arc-announcement" :class="{
    hidden: isHidden,
    'suhui-theme': currentTheme === 'suhui'
  }">
    <svg width="100vw" height="100vh" viewBox="-200 0 1400 1000" overflow="visible">
      <defs>
        <!-- 零域主题渐变 -->
        <linearGradient id="zeroGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#9333ea"/>
          <stop offset="50%" style="stop-color:#c026d3"/>
          <stop offset="100%" style="stop-color:#e879f9"/>
        </linearGradient>

        <!-- 溯洄主题渐变 -->
        <linearGradient id="suhuiGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#daa520"/>
          <stop offset="50%" style="stop-color:#ffd700"/>
          <stop offset="100%" style="stop-color:#ffed4e"/>
        </linearGradient>

        <!-- 流光效果 -->
        <linearGradient id="flowingLight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:rgba(255,255,255,0)"/>
          <stop offset="48%" style="stop-color:rgba(255,255,255,0)"/>
          <stop offset="50%" style="stop-color:rgba(255,255,255,0.9)"/>
          <stop offset="52%" style="stop-color:rgba(255,255,255,0)"/>
          <stop offset="100%" style="stop-color:rgba(255,255,255,0)"/>
        </linearGradient>

        <!-- 弧形轨道路径 -->
        <path id="outer-ring" d="M -635 1000 A 1135 1135 0 0 1 500 -135" />
        <path id="text-track" d="M -612.5 1000 A 1112.5 1112.5 0 0 1 500 -112.5" />
        <path id="inner-ring" d="M -600 1000 A 1100 1100 0 0 1 500 -100" />
      </defs>

      <!-- 外圆环 - 带断开效果 -->
      <path d="M -635 1000 A 1135 1135 0 0 1 500 -135"
            :stroke="currentGradient"
            stroke-width="1"
            fill="none"
            opacity="0.8"
            stroke-dasharray="40 20 60 15 30 25 50 10"
            stroke-dashoffset="0">
        <animate attributeName="stroke-dashoffset"
                 values="0;250"
                 dur="12s"
                 repeatCount="indefinite"
                 calcMode="linear"/>
      </path>

      <!-- 内圆环 - 连续线条，无断开 -->
      <path d="M -600 1000 A 1100 1100 0 0 1 500 -100"
            :stroke="currentGradient"
            stroke-width="1"
            fill="none"
            opacity="0.8"/>

      <!-- 外圆环流光 -->
      <path d="M -635 1000 A 1135 1135 0 0 1 500 -135"
            stroke="url(#flowingLight)"
            stroke-width="2"
            fill="none"
            opacity="1">
        <animate attributeName="stroke-dasharray"
                 values="0 3000;80 2920;0 3000"
                 dur="4s"
                 repeatCount="indefinite"/>
      </path>

      <!-- 内圆环流光 -->
      <path d="M -600 1000 A 1100 1100 0 0 1 500 -100"
            stroke="url(#flowingLight)"
            stroke-width="2"
            fill="none"
            opacity="0.7">
        <animate attributeName="stroke-dasharray"
                 values="0 2800;70 2730;0 2800"
                 dur="3.5s"
                 repeatCount="indefinite"/>
      </path>

      <!-- 公告文字沿中间轨道逆时针移动 -->
      <text font-size="14"
            :fill="textColor"
            font-weight="bold"
            text-shadow="2px 2px 4px rgba(0,0,0,0.8)"
            class="announcement-text"
            ref="announcementTextRef"
            @mouseenter="pauseAnimation"
            @mouseleave="resumeAnimation"
            @click="handleTextClick">
        <textPath href="#text-track" startOffset="0%">
          <animate ref="textAnimationRef"
                   attributeName="startOffset"
                   values="110%;-30%"
                   dur="25s"
                   repeatCount="indefinite"
                   calcMode="linear"/>
          {{ announcementText }}
        </textPath>
      </text>
    </svg>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAnnouncementArc } from '../composables/useAnnouncementArc.js'

// Props
const props = defineProps({
  currentTheme: {
    type: String,
    default: 'zero'
  },
  isHidden: {
    type: Boolean,
    default: false
  }
})

// 使用公告栏逻辑
const {
  announcementText,
  isPaused,
  pauseAnimation,
  resumeAnimation,
  handleAnnouncementClick
} = useAnnouncementArc()

// 模板引用
const announcementTextRef = ref(null)
const textAnimationRef = ref(null)

// 计算属性
const currentGradient = computed(() =>
    props.currentTheme === 'suhui' ? 'url(#suhuiGradient)' : 'url(#zeroGradient)'
)

const textColor = computed(() =>
    props.currentTheme === 'suhui' ? '#ffe55c' : 'white'
)

// 方法
const handleTextClick = (event) => {
  event.preventDefault()
  handleAnnouncementClick()
}

// 生命周期
onMounted(() => {
  // 将DOM引用传递给composable以便控制动画
  if (announcementTextRef.value && textAnimationRef.value) {
    // 这里可以进一步集成DOM操作
  }
})
</script>

<style scoped>
.arc-announcement {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 7500;
  opacity: 1;
  transition: all 0.5s ease;
  pointer-events: none;
}

.arc-announcement.hidden {
  transform: translateY(-100px);
  opacity: 0;
}

.arc-announcement svg {
  overflow: visible;
}

/* 公告文字样式 */
.announcement-text {
  cursor: pointer;
  pointer-events: auto;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  filter: drop-shadow(0 0 5px rgba(147, 51, 234, 0.5));
  transition: filter 0.3s ease;
}

.announcement-text:hover {
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
}

/* 溯洄主题样式 */
.arc-announcement.suhui-theme .announcement-text {
  filter: drop-shadow(0 0 5px rgba(218, 165, 32, 0.5));
}

.arc-announcement.suhui-theme .announcement-text:hover {
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8));
}

/* 响应式设计 */
@media (max-width: 768px) {
  .announcement-text {
    font-size: 12px;
  }
}
</style>