# 首页注入页面

<template>
  <div class="home-page">
    <!-- 流星雨容器 -->
    <div class="meteor-shower-container" id="meteorShowerContainer">
      <div class="meteors-outside" id="meteorsOutside"></div>
      <div class="meteors-inside" id="meteorsInside"></div>
      <div class="atmosphere-particles" id="atmosphereParticles"></div>
    </div>

    <!-- 使用DualCityLayout组件替代原来的div -->
    <DualCityLayout
        :is-flipped="isFlipped"
        :is-transitioning="isTransitioning"
    />

    <!-- 翻转按钮 -->
    <FlipButton
        :is-rotating="isTransitioning"
        :flip-button-icon="isFlipped ? '🌸' : '⚡'"
        @flip="handleFlipClick"
    />

    <!-- 滚动指示器 -->
    <ScrollIndicator
        :is-scrolled-down="isScrolledDown"
        @scroll-toggle="handleScrollToggle"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DualCityLayout from './DualCityLayout.vue'
import ScrollIndicator from './ScrollIndicator.vue'
import FlipButton from './FlipButton.vue'
import { useCityTransition } from '../composables/useCityTransition.js'

// Emits
const emit = defineEmits(['theme-change'])

// 城市切换逻辑
const { isFlipped, isTransitioning, toggleCityTransition } = useCityTransition()

const handleFlipClick = () => {
  const result = toggleCityTransition()
  if (result && result.newTheme) {
    emit('theme-change', result.newTheme)
  }
}

// 滚动控制
const isScrolledDown = ref(false)

const handleScrollToggle = () => {
  if (!isScrolledDown.value) {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
    isScrolledDown.value = true
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    isScrolledDown.value = false
  }
}
</script>

<style scoped>
.home-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #0a0e27;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 1;
}

/* 流星雨容器样式 - 后续也可以提取到单独组件 */
.meteor-shower-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 1;
}

.meteors-outside,
.meteors-inside,
.atmosphere-particles {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>