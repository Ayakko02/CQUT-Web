// frontend/src/features/quiz/data/categories.js

/**
 * ============================================
 * 题库分类配置
 * ============================================
 */

/**
 * 一级分类配置
 */
export const primaryCategories = {
    '游戏': {
        id: 'games',
        name: '游戏',
        icon: '🎮',
        color: '#667eea',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        description: 'ACGN游戏知识大挑战',
        keywords: ['二游', '手游', '端游', 'gal', '独立游戏']
    },

    '动漫': {
        id: 'anime',
        name: '动漫',
        icon: '📺',
        color: '#ff6b9d',
        gradient: 'linear-gradient(135deg, #ff6b9d 0%, #f9748f 100%)',
        description: '番剧动画知识问答',
        keywords: ['番剧', 'TV动画', '剧场版', 'OVA']
    },

    '声优': {
        id: 'seiyuu',
        name: '声优',
        icon: '🎤',
        color: '#fbc2eb',
        gradient: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
        description: '声优配音知识大全',
        keywords: ['CV', '配音', '声优梗', '角色识别']
    },

    '电子竞技': {
        id: 'esports',
        name: '电子竞技',
        icon: '🏆',
        color: '#fa709a',
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        description: '电竞赛事与选手知识',
        keywords: ['LOL', 'DOTA', 'CSGO', '职业选手', '赛事']
    },

    '音乐': {
        id: 'music',
        name: '音乐',
        icon: '🎵',
        color: '#f093fb',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        description: 'OP/ED、Vocaloid、声优歌',
        keywords: ['OP', 'ED', 'OST', 'Vocaloid', 'BGM']
    },

    '梗百科': {
        id: 'memes',
        name: '梗百科',
        icon: '😂',
        color: '#84fab0',
        gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
        description: 'ACGN文化梗大全',
        keywords: ['梗', '黑话', '流行语', '亚文化']
    }
}

/**
 * 二级分类配置 - 游戏类
 */
export const gameSubcategories = {
    '重返未来:1999': {
        id: '1999',
        name: '重返未来:1999',
        icon: '⏰',
        emoji: '🎭',
        color: '#c44569',
        tags: ['回合制', 'RPG', '剧情向']
    },

    'FGO': {
        id: 'fgo',
        name: 'FGO',
        icon: '⚔️',
        emoji: '👑',
        color: '#5f27cd',
        tags: ['卡牌', 'RPG', '型月']
    },

    'Galgame': {
        id: 'galgame',
        name: 'Galgame',
        icon: '💕',
        emoji: '💖',
        color: '#ff6b9d',
        tags: ['AVG', '恋爱', '剧情']
    },

    '崩坏3': {
        id: 'bh3',
        name: '崩坏3',
        icon: '⚡',
        emoji: '🦋',
        color: '#a29bfe',
        tags: ['动作', 'ARPG', '米哈游']
    },

    '崩坏:星穹铁道': {
        id: 'hsr',
        name: '崩坏:星穹铁道',
        icon: '🚂',
        emoji: '⭐',
        color: '#fdcb6e',
        tags: ['回合制', 'RPG', '米哈游']
    },

    '第五人格': {
        id: 'identity-v',
        name: '第五人格',
        icon: '🎪',
        emoji: '🔍',
        color: '#2d3436',
        tags: ['非对称竞技', '多人', '恐怖']
    },

    '东方Project': {
        id: 'touhou',
        name: '东方Project',
        icon: '🌸',
        emoji: '🎵',
        color: '#e17055',
        tags: ['STG', '弹幕', '同人']
    },

    '饥荒': {
        id: 'dont-starve',
        name: '饥荒',
        icon: '🍖',
        emoji: '🔥',
        color: '#6c5ce7',
        tags: ['生存', '沙盒', '独立游戏']
    },

    '绝区零': {
        id: 'zzz',
        name: '绝区零',
        icon: '🌆',
        emoji: '📺',
        color: '#00b894',
        tags: ['动作', 'ARPG', '米哈游']
    },

    '麻将/雀魂': {
        id: 'mahjong',
        name: '麻将/雀魂',
        icon: '🀄',
        emoji: '🎴',
        color: '#d63031',
        tags: ['桌游', '策略', '竞技']
    },

    '鸣潮': {
        id: 'wuthering-waves',
        name: '鸣潮',
        icon: '🌊',
        emoji: '🎵',
        color: '#0984e3',
        tags: ['动作', 'RPG', '库洛游戏']
    },

    '三国杀': {
        id: 'sgs',
        name: '三国杀',
        icon: '🗡️',
        emoji: '🐉',
        color: '#fab1a0',
        tags: ['卡牌', '策略', '桌游']
    },

    '原神': {
        id: 'genshin',
        name: '原神',
        icon: '🗺️',
        emoji: '⚔️',
        color: '#74b9ff',
        tags: ['开放世界', 'ARPG', '米哈游']
    },

    '月亮计划': {
        id: 'limbus',
        name: '月亮计划',
        icon: '🌙',
        emoji: '🦋',
        color: '#636e72',
        tags: ['独立游戏', '剧情向', '艺术']
    }
}

