# 翻转动画

<template>
  <!-- 双城容器 - 包含翻转动画逻辑 -->
  <div class="dual-city-container" :class="containerClasses" id="dualCityContainer">
    <CityDivider />
    <ZeroCity :are-background-elements-hidden="areBackgroundElementsHidden" />
    <SuhuiCity />
  </div>
</template>

<script setup>
import CityDivider from './CityDivider.vue'
import ZeroCity from './ZeroCity.vue'
import SuhuiCity from './SuhuiCity.vue'
import { computed } from 'vue'

const props = defineProps({
  isFlipped: Boolean,
  isTransitioning: Boolean,
  areBackgroundElementsHidden: Boolean
})

const containerClasses = computed(() => {
  const classes = []
  if (props.isFlipped) classes.push('flipped')
  if (props.isTransitioning) classes.push('transitioning')
  return classes
})
</script>

<style scoped>
.dual-city-container {
  position: relative;
  width: 100vw;
  height: 200vh;
  transform-origin: center;
  transition: transform 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* 旋转180度 - Z轴旋转 */
.dual-city-container.flipped {
  transform: rotate(180deg);
}

/* 过渡动画状态 */
.dual-city-container.transitioning {
  pointer-events: none;
}
</style>