# 音乐播放器

<template>
  <!-- 音乐播放器 - 固定在右上角 -->
  <div class="music-player" :class="`${currentPlaylist}-theme`">
    <div class="player-container">
      <!-- 黑胶唱片区域 -->
      <div class="vinyl-container" :class="{ playing: isPlaying }">
        <div
            class="vinyl-disc"
            :class="{ playing: isPlaying }"
            :style="{ '--cover-image': currentCoverImage }"
        >
        </div>
        <div class="vinyl-arm"></div>
      </div>

      <!-- 播放控制区 -->
      <div class="player-controls">
        <button class="play-btn" @click="togglePlay">
          {{ isPlaying ? '⏸' : '▶' }}
        </button>
        <div class="song-info">
          <div class="song-title">{{ currentTrack?.title || '选择歌曲' }}</div>
          <div class="song-artist">{{ currentTrack?.artist || '未知艺术家' }}</div>
        </div>
      </div>

      <!-- 进度条 -->
      <div class="progress-container">
        <div class="progress-bar" @click="seek">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
        <div class="time-display">
          <span>{{ formatTime(currentTime) }}</span>
          <span>{{ formatTime(duration) }}</span>
        </div>
      </div>

      <!-- 歌单列表 - 可收放 -->
      <div class="playlist" :class="{ collapsed: !isPlaylistExpanded }">
        <div class="playlist-header" @click="togglePlaylist">
          <span>当前歌单</span>
          <button class="playlist-toggle">
            {{ isPlaylistExpanded ? '▼' : '◀' }}
          </button>
        </div>
        <div class="playlist-items">
        <div
            v-for="(song, index) in currentPlaylistSongs"
            :key="index"
            class="playlist-item"
            :class="{ active: index === currentTrackIndex }"
            @click.stop="selectTrack(index)"
        >
          <div class="playlist-item-title">{{ song.title }}</div>
          <div class="playlist-item-artist">{{ song.artist }}</div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue'
import { useMusicPlayer } from '../composables/useMusicPlayer.js'
import { useMusicStore } from '@/stores/music'


// Props
const props = defineProps({
  currentTheme: {
    type: String,
    default: 'zero'
  },
  autoSwitchPlaylist: {
    type: Boolean,
    default: true
  }
})

// 使用音乐播放器逻辑
const {
  // 播放状态
  isPlaying,
  currentTime,
  duration,
  progressPercentage,

  // 歌单和曲目
  currentPlaylist,
  currentTrackIndex,
  currentTrack,
  currentPlaylistSongs,

  // 播放列表UI
  isPlaylistExpanded,

  // 方法
  togglePlay,
  selectTrack,
  nextTrack,
  previousTrack,
  seek,
  togglePlaylist,
  switchPlaylist,
  formatTime,

  // 初始化
  initializePlayer
} = useMusicPlayer()

// 计算属性
const currentCoverImage = computed(() => {
  if (currentTrack.value?.cover) {
    return `url('${currentTrack.value.cover}')`
  }
  return 'none'
})

// 监听主题变化，自动切换歌单
watch(() => props.currentTheme, (newTheme) => {
  if (props.autoSwitchPlaylist) {
    const targetPlaylist = newTheme === 'suhui' ? 'suhui' : 'zero'
    if (targetPlaylist !== currentPlaylist.value) {
      switchPlaylist(targetPlaylist)
    }
  }
}, { immediate: true })

// 生命周期
onMounted(() => {
  initializePlayer()
})

// 暴露方法供父组件调用
defineExpose({
  play: togglePlay,
  pause: () => isPlaying.value && togglePlay(),
  switchPlaylist,
  nextTrack,
  previousTrack
})
</script>

<style scoped>
/* 音乐播放器 - 固定右上角，不参与旋转 */
.music-player {
  position: fixed;
  top: 0;
  right: calc(0px + env(scrollbar-width, 15px));
  width: 200px;
  height: 200px;
  background: rgba(20, 25, 40, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  border: 2px solid rgba(147, 51, 234, 0.3);
  padding: 20px;
  z-index: 9999;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  transform: none !important;
  box-sizing: border-box;

}

/* 黑胶唱片区域 */
.vinyl-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 15px;
  z-index: 1;
}

.vinyl-disc {
  --cover-image: none;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: relative;
  transition: transform 0.3s ease;
  overflow: hidden;

  /* 黑胶基础样式 */
  background: #1a1a1a;
  box-shadow:
      0 5px 15px rgba(0, 0, 0, 0.3),
      inset 0 0 0 8px #2d2d2d,
      inset 0 0 0 16px #1a1a1a,
      inset 0 0 0 24px #333,
      inset 0 0 20px rgba(0, 0, 0, 0.5);
}

/* 封面图片层 */
.vinyl-disc::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  bottom: 8px;
  border-radius: 50%;
  background-image: var(--cover-image);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 2;
  background-color: #333;
}

/* 中心孔 */
.vinyl-disc::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  background: #000;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  box-shadow:
      inset 0 0 3px rgba(255, 255, 255, 0.1),
      0 1px 3px rgba(0, 0, 0, 0.5);
}

/* 旋转动画 */
.vinyl-disc.playing {
  animation: vinylRotate 25s linear infinite;
}