/**
 * 二级分类配置 - 动漫类
 */
export const animeSubcategories = {
    '全部': {
        id: 'all',
        name: '全部',
        icon: '📺',
        emoji: '🎬',
        color: '#ff6b9d',
        tags: ['TV动画', '剧场版', 'OVA']
    }
}

/**
 * 二级分类配置 - 声优类
 */
export const seiyuuSubcategories = {
    '男声优': {
        id: 'male',
        name: '男声优',
        icon: '👨',
        emoji: '🎤',
        color: '#74b9ff',
        tags: ['男CV', '配音']
    },

    '女声优': {
        id: 'female',
        name: '女声优',
        icon: '👩',
        emoji: '🎤',
        color: '#fd79a8',
        tags: ['女CV', '配音']
    },

    '声优梗': {
        id: 'memes',
        name: '声优梗',
        icon: '😂',
        emoji: '💬',
        color: '#fdcb6e',
        tags: ['梗', '趣闻', '黑话']
    },

    '配音作品': {
        id: 'works',
        name: '配音作品',
        icon: '🎬',
        emoji: '🎭',
        color: '#a29bfe',
        tags: ['角色', '作品']
    }
}

/**
 * 二级分类配置 - 电竞类
 */
export const esportsSubcategories = {
    'LOL(英雄联盟)': {
        id: 'lol',
        name: 'LOL',
        icon: '🏆',
        emoji: '⚔️',
        color: '#0984e3',
        tags: ['MOBA', 'Riot', 'S赛']
    },

    'DOTA2': {
        id: 'dota2',
        name: 'DOTA2',
        icon: '🛡️',
        emoji: '⚡',
        color: '#d63031',
        tags: ['MOBA', 'Valve', 'TI']
    },

    'CSGO/CS2': {
        id: 'csgo',
        name: 'CSGO/CS2',
        icon: '🔫',
        emoji: '💥',
        color: '#fdcb6e',
        tags: ['FPS', 'Valve', 'Major']
    },

    '王者荣耀': {
        id: 'mobile-moba',
        name: '王者荣耀',
        icon: '👑',
        emoji: '🎮',
        color: '#e17055',
        tags: ['MOBA', '手游', 'KPL']
    },

    '和平精英': {
        id: 'mobile-fps',
        name: '和平精英',
        icon: '🎯',
        emoji: '🔫',
        color: '#00b894',
        tags: ['FPS', '手游', '大逃杀']
    },

    '电竞赛事': {
        id: 'tournaments',
        name: '电竞赛事',
        icon: '🏅',
        emoji: '🏆',
        color: '#fdcb6e',
        tags: ['赛事', '锦标赛', '世界赛']
    },

    '职业选手': {
        id: 'players',
        name: '职业选手',
        icon: '🎮',
        emoji: '⭐',
        color: '#a29bfe',
        tags: ['选手', '战队', '传奇']
    }
}

