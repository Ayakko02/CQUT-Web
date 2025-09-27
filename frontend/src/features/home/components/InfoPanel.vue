# 内容展示信息面板

<template>
  <!-- 零域娘容器 -->
  <div
      class="zero-niang-container"
      :class="{ 'show': isZeroNiangVisible }"
  >
    <div class="zero-niang-placeholder">
      <img src="/images/rinYuri2.png" alt="零域娘剪影" class="zero-niang-display">
    </div>
  </div>

  <!-- 信息面板 - 增强淡入淡出效果 -->
  <div
      class="info-panel"
      :class="{ 'show': isPanelVisible }"
      v-if="isPanelVisible || isZeroNiangVisible"
  >
    <div class="panel-header">
      <h2>{{ getCurrentContent().title }}</h2>
    </div>
    <div class="panel-content" v-html="getCurrentContent().content"></div>
  </div>
</template>

<script setup>

const props = defineProps({
  isPanelVisible: Boolean,
  isZeroNiangVisible: Boolean,
  currentContentType: String
})

const emit = defineEmits(['close-panel', 'switch-panel'])

const contentData = {
  '社团简介': {
    title: '社团简介',
    content: `
      <p>CQUT动漫社成立于2018年，是一个充满活力的学生社团...</p>
      <p>我们致力于推广ACGN文化，为同学们提供交流平台...</p>
    `
  },
  '社团成就': {
    title: '社团成就',
    content: `
      <ul>
        <li>2020年获得校级优秀社团称号</li>
        <li>成功举办多场大型cosplay活动</li>
        <li>与多个高校建立合作关系</li>
      </ul>
    `
  },
  '社团文化': {
    title: '社团文化',
    content: `
      <p>零域·溯洄 - 两个分支代表不同的文化特色</p>
      <p>零域注重创新与前沿，溯洄传承经典与深度...</p>
    `
  }
}

const getCurrentContent = () => {
  return contentData[props.currentContentType] || contentData['社团简介']
}
</script>

<style scoped>
/* 零域娘容器 */
.zero-niang-container {
  position: fixed;
  left: 15%;
  top: 60%;
  transform: translateY(-50%) translateX(-100px);
  opacity: 0;
  visibility: hidden;
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: 100;
  pointer-events: none;
}

.zero-niang-container.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(-50%) translateX(0);
}

.zero-niang-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.zero-niang-display {
  width: 550px;
  height: auto;
  filter: drop-shadow(0 10px 30px rgba(147, 51, 234, 0.3));
  transform: scaleX(-1);
}

/* 信息面板 - 增强淡入淡出效果 */
.info-panel {
  position: fixed;
  left: 52%;
  top: 50%;
  transform: translate(-50%, -50%) translateY(5px) scale(0.98);
  width: 530px;
  min-height: 330px;
  background: rgba(20, 25, 40, 0.15);
  backdrop-filter: blur(20px) saturate(1.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 30px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: 100;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.info-panel.show {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, -50%) translateY(0) scale(1);
}

.panel-header {
  text-align: center;
  margin-bottom: 20px;
}

.panel-header h2 {
  color: white;
  font-size: 1.5em;
  text-shadow: 0 2px 10px rgba(147, 51, 234, 0.5);
  margin: 0;
  opacity: 0;
  transition: all 0.4s ease 0.2s;
}

.info-panel.show .panel-header h2 {
  opacity: 1;
}

.panel-content {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin-bottom: 20px;
  opacity: 0;
  transform: translateY(15px);
  transition: all 0.4s ease 0.3s;
}

.info-panel.show .panel-content {
  opacity: 1;
  transform: translateY(0);
}

.panel-content ::v-deep ul {
  padding-left: 20px;
}

.panel-content ::v-deep li {
  margin-bottom: 8px;
}
</style>