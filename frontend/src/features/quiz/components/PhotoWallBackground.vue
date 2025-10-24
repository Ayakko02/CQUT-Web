<template>
  <div class="scrolling-background">
    <!-- 第一层 - 向右滚动 -->
    <div class="scroll-layer layer-1">
      <div class="scroll-content" :style="layer1Style">
        <img v-for="(photo, index) in layer1PhotoList" :key="index" :src="photo" class="scroll-image">
        <!-- 复制一遍图片以实现无缝循环 -->
        <img v-for="(photo, index) in layer1PhotoList" :key="`copy-${index}`" :src="photo" class="scroll-image">
      </div>
    </div>

    <!-- 第二层 - 向左滚动 -->
    <div class="scroll-layer layer-2">
      <div class="scroll-content scroll-content-reverse" :style="layer2Style">
        <!-- 复制一遍图片放在前面 -->
        <img v-for="(photo, index) in layer2PhotoList" :key="`copy-${index}`" :src="photo" class="scroll-image">
        <img v-for="(photo, index) in layer2PhotoList" :key="index" :src="photo" class="scroll-image">
      </div>
    </div>

    <!-- 第三层 - 向右滚动 -->
    <div class="scroll-layer layer-3">
      <div class="scroll-content" :style="layer3Style">
        <img v-for="(photo, index) in layer3PhotoList" :key="index" :src="photo" class="scroll-image">
        <!-- 复制一遍图片以实现无缝循环 -->
        <img v-for="(photo, index) in layer3PhotoList" :key="`copy-${index}`" :src="photo" class="scroll-image">
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

// Props - 接收三层独立的照片数组
const props = defineProps({
  layer1Photos: {
    type: Array,
    default: () => []
  },
  layer2Photos: {
    type: Array,
    default: () => []
  },
  layer3Photos: {
    type: Array,
    default: () => []
  },
  speed: {
    type: Number,
    default: 0.5
  }
})

// 滚动位置
const layer1Offset = ref(0)
const layer2Offset = ref(0)
const layer3Offset = ref(0)

// 将照片分配到三层 - 每层独立重复
const layer1PhotoList = ref([])
const layer2PhotoList = ref([])
const layer3PhotoList = ref([])

// 🔥 Canvas 优化：动态压缩图片
const optimizeImage = (src) => {
  return new Promise((resolve) => {
    const img = new Image()
    // 🔥 本地图片不需要 crossOrigin
    // img.crossOrigin = 'anonymous'

    img.onload = () => {
      try {
        // 创建 canvas
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        // 设置合适的尺寸（因为显示宽度只有400px，所以800px足够）
        const maxWidth = 800
        const scale = maxWidth / img.width
        canvas.width = maxWidth
        canvas.height = img.height * scale

        // 绘制图片
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        // 转换为 blob URL（质量95%，视觉无损）
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(URL.createObjectURL(blob))
          } else {
            resolve(src) // 失败则使用原图
          }
        }, 'image/jpeg', 0.95)
      } catch (error) {
        console.error('[照片墙] 优化图片失败:', error)
        resolve(src) // 出错则使用原图
      }
    }

    img.onerror = (error) => {
      console.error('[照片墙] 加载图片失败:', src, error)
      resolve(src) // 加载失败，使用原图
    }

    img.src = src
  })
}

// 预处理照片列表
const preprocessPhotos = async (photos, times = 2) => {
  if (!photos || photos.length === 0) return []

  // 先优化图片
  const optimized = await Promise.all(photos.map(optimizeImage))

  // 然后重复指定次数
  const repeated = []
  for (let i = 0; i < times; i++) {
    repeated.push(...optimized)
  }
  return repeated
}

// 计算样式
const layer1Style = computed(() => ({
  transform: `translateX(${layer1Offset.value}px)`
}))

const layer2Style = computed(() => ({
  transform: `translateX(${layer2Offset.value}px)`
}))

const layer3Style = computed(() => ({
  transform: `translateX(${layer3Offset.value}px)`
}))

// 动画循环
let animationId = null
let lastTime = 0