/**
 * 二级分类配置 - 音乐类
 */
export const musicSubcategories = {
    'OP/ED': {
        id: 'oped',
        name: 'OP/ED',
        icon: '🎵',
        emoji: '🎬',
        color: '#ff6b9d',
        tags: ['片头曲', '片尾曲', '主题歌']
    },

    'Vocaloid': {
        id: 'vocaloid',
        name: 'Vocaloid',
        icon: '🎤',
        emoji: '🎹',
        color: '#74b9ff',
        tags: ['初音未来', 'V家', '虚拟歌手']
    },

    '声优歌手': {
        id: 'seiyuu-singer',
        name: '声优歌手',
        icon: '🎙️',
        emoji: '⭐',
        color: '#a29bfe',
        tags: ['声优', '歌手', '角色歌']
    },

    '动漫OST': {
        id: 'ost',
        name: '动漫OST',
        icon: '🎼',
        emoji: '🎧',
        color: '#fdcb6e',
        tags: ['原声', 'BGM', '配乐']
    }
}

/**
 * 二级分类配置 - 梗百科类
 */
export const memesSubcategories = {
    '游戏梗': {
        id: 'game-memes',
        name: '游戏梗',
        icon: '🎮',
        emoji: '😂',
        color: '#667eea',
        tags: ['游戏', '梗', '黑话']
    },

    '动漫梗': {
        id: 'anime-memes',
        name: '动漫梗',
        icon: '📺',
        emoji: '😂',
        color: '#ff6b9d',
        tags: ['动漫', '梗', '名场面']
    },

    '网络流行语': {
        id: 'internet-slang',
        name: '网络流行语',
        icon: '💬',
        emoji: '🌐',
        color: '#84fab0',
        tags: ['网络', '流行语', '黑话']
    },

    'ACGN黑话': {
        id: 'acgn-slang',
        name: 'ACGN黑话',
        icon: '🗣️',
        emoji: '🎭',
        color: '#f093fb',
        tags: ['黑话', '术语', '亚文化']
    }
}

/**
 * 获取所有二级分类配置
 */
export const allSubcategories = {
    games: gameSubcategories,
    anime: animeSubcategories,
    seiyuu: seiyuuSubcategories,
    esports: esportsSubcategories,
    music: musicSubcategories,
    memes: memesSubcategories
}

/**
 * 根据一级分类ID获取二级分类
 * @param {string} categoryId - 一级分类ID
 * @returns {Object} 二级分类配置对象
 */
export function getSubcategoriesByCategoryId(categoryId) {
    return allSubcategories[categoryId] || {}
}

/**
 * 根据一级分类名称获取配置
 * @param {string} categoryName - 一级分类名称
 * @returns {Object} 分类配置对象
 */
export function getCategoryByName(categoryName) {
    return primaryCategories[categoryName] || null
}

/**
 * 根据一级分类ID获取配置
 * @param {string} categoryId - 一级分类ID
 * @returns {Object} 分类配置对象
 */
export function getCategoryById(categoryId) {
    return Object.values(primaryCategories).find(cat => cat.id === categoryId) || null
}

/**
 * 获取所有一级分类名称列表
 * @returns {Array<string>} 分类名称数组
 */
export function getAllCategoryNames() {
    return Object.keys(primaryCategories)
}

/**
 * 获取所有一级分类ID列表
 * @returns {Array<string>} 分类ID数组
 */
export function getAllCategoryIds() {
    return Object.values(primaryCategories).map(cat => cat.id)
}

/**
 * 导出默认对象
 */
export default {
    primaryCategories,
    gameSubcategories,
    animeSubcategories,
    seiyuuSubcategories,
    esportsSubcategories,
    musicSubcategories,
    memesSubcategories,
    allSubcategories,
    getSubcategoriesByCategoryId,
    getCategoryByName,
    getCategoryById,
    getAllCategoryNames,
    getAllCategoryIds
}