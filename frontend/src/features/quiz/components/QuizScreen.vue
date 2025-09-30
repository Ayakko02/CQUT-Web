<template>
  <!-- 所有内容包裹在一个根div中 -->
  <div class="player-container">
    <div class="music-player" :class="{ minimized: isMinimized }">
      <!-- 播放器头部 -->
      <div class="music-player-header" @click="toggleMinimize">
        <div class="music-info">
          <div class="music-album-container">
            <div class="music-album" :class="{ spinning: isPlaying }" 
                 :style="{ backgroundImage: `url(${currentMusic.cover || 'https://picsum.photos/id/237/100/100'})` }">
            </div>
            <div class="album-glow"></div>
          </div>
          <div class="music-details">
            <div class="music-title-container">
              <div class="music-title" :class="{ scrolling: shouldScroll }" :style="titleStyle">
                {{ currentMusic.title || '默认背景音乐' }}
              </div>
            </div>
            <div class="music-artist">{{ currentMusic.artist || '未知艺术家' }}</div>
          </div>
        </div>
        <button class="minimize-btn" @click.stop="toggleMinimize">
          <i :class="isMinimized ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
        </button>
      </div>
      
      <!-- 播放器控制区 -->
      <div v-if="!isMinimized" class="music-player-controls">
        <!-- 进度条 -->
        <div class="progress-container">
          <span class="time current-time">{{ formattedCurrentTime }}</span>
          <div class="progress-bar" @click="seek">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
            <div class="progress-handle" :style="{ left: progressPercent + '%' }"></div>
          </div>
          <span class="time duration">{{ formattedDuration }}</span>
        </div>
        
        <!-- 控制按钮 -->
        <div class="music-controls">
          <button class="music-btn shuffle-btn" @click="toggleShuffle" :class="{ active: isShuffle }" title="随机播放">
            <i class="fas fa-random"></i>
          </button>
          <button class="music-btn prev-btn" @click="prevTrack" title="上一曲">
            <i class="fas fa-step-backward"></i>
          </button>
          <button class="music-btn play-pause" @click="togglePlay" title="播放/暂停">
            <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
          </button>
          <button class="music-btn next-btn" @click="nextTrack" title="下一曲">
            <i class="fas fa-step-forward"></i>
          </button>
          <button class="music-btn repeat-btn" @click="toggleRepeat" :class="{ active: repeatMode !== 'none' }" title="循环模式">
            <i :class="repeatMode === 'one' ? 'fas fa-redo-alt' : 'fas fa-redo'"></i>
            <span v-if="repeatMode === 'one'" class="repeat-badge">1</span>
          </button>
        </div>
        
        <!-- 音量控制和播放列表按钮 -->
        <div class="volume-and-playlist">
          <div class="volume-control">
            <button class="volume-icon-btn" @click.stop="toggleVolumeControl" :class="{ active: showVolumeControl }" title="音量控制">
              <i :class="volume > 50 ? 'fas fa-volume-up' : volume > 0 ? 'fas fa-volume-down' : 'fas fa-volume-mute'"></i>
            </button>
            <div class="volume-slider-container" :class="{ visible: showVolumeControl }">
              <input 
                type="range" 
                min="0" 
                max="100" 
                v-model="volume" 
                @input="adjustVolume"
                class="volume-slider"
                title="调整音量"
              >
              <span class="volume-percent">{{ volume }}%</span>
            </div>
          </div>
          
          <div class="playlist-controls">
            <button class="playlist-btn" @click.stop="togglePlaylist" :class="{ active: showPlaylist }" title="播放列表">
              <i class="fas fa-list"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- 播放列表 -->
      <div v-if="showPlaylist && !isMinimized" class="music-playlist">
        <div class="playlist-header">
          <h4>播放列表 ({{ Object.keys(musicLibrary).length }})</h4>
          <button class="close-playlist" @click.stop="showPlaylist = false" title="关闭">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="playlist-items">
          <div 
            v-for="(music, key) in musicLibrary" 
            :key="key"
            class="playlist-item"
            :class="{ active: currentMusic.url === music.url }"
            @click.stop="selectTrack(key)"
          >
            <div class="playlist-album" :style="{ backgroundImage: `url(${music.cover || 'https://picsum.photos/id/237/100/100'})` }"></div>
            <div class="playlist-info">
              <div class="playlist-title">{{ music.title || '未知歌曲' }}</div>
              <div class="playlist-artist">{{ music.artist || '未知艺术家' }}</div>
            </div>
            <div class="playlist-actions">
              <i v-if="currentMusic.url === music.url" class="fas fa-play active-indicator"></i>
              <span v-else class="track-number">{{ getTrackNumber(key) }}</span>
            </div>
          </div>
          <div v-if="Object.keys(musicLibrary).length === 0" class="empty-playlist">
            播放列表为空
          </div>
        </div>
      </div>
      
      <!-- 音频元素 -->
      <audio 
        ref="bgm" 
        :src="currentMusic.url" 
        :loop="repeatMode === 'one'"
        @error="handleAudioError"
        @ended="handleTrackEnd"
        @timeupdate="updateProgress"
        @loadedmetadata="updateDuration"
      >
        您的浏览器不支持音频播放，请更新浏览器到最新版本
      </audio>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from 'vue';

