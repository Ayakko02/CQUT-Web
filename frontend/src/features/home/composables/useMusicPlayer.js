// # 音乐播放器逻辑

import {computed, ref} from 'vue'

let musicPlayerInstance = null

// 歌单数据
const playlists = {
    zero: [
        { title: "サターン", artist: "ずっと真夜中でいいのに。", duration: 245, file: "/audio/サターン (土星).mp3", cover: "/images/covers/土星.png" },
        { title: "Dear Mr F", artist: "ずっと真夜中でいいのに。", duration: 198, file: "/audio/DearMrF.mp3", cover: "/images/covers/亲爱的F先生.png" },
        { title: "秒針を噛む", artist: "ずっと真夜中でいいのに。", duration: 267, file: "/audio/秒針を噛む.mp3", cover: "/images/covers/土星.png" },
        { title: "眩しいDNAだけ", artist: "ずっと真夜中でいいのに。", duration: 223, file: "/audio/眩しいDNAだけ.mp3", cover: "/images/covers/只是耀眼的DNA.png" }
    ],
    suhui: [
        { title: "花に亡霊", artist: "ヨルシカ", duration: 210, file: "/audio/花に亡霊.mp3", cover: "/images/covers/花上亡灵.png" },
        { title: "嘘月", artist: "ヨルシカ", duration: 234, file: "/audio/嘘月.mp3", cover: "/images/covers/嘘月.png" },
        { title: "思想犯", artist: "ヨルシカ", duration: 289, file: "/audio/思想犯.mp3", cover: "/images/covers/思想犯.png" },
        { title: "だから僕は音楽を辞めた", artist: "ヨルシカ", duration: 256, file: "/audio/だから僕は音楽を辞めた.mp3", cover: "/images/covers/所以我放弃了音乐.png" }
    ]
}