const animate = (currentTime = 0) => {
  // 🔥 提高到60fps（删除帧率限制）
  // if (currentTime - lastTime < 33) {
  //   animationId = requestAnimationFrame(animate)
  //   return
  // }
  // lastTime = currentTime

  // 计算每层的总宽度（每层可能图片数量不同）
  const imageWidth = 400
  const totalWidth1 = imageWidth * (props.layer1Photos?.length || 0)
  const totalWidth2 = imageWidth * (props.layer2Photos?.length || 0)
  const totalWidth3 = imageWidth * (props.layer3Photos?.length || 0)

  // 防止除以0
  if (totalWidth1 === 0 || totalWidth2 === 0 || totalWidth3 === 0) {
    animationId = requestAnimationFrame(animate)
    return
  }

  // 第一层向右滚动（translateX 负数增加）- 快速
  layer1Offset.value -= props.speed * 1.3  // 👈 从 1.5 改成 2.5
  if (layer1Offset.value <= -totalWidth1) {
    layer1Offset.value = 0
  }

  // 第二层向左滚动（translateX 正数增加）- 慢速
  layer2Offset.value += props.speed * 0.6  // 👈 从 2.0 改成 0.8
  if (layer2Offset.value >= 0) {
    layer2Offset.value = -totalWidth2
  }

  // 第三层向右滚动（translateX 负数增加）- 中速
  layer3Offset.value -= props.speed * 1.0  // 👈 保持 1.0（基准速度）
  if (layer3Offset.value <= -totalWidth3) {
    layer3Offset.value = 0
  }

  animationId = requestAnimationFrame(animate)
}

// 生命周期
onMounted(async () => {
  console.log('[照片墙] 开始加载图片...')
  console.log('[照片墙] 第1层图片数量:', props.layer1Photos?.length || 0)
  console.log('[照片墙] 第2层图片数量:', props.layer2Photos?.length || 0)
  console.log('[照片墙] 第3层图片数量:', props.layer3Photos?.length || 0)

  try {
    // 🔥 预处理和优化所有图片（重复次数从5改成2）
    const [optimized1, optimized2, optimized3] = await Promise.all([
      preprocessPhotos(props.layer1Photos, 2),
      preprocessPhotos(props.layer2Photos, 2),
      preprocessPhotos(props.layer3Photos, 2)
    ])

    layer1PhotoList.value = optimized1
    layer2PhotoList.value = optimized2
    layer3PhotoList.value = optimized3

    console.log('[照片墙] 图片优化完成！')
    console.log('[照片墙] 第1层处理后:', layer1PhotoList.value.length)
    console.log('[照片墙] 第2层处理后:', layer2PhotoList.value.length)
    console.log('[照片墙] 第3层处理后:', layer3PhotoList.value.length)
  } catch (error) {
    console.error('[照片墙] 图片处理失败:', error)
    // 如果优化失败，直接使用原图
    layer1PhotoList.value = [...props.layer1Photos, ...props.layer1Photos]
    layer2PhotoList.value = [...props.layer2Photos, ...props.layer2Photos]
    layer3PhotoList.value = [...props.layer3Photos, ...props.layer3Photos]
  }

  // 初始化第二层的起始位置
  const imageWidth = 400
  const totalWidth2 = imageWidth * (props.layer2Photos?.length || 0)
  layer2Offset.value = -totalWidth2

  // 启动动画
  animate()
})

onBeforeUnmount(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }

  // 清理 blob URLs
  const cleanupUrls = (urls) => {
    urls.forEach(url => {
      if (typeof url === 'string' && url.startsWith('blob:')) {
        URL.revokeObjectURL(url)
      }
    })
  }

  cleanupUrls(layer1PhotoList.value)
  cleanupUrls(layer2PhotoList.value)
  cleanupUrls(layer3PhotoList.value)
})
</script>

<style scoped>
.scrolling-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
  transform: rotate(30deg) scale(1.9); /* 🔥 旋转30度并放大1.5倍避免露白边 */
  transform-origin: center center;
}

.scroll-layer {
  position: absolute;
  width: 100%;
  height: 33.333%;
  overflow: hidden;
}

.layer-1 {
  top: 0;
  opacity: 0.9;
}

.layer-2 {
  top: 33.333%;
  opacity: 0.8;
}

.layer-3 {
  top: 66.666%;
  opacity: 0.9;
}

.scroll-content {
  display: flex;
  height: 100%;
  will-change: transform;
  transform: translateZ(0); /* 🔥 强制GPU加速 */
  backface-visibility: hidden; /* 🔥 优化渲染 */
}

.scroll-image {
  height: 100%;
  width: 400px;
  object-fit: cover;
  flex-shrink: 0;
  border: none;
  transform: translateZ(0); /* 🔥 每张图片独立GPU层 */
  /* 移除 image-rendering，避免兼容性警告 */
}

/* 响应式 */
@media (max-width: 768px) {
  .scroll-image {
    width: 300px;
  }
}
</style>