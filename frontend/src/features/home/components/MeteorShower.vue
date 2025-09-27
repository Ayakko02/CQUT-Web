# 流星雨

<template>
  <!-- 流星雨容器 -->
  <div class="meteor-shower-container">
    <div class="meteors-outside" ref="meteorsOutside"></div>
    <div class="meteors-inside" ref="meteorsInside"></div>
    <div class="atmosphere-particles" ref="atmosphereParticles"></div>
  </div>

  <!-- 流星雨控制器 -->
  <div class="meteor-controller" :class="`level-${currentLevel}`">
    <div class="meteor-btn" @click="toggleMeteorShower">
      <div class="meteor-icon">✨</div>
      <div class="meteor-level">{{ levelNames[currentLevel] }}</div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, nextTick, computed, watch} from 'vue'

// Props
const props = defineProps({
  currentTheme: {
    type: String,
    default: 'zero'
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  isScrolledDown: {
    type: Boolean,
    default: false
  },
  isFlipped: {
    type: Boolean,
    default: false
  }
})

// 引用DOM元素
const meteorsOutside = ref(null)
const meteorsInside = ref(null)
const atmosphereParticles = ref(null)

// 流星雨状态
const currentLevel = ref(0)
const meteors = ref([])
const isActive = ref(false)
const isPageVisible = ref(true)

// 定时器
let generationTimer = null

// 配置参数
const config = {
  0: { interval: 0 },        // 关闭
  1: { interval: 500 },      // 轻微
  2: { interval: 200 },      // 中等
  3: { interval: 100 }       // 密集
}

const levelNames = ['关', '轻微', '中等', '密集']

const isInZeroRegion = computed(() => {
  // 只在零域主题且未滚动到下半区时显示流星雨
  return props.currentTheme === 'zero' && !props.isScrolledDown
})

// 监听区域变化
watch(isInZeroRegion, (newValue) => {
  if (!newValue) {
    // 离开零域区域时立即清除流星并关闭
    forceStopMeteorShower()
  }
}, { immediate: true })

// 监听翻转状态
watch(() => props.isFlipped, (newValue) => {
  if (newValue) {
    // 翻转到苏回时立即清除
    forceStopMeteorShower()
  }
})

// 监听滚动状态
watch(() => props.isScrolledDown, (newValue) => {
  if (newValue && props.currentTheme === 'zero') {
    // 在零域主题下滚动到下半区时清除
    forceStopMeteorShower()
  }
})

const forceStopMeteorShower = () => {
  // 强制设置为关闭状态
  currentLevel.value = 0
  isActive.value = false

  if (generationTimer) {
    clearTimeout(generationTimer)
  }

  // 立即清除所有现有流星
  meteors.value.forEach(meteor => meteor.remove())
  meteors.value = []

  console.log('[MeteorShower] 强制清除流星雨')
}

// 单个流星类
class Meteor {
  constructor(refs) {
    this.refs = refs
    this.size = Math.random() * 1.2 + 1.7
    this.x = Math.random() * (window.innerWidth + 800) + 200
    this.y = Math.random() * 200 - 300
    this.speed = Math.random() * 1.5 + 1
    this.tailLength = Math.random() * 6 + 5.5
    this.element = null
    this.isInside = false
    this.animationId = null
  }

  init() {
    // 创建SVG容器
    this.element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.element.style.position = 'absolute';
    this.element.style.width = (this.size * this.tailLength * 5) + 'px';
    this.element.style.height = (this.size * 2) + 'px';
    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
    this.element.style.transform = 'rotate(-45deg)';
    this.element.style.pointerEvents = 'none';
    this.element.style.overflow = 'visible';

    // 创建渐变定义
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.id = `meteorGradient-${Date.now()}-${Math.random()}`;
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('x2', '100%');

    // 白色流星的渐变stops
    const stops = [
      { offset: '0%', color: 'rgba(255, 255, 255, 1)' },
      { offset: '20%', color: 'rgba(255, 255, 255, 0.8)' },
      { offset: '50%', color: 'rgba(255, 255, 255, 0.4)' },
      { offset: '100%', color: 'transparent' }
    ];

    stops.forEach(stop => {
      const stopElement = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stopElement.setAttribute('offset', stop.offset);
      stopElement.setAttribute('stop-color', stop.color);
      gradient.appendChild(stopElement);
    });

    defs.appendChild(gradient);

    // 创建水滴形状的path
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const width = this.size * this.tailLength * 5;
    const height = this.size * 2;

    // 水滴形状的路径：头部圆润，尾部尖锐
    const pathData = `M 5 ${height/2}
                    Q 5 ${height*0.2} ${width*0.15} ${height*0.3}
                    Q ${width*0.3} ${height*0.4} ${width*0.6} ${height*0.45}
                    L ${width*0.95} ${height/2}
                    L ${width*0.6} ${height*0.55}
                    Q ${width*0.3} ${height*0.6} ${width*0.15} ${height*0.7}
                    Q 5 ${height*0.8} 5 ${height/2} Z`;

    path.setAttribute('d', pathData);
    path.setAttribute('fill', `url(#${gradient.id})`);
    path.setAttribute('filter', 'drop-shadow(0 0 3px rgba(255,255,255,0.8))');

    this.element.appendChild(defs);
    this.element.appendChild(path);
    this.refs.meteorsOutside.appendChild(this.element);
    this.animate();
  }

  animate() {
    const move = () => {
      this.x -= this.speed
      this.y += this.speed

      if (!this.isInside && this.checkAtmosphereEntry()) {
        this.enterAtmosphere()
      }

      if (this.element) {
        this.element.style.left = this.x + 'px'
        this.element.style.top = this.y + 'px'
      }

      if (this.x < -100 || this.y > window.innerHeight + 100) {
        this.remove()
        return
      }

      this.animationId = requestAnimationFrame(move)
    }

    move()
  }

  checkAtmosphereEntry() {
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight
    const radius = window.innerWidth / 2

    const distance = Math.sqrt(
        Math.pow(this.x - centerX, 2) + Math.pow(this.y - centerY, 2)
    )

    return distance <= radius && this.y <= centerY
  }

  enterAtmosphere() {
    this.isInside = true;
    this.createParticles();

    this.element.remove();

    // 重新创建SVG，使用紫色渐变
    this.element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.element.style.position = 'absolute';
    this.element.style.width = (this.size * this.tailLength * 5) + 'px';
    this.element.style.height = (this.size * 2) + 'px';
    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
    this.element.style.transform = 'rotate(-45deg)';
    this.element.style.pointerEvents = 'none';

    // 紫色渐变
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.id = `meteorGradientInside-${Date.now()}-${Math.random()}`;
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('x2', '100%');

    const stops = [
      { offset: '0%', color: 'rgba(255, 255, 255, 1)' },
      { offset: '15%', color: 'rgba(147, 51, 234, 0.9)' },
      { offset: '40%', color: 'rgba(192, 38, 211, 0.7)' },
      { offset: '100%', color: 'transparent' }
    ];

    stops.forEach(stop => {
      const stopElement = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stopElement.setAttribute('offset', stop.offset);
      stopElement.setAttribute('stop-color', stop.color);
      gradient.appendChild(stopElement);
    });

    defs.appendChild(gradient);

    // 同样的路径
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const width = this.size * this.tailLength * 5;
    const height = this.size * 2;

    const pathData = `M 5 ${height/2}
                    Q 5 ${height*0.2} ${width*0.15} ${height*0.3}
                    Q ${width*0.3} ${height*0.4} ${width*0.6} ${height*0.45}
                    L ${width*0.95} ${height/2}
                    L ${width*0.6} ${height*0.55}
                    Q ${width*0.3} ${height*0.6} ${width*0.15} ${height*0.7}
                    Q 5 ${height*0.8} 5 ${height/2} Z`;

    path.setAttribute('d', pathData);
    path.setAttribute('fill', `url(#${gradient.id})`);
    path.setAttribute('filter', 'drop-shadow(0 0 5px rgba(147,51,234,0.8))');

    this.element.appendChild(defs);
    this.element.appendChild(path);
    this.refs.meteorsInside.appendChild(this.element);
  }

  createParticles() {
    // 撞击瞬间粒子（爆炸效果）- 模拟流星撞击大气层的瞬间
    const impactParticles = Math.random() * 25 + 10;

    // 跟随粒子（拖尾效果）- 模拟被带走的大气粒子
    const followParticles = Math.random() * 12 + 7;

    // 撞击瞬间粒子 - 快速向四周爆炸
    for (let i = 0; i < impactParticles; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');

        const size = (Math.random() * 2.5 + 1) + 'px';
        particle.style.position = 'fixed';
        particle.style.width = size;
        particle.style.height = size;
        particle.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(147, 51, 234, 0.9) 30%, rgba(192, 38, 211, 0.6) 70%, transparent 100%)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9000';
        particle.style.opacity = '1';
        particle.style.boxShadow = '0 0 6px rgba(147, 51, 234, 0.8)';

        if (this.element) {
          const rect = this.element.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          // 流星头部位置计算
          const localHeadX = rect.width * 0.1 - rect.width / 2;
          const localHeadY = 0;

          const rotationAngle = -Math.PI / 4;
          const rotatedX = localHeadX * Math.cos(rotationAngle) - localHeadY * Math.sin(rotationAngle);
          const rotatedY = localHeadX * Math.sin(rotationAngle) + localHeadY * Math.cos(rotationAngle);

          const startX = centerX + rotatedX;
          const startY = centerY + rotatedY;

          // 撞击粒子：短距离、全方向爆炸
          const distance = Math.random() * 25 + 8;
          const angle = Math.random() * 2 * Math.PI;

          const endX = startX + Math.cos(angle) * distance;
          const endY = startY + Math.sin(angle) * distance;

          particle.style.left = startX + 'px';
          particle.style.top = startY + 'px';
          particle.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'; // 快速爆炸

          document.body.appendChild(particle);

          requestAnimationFrame(() => {
            particle.style.left = endX + 'px';
            particle.style.top = endY + 'px';
            particle.style.opacity = '0';
            particle.style.transform = 'scale(2.5)';
          });

          setTimeout(() => particle.remove(), 600);
        }
      }, i * 8); // 快速连续生成
    }

    // 跟随粒子 - 沿着流星轨迹被带走
    for (let i = 0; i < followParticles; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');

        const size = (Math.random() * 2 + 1.5) + 'px';
        particle.style.position = 'fixed';
        particle.style.width = size;
        particle.style.height = size;
        particle.style.background = 'radial-gradient(circle, rgba(147, 51, 234, 0.8) 0%, rgba(192, 38, 211, 0.5) 50%, transparent 100%)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '8999';
        particle.style.opacity = '0.8';

        if (this.element) {
          const rect = this.element.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const localHeadX = rect.width * 0.1 - rect.width / 2;
          const localHeadY = 0;

          const rotationAngle = -Math.PI / 4;
          const rotatedX = localHeadX * Math.cos(rotationAngle) - localHeadY * Math.sin(rotationAngle);
          const rotatedY = localHeadX * Math.sin(rotationAngle) + localHeadY * Math.cos(rotationAngle);

          const startX = centerX + rotatedX;
          const startY = centerY + rotatedY;

          // 跟随粒子：沿着流星运动方向，较长距离
          const followDistance = Math.random() * 60 + 40;
          const followAngle = -Math.PI/4 + (Math.random() - 0.5) * Math.PI/12; // 主要沿着流星方向，稍有偏移

          const endX = startX + Math.cos(followAngle) * followDistance;
          const endY = startY + Math.sin(followAngle) * followDistance;

          particle.style.left = startX + 'px';
          particle.style.top = startY + 'px';
          particle.style.transition = 'all 1.2s ease-out'; // 较慢的跟随动画

          document.body.appendChild(particle);

          requestAnimationFrame(() => {
            particle.style.left = endX + 'px';
            particle.style.top = endY + 'px';
            particle.style.opacity = '0';
            particle.style.transform = 'scale(0.3)';
          });

          setTimeout(() => particle.remove(), 1200);
        }
      }, 150 + i * 40); // 在撞击粒子之后开始生成
    }
  }
  remove() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    if (this.element) {
      this.element.remove()
      this.element = null
    }
  }
}