// 属性定义
const props = defineProps({
  initialVolume: {
    type: Number,
    default: 70,
    validator: (val) => val >= 0 && val <= 100
  },
  autoPlay: {
    type: Boolean,
    default: false
  }
});

// 事件定义
const emit = defineEmits(['play', 'pause', 'trackChange', 'volumeChange']);

// 响应式数据
const isPlaying = ref(props.autoPlay);
const isMinimized = ref(false);
const showPlaylist = ref(false);
const volume = ref(props.initialVolume);
const bgm = ref(null);
const progressPercent = ref(0);
const currentTime = ref(0);
const duration = ref(0);
const isShuffle = ref(false);
const repeatMode = ref('all'); // 'all', 'one', 'none'
const showVolumeControl = ref(false);
const shuffledOrder = ref([]);
const currentShuffledIndex = ref(0);

// 音乐库
const musicLibrary = ref([
  {
    title: 'aLIEz',
    artist: '泽野弘之',
    url: '/asset/alize.mp3',
    cover: '/asset/alize.webp'
  },
  {
    title: 'one last kiss',
    artist: '翻唱',
    url: '/asset/one last kiss.mp3',
    cover: '/asset/olk.webp'
  },
  {
    title: '恋爱サーキュレーション',
    artist: '花澤香菜',
    url: '/asset/恋爱循环.mp3',
    cover: '/asset/恋爱循环.webp'
  },
  {
    title: '青鸟',
    artist: '生物股长',
    url: '/asset/いきものがかり-青鸟-[ブルーバード]-.mp3',
    cover: '/asset/青鸟.webp'
  },
  {
    title: '千本樱',
    artist: '初音ミク',
    url: '/asset/千本樱.aac',
    cover: '/asset/千本樱.webp'
  }
]);


// 当前播放音乐
const currentMusic = ref(musicLibrary.value.default || {
  title: '可愛くてごめん',
  artist: 'HoneyWorks&早見沙織',
  url: '/asset/可愛くてごめん.mp3',
  cover: '/asset/这么可爱真是抱歉.webp'
});

// 计算属性
const currentTrackKey = computed(() => {
  if (!currentMusic.value?.url) return 'default';
  return Object.keys(musicLibrary.value).find(key => 
    musicLibrary.value[key]?.url === currentMusic.value.url
  ) || 'default';
});

const formattedCurrentTime = computed(() => {
  return formatTime(currentTime.value);
});

const formattedDuration = computed(() => {
  return formatTime(duration.value || 0);
});

const shouldScroll = computed(() => {
  const title = currentMusic.value?.title || '';
  return title.length > 12;
});

