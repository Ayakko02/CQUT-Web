# 城市分隔线组件

<template>
  <!-- 城市分界线 -->
  <div class="city-divider"></div>
</template>

<script setup>
// 分界线组件逻辑（如果需要的话）
</script>

<style scoped>
.city-divider {
  position: absolute;
  top: 100vh;
  left: 0;
  width: 100vw;
  height: 2px;
  background: linear-gradient(90deg,
  rgba(147, 51, 234, 0.8) 0%,
  rgba(218, 165, 32, 0.8) 100%);
  z-index: 100;
  box-shadow: 0 0 10px rgba(147, 51, 234, 0.5);
}
</style>