// 流星雨控制方法
const toggleMeteorShower = () => {
  // 检查是否在有效区域
  if (!isInZeroRegion.value && currentLevel.value === 0) {
    console.log('[MeteorShower] 当前不在零域区域，无法启动流星雨')
    return
  }

  currentLevel.value = (currentLevel.value + 1) % 4

  if (currentLevel.value === 0) {
    stopMeteorShower()
  } else if (isInZeroRegion.value) {
    startMeteorShower()
  } else {
    // 如果不在有效区域，重置为关闭状态
    currentLevel.value = 0
  }
}

const startMeteorShower = () => {
  if (isActive.value) stopMeteorShower()

  isActive.value = true
  scheduleNextMeteor()
}

const stopMeteorShower = () => {
  isActive.value = false
  if (generationTimer) {
    clearTimeout(generationTimer)
  }

  meteors.value.forEach(meteor => meteor.remove())
  meteors.value = []
}

const scheduleNextMeteor = () => {
  if (!isActive.value || !isPageVisible.value) return

  const currentConfig = config[currentLevel.value]
  if (currentConfig.interval === 0) return

  const randomInterval = currentConfig.interval + (Math.random() - 0.5) * currentConfig.interval * 0.3

  generationTimer = setTimeout(() => {
    if (isActive.value) {
      createMeteor()
      scheduleNextMeteor()
    }
  }, randomInterval)
}