const titleStyle = computed(() => {
  if (!shouldScroll.value) return {};
  
  const title = currentMusic.value?.title || '';
  const textWidth = title.length * 7;
  const containerWidth = 140;
  const scrollDistance = Math.max(0, textWidth - containerWidth);
  
  return {
    '--scroll-distance': `-${scrollDistance}px`,
    '--scroll-duration': `${Math.max(4, scrollDistance / 15)}s`,
    'animation-play-state': isPlaying.value ? 'running' : 'paused'
  };
});

// 工具函数
function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' + secs : secs}`;
}

function shuffleArray(array) {
  if (!Array.isArray(array) || array.length === 0) return [];
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function getTrackNumber(key) {
  const keys = Object.keys(musicLibrary.value);
  const index = keys.indexOf(key);
  return index >= 0 ? index + 1 : '';
}

// 播放控制方法
const togglePlay = () => {
  if (!bgm.value) {
    console.warn('音频元素未初始化');
    return;
  }
  
  try {
    if (isPlaying.value) {
      bgm.value.pause();
      emit('pause');
    } else {
      bgm.value.play().then(() => {
        emit('play');
      }).catch(e => {
        console.error('播放失败:', e);
        alert('播放失败，请点击播放器任意位置后重试（浏览器限制自动播放）');
        isPlaying.value = false;
      });
    }
    isPlaying.value = !isPlaying.value;
  } catch (e) {
    console.error('播放逻辑错误:', e);
    isPlaying.value = false;
  }
};

const prevTrack = () => {
  const musicKeys = Object.keys(musicLibrary.value);
  if (musicKeys.length === 0) return;
  
  if (isShuffle.value && shuffledOrder.value.length) {
    currentShuffledIndex.value = 
      (currentShuffledIndex.value - 1 + shuffledOrder.value.length) % shuffledOrder.value.length;
    selectTrack(shuffledOrder.value[currentShuffledIndex.value] || musicKeys[0]);
  } else {
    const currentIndex = musicKeys.indexOf(currentTrackKey.value);
    const prevIndex = (currentIndex - 1 + musicKeys.length) % musicKeys.length;
    selectTrack(musicKeys[prevIndex]);
  }
};

const nextTrack = () => {
  const musicKeys = Object.keys(musicLibrary.value);
  if (musicKeys.length === 0) return;
  
  if (isShuffle.value && shuffledOrder.value.length) {
    currentShuffledIndex.value = (currentShuffledIndex.value + 1) % shuffledOrder.value.length;
    selectTrack(shuffledOrder.value[currentShuffledIndex.value] || musicKeys[0]);
  } else {
    const currentIndex = musicKeys.indexOf(currentTrackKey.value);
    const nextIndex = (currentIndex + 1) % musicKeys.length;
    selectTrack(musicKeys[nextIndex]);
  }
};

const selectTrack = (trackKey) => {
  if (!trackKey || !musicLibrary.value[trackKey]) {
    console.warn('无效的歌曲key:', trackKey);
    return;
  }
  
  const targetMusic = musicLibrary.value[trackKey];
  if (!targetMusic?.url) {
    console.warn('歌曲URL无效:', targetMusic);
    return;
  }
  
  const previousTrack = currentTrackKey.value;
  currentMusic.value = targetMusic;
  
  if (bgm.value) {
    try {
      bgm.value.pause();
      nextTick(() => {
        bgm.value.src = targetMusic.url;
        bgm.value.load();
        
        if (isPlaying.value) {
          bgm.value.play().catch(e => {
            console.error('切换歌曲播放失败:', e);
            isPlaying.value = false;
          });
        }
      });
    } catch (e) {
      console.error('切换歌曲逻辑错误:', e);
    }
  }
  
  if (isShuffle.value && shuffledOrder.value.length) {
    currentShuffledIndex.value = shuffledOrder.value.indexOf(trackKey);
  }
  
  emit('trackChange', { 
    previous: previousTrack, 
    current: trackKey,
    track: targetMusic
  });
};

// 音量控制
const adjustVolume = () => {
  const clampedVolume = Math.max(0, Math.min(100, volume.value));
  volume.value = clampedVolume;
  
  if (bgm.value) {
    bgm.value.volume = clampedVolume / 100;
  }
  emit('volumeChange', clampedVolume);
};

// 错误处理
const handleAudioError = (error) => {
  console.error('音频播放错误:', error);
  
  
  const defaultMusic = musicLibrary.value.default;
  if (defaultMusic && currentMusic.value.url !== defaultMusic.url) {
    currentMusic.value = defaultMusic;
    if (bgm.value) {
      bgm.value.src = defaultMusic.url;
      bgm.value.load();
      
      if (isPlaying.value) {
        bgm.value.play().catch(e => console.error('默认音乐播放失败:', e));
      }
    }
  }
};

const handleTrackEnd = () => {
  if (!bgm.value) return;
  
  try {
    if (repeatMode.value === 'one') {
      bgm.value.currentTime = 0;
      bgm.value.play().catch(e => console.error('单曲循环失败:', e));
    } else if (repeatMode.value === 'all' || isShuffle.value) {
      nextTrack();
    }
  } catch (e) {
    console.error('歌曲结束处理错误:', e);
  }
};

// 界面控制
const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value;
  if (showPlaylist.value) {
    showPlaylist.value = false;
  }
  if (showVolumeControl.value) {
    showVolumeControl.value = false;
  }
};

