<template>
  <!-- 音乐开关控制 - 左下角 -->
  <div class="music-toggle-container">
    <button
        class="music-toggle-btn"
        :class="{ active: isPlaying }"
        @click="toggleMusic"
        title="切换音乐播放/暂停"
    >
      <i class="music-note">♪</i>
    </button>
  </div>
</template>

<script setup>
import { useMusicPlayer } from '@/features/home/composables/useMusicPlayer'

// 获取音乐播放器实例
const musicPlayer = useMusicPlayer()

// 从 useMusicPlayer 获取状态
const { isPlaying } = musicPlayer

// 切换音乐播放/暂停
const toggleMusic = () => {
  musicPlayer.togglePlay()
  console.log('[MusicToggle] 切换音乐播放状态:', isPlaying.value)
}
</script>

<style scoped>
.music-toggle-container {
  position: fixed;
  bottom: 50px;  /* 与弹幕发射框距离底部相同 */
  left: 50px;
  z-index: 1000;
}

.music-toggle-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #9333ea;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  color: #ccc;
  font-size: 1.5em;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.music-toggle-btn:hover {
  background: rgba(147, 51, 234, 0.2);
  transform: scale(1.1);
}

.music-toggle-btn:active {
  transform: scale(0.95);
}

/* 打开状态 - 有颜色 */
.music-toggle-btn.active {
  border-color: #9333ea;
  color: #9333ea;
  background: rgba(147, 51, 234, 0.3);
  box-shadow: 0 4px 15px rgba(147, 51, 234, 0.4);
}

.music-toggle-btn.active:hover {
  background: rgba(147, 51, 234, 0.4);
  box-shadow: 0 4px 20px rgba(147, 51, 234, 0.6);
}

/* 关闭状态 - 没颜色 */
.music-toggle-btn:not(.active) {
  color: #999;
  border-color: #666;
}

.music-toggle-btn:not(.active):hover {
  border-color: #999;
  color: #aaa;
}

.music-note {
  display: block;
  line-height: 1;
}

/* 打开时才有动画 */
.music-toggle-btn.active .music-note {
  animation: noteFloat 1s ease-in-out infinite;
}

@keyframes noteFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .music-toggle-btn {
    width: 45px;
    height: 45px;
    font-size: 1.2em;
  }
}
</style>