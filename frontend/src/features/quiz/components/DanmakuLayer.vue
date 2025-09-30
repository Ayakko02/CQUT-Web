<template>
  <div id="danmaku-root"></div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  initialDanmakus: { type: Array, default: () => [] },
  colors: { 
    type: Array, 
    default: () => ['#ffffff', '#ffff99', '#99ff99', '#99ccff', '#ffccff', '#ffd700', '#00ffff'] 
  },
  autoDanmaku: { type: Boolean, default: true },
  autoTexts: { 
    type: Array, 
    default: () => ['CQUT动漫社赛高！', '零域和溯回都是最棒的！', '有人一起出cos吗？', '这题我会！'] 
  },
  websocketUrl: { type: String, default: 'ws://localhost:3000' }
});

const emit = defineEmits(['newDanmaku', 'playSound']);

// 弹幕数据
const danmakus = ref([...props.initialDanmakus]);
let autoDanmakuInterval = null;
let cleanupInterval = null;
let shadowRoot = null;
let danmakuLayer = null;
let inputGroup = null;
let websocket = null;
let isConnected = ref(false);

// 创建Shadow DOM
onMounted(() => {
  const root = document.getElementById('danmaku-root');
  shadowRoot = root.attachShadow({ mode: 'closed' });
  
  // 创建弹幕墙
  danmakuLayer = document.createElement('div');
  danmakuLayer.className = 'danmaku-layer';
  
  // 创建输入框和连接状态
  inputGroup = document.createElement('div');
  inputGroup.className = 'danmaku-input-group';
  inputGroup.innerHTML = `
    <input type="text" placeholder="发送弹幕..." maxlength="50" class="danmaku-input">
    <button class="danmaku-button">
      <i class="fas fa-paper-plane"></i>
    </button>
    <div class="connection-status"></div>
  `;
  
  // 添加样式
  const style = document.createElement('style');
  style.textContent = `
    .danmaku-layer {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 15;
      pointer-events: none;
      overflow: hidden;
    }
    
    .danmaku-item {
      position: absolute;
      white-space: nowrap;
      font-family: "Microsoft YaHei", sans-serif;
      font-weight: bold;
      pointer-events: none;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
    }
    
    @keyframes danmaku-scroll {
      0% { transform: translateX(100vw); opacity: 0; }
      10% { opacity: 0.95; }
      90% { opacity: 0.95; }
      100% { transform: translateX(-100%); opacity: 0; }
    }
    
    .danmaku-input-group {
      position: fixed;
      bottom: 20px;
      right: 20px;
      display: flex;
      z-index: 50;
      width: 320px;
      align-items: center;
    }
    
    .danmaku-input {
      flex: 1;
      background: rgba(15, 15, 26, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 30px 0 0 30px;
      padding: 12px 20px;
      color: white;
      font-size: 0.95rem;
      outline: none;
      box-sizing: border-box;
      height: 44px;
    }
    
    .danmaku-button {
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
      border: none;
      border-radius: 0 30px 30px 0;
      color: white;
      padding: 0 18px;
      cursor: pointer;
      font-size: 1.1rem;
      box-sizing: border-box;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .connection-status {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-left: 10px;
      background-color: #ff6b6b; /* 未连接-红色 */
    }
    
    .connection-status.connected {
      background-color: #4cd964; /* 已连接-绿色 */
    }
    
    .connection-status.connecting {
      background-color: #ffcb69; /* 连接中-黄色 */
      animation: pulse 1.5s infinite;
    }
    
    @keyframes pulse {
      0% { opacity: 0.5; }
      50% { opacity: 1; }
      100% { opacity: 0.5; }
    }
    
    @media (max-width: 768px) {
      .danmaku-input-group {
        width: calc(100% - 40px);
      }
    }
  `;
  
  // 添加Font Awesome
  const faLink = document.createElement('link');
  faLink.rel = 'stylesheet';
  faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
  
  // 组装Shadow DOM
  shadowRoot.appendChild(style);
  shadowRoot.appendChild(faLink);
  shadowRoot.appendChild(danmakuLayer);
  shadowRoot.appendChild(inputGroup);
  
  // 获取元素并绑定事件
  const input = inputGroup.querySelector('.danmaku-input');
  const button = inputGroup.querySelector('.danmaku-button');
  const statusIndicator = inputGroup.querySelector('.connection-status');
  
  input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') sendDanmaku(input);
  });
  button.addEventListener('click', () => sendDanmaku(input));
  
  // 初始化弹幕
  props.initialDanmakus.forEach(addDanmakuElement);
  
  // 启动WebSocket连接
  connectWebSocket(statusIndicator);
  
  // 启动自动弹幕和清理
  if (props.autoDanmaku) startAutoDanmaku();
  cleanupInterval = setInterval(cleanupDanmakus, 5000);
});