@keyframes vinylRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 唱针 */
.vinyl-arm {
  position: absolute;
  top: -10px;
  right: 10px;
  width: 3px;
  height: 80px;
  background: linear-gradient(to bottom, #888, #333);
  border-radius: 3px;
  transform-origin: top center;
  transform: rotate(25deg);
  transition: transform 0.5s ease;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3);
  z-index: 4;
}

.vinyl-arm::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: -3px;
  width: 9px;
  height: 15px;
  background: linear-gradient(135deg, #666, #333);
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

/* 播放时唱针位置 */
.vinyl-container.playing .vinyl-arm {
  transform: rotate(0deg);
}

/* 播放控制 */
.player-controls {
  position: absolute;
  top: 150px;
  right: 10px;
  width: 180px;
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.play-btn {
  width: 40px;
  height: 40px;
  margin-right: 5px;
  border-radius: 50%;
  background: linear-gradient(135deg, #9333ea, #c026d3);
  border: none;
  color: white;
  font-size: 1.2em;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba(147, 51, 234, 0.3);
}

.play-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 5px 15px rgba(147, 51, 234, 0.5);
}

.play-btn:active {
  transform: scale(0.95);
}

.song-info {
  flex: 1;
  color: white;
  min-width: 0;
}

.song-title {
  font-weight: bold;
  font-size: 0.9em;
  margin-bottom: 3px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.song-artist {
  font-size: 0.7em;
  opacity: 0.7;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

/* 进度条 */
.progress-container {
  margin-bottom: -125px;
  position: absolute;
  bottom: 80px;
  width: 180px;
  right: 10px;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
  cursor: pointer;
  margin-bottom: 8px;
  position: relative;
}

.progress-bar:hover {
  height: 6px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #9333ea, #c026d3);
  width: 0;
  transition: width 0.1s ease;
  border-radius: 2px;
}

.time-display {
  display: flex;
  justify-content: space-between;
  color: white;
  font-size: 0.7em;
  opacity: 0.7;
  margin-top: 0;
}

/* 歌单容器 */
.playlist {
  position: absolute;
  top: 125%;
  right: 0;
  width: 165px;
  transition: all 0.3s ease;
}

/* 固定标题 - 绝对不滚动 */
.playlist-header {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(147, 51, 234, 0.3);
  border-radius: 8px;
  padding: 8px;
  color: white;
  font-weight: bold;
  font-size: 0.8em;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 30;
  margin-bottom: 4px;
  transition: all 0.3s ease;
}

.playlist-header:hover {
  background: rgba(255, 255, 255, 0.15);
}

.playlist-header::before {
  content: '♪';
  color: #9333ea;
  margin-right: 8px;
}

.playlist-toggle {
  background: none;
  border: none;
  color: white;
  font-size: 0.8em;
  cursor: pointer;
  opacity: 0.7;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.playlist-toggle:hover {
  background: rgba(255, 255, 255, 0.2);
  opacity: 1;
  transform: scale(1.1);
}

/* 歌曲列表容器 - 在标题下方 */
.playlist-items {
  border: 2px solid rgba(147, 51, 234, 0.3);
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 25;
  opacity: 1;
  padding-top: 0;
  margin-top: 0;
}


/* 展开状态 */
.playlist:not(.collapsed) .playlist-items {
  max-height: 135px;
  overflow-y: auto;
  opacity: 1;
}

/* 收起状态 */
.playlist.collapsed .playlist-items {
  max-height: 150px !important;
  overflow: hidden !important;
  opacity: 0;
}

.playlist.collapsed .playlist-toggle {
  transform: rotate(-90deg);
}

/* 歌曲项目 */
.playlist-item {
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 0.7em;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  margin: 5px 8px;
}

.playlist-item:hover {
  background: rgba(147, 51, 234, 0.3);
  transform: translateX(5px);
  border-color: rgba(147, 51, 234, 0.5);
}

.playlist-item.active {
  background: linear-gradient(135deg, #9333ea, #c026d3);
  border-color: rgba(255, 255, 255, 0.2);
}

.playlist-item-title {
  font-weight: bold;
  margin-bottom: 2px;
}

.playlist-item-artist {
  opacity: 0.7;
  font-size: 0.9em;
}

/* 滚动条样式 */
.playlist-items::-webkit-scrollbar {
  width: 4px;
}

.playlist-items::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.playlist-items::-webkit-scrollbar-thumb {
  background: rgba(147, 51, 234, 0.5);
  border-radius: 2px;
}

.playlist-items::-webkit-scrollbar-thumb:hover {
  background: rgba(147, 51, 234, 0.7);
}

/* 主题切换 */

.music-player.zero-theme .play-btn {
  background: linear-gradient(135deg, #9333ea, #c026d3);
}

.music-player.zero-theme .progress-fill {
  background: linear-gradient(90deg, #9333ea, #c026d3);
}

.music-player.suhui-theme .play-btn {
  background: linear-gradient(135deg, #daa520, #ffd700);
}

.music-player.suhui-theme .progress-fill {
  background: linear-gradient(90deg, #daa520, #ffd700);
}

.music-player.suhui-theme .playlist-header::before {
  color: #daa520;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .music-player {
    width: 160px;
    height: 180px;
    top: 10px;
    right: 10px;
    padding: 15px;
  }

  .vinyl-container {
    width: 80px;
    height: 80px;
  }

  .playlist {
    width: 140px;
  }

  .player-controls {
    width: 140px;
  }

  .progress-container {
    width: 140px;
  }
}
</style>