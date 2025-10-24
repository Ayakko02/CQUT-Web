// frontend/src/stores/music.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMusicStore = defineStore('music', () => {
    // ============ 状态定义 ============

    // 首页当前歌单 ('zero' 或 'suhui')
    const homePlaylist = ref('zero')

    // 小程序当前歌单 (如 'anime', 'honkai-3', 'game' 等)
    const miniGamePlaylist = ref(null)

    // 当前上下文 ('home' 或 'miniGame')
    const currentContext = ref('home')

    // 小程序歌单数据映射（临时模拟，后续替换为真实数据）
    const playlistMap = ref({
        'return-to-1999': [
            { title: '重返未来:1999 主题曲2', artist: '艺术家2', file: '/audio/return-to-1999-2.mp3', cover: '/images/return-to-1999-2.png' }
        ],
        'fgo': [
            { title: 'FGO 主题曲1', artist: '艺术家3', file: '/audio/fgo-1.mp3', cover: '/images/fgo-1.png' },
            { title: 'FGO 主题曲2', artist: '艺术家4', file: '/audio/fgo-2.mp3', cover: '/images/fgo-2.png' }
        ],
        'galgame': [
            { title: 'Galgame 主题曲1', artist: '艺术家5', file: '/audio/galgame-1.mp3', cover: '/images/galgame-1.png' },
            { title: 'Galgame 主题曲2', artist: '艺术家6', file: '/audio/galgame-2.mp3', cover: '/images/galgame-2.png' }
        ],
        'honkai-3': [
            { title: 'TruE', artist: '崩坏3', duration: 0, file: '/audio/崩坏三/TruE.mp3', cover: '/images/honkai-3-1.png' },
            { title: 'Cyberangel', artist: '崩坏3', duration: 0, file: '/audio/崩坏三/Cyberangel.mp3', cover: '/images/honkai-3-1.png' },
            { title: 'Da Capo', artist: '崩坏3', duration: 0, file: '/audio/崩坏三/Da Capo.mp3', cover: '/images/honkai-3-1.png' },
            { title: 'Moon Halo', artist: '崩坏3', duration: 0, file: '/audio/崩坏三/Moon Halo.mp3', cover: '/images/honkai-3-1.png' },
            { title: 'Nightglow', artist: '崩坏3', duration: 0, file: '/audio/崩坏三/Nightglow.mp3', cover: '/images/honkai-3-1.png' },
            { title: 'Regression', artist: '崩坏3', duration: 0, file: '/audio/崩坏三/Regression.mp3', cover: '/images/honkai-3-1.png' },
            { title: 'Φ²', artist: '崩坏3', duration: 0, file: '/audio/崩坏三/Φ².mp3', cover: '/images/honkai-3-1.png' },
            { title: '崩壊世界の歌姫', artist: '崩坏3', duration: 0, file: '/audio/崩坏三/崩壊世界の歌姫.mp3', cover: '/images/honkai-3-1.png' },
            { title: 'Rubia', artist: '崩坏3', duration: 0, file: '/audio/崩坏三/Rubia.mp3', cover: '/images/honkai-3-1.png' },
            { title: 'Starfall', artist: '崩坏3', duration: 0, file: '/audio/崩坏三/Starfall.mp3', cover: '/images/honkai-3-1.png' },
        ],
        'honkai-star-rail': [
            { title: '崩坏:星穹铁道 主题曲1', artist: '艺术家9', file: '/audio/hsr-1.mp3', cover: '/images/hsr-1.png' },
            { title: '崩坏:星穹铁道 主题曲2', artist: '艺术家10', file: '/audio/hsr-2.mp3', cover: '/images/hsr-2.png' }
        ],
        'identity-v': [
            { title: '第五人格 主题曲1', artist: '艺术家11', file: '/audio/identity-v-1.mp3', cover: '/images/identity-v-1.png' },
            { title: '第五人格 主题曲2', artist: '艺术家12', file: '/audio/identity-v-2.mp3', cover: '/images/identity-v-2.png' }
        ],
        'touhou': [
            { title: '东方Project 主题曲1', artist: '艺术家13', file: '/audio/东方/のみこ - Bad Apple!!.mp3', cover: '/images/touhou-1.png' },
            { title: '东方Project 主题曲1', artist: '艺术家13', file: '/audio/东方/ばんばんしー - 秋姉妹のなく顷に.mp3', cover: '/images/touhou-1.png' },
            { title: '东方Project 主题曲1', artist: '艺术家13', file: '/audio/东方/上海アリス幻樂団 - U.N.オーエンは彼女なのか？.mp3', cover: '/images/touhou-1.png' },
            { title: '东方Project 主题曲1', artist: '艺术家13', file: '/audio/东方/上海アリス幻樂団 - 感情の摩天楼　～ Cosmic Mind.mp3', cover: '/images/touhou-1.png' },
            { title: '东方Project 主题曲1', artist: '艺术家13', file: '/audio/东方/上海アリス幻樂団 - 月まで届け、不死の煙.mp3', cover: '/images/touhou-1.png' },
            { title: '东方Project 主题曲1', artist: '艺术家13', file: '/audio/东方/上海アリス幻樂団 - 神々が恋した幻想郷.mp3', cover: '/images/touhou-1.png' },
            { title: '东方Project 主题曲1', artist: '艺术家13', file: '/audio/东方/上海アリス幻樂団 - 童祭 ～ Innocent Treasures.mp3', cover: '/images/touhou-1.png' },
            { title: '东方Project 主题曲1', artist: '艺术家13', file: '/audio/东方/幽閉サテライト - 大地に咲く旋律.mp3', cover: '/images/touhou-1.png' },
            { title: '东方Project 主题曲1', artist: '艺术家13', file: '/audio/东方/森永真由美 - 色は匂へど散りぬるを(with senya) 幻想万華鏡 春雪異変の章 OP主題歌.mp3', cover: '/images/touhou-1.png' },
            { title: '东方Project 主题曲1', artist: '艺术家13', file: '/audio/东方/黄昏フロンティア,上海アリス幻樂団 - 砕月  あきやまうに.mp3', cover: '/images/touhou-1.png' },
        ],
        'dont-starve': [
            { title: '饥荒 主题曲1', artist: '艺术家15', file: '/audio/dont-starve-1.mp3', cover: '/images/dont-starve-1.png' },
            { title: '饥荒 主题曲2', artist: '艺术家16', file: '/audio/dont-starve-2.mp3', cover: '/images/dont-starve-2.png' }
        ],
        'zzz': [
            { title: 'pinKing', artist: '艺术家17', file: '/audio/绝区零/ChiliChill,三Z-STUDIO,HOYO-MiX - pinKing.mp3', cover: '/images/zzz-1.png' },
            { title: 'FURYON 狂怒觉醒', artist: '艺术家17', file: '/audio/绝区零/三Z-STUDIO,HOYO-MiX,Alaina Cross - FURYON 狂怒觉醒.mp3', cover: '/images/zzz-1.png' },
            { title: 'Burning Desires 绝望吧台', artist: '艺术家17', file: '/audio/绝区零/Burning Desires 绝望吧台.mp3', cover: '/images/zzz-1.png' },
            { title: 'Fearless 无所畏惧', artist: '艺术家17', file: '/audio/绝区零/三Z-STUDIO,HOYO-MiX - Fearless 无所畏惧.mp3', cover: '/images/zzz-1.png' },
            { title: 'Stars Align 当群星交汇', artist: '艺术家17', file: '/audio/绝区零/三Z-STUDIO,HOYO-MiX - Stars Align 当群星交汇 (Feat.耀嘉音).mp3', cover: '/images/zzz-1.png' },
            { title: '乐园梦游计', artist: '艺术家17', file: '/audio/绝区零/三Z-STUDIO,HOYO-MiX - 乐园梦游计.mp3', cover: '/images/zzz-1.png' },
            { title: '原色', artist: '艺术家17', file: '/audio/绝区零/三Z-STUDIO,HOYO-MiX - 原色.mp3', cover: '/images/zzz-1.png' },
            { title: '晓', artist: '艺术家17', file: '/audio/绝区零/三Z-STUDIO,HOYO-MiX - 晓.mp3', cover: '/images/zzz-1.png' },
            { title: '不及', artist: '艺术家17', file: '/audio/绝区零/苏诗丁,三Z-STUDIO,HOYO-MiX - 不及.mp3', cover: '/images/zzz-1.png' },
            { title: 'BITE! 咬合力', artist: '艺术家17', file: '/audio/绝区零/雷雨心,三Z-STUDIO,HOYO-MiX - BITE! 咬合力.mp3', cover: '/images/zzz-1.png' },
        ],
        'mahjong': [
            { title: '麻将/雀魂 主题曲1', artist: '艺术家19', file: '/audio/mahjong-1.mp3', cover: '/images/mahjong-1.png' },
            { title: '麻将/雀魂 主题曲2', artist: '艺术家20', file: '/audio/mahjong-2.mp3', cover: '/images/mahjong-2.png' }
        ],
        'wuthering-waves': [
            { title: '鸣潮 主题曲1', artist: '艺术家21', file: '/audio/wuthering-waves-1.mp3', cover: '/images/wuthering-waves-1.png' },
            { title: '鸣潮 主题曲2', artist: '艺术家22', file: '/audio/wuthering-waves-2.mp3', cover: '/images/wuthering-waves-2.png' }
        ],
        'sgs': [
            { title: '三国杀 主题曲1', artist: '艺术家23', file: '/audio/sgs-1.mp3', cover: '/images/sgs-1.png' },
            { title: '三国杀 主题曲2', artist: '艺术家24', file: '/audio/sgs-2.mp3', cover: '/images/sgs-2.png' }
        ],
        'genshin': [
            { title: '原神 主题曲1', artist: '艺术家25', file: '/audio/genshin-1.mp3', cover: '/images/genshin-1.png' },
            { title: '原神 主题曲2', artist: '艺术家26', file: '/audio/genshin-2.mp3', cover: '/images/genshin-2.png' }
        ],
        'limbus': [
            { title: '月亮计划 主题曲1', artist: '艺术家27', file: '/audio/limbus-1.mp3', cover: '/images/limbus-1.png' },
            { title: '月亮计划 主题曲2', artist: '艺术家28', file: '/audio/limbus-2.mp3', cover: '/images/limbus-2.png' }
        ],
        'overwatch': [
            { title: '守望先锋 主题曲1', artist: '艺术家29', file: '/audio/overwatch-1.mp3', cover: '/images/overwatch-1.png' },
            { title: '守望先锋 主题曲2', artist: '艺术家30', file: '/audio/overwatch-2.mp3', cover: '/images/overwatch-2.png' }
        ],
        'terraria': [
            { title: 'terraria', artist: '艺术家29', file: '/audio/泰拉瑞亚/DM DOKURO,SixteenInMono - Return to Slime.mp3', cover: '/images/overwatch-1.png' },
            { title: 'terraria', artist: '艺术家29', file: '/audio/泰拉瑞亚/DM DOKURO - Guardian of the Former Seas.mp3', cover: '/images/overwatch-1.png' },
            { title: 'terraria', artist: '艺术家29', file: '/audio/泰拉瑞亚/DM DOKURO - Infestation.mp3', cover: '/images/overwatch-1.png' },
            { title: 'terraria', artist: '艺术家29', file: '/audio/泰拉瑞亚/DM DOKURO - Raw, Unfiltered Calamity.mp3', cover: '/images/overwatch-1.png' },
            { title: 'terraria', artist: '艺术家29', file: '/audio/泰拉瑞亚/DM DOKURO - Roar of the Jungle Dragon（丛林龙之怒吼）.mp3', cover: '/images/overwatch-1.png' },
            { title: 'terraria', artist: '艺术家29', file: '/audio/泰拉瑞亚/DM DOKURO - Scourge of the Universe.mp3', cover: '/images/overwatch-1.png' },
            { title: 'terraria', artist: '艺术家29', file: '/audio/泰拉瑞亚/DM DOKURO - Stained, Brutal Calamity（玷残之灾）.mp3', cover: '/images/overwatch-1.png' },
            { title: 'terraria', artist: '艺术家29', file: '/audio/泰拉瑞亚/DM DOKURO - The Leviathan Trilogy.mp3', cover: '/images/overwatch-1.png' },
            { title: 'terraria', artist: '艺术家29', file: '/audio/泰拉瑞亚/Scott Lloyd Shelly - Overworld Day.mp3', cover: '/images/overwatch-1.png' },
            { title: 'terraria', artist: '艺术家29', file: '/audio/泰拉瑞亚/We_Lived_In_Fun - 【Calamity Mod】Catastrophic Fabrications - “铸灾神械”（嘉登与星流巨械主题曲）.mp3', cover: '/images/overwatch-1.png' },
        ]
    })

    // ============ 计算属性 ============

    /**
     * 获取当前激活的歌单ID
     * 根据 currentContext 决定返回首页歌单还是小程序歌单
     */
    const getActivePlaylist = computed(() => {
        if (currentContext.value === 'home') {
            return homePlaylist.value
        } else if (currentContext.value === 'miniGame') {
            return miniGamePlaylist.value
        }
        return null
    })

    /**
     * 获取当前上下文的描述文本（用于调试）
     */
    const getContextInfo = computed(() => {
        return {
            context: currentContext.value,
            activePlaylist: getActivePlaylist.value,
            homePlaylist: homePlaylist.value,
            miniGamePlaylist: miniGamePlaylist.value
        }
    })

    // ============ Actions ============

    /**
     * 切换到首页上下文
     * 调用时机：用户从小程序返回首页
     */
    const switchToHomeContext = () => {
        console.log('[MusicStore] 切换到首页上下文')
        currentContext.value = 'home'
    }

    /**
     * 切换到小程序上下文
     * 调用时机：用户导航到小程序页面
     */
    const switchToMiniGameContext = () => {
        console.log('[MusicStore] 切换到小程序上下文')
        currentContext.value = 'miniGame'
    }

    /**
     * 更新首页歌单
     * @param {string} playlist - 歌单ID ('zero' 或 'suhui')
     */
    const updateHomePlaylist = (playlist) => {
        console.log(`[MusicStore] 首页歌单切换: ${homePlaylist.value} -> ${playlist}`)
        homePlaylist.value = playlist
    }

    /**
     * 更新小程序歌单
     * 调用时机：用户点击"确认选择"按钮
     * @param {string} playlist - 歌单ID (如 'anime', 'honkai-3' 等)
     */
    const updateMiniGamePlaylist = (playlist) => {
        console.log(`[MusicStore] 小程序歌单切换: ${miniGamePlaylist.value} -> ${playlist}`)
        miniGamePlaylist.value = playlist

        // 可选：在这里触发全局事件，通知 MusicPlayer 进行切换
        // emit('miniGamePlaylistChanged', playlist)
    }

    /**
     * 获取小程序歌单的歌曲列表
     * @param {string} playlistId - 歌单ID
     * @returns {Array} 歌曲列表
     */
    const getMiniGamePlaylistSongs = (playlistId) => {
        return playlistMap.value[playlistId] || []
    }

    // ============ 导出 ============
    return {
        // 状态
        homePlaylist,
        miniGamePlaylist,
        currentContext,
        playlistMap,

        // 计算属性
        getActivePlaylist,
        getContextInfo,

        // 方法
        switchToHomeContext,
        switchToMiniGameContext,
        updateHomePlaylist,
        updateMiniGamePlaylist,
        getMiniGamePlaylistSongs
    }
})