<template>
  <div class="home-page">
    <!-- 流星雨容器 -->
    <div class="meteor-shower-container" id="meteorShowerContainer">
      <div class="meteors-outside" id="meteorsOutside"></div>
      <div class="meteors-inside" id="meteorsInside"></div>
      <div class="atmosphere-particles" id="atmosphereParticles"></div>
    </div>

    <!-- 双城容器 -->
    <div class="dual-city-container" id="dualCityContainer">
      <div class="city-divider"></div>

      <!-- 直接使用ZeroCity组件，不要额外嵌套div -->
      <ZeroCity />

      <!-- 溯洄（下半圆） - 修复HTML结构 -->
      <div class="suhui-city">
        <div class="city-content">
          <div class="mascot-area">
            <div class="mascot suhui-mascot">🌸</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 翻转按钮 -->
    <button class="flip-button" @click="toggleFlip">
      <div class="flip-button-content">⚡</div>
    </button>

    <!-- 滚动指示器 -->
    <div class="scroll-indicator" @click="toggleScroll">
      <div class="scroll-arrow">⬇</div>
      <div class="scroll-text">滚动查看溯洄（颠倒状态）</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ZeroCity from './ZeroCity.vue'  // 添加这行导入

const emit = defineEmits(['theme-change'])
const isFlipped = ref(false)

const toggleFlip = () => {
  isFlipped.value = !isFlipped.value
  emit('theme-change', isFlipped.value ? 'suhui' : 'zero')
}

const toggleScroll = () => {
  console.log('滚动功能')
}
</script>