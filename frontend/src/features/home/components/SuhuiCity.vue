# 溯洄组件 - 下半圆溯洄展示

<template>
  <!-- 溯洄（下半圆） -->
  <div class="suhui-city">
    <div class="city-content">
      <div class="mascot-area">
        <div class="mascot suhui-mascot">🌸</div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 溯洄组件的专属逻辑
</script>

<style scoped>
.suhui-city {
  position: absolute;
  top: 100vh;
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
  height: 50vw;
  background: linear-gradient(135deg,
  #2d1b20 0%,
  #4a2c2a 30%,
  #704214 60%,
  #b8860b 100%);
  border-radius: 0 0 50vw 50vw;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  box-shadow:
      0 0 30px rgba(218, 165, 32, 0.4),
      inset 0 0 20px rgba(218, 165, 32, 0.1);
}

.suhui-city .city-content {
  transform: rotate(180deg);
}

.mascot-area {
  display: flex;
  align-items: center;
  justify-content: center;
}

.mascot.suhui-mascot {
  font-size: 3em;
}
</style>