const toggleShuffle = () => {
  isShuffle.value = !isShuffle.value;
  
  if (isShuffle.value) {
    const musicKeys = Object.keys(musicLibrary.value);
    shuffledOrder.value = shuffleArray(musicKeys);
    currentShuffledIndex.value = shuffledOrder.value.indexOf(currentTrackKey.value);
  }
};

const toggleRepeat = () => {
  const modes = ['all', 'one', 'none'];
  const currentIndex = modes.indexOf(repeatMode.value);
  repeatMode.value = modes[(currentIndex + 1) % modes.length];
};

const toggleVolumeControl = (e) => {
  e.stopPropagation();
  showVolumeControl.value = !showVolumeControl.value;
};

const togglePlaylist = (e) => {
  e.stopPropagation();
  showPlaylist.value = !showPlaylist.value;
};

// 进度更新
const updateProgress = () => {
  if (!bgm.value) return;
  
  try {
    const currentTimeVal = bgm.value.currentTime;
    const durationVal = bgm.value.duration || 0;
    
    if (currentTimeVal >= 0 && durationVal > 0) {
      currentTime.value = currentTimeVal;
      progressPercent.value = Math.min(100, Math.max(0, (currentTimeVal / durationVal) * 100));
    }
  } catch (e) {
    console.error('进度更新错误:', e);
  }
};

const updateDuration = () => {
  if (bgm.value) {
    duration.value = bgm.value.duration || 0;
  }
};

const seek = (e) => {
  if (!bgm.value || !duration.value) return;
  
  try {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    bgm.value.currentTime = pos * duration.value;
  } catch (e) {
    console.error('进度拖动错误:', e);
  }
};

// 点击外部关闭
const handleClickOutside = (e) => {
  const player = document.querySelector('.music-player');
  const volumeControl = document.querySelector('.volume-control');
  const playlist = document.querySelector('.music-playlist');
  const playlistBtn = document.querySelector('.playlist-btn');
  
  if (player && !player.contains(e.target)) {
    if (showVolumeControl.value && volumeControl && !volumeControl.contains(e.target)) {
      showVolumeControl.value = false;
    }
    
    if (showPlaylist.value && playlist && !playlist.contains(e.target) && 
        (!playlistBtn || !playlistBtn.contains(e.target))) {
      showPlaylist.value = false;
    }
  }
};

// 对外暴露方法
const play = () => {
  if (bgm.value && !isPlaying.value) {
    togglePlay();
  }
};

const pause = () => {
  if (bgm.value && isPlaying.value) {
    togglePlay();
  }
};

