<template>
  <!-- 弹幕容器 -->
  <div class="danmaku-container" ref="containerRef"></div>

  <!-- 弹幕输入区 -->
  <div class="danmaku-input-wrapper">
    <input
        type="text"
        class="danmaku-input"
        v-model="inputText"
        placeholder="发个弹幕吧~"
        maxlength="30"
        @keypress.enter="sendDanmaku"
    >
    <button class="danmaku-send-btn" @click="sendDanmaku">
      <i class="fas fa-paper-plane"></i>
      发射!
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// 容器引用
const containerRef = ref(null)

// 输入框内容
const inputText = ref('')

// 活跃弹幕元素数组
const activeDanmakuElements = ref([])

// WebSocket连接
let ws = null
const isConnected = ref(false)

// 弹幕颜色池 - 更丰富的颜色
const danmakuColors = [
  '#ffeb3b', '#ff6b6b', '#bb86fc', '#03dac6',
  '#4fc3f7', '#81c784', '#ff8a65', '#f06292',
  '#ffd700', '#ff9800', '#e91e63', '#00bcd4',
  '#9c27b0', '#4caf50', '#ff5722', '#00e676',
  '#ffc107', '#f44336', '#2196f3', '#8bc34a'
]

/**
 * 初始化WebSocket连接
 */
const initWebSocket = () => {
  const wsUrl = 'ws://localhost:3000'
  console.log('[弹幕系统] 正在连接WebSocket:', wsUrl)

  try {
    ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      isConnected.value = true
      console.log('[弹幕系统] ✅ WebSocket已连接')
    }

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        console.log('[弹幕系统] 📨 收到消息:', message)

        // 只处理弹幕消息
        if (message.type === 'danmaku' && message.text) {
          displayDanmaku(message)
        }
      } catch (error) {
        console.error('[弹幕系统] 消息解析错误:', error)
      }
    }

    ws.onerror = (error) => {
      console.error('[弹幕系统] ❌ WebSocket错误:', error)
      isConnected.value = false
    }

    ws.onclose = () => {
      isConnected.value = false
      console.log('[弹幕系统] 🔌 WebSocket已断开，5秒后重连...')
      setTimeout(initWebSocket, 5000)
    }
  } catch (error) {
    console.error('[弹幕系统] WebSocket创建失败:', error)
  }
}

/**
 * 显示弹幕（从服务器接收）
 */
const displayDanmaku = (data) => {
  if (!containerRef.value) return

  const text = data.text
  if (!text) return

  console.log('[弹幕系统] 🎬 显示弹幕:', text)

  const danmakuEl = document.createElement('div')
  danmakuEl.className = 'danmaku-item'
  danmakuEl.textContent = text

  // 🔥 使用服务器传来的样式参数
  const color = data.color
  const top = data.top
  const fontSize = data.fontSize
  const duration = data.duration

  console.log('[弹幕系统] 样式 - 颜色:', color, '位置:', top, '大小:', fontSize, '时长:', duration)

  // 设置样式
  danmakuEl.style.cssText = `
    position: fixed;
    left: 100vw;
    top: ${top}vh;
    color: ${color};
    font-size: ${fontSize}em;
    font-weight: bold;
    white-space: nowrap;
    text-shadow:
      2px 2px 6px rgba(0, 0, 0, 0.9),
      0 0 15px rgba(0, 0, 0, 0.8),
    pointer-events: none;
    z-index: 99999;
    will-change: transform;
  `

  // 添加到容器
  containerRef.value.appendChild(danmakuEl)
  activeDanmakuElements.value.push(danmakuEl)

  // 强制重绘
  danmakuEl.offsetHeight

  // 开始动画
  danmakuEl.style.transition = `transform ${duration}s linear`
  requestAnimationFrame(() => {
    danmakuEl.style.transform = `translateX(calc(-100vw - 100%))`
  })

  // 动画结束后移除
  setTimeout(() => {
    removeDanmaku(danmakuEl)
  }, duration * 1000)
}