const createMeteor = async () => {
  await nextTick()

  if (!meteorsOutside.value || !meteorsInside.value || !atmosphereParticles.value) return

  const refs = {
    meteorsOutside: meteorsOutside.value,
    meteorsInside: meteorsInside.value,

  }

  const meteor = new Meteor(refs)
  meteor.init()
  meteors.value.push(meteor)

  setTimeout(() => {
    const index = meteors.value.indexOf(meteor)
    if (index > -1) {
      meteors.value.splice(index, 1)
    }
  }, 5000)
}

// 页面可见性监听
const initVisibilityListener = () => {
  const handleVisibilityChange = () => {
    isPageVisible.value = !document.hidden

    if (!isPageVisible.value && isActive.value) {
      pauseGeneration()
    } else if (isPageVisible.value && isActive.value) {
      resumeGeneration()
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }
}

const pauseGeneration = () => {
  if (generationTimer) {
    clearTimeout(generationTimer)
  }
}

const resumeGeneration = () => {
  if (isActive.value) {
    scheduleNextMeteor()
  }
}

// 生命周期
let cleanupVisibility = null

onMounted(() => {
  cleanupVisibility = initVisibilityListener()
})

onUnmounted(() => {
  stopMeteorShower()
  if (cleanupVisibility) {
    cleanupVisibility()
  }
})

// 暴露方法供父组件调用
defineExpose({
  toggleMeteorShower,
  startMeteorShower,
  stopMeteorShower,
  currentLevel
})
</script>

<style scoped>
/* 流星雨控制器 */
.meteor-controller {
  position: fixed;
  top: 15px;
  right: 227px;
  width: 60px;
  height: 60px;
  z-index: 9998;
  transition: all 0.3s ease;
}

.meteor-btn {
  width: 100%;
  height: 100%;
  background: rgba(20, 25, 40, 0.95);
  backdrop-filter: blur(15px);
  border: 2px solid rgba(147, 51, 234, 0.3);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.meteor-btn:hover {
  transform: scale(1.1);
  border-color: #9333ea;
  box-shadow: 0 10px 30px rgba(147, 51, 234, 0.5);
}

.meteor-icon {
  font-size: 24px;
  margin-bottom: 2px;
  transition: all 0.3s ease;
}

.meteor-level {
  font-size: 10px;
  color: white;
  font-weight: bold;
}

/* 不同级别的动画 */
.meteor-controller.level-1 .meteor-icon {
  animation: meteorRotate 2s ease-in-out infinite;
}

.meteor-controller.level-2 .meteor-icon {
  animation: meteorRotate 1.5s ease-in-out infinite;
}

.meteor-controller.level-3 .meteor-icon {
  animation: meteorRotate 1s ease-in-out infinite;
}

/* 简单顺时针旋转 */
@keyframes meteorRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 流星雨容器 */
.meteor-shower-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 15;
  pointer-events: none;
  overflow: hidden;
}

.meteors-outside {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 16;
}

.meteors-inside {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 18;
  clip-path: ellipse(50vw 50vw at 50% 100%);
}

.atmosphere-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 17;
}

@keyframes insideMeteorGlow {
  from {
    box-shadow:
        0 0 10px rgba(255, 255, 255, 0.8),
        2px 2px 20px rgba(147, 51, 234, 0.7),
        4px 4px 30px rgba(192, 38, 211, 0.4);
  }
  to {
    box-shadow:
        0 0 15px rgba(255, 255, 255, 1),
        3px 3px 25px rgba(147, 51, 234, 0.9),
        6px 6px 40px rgba(192, 38, 211, 0.6);
  }
}


@keyframes particleImpact {
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(3); }
}

@keyframes particleFollow {
  0% { opacity: 1; transform: scale(1) translateX(0) translateY(0); }
  50% { opacity: 0.6; transform: scale(0.8) translateX(-15px) translateY(15px); }
  100% { opacity: 0; transform: scale(0.3) translateX(-30px) translateY(30px); }
}


</style>