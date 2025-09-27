# 历史时间线

<template>
  <!-- 左侧历史折线 - 整个容器都支持淡入淡出 -->
  <div class="left-history" :class="{ 'fade-out': areBackgroundElementsHidden }">
    <div class="history-path">
      <!-- 四个历史节点 -->
      <div class="history-node" data-year="2018">
        <div class="node-dot"></div>
        <div class="node-label">社团成立</div>
      </div>
      <div class="history-node" data-year="2020">
        <div class="node-dot"></div>
        <div class="node-label">稳步发展</div>
      </div>
      <div class="history-node" data-year="2024">
        <div class="node-dot"></div>
        <div class="node-label">重要转折</div>
      </div>
      <div class="history-node" data-year="2025">
        <div class="node-dot"></div>
        <div class="node-label">未来展望</div>
      </div>

      <!-- 连接线段 -->
      <div class="path-segment segment-1"></div>
      <div class="path-segment segment-2"></div>
      <div class="path-segment segment-3"></div>
    </div>
  </div>
</template>

<script setup>
// 接收隐藏状态
defineProps({
  areBackgroundElementsHidden: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
/* 左侧历史区域 - 整个容器的过渡效果 */
.left-history {
  position: absolute;
  left: 15%;
  top: 30%;
  width: 20%;
  height: 100%;
  z-index: 30;
  transition: all 0.8s ease;
  opacity: 1;
  visibility: visible;
}

.left-history.fade-out {
  opacity: 0;
  visibility: hidden;
  transform: translateX(-20px);
}

/* 历史路径容器 */
.history-path {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 历史节点定位 */
.history-node:nth-child(1) {
  position: absolute;
  top: 50%;
  left: 0;
}

.history-node:nth-child(2) {
  position: absolute;
  top: 35%;
  left: 230px;
}

.history-node:nth-child(3) {
  position: absolute;
  top: 15%;
  left: 40px;
}

.history-node:nth-child(4) {
  position: absolute;
  top: 0;
  left: 260px;
}

/* 节点圆点 */
.node-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: radial-gradient(circle,
  rgba(147, 51, 234, 1) 0%,
  rgba(147, 51, 234, 0.8) 50%,
  rgba(192, 38, 211, 0.3) 100%
  );
  box-shadow:
      0 0 15px rgba(147, 51, 234, 0.8),
      0 0 25px rgba(147, 51, 234, 0.4);
  position: relative;
  z-index: 3;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: nodePulse 2s ease-in-out infinite;
}

.node-dot:hover {
  transform: scale(1.3) !important;
  box-shadow:
      0 0 20px rgba(147, 51, 234, 1),
      0 0 35px rgba(192, 38, 211, 0.8) !important;
}

@keyframes nodePulse {
  0%, 100% {
    box-shadow:
        0 0 15px rgba(147, 51, 234, 0.8),
        0 0 25px rgba(147, 51, 234, 0.4);
  }
  50% {
    box-shadow:
        0 0 20px rgba(147, 51, 234, 1),
        0 0 35px rgba(192, 38, 211, 0.6);
  }
}

/* 节点标签 */
.node-label {
  position: absolute;
  top: 20px;
  left: -30px;
  color: #e0e0e0;
  font-size: 0.8em;
  font-weight: bold;
  white-space: nowrap;
  text-shadow: 0 0 8px rgba(147, 51, 234, 0.6);
  background: rgba(147, 51, 234, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(147, 51, 234, 0.4);
  border-radius: 12px;
  padding: 6px 12px;
  box-shadow:
      0 4px 15px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* 连接线段 */
.path-segment {
  position: absolute;
  height: 1px;
  transform-origin: left center;
}

.segment-1 {
  top: 50%;
  left: 12px;
  width: 265px;
  transform: rotate(-34deg);
  background: linear-gradient(90deg,
  transparent 0%,
  #9333ea 25%,
  #c026d3 75%,
  transparent 100%
  );
}

.segment-2 {
  top: 35%;
  left: 230px;
  width: 255px;
  transform: rotate(-133deg);
  background: linear-gradient(90deg,
  transparent 0%,
  #9333ea 25%,
  #c026d3 75%,
  transparent 100%
  );
}

.segment-3 {
  top: 15%;
  left: 45px;
  width: 265px;
  transform: rotate(-34deg);
  background: linear-gradient(90deg,
  transparent 0%,
  #9333ea 25%,
  #c026d3 75%,
  transparent 100%
  );
}

/* 线段光效动画 */
.path-segment::before {
  content: '';
  position: absolute;
  top: 0;
  left: -20px;
  width: 40px;
  height: 100%;
  background: linear-gradient(90deg,
  transparent 0%,
  rgba(255, 255, 255, 0.6) 50%,
  transparent 100%
  );
  animation: segmentGlow 4s ease-in-out infinite;
}

@keyframes segmentGlow {
  0% {
    left: -20px;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    left: calc(100% - 20px);
    opacity: 0;
  }
}

.segment-1::before {
  animation-delay: 0s;
}

.segment-2::before {
  animation-delay: 2s;
}

.segment-3::before {
  animation-delay: 4s;
}
</style>