const setVolume = (newVolume) => {
  volume.value = newVolume;
  adjustVolume();
};

const changeTrack = (trackKey) => {
  if (trackKey && musicLibrary.value[trackKey]) {
    selectTrack(trackKey);
  }
};

// 监听器
watch(volume, (newVolume) => {
  adjustVolume();
}, { immediate: true });

watch(currentMusic, () => {
  currentTime.value = 0;
  progressPercent.value = 0;
}, { immediate: true });

// 生命周期
onMounted(() => {
  shuffledOrder.value = shuffleArray(Object.keys(musicLibrary.value));
  document.addEventListener('click', handleClickOutside, true);
  
  setTimeout(() => {
    if (bgm.value) {
      adjustVolume();
      
      if (props.autoPlay) {
        const triggerAutoPlay = () => {
          if (!isPlaying.value) {
            togglePlay();
          }
          document.removeEventListener('click', triggerAutoPlay);
        };
        document.addEventListener('click', triggerAutoPlay, { once: true });
      }
    }
  }, 500);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, true);
  
  if (bgm.value) {
    bgm.value.pause();
    bgm.value.src = '';
  }
});

// 暴露方法给父组件
defineExpose({
  play,
  pause,
  setVolume,
  changeTrack,
  nextTrack,
  prevTrack
});
</script>

<style scoped>
:root {
  --primary-color: #6366f1;
  --accent-color: #f43f5e;
  --dark-bg: #1e1b4b;
  --light-bg: #2e2b5f;
  --text-primary: #ffffff;
  --text-secondary: #cbd5e1;
  --border-color: rgba(255, 255, 255, 0.15);
  --shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
  --transition: all 0.2s ease;
}



.music-player {
  position: fixed;
  bottom: 15px;
  left: 15px;
  background: var(--dark-bg);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  padding: 12px;
  width: 280px;
  z-index: 9999;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow);
  color: var(--text-primary);
  font-family: 'Segoe UI', system-ui, sans-serif;
  display: block;
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.music-player:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
}

.music-player.minimized {
  width: 240px;
  padding: 8px 12px;
}

/* 头部样式 */
.music-player-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  cursor: pointer;
  padding: 4px 0;
}

.music-info {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.music-album-container {
  position: relative;
  margin-right: 10px;
  flex-shrink: 0;
}

.music-album {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
  box-shadow: 0 2px 10px rgba(99, 102, 241, 0.3);
  background-size: cover;
  background-position: center;
  position: relative;
  z-index: 2;
}

.album-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(99, 102, 241, 0) 70%);
  z-index: 1;
}

.spinning {
  animation: rotate 15s linear infinite;
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.music-details {
  flex: 1;
  min-width: 0;
}

.music-title-container {
  position: relative;
  width: 140px;
  height: 22px;
  overflow: hidden;
  line-height: 22px;
}

.music-title {
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  color: var(--text-primary);
}

.music-title.scrolling {
  animation: scrollText var(--scroll-duration, 5s) linear infinite alternate;
}

@keyframes scrollText {
  0% { transform: translateX(0); }
  10% { transform: translateX(0); }
  90% { transform: translateX(var(--scroll-distance, -50px)); }
  100% { transform: translateX(var(--scroll-distance, -50px)); }
}

.music-artist {
  font-size: 0.75rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.minimize-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  transition: var(--transition);
  flex-shrink: 0;
}

.minimize-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: var(--text-primary);
}

.minimize-btn i {
  font-size: 0.8rem;
}

/* 控制区样式 */
.music-player-controls {
  border-top: 1px solid var(--border-color);
  padding-top: 10px;
  display: block;
  min-height: 120px;
}

/* 进度条样式 */
.progress-container {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
}

.time {
  font-size: 0.7rem;
  color: var(--text-secondary);
  width: 36px;
  text-align: center;
  flex-shrink: 0;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  position: relative;
  cursor: pointer;
  transition: var(--transition);
}

.progress-bar:hover {
  height: 6px;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  border-radius: 2px;
  transition: width 0.1s linear;
}