export function useMusicPlayer() {
    if (musicPlayerInstance) {
        return musicPlayerInstance
    }

    // 播放状态
    const isPlaying = ref(false)
    const currentTime = ref(0)
    const duration = ref(0)
    const isFirstPlay = ref(true)

    // 歌单和曲目状态
    const currentPlaylist = ref('zero')
    const currentTrackIndex = ref(0)
    const lastPlayedTrack = ref(-1)

    // UI状态
    const isPlaylistExpanded = ref(false)
    const isInitialized = ref(false)

    // 音频对象
    let audio = null

    // 计算属性
    const currentPlaylistSongs = computed(() => playlists[currentPlaylist.value] || [])

    const currentTrack = computed(() => {
        const songs = currentPlaylistSongs.value
        return songs[currentTrackIndex.value] || null
    })

    const progressPercentage = computed(() => {
        if (duration.value > 0) {
            return (currentTime.value / duration.value) * 100
        }
        return 0
    })

    // 初始化音频
    const initializeAudio = () => {
        if (audio) {
            audio.pause()
            audio = null
        }

        audio = new Audio()

        // 绑定音频事件
        audio.addEventListener('loadedmetadata', () => {
            duration.value = audio.duration
            console.log('[MusicPlayer] 音频元数据加载完成, 时长:', formatTime(duration.value))
        })

        audio.addEventListener('timeupdate', () => {
            currentTime.value = audio.currentTime
        })

        audio.addEventListener('ended', () => {
            console.log('[MusicPlayer] 播放结束，自动下一首')
            nextTrack()
        })

        audio.addEventListener('error', (e) => {
            console.error('[MusicPlayer] 音频加载失败:', e)
            nextTrack()
        })

        audio.addEventListener('canplaythrough', () => {
            console.log('[MusicPlayer] 音频缓冲完成，可以播放')
        })
    }

    // 加载当前曲目
    const loadCurrentTrack = () => {
        if (!audio || !currentTrack.value) return

        audio.src = currentTrack.value.file
        audio.load()

        // 预加载封面图片
        if (currentTrack.value.cover) {
            const img = new Image()
            img.src = currentTrack.value.cover
        }

        console.log('[MusicPlayer] 加载曲目:', currentTrack.value.title)
    }

    // 播放/暂停切换
    const togglePlay = async () => {
        console.log('[MusicPlayer] 切换播放状态, 当前:', isPlaying.value)

        // 首次播放时加载音频
        if (isFirstPlay.value) {
            loadCurrentTrack()
            isFirstPlay.value = false
        }

        if (isPlaying.value) {
            pause()
        } else {
            await play()
        }
    }

    // 播放
    const play = async () => {
        if (!audio) return

        try {
            await audio.play()
            isPlaying.value = true
            console.log('[MusicPlayer] 开始播放:', currentTrack.value?.title)
        } catch (error) {
            console.error('[MusicPlayer] 播放失败:', error)
            isPlaying.value = false
        }
    }

    // 暂停
    const pause = () => {
        if (!audio) return

        audio.pause()
        isPlaying.value = false
        console.log('[MusicPlayer] 暂停播放')
    }

    // 选择曲目
    const selectTrack = async (index) => {
        if (index < 0 || index >= currentPlaylistSongs.value.length) return

        const wasPlaying = isPlaying.value

        currentTrackIndex.value = index
        loadCurrentTrack()
        isFirstPlay.value = false

        if (wasPlaying) {
            // 等待音频加载后自动播放
            audio.addEventListener('loadeddata', async () => {
                await play()
            }, { once: true })
        }

        console.log('[MusicPlayer] 选择曲目:', currentTrack.value.title)
    }

    // 下一首
    const nextTrack = () => {
        const nextIndex = (currentTrackIndex.value + 1) % currentPlaylistSongs.value.length
        selectTrack(nextIndex)
    }

    // 上一首
    const previousTrack = () => {
        const prevIndex = currentTrackIndex.value === 0
            ? currentPlaylistSongs.value.length - 1
            : currentTrackIndex.value - 1
        selectTrack(prevIndex)
    }

    // 进度条点击跳转
    const seek = (event) => {
        if (!audio || duration.value === 0) return

        const rect = event.target.getBoundingClientRect()
        const clickX = event.clientX - rect.left
        const progress = clickX / rect.width
        const newTime = progress * duration.value

        audio.currentTime = newTime
        console.log('[MusicPlayer] 跳转到:', formatTime(newTime))
    }

    // 切换歌单展开状态
    const togglePlaylist = () => {
        isPlaylistExpanded.value = !isPlaylistExpanded.value
        console.log('[MusicPlayer] 歌单展开状态:', isPlaylistExpanded.value)
    }

    // 切换歌单
    const switchPlaylist = (newPlaylist) => {
        if (newPlaylist === currentPlaylist.value) return

        const wasPlaying = isPlaying.value

        currentPlaylist.value = newPlaylist

        // 随机选择一首歌，但不与上一首重复
        const playlistLength = currentPlaylistSongs.value.length
        let randomTrack = 0

        if (playlistLength > 1 && lastPlayedTrack.value !== -1) {
            do {
                randomTrack = Math.floor(Math.random() * playlistLength)
            } while (randomTrack === lastPlayedTrack.value)
        } else {
            randomTrack = Math.floor(Math.random() * playlistLength)
        }

        lastPlayedTrack.value = currentTrackIndex.value
        currentTrackIndex.value = randomTrack

        pause()
        loadCurrentTrack()
        isFirstPlay.value = false

        if (wasPlaying) {
            audio.addEventListener('loadeddata', async () => {
                await play()
            }, { once: true })
        }

        const themeText = newPlaylist === 'zero' ? '零域' : '溯洄'
        console.log(`[MusicPlayer] 切换到${themeText}歌单，随机播放:`, currentTrack.value.title)
    }

    // 格式化时间
    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0:00'

        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    // 设置音量
    const setVolume = (volume) => {
        if (audio) {
            audio.volume = Math.max(0, Math.min(1, volume))
            console.log('[MusicPlayer] 设置音量:', audio.volume)
        }
    }

    // 获取播放器状态
    const getPlayerState = () => {
        return {
            isPlaying: isPlaying.value,
            currentTime: currentTime.value,
            duration: duration.value,
            currentTrack: currentTrack.value,
            currentPlaylist: currentPlaylist.value,
            progress: progressPercentage.value
        }
    }

    // 初始化播放器
    const initializePlayer = () => {
        if (isInitialized.value) return

        initializeAudio()
        isInitialized.value = true

        console.log('[MusicPlayer] 播放器初始化完成')
    }

    // 清理资源
    const cleanup = () => {
        if (audio) {
            audio.pause()
            audio.src = ''
            audio = null
        }
        isInitialized.value = false
        console.log('[MusicPlayer] 资源清理完成')
    }

    // 快进/快退
    const skipTime = (seconds) => {
        if (audio && duration.value > 0) {
            audio.currentTime = Math.max(0, Math.min(duration.value, currentTime.value + seconds))
        }
    }

    // 创建单例实例
    musicPlayerInstance = {
        // 响应式状态
        isPlaying,
        currentTime,
        duration,
        progressPercentage,
        currentPlaylist,
        currentTrackIndex,
        currentTrack,
        currentPlaylistSongs,
        isPlaylistExpanded,
        isInitialized,

        // 播放控制方法
        togglePlay,
        play,
        pause,
        selectTrack,
        nextTrack,
        previousTrack,
        seek,

        // 歌单管理方法
        switchPlaylist,
        togglePlaylist,

        // 功能方法
        setVolume,
        skipTime,
        formatTime,
        getPlayerState,

        // 生命周期方法
        initializePlayer,
        cleanup,

        // 工具数据
        playlists
    }

    return musicPlayerInstance
}