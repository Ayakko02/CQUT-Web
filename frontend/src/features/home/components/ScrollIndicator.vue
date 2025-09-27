# 滚动指示器

<template>
  <!-- 滚动指示器 -->
  <div class="scroll-indicator" @click="handleScrollClick">
    <div class="scroll-arrow">{{ scrollArrow }}</div>
    <div class="scroll-text">{{ scrollText }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  isScrolledDown: {
    type: Boolean,
    default: false
  },
  scrollText: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['scroll-toggle'])

// 计算属性
const scrollArrow = computed(() => {
  return props.isScrolledDown ? '⬆' : '⬇'
})

const scrollText = computed(() => {
  return props.scrollText || (props.isScrolledDown ? '都说了不能点嘛！' : '这个不能点！')
})

// 方法
const handleScrollClick = () => {
  emit('scroll-toggle')
}
</script>

<style scoped>
.scroll-indicator {
  position: fixed;
  bottom: 55px;
  left: 49.7%;
  transform: translateX(-50%);
  color: white;
  text-align: center;
  opacity: 0.7;
  z-index: 100;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.scroll-indicator:hover {
  opacity: 1;
}

.scroll-arrow {
  font-size: 1.5em;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.scroll-text {
  font-size: 0.9em;
  margin-top: 5px;
}
</style>