.progress-handle {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: var(--transition);
}

.progress-bar:hover .progress-handle {
  opacity: 1;
}

/* 控制按钮样式 */
.music-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.music-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  position: relative;
}

.music-btn i {
  font-size: 0.9rem;
}

.music-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.music-btn.active {
  background: rgba(99, 102, 241, 0.3);
  color: var(--primary-color);
}

.shuffle-btn, .repeat-btn {
  width: 28px;
  height: 28px;
}

.prev-btn, .next-btn {
  width: 34px;
  height: 34px;
}

.play-pause {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
  color: white;
  box-shadow: 0 2px 10px rgba(244, 63, 94, 0.3);
  opacity: 1;
}

.play-pause:hover {
  transform: scale(1.05);
  box-shadow: 0 3px 12px rgba(244, 63, 94, 0.4);
}

.repeat-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: var(--accent-color);
  color: white;
  font-size: 0.6rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 音量控制和播放列表按钮 */
.volume-and-playlist {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
}

.volume-icon-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.volume-icon-btn i {
  font-size: 0.85rem;
}

.volume-icon-btn:hover,
.volume-icon-btn.active {
  background: rgba(255, 255, 255, 0.2);
  color: var(--text-primary);
}

.volume-slider-container {
  position: absolute;
  left: 28px;
  bottom: 34px;
  background: var(--light-bg);
  padding: 8px;
  border-radius: 8px;
  box-shadow: var(--shadow);
  transform-origin: left bottom;
  transform: scale(0.8);
  opacity: 0;
  pointer-events: none;
  transition: var(--transition);
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 8px;
}

.volume-slider-container.visible {
  transform: scale(1);
  opacity: 1;
  pointer-events: auto;
}

.volume-slider {
  width: 80px;
  accent-color: var(--accent-color);
  cursor: pointer;
}

.volume-percent {
  font-size: 0.7rem;
  color: var(--text-secondary);
  min-width: 30px;
}

.playlist-controls {
  display: flex;
  justify-content: center;
}

.playlist-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: var(--text-secondary);
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
}

.playlist-btn i {
  font-size: 0.9rem;
}

.playlist-btn:hover,
.playlist-btn.active {
  background: rgba(255, 255, 255, 0.2);
  color: var(--text-primary);
}

/* 播放列表样式 */
.music-playlist {
  margin-top: 10px;
  border-top: 1px solid var(--border-color);
  padding-top: 10px;
  max-height: 220px;
  overflow-y: auto;
}

.playlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.playlist-header h4 {
  font-size: 0.85rem;
  color: var(--text-primary);
  margin: 0;
  font-weight: 600;
}

.close-playlist {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 3px;
  border-radius: 3px;
  font-size: 0.8rem;
  transition: var(--transition);
}

.close-playlist:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.1);
}

.playlist-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.playlist-item {
  display: flex;
  align-items: center;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  transition: var(--transition);
  gap: 8px;
  background: transparent;
}

.playlist-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.playlist-item.active {
  background: rgba(244, 63, 94, 0.2);
}

.playlist-album {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
}

.playlist-info {
  flex: 1;
  min-width: 0;
}

.playlist-title {
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.playlist-artist {
  font-size: 0.7rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.playlist-actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.active-indicator {
  color: var(--accent-color);
  font-size: 0.8rem;
  animation: pulse 1.5s infinite;
}

.track-number {
  font-size: 0.7rem;
  color: var(--text-secondary);
  width: 16px;
  text-align: center;
}

.empty-playlist {
  padding: 10px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.8rem;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

/* 滚动条样式 */
.music-playlist::-webkit-scrollbar {
  width: 4px;
}

.music-playlist::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
}

.music-playlist::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .music-player {
    width: calc(100% - 30px);
    left: 15px;
    right: 15px;
    bottom: 15px;
  }
  
  .music-player.minimized {
    width: calc(100% - 30px);
  }
  
  .music-title-container {
    width: 120px;
  }
}
</style>
    