/**
 * 移除弹幕
 */
const removeDanmaku = (element) => {
  if (element && element.parentNode) {
    element.remove()
    const index = activeDanmakuElements.value.indexOf(element)
    if (index > -1) {
      activeDanmakuElements.value.splice(index, 1)
    }
  }
}

/**
 * 发送弹幕
 */
const sendDanmaku = () => {
  const text = inputText.value.trim()

  if (!text) {
    console.warn('[弹幕系统] 弹幕内容为空')
    return
  }

  // 🎯 生成随机样式参数
  const color = danmakuColors[Math.floor(Math.random() * danmakuColors.length)]
  const top = Math.random() * 80 + 5  // 5% - 85%
  const fontSize = Math.random() * 0.8 + 1.5  // 1.5em - 2.3em
  const duration = Math.random() * 6 + 10  // 10s - 16s

  // 🔥 构造完整的弹幕数据对象（包含样式）
  const danmakuData = {
    type: 'danmaku',
    text: text,
    color: color,
    top: top,
    fontSize: fontSize,
    duration: duration,
    timestamp: Date.now()
  }

  console.log('[弹幕系统] 📤 发送弹幕:', danmakuData)

  // 先在本地立即显示（提升体验）
  displayDanmaku(danmakuData)

  // 发送到WebSocket服务器
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(danmakuData))
    console.log('[弹幕系统] ✅ 弹幕已发送到服务器')
  } else {
    console.warn('[弹幕系统] ⚠️ WebSocket未连接，弹幕仅本地显示')
  }

  // 清空输入框
  inputText.value = ''
}

/**
 * 清空所有弹幕
 */
const clearAllDanmaku = () => {
  activeDanmakuElements.value.forEach(el => {
    if (el && el.parentNode) {
      el.remove()
    }
  })
  activeDanmakuElements.value = []
  console.log('[弹幕系统] 清空所有弹幕')
}

// 生命周期
onMounted(() => {
  console.log('[弹幕系统] 🚀 组件已挂载')
  initWebSocket()
})

onBeforeUnmount(() => {
  if (ws) {
    ws.close()
    ws = null
  }
  clearAllDanmaku()
  console.log('[弹幕系统] 🛑 组件已卸载')
})

// 暴露方法
defineExpose({
  sendDanmaku,
  clearAllDanmaku
})
</script>

<style scoped>
/* 弹幕容器 */
.danmaku-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 99999;
  overflow: visible;
}

/* 弹幕输入区 */
.danmaku-input-wrapper {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 10000;
  display: flex;
  gap: 10px;
  align-items: center;
  background: rgba(20, 25, 40, 0.9);
  padding: 15px;
  border-radius: 30px;
  border: 2px solid rgba(147, 51, 234, 0.3);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.8s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.danmaku-input {
  background: rgba(147, 51, 234, 0.1);
  border: 1px solid rgba(147, 51, 234, 0.3);
  border-radius: 20px;
  padding: 10px 15px;
  color: white;
  width: 200px;
  transition: all 0.3s ease;
  font-size: 14px;
}

.danmaku-input:focus {
  outline: none;
  border-color: #9333ea;
  background: rgba(147, 51, 234, 0.2);
  width: 250px;
  box-shadow: 0 0 20px rgba(147, 51, 234, 0.3);
}

.danmaku-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.danmaku-send-btn {
  background: linear-gradient(135deg, #9333ea, #c026d3);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 5px;
}

.danmaku-send-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.danmaku-send-btn:active::before {
  width: 300px;
  height: 300px;
}

.danmaku-send-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 20px rgba(147, 51, 234, 0.5);
}

/* 响应式 */
@media (max-width: 768px) {
  .danmaku-input-wrapper {
    bottom: 15px;
    right: 15px;
    padding: 10px;
  }

  .danmaku-input {
    width: 150px;
  }

  .danmaku-input:focus {
    width: 180px;
  }

  .danmaku-send-btn {
    padding: 10px 15px;
    font-size: 0.9rem;
  }
}
</style>