// WebSocket连接
const connectWebSocket = (statusIndicator) => {
  if (websocket) {
    websocket.close();
  }
  
  statusIndicator.className = 'connection-status connecting';
  isConnected.value = false;
  
  try {
    websocket = new WebSocket(props.websocketUrl);
    
    websocket.onopen = () => {
      statusIndicator.className = 'connection-status connected';
      isConnected.value = true;
    };
    
    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'danmaku') {
          addDanmakuElement(data);
          danmakus.value.push(data);
          emit('newDanmaku', data);
        }
      } catch (error) {
        console.error('解析消息失败:', error);
      }
    };
    
    websocket.onclose = () => {
      statusIndicator.className = 'connection-status';
      isConnected.value = false;
      // 自动重连
      setTimeout(() => connectWebSocket(statusIndicator), 5000);
    };
    
    websocket.onerror = (error) => {
      console.error('WebSocket错误:', error);
    };
  } catch (error) {
    console.error('连接失败:', error);
    setTimeout(() => connectWebSocket(statusIndicator), 5000);
  }
};

// 发送弹幕
const sendDanmaku = (input) => {
  if (!input.value.trim()) return;
  
  emit('playSound', 'danmaku');
  
  const newDanmakuObj = {
    type: 'danmaku',
    text: input.value,
    top: Math.random() * 80 + 5,
    color: props.colors[Math.floor(Math.random() * props.colors.length)],
    size: Math.floor(Math.random() * 4) + 16,
    speed: Math.random() * 5 + 5,
    timestamp: Date.now()
  };
  
  // 本地显示
  danmakus.value.push(newDanmakuObj);
  addDanmakuElement(newDanmakuObj);
  emit('newDanmaku', newDanmakuObj);
  
  // 发送到服务器
  if (isConnected.value && websocket) {
    websocket.send(JSON.stringify(newDanmakuObj));
  }
  
  input.value = '';
};

// 添加弹幕元素到DOM
const addDanmakuElement = (danmaku) => {
  const el = document.createElement('div');
  el.className = 'danmaku-item';
  el.textContent = danmaku.text;
  el.style.top = `${danmaku.top}%`;
  el.style.color = danmaku.color;
  el.style.fontSize = `${danmaku.size}px`;
  el.style.animation = `danmaku-scroll ${danmaku.speed}s linear forwards`;
  el.dataset.timestamp = danmaku.timestamp;
  
  danmakuLayer.appendChild(el);
  
  // 动画结束后自动移除
  setTimeout(() => {
    if (el.parentNode === danmakuLayer) {
      danmakuLayer.removeChild(el);
    }
  }, danmaku.speed * 1000);
};

// 自动发送弹幕
const startAutoDanmaku = () => {
  autoDanmakuInterval = setInterval(() => {
    if (Math.random() > 0.7) {
      const newDanmakuObj = {
        type: 'danmaku',
        text: props.autoTexts[Math.floor(Math.random() * props.autoTexts.length)],
        top: Math.random() * 80 + 5,
        color: props.colors[Math.floor(Math.random() * props.colors.length)],
        size: Math.floor(Math.random() * 4) + 16,
        speed: Math.random() * 5 + 5,
        timestamp: Date.now()
      };
      
      danmakus.value.push(newDanmakuObj);
      addDanmakuElement(newDanmakuObj);
      emit('newDanmaku', newDanmakuObj);
      
      // 连接成功时发送到服务器
      if (isConnected.value && websocket) {
        websocket.send(JSON.stringify(newDanmakuObj));
      }
    }
  }, 3000);
};

// 清理过期弹幕
const cleanupDanmakus = () => {
  const now = Date.now();
  danmakus.value = danmakus.value.filter(d => now - d.timestamp < 15000);
  
  // 清理DOM元素
  const elements = danmakuLayer.querySelectorAll('.danmaku-item');
  elements.forEach(el => {
    const timestamp = parseInt(el.dataset.timestamp);
    if (now - timestamp >= 15000) {
      if (el.parentNode === danmakuLayer) {
        danmakuLayer.removeChild(el);
      }
    }
  });
};

// 组件卸载时清理
onUnmounted(() => {
  if (autoDanmakuInterval) clearInterval(autoDanmakuInterval);
  if (cleanupInterval) clearInterval(cleanupInterval);
  
  // 关闭WebSocket连接
  if (websocket) {
    websocket.close(1000, '组件卸载');
  }
  
  if (shadowRoot) {
    const root = document.getElementById('danmaku-root');
    root.innerHTML = '';
  }
});
</script>

<style scoped>
#danmaku-root {
  display: block;
}
</style>
    
