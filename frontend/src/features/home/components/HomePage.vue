<template>

  <div class="home-page">
      <!-- 流星雨组件 -->
    <MeteorShower
        :current-theme="currentTheme"
        :is-hidden="isSidebarHidden"
        :is-scrolled-down="isScrolledDown"
        :is-flipped="isFlipped"
    />

    <!-- 侧边导航栏 -->
    <NavigationSidebar
        :current-theme="currentTheme"
        :is-hidden="isSidebarHidden"
    />

    <!-- 右上角搜索框-->
    <SearchContainer
        :current-theme="currentTheme"
        :is-hidden="isSidebarHidden"
    />

    <!-- 弧形公告栏 -->
    <AnnouncementArc
        :current-theme="currentTheme"
        :is-hidden="isSidebarHidden"
    />

    <!-- 音乐播放器 -->
    <MusicPlayer
        :current-theme="musicPlayerTheme"
        :is-hidden="isSidebarHidden"
        :auto-switch-playlist="true"
    />

    <!-- 使用DualCityLayout组件替代原来的div -->
    <DualCityLayout
        :is-flipped="isFlipped"
        :is-transitioning="isTransitioning"
        :are-background-elements-hidden="areBackgroundElementsHidden"
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
        :scroll-text="getScrollText(currentTheme)"
        @scroll-toggle="toggleScroll"
    />
  </div>
</template>

<script setup>
import {computed, watch } from 'vue'
import DualCityLayout from './DualCityLayout.vue'
import ScrollIndicator from './ScrollIndicator.vue'
import FlipButton from './FlipButton.vue'
import NavigationSidebar from "./NavigationSidebar.vue"
import AnnouncementArc from './AnnouncementArc.vue'

import { useCityTransition } from '../composables/useCityTransition.js'
import { useScrollControl } from "@/features/home/composables/useScrollControl.js"
import { useContentDisplay } from "../composables/useContentDisplay.js"
import SearchContainer from "./SearchContainer.vue";
import MusicPlayer from "./MusicPlayer.vue";
import MeteorShower from "./MeteorShower.vue";

const emit = defineEmits(['theme-change'])

// 城市切换逻辑
const { isFlipped, isTransitioning, toggleCityTransition } = useCityTransition()

// 统一滚动控制逻辑
const { isScrolledDown, toggleScroll, getScrollText, isSidebarHidden } = useScrollControl()

// 内容展示逻辑 - 获取背景元素隐藏状态
const { areBackgroundElementsHidden } = useContentDisplay()

// 当前主题计算属性
const currentTheme = computed(() => isFlipped.value ? 'suhui' : 'zero')

// 添加单独的音乐播放器主题状态
const musicPlayerTheme = computed(() => {
  // 获取当前上半区的主题状态
  const upperTheme = currentTheme.value // 'zero' 或 'suhui'

  // 根据滚动位置决定是否反转
  if (isScrolledDown.value) {
    // 在下半区时，使用相反的主题
    return upperTheme === 'zero' ? 'suhui' : 'zero'
  } else {
    // 在上半区时，使用相同的主题
    return upperTheme
  }
})

// 处理翻转点击
const handleFlipClick = () => {
  console.log('[HomePage] 翻转按钮被点击！')
  const result = toggleCityTransition()
  console.log('[HomePage] toggleCityTransition 返回:', result)
  if (result && result.newTheme) {
    emit('theme-change', result.newTheme)
  }


// 监听主题变化，更新公告栏主题
  watch(currentTheme, (newTheme) => {
    console.log('[HomePage] 主题切换到:', newTheme)
    // 这里可以添加额外的主题切换逻辑
    emit('theme-change', newTheme)
  }, {immediate: true})
}

</script>

<style scoped>
.home-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #0a0e27;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 1;

}

</style>