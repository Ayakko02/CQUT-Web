// frontend/src/features/quiz/data/constants.js

/**
 * ============================================
 * 题库常量定义
 * ============================================
 */

/**
 * 题型枚举
 * @enum {string}
 */
export const QuestionType = {
    SINGLE: 'single',           // 单选题
    MULTIPLE: 'multiple',       // 多选题
    TRUEFALSE: 'truefalse',    // 判断题
    FILLBLANK: 'fillblank',    // 填空题
    SHORTANSWER: 'shortanswer', // 简答题
    IMAGE: 'image'              // 看图题（单选/多选的变体）
}

/**
 * 题型中文名称映射
 */
export const QuestionTypeLabels = {
    [QuestionType.SINGLE]: '单选题',
    [QuestionType.MULTIPLE]: '多选题',
    [QuestionType.TRUEFALSE]: '判断题',
    [QuestionType.FILLBLANK]: '填空题',
    [QuestionType.SHORTANSWER]: '简答题',
    [QuestionType.IMAGE]: '看图题'
}

/**
 * 难度等级枚举
 * @enum {string}
 */
export const Difficulty = {
    EASY: 'easy',               // 简单
    NORMAL: 'normal',           // 普通
    HARD: 'hard',               // 困难
    LEGENDARY: 'legendary'      // 传说
}

/**
 * 难度中文名称映射
 */
export const DifficultyLabels = {
    [Difficulty.EASY]: '简单',
    [Difficulty.NORMAL]: '普通',
    [Difficulty.HARD]: '困难',
    [Difficulty.LEGENDARY]: '传说'
}

/**
 * 难度对应的颜色
 */
export const DifficultyColors = {
    [Difficulty.EASY]: '#4cd964',      // 绿色
    [Difficulty.NORMAL]: '#5ac8fa',    // 蓝色
    [Difficulty.HARD]: '#ff9500',      // 橙色
    [Difficulty.LEGENDARY]: '#ff2d55'  // 红色
}

/**
 * 难度对应的图标
 */
export const DifficultyIcons = {
    [Difficulty.EASY]: '⭐',
    [Difficulty.NORMAL]: '⭐⭐',
    [Difficulty.HARD]: '⭐⭐⭐',
    [Difficulty.LEGENDARY]: '👑'
}

/**
 * 一级分类ID枚举
 * @enum {string}
 */
export const CategoryID = {
    GAMES: 'games',
    ANIME: 'anime',
    SEIYUU: 'seiyuu',
    ESPORTS: 'esports',
    MUSIC: 'music',
    MEMES: 'memes'
}

/**
 * 一级分类中文名称映射
 */
export const CategoryLabels = {
    [CategoryID.GAMES]: '游戏',
    [CategoryID.ANIME]: '动漫',
    [CategoryID.SEIYUU]: '声优',
    [CategoryID.ESPORTS]: '电子竞技',
    [CategoryID.MUSIC]: '音乐',
    [CategoryID.MEMES]: '梗百科'
}

/**
 * 答题模式枚举
 */
export const QuizMode = {
    NORMAL: 'normal',       // 普通模式
    CHALLENGE: 'challenge', // 挑战模式
    RANDOM: 'random',       // 随机模式
    LEGENDARY: 'legendary'  // 传说模式（只有传说题）
}

/**
 * 答题模式中文名称
 */
export const QuizModeLabels = {
    [QuizMode.NORMAL]: '普通模式',
    [QuizMode.CHALLENGE]: '挑战模式',
    [QuizMode.RANDOM]: '随机模式',
    [QuizMode.LEGENDARY]: '传说模式'
}

/**
 * 评分等级
 */
export const ScoreRank = {
    S: 's',
    A: 'a',
    B: 'b',
    C: 'c',
    D: 'd'
}

/**
 * 评分等级对应的称号
 */
export const ScoreRankTitles = {
    [ScoreRank.S]: 'ACGN大师',
    [ScoreRank.A]: '资深宅人',
    [ScoreRank.B]: '入门爱好者',
    [ScoreRank.C]: '萌新',
    [ScoreRank.D]: '路人甲'
}

/**
 * 评分等级对应的颜色
 */
export const ScoreRankColors = {
    [ScoreRank.S]: '#ff2d55',
    [ScoreRank.A]: '#ff9500',
    [ScoreRank.B]: '#5ac8fa',
    [ScoreRank.C]: '#4cd964',
    [ScoreRank.D]: '#8e8e93'
}

/**
 * 本地存储键名
 */
export const STORAGE_KEYS = {
    USER_STATS: 'quiz_user_stats',           // 用户统计数据
    USER_CONFIG: 'quiz_user_config',         // 用户配置
    QUIZ_HISTORY: 'quiz_history',            // 答题历史
    FAVORITE_QUESTIONS: 'favorite_questions', // 收藏的题目
    LAST_CATEGORY: 'last_category'           // 上次选择的分类
}

/**
 * 动画时长配置（毫秒）
 */
export const ANIMATION_DURATION = {
    SHORT: 200,
    NORMAL: 300,
    LONG: 500,
    CARD_FLIP: 600,
    CATEGORY_TRANSITION: 800,
    LOADING: 1500
}

/**
 * 弹幕配置
 */
export const DANMAKU_CONFIG = {
    MAX_DANMAKU: 50,           // 最大弹幕数量
    SPEED_MIN: 3,              // 最小速度（秒）
    SPEED_MAX: 8,              // 最大速度（秒）
    FONT_SIZE_MIN: 16,         // 最小字号
    FONT_SIZE_MAX: 24,         // 最大字号
    VERTICAL_SPACING: 40,      // 垂直间距
    COLORS: [                  // 弹幕颜色
        '#ff6b9d',
        '#c44569',
        '#f8b500',
        '#5ac8fa',
        '#4cd964',
        '#a29bfe',
        '#fd79a8'
    ]
}

/**
 * Combo等级配置
 */
export const COMBO_LEVELS = {
    3: { text: '3 Combo!', emoji: '🔥' },
    5: { text: '真爱粉认证!', emoji: '💖' },
    10: { text: '大神降临!', emoji: '👑' },
    15: { text: '无敌了!', emoji: '⚡' },
    20: { text: '传说中的存在!', emoji: '🌟' }
}

/**
 * Combo系统配置
 */
export const COMBO_CONFIG = {
    thresholds: {
        3: '3 Combo! 🔥',
        5: '真爱粉认证! 💖',
        10: '大神降临! 👑',
        15: '无敌了! ⚡',
        20: '传说中的存在! 🌟'
    },
    levels: COMBO_LEVELS,
    display: {
        duration: 2000,
        animationDuration: 500
    }
}

/**
 * 音效文件路径
 */
export const SOUND_EFFECTS = {
    CLICK: '/assets/sounds/click.mp3',
    CORRECT: '/assets/sounds/correct.mp3',
    WRONG: '/assets/sounds/wrong.mp3',
    COMBO: '/assets/sounds/combo.mp3',
    LEGENDARY: '/assets/sounds/legendary.mp3',
    COMPLETE: '/assets/sounds/complete.mp3'
}

/**
 * 默认配置
 */
export const DEFAULT_CONFIG = {
    QUESTIONS_PER_QUIZ: 10,
    TIME_LIMIT: 300,
    SHOW_ANSWER: true,
    SHOW_TRIVIA: true,
    ENABLE_SOUND: true,
    ENABLE_DANMAKU: true,
    AUTO_NEXT: false,
    SHUFFLE_QUESTIONS: true,
    SHUFFLE_OPTIONS: true,

    // 动画配置
    animations: {
        loadingDuration: 1500,
        transitionDuration: 300,
        cardFlipDuration: 600,
        categoryTransition: 800,
        comboDisplayDuration: 2000
    },

    // Combo配置
    combo: {
        thresholds: {
            3: '3 Combo! 🔥',
            5: '真爱粉认证! 💖',
            10: '大神降临! 👑',
            15: '无敌了! ⚡',
            20: '传说中的存在! 🌟'
        },
        levels: COMBO_LEVELS,
        display: {
            duration: 2000,
            animationDuration: 500
        }
    }
}

/**
 * 导出所有常量
 */
export default {
    QuestionType,
    QuestionTypeLabels,
    Difficulty,
    DifficultyLabels,
    DifficultyColors,
    DifficultyIcons,
    CategoryID,
    CategoryLabels,
    QuizMode,
    QuizModeLabels,
    ScoreRank,
    ScoreRankTitles,
    ScoreRankColors,
    DEFAULT_CONFIG,
    STORAGE_KEYS,
    ANIMATION_DURATION,
    DANMAKU_CONFIG,
    COMBO_LEVELS,
    COMBO_CONFIG,
    SOUND_EFFECTS
}