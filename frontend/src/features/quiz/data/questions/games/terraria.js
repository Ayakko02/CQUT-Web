// frontend/src/features/quiz/data/questions/games/terraria.js

import { QuestionType, Difficulty } from '../../constants'

/**
 * ============================================
 * 泰拉瑞亚 (Terraria) 题库
 * ============================================
 * 共 25 题
 * 包含原版和灾厄MOD内容
 */

export default [
    {
        id: 'terraria_001',
        category: '泰拉瑞亚',
        question: '泰拉瑞亚中,玩家出生时的初始生命值是多少?',
        type: QuestionType.FILLBLANK,
        answer: '100',
        explanation: '玩家初始生命值为100点,可以通过生命水晶提升至400,再用生命果提升至500',
        difficulty: Difficulty.EASY,
        acceptableAnswers: ['100', '100点'],
        tags: ['基础知识', '生命值', '数值']
    },

    {
        id: 'terraria_002',
        category: '泰拉瑞亚',
        question: '以下哪个Boss不是机械三王?',
        type: QuestionType.SINGLE,
        options: [
            { key: 'A', value: '机械骷髅王' },
            { key: 'B', value: '双子魔眼' },
            { key: 'C', value: '毁灭者' },
            { key: 'D', value: '机械蠕虫' }
        ],
        answer: 'D',
        explanation: '机械三王是指毁灭者、双子魔眼和机械骷髅王,没有机械蠕虫这个Boss',
        difficulty: Difficulty.EASY,
        trivia: '击败机械三王后世界会进入困难模式后期!',
        tags: ['Boss', '机械三王', '困难模式']
    },

    {
        id: 'terraria_003',
        category: '泰拉瑞亚',
        question: '向导的名字叫什么?',
        type: QuestionType.FILLBLANK,
        answer: 'Andrew',
        explanation: '向导(Guide)的默认名字是Andrew,他是游戏中最重要的NPC之一',
        difficulty: Difficulty.NORMAL,
        acceptableAnswers: ['Andrew', '安德鲁'],
        trivia: '向导可以告诉你合成配方,但也是召唤血肉墙的祭品!',
        tags: ['NPC', '向导', '名字']
    },

    {
        id: 'terraria_004',
        category: '泰拉瑞亚',
        question: '泰拉刃需要哪些剑来合成?',
        type: QuestionType.SHORTANSWER,
        answer: '真永夜刃和真神圣之刃',
        explanation: '泰拉刃由永夜刃和神圣之刃在山铜砧或精金砧处合成',
        difficulty: Difficulty.NORMAL,
        acceptableAnswers: ['永夜刃神圣之刃', '永夜刃和神圣之刃', '神圣之刃永夜刃'],
        trivia: '泰拉刃是游戏中最经典的武器之一!',
        tags: ['武器', '合成', '泰拉刃']
    },

    {
        id: 'terraria_005',
        category: '泰拉瑞亚',
        question: '召唤血肉墙需要在哪里进行?',
        type: QuestionType.SINGLE,
        options: [
            { key: 'A', value: '地狱' },
            { key: 'B', value: '地牢' },
            { key: 'C', value: '神庙' },
            { key: 'D', value: '地下丛林' }
        ],
        answer: 'A',
        explanation: '血肉墙必须在地狱层通过将向导巫毒娃娃扔进岩浆来召唤',
        difficulty: Difficulty.EASY,
        tags: ['Boss', '血肉墙', '地狱', '召唤']
    },

    {
        id: 'terraria_006',
        category: '泰拉瑞亚',
        question: '金字塔是泰拉瑞亚中的稀有建筑结构',
        type: QuestionType.TRUEFALSE,
        options: [
            { key: 'A', value: '正确' },
            { key: 'B', value: '错误' }
        ],
        answer: 'A',
        explanation: '金字塔是沙漠地表的稀有结构,内部有宝箱和飞毯',
        difficulty: Difficulty.NORMAL,
        trivia: '金字塔只在沙漠生成,概率很低!',
        tags: ['建筑', '金字塔', '沙漠', '稀有']
    },

    {
        id: 'terraria_007',
        category: '泰拉瑞亚',
        question: '渔夫给的任务每天可以完成几次?',
        type: QuestionType.FILLBLANK,
        answer: '1',
        explanation: '渔夫的任务每个游戏日只能完成一次',
        difficulty: Difficulty.EASY,
        acceptableAnswers: ['1', '一次', '1次'],
        tags: ['NPC', '渔夫', '任务', '钓鱼']
    },

    {
        id: 'terraria_008',
        category: '泰拉瑞亚',
        question: '以下哪个武器是月亮领主掉落的?',
        type: QuestionType.SINGLE,
        options: [
            { key: 'A', value: '星云奥秘' },
            { key: 'B', value: '星旋机枪' },
            { key: 'C', value: '彩虹猫剑' },
            { key: 'D', value: '星云烈焰' }
        ],
        answer: 'C',
        explanation: '彩虹猫剑是月亮领主掉落',
        difficulty: Difficulty.HARD,
        tags: ['武器', '月亮领主', '掉落']
    },

    {
        id: 'terraria_009',
        category: '泰拉瑞亚',
        question: '史莱姆之王在受到伤害后会分裂出什么?',
        type: QuestionType.FILLBLANK,
        answer: '蓝史莱姆',
        explanation: '史莱姆之王在生命值降低后会持续分裂出蓝色史莱姆',
        difficulty: Difficulty.EASY,
        acceptableAnswers: ['蓝史莱姆', '蓝色史莱姆', '小史莱姆'],
        tags: ['Boss', '史莱姆之王', '机制']
    },

    {
        id: 'terraria_010',
        category: '泰拉瑞亚',
        question: '困难模式开启后,腐化/猩红会开始扩散',
        type: QuestionType.TRUEFALSE,
        options: [
            { key: 'A', value: '正确' },
            { key: 'B', value: '错误' }
        ],
        answer: 'A',
        explanation: '困难模式开启后,邪恶生物群系的扩散速度会大幅增加',
        difficulty: Difficulty.EASY,
        trivia: '记得用向日葵或圣水保护你的基地!',
        tags: ['困难模式', '腐化', '猩红', '扩散']
    },

    {
        id: 'terraria_011',
        category: '泰拉瑞亚',
        question: '世纪之花必须在什么环境下召唤?',
        type: QuestionType.SINGLE,
        options: [
            { key: 'A', value: '地下丛林' },
            { key: 'B', value: '地表丛林' },
            { key: 'C', value: '神庙内' },
            { key: 'D', value: '任何地方' }
        ],
        answer: 'A',
        explanation: '世纪之花通过破坏地下丛林的世纪之花球茎来召唤',
        difficulty: Difficulty.NORMAL,
        tags: ['Boss', '世纪之花', '丛林', '召唤']
    },

    {
        id: 'terraria_012',
        category: '泰拉瑞亚',
        question: '松露虫可以在什么环境下抓到?',
        type: QuestionType.FILLBLANK,
        answer: '发光蘑菇',
        explanation: '松露虫只能在发光蘑菇生物群系中抓到,用于召唤猪鲨公爵',
        difficulty: Difficulty.NORMAL,
        acceptableAnswers: ['发光蘑菇', '蘑菇地', '发光蘑菇群系'],
        trivia: '松露虫是召唤猪鲨公爵的必需品!',
        tags: ['钓鱼', '松露虫', '发光蘑菇', '材料']
    },

    {
        id: 'terraria_013',
        category: '泰拉瑞亚',
        question: '【灾厄MOD】至尊灾厄是灾厄MOD中的最终Boss',
        type: QuestionType.TRUEFALSE,
        options: [
            { key: 'A', value: '正确' },
            { key: 'B', value: '错误' }
        ],
        answer: 'A',
        explanation: '至尊灾厄(Supreme Calamitas)是灾厄MOD的最终Boss',
        difficulty: Difficulty.NORMAL,
        trivia: '至尊灾厄是灾厄女巫的真正形态!',
        tags: ['灾厄MOD', 'Boss', '至尊灾厄', '最终Boss']
    },

    {
        id: 'terraria_014',
        category: '泰拉瑞亚',
        question: '【灾厄MOD】荒漠灾虫是在哪个阶段可以挑战的Boss?',
        type: QuestionType.SINGLE,
        options: [
            { key: 'A', value: '困难模式前' },
            { key: 'B', value: '困难模式初期' },
            { key: 'C', value: '困难模式后期' },
            { key: 'D', value: '月后' }
        ],
        answer: 'A',
        explanation: '荒漠灾虫(Desert Scourge)是灾厄MOD中困难模式前的Boss',
        difficulty: Difficulty.NORMAL,
        tags: ['灾厄MOD', 'Boss', '荒鳄', '困难模式前']
    },

    {
        id: 'terraria_015',
        category: '泰拉瑞亚',
        question: '【灾厄MOD】硫磺海是灾厄MOD新增的生物群系',
        type: QuestionType.TRUEFALSE,
        options: [
            { key: 'A', value: '正确' },
            { key: 'B', value: '错误' }
        ],
        answer: 'A',
        explanation: '硫磺海(Sulphurous Sea)是灾厄MOD新增的海洋群系',
        difficulty: Difficulty.NORMAL,
        trivia: '硫磺海中有剧毒的硫磺海水!',
        tags: ['灾厄MOD', '生物群系', '硫磺海']
    },

    {
        id: 'terraria_016',
        category: '泰拉瑞亚',
        question: '哥布林工匠可以为装备提供什么服务?',
        type: QuestionType.FILLBLANK,
        answer: '重铸',
        explanation: '哥布林工匠可以重铸装备和武器的词缀',
        difficulty: Difficulty.EASY,
        acceptableAnswers: ['重铸', '重新铸造', '改造'],
        tags: ['NPC', '哥布林工匠', '重铸', '服务']
    },

    {
        id: 'terraria_017',
        category: '泰拉瑞亚',
        question: '以下哪个不是四柱之一?',
        type: QuestionType.SINGLE,
        options: [
            { key: 'A', value: '星云柱' },
            { key: 'B', value: '星旋柱' },
            { key: 'C', value: '日光柱' },
            { key: 'D', value: '星云柱' }
        ],
        answer: 'C',
        explanation: '四柱是星云柱、星旋柱、日曜柱和星尘柱,没有日光柱',
        difficulty: Difficulty.NORMAL,
        tags: ['四柱', '月亮事件', '终极']
    },

    {
        id: 'terraria_018',
        category: '泰拉瑞亚',
        question: '【灾厄MOD】伊卡洛斯之翼的前置材料包括什么羽毛?',
        type: QuestionType.FILLBLANK,
        answer: '神圣羽毛',
        explanation: '伊卡洛斯之翼需要神圣羽毛作为主要材料之一',
        difficulty: Difficulty.HARD,
        acceptableAnswers: ['神圣羽毛', '天使羽毛'],
        tags: ['灾厄MOD', '装备', '翅膀', '材料']
    },

    {
        id: 'terraria_019',
        category: '泰拉瑞亚',
        question: '克苏鲁之眼的第二形态会露出什么?',
        type: QuestionType.FILLBLANK,
        answer: '嘴',
        explanation: '克苏鲁之眼生命值降低后会撕开外壳,露出血盆大口',
        difficulty: Difficulty.EASY,
        acceptableAnswers: ['嘴', '嘴巴', '血口'],
        trivia: '第二形态的克苏鲁之眼会加速冲刺!',
        tags: ['Boss', '克苏鲁之眼', '形态', '机制']
    },

    {
        id: 'terraria_020',
        category: '泰拉瑞亚',
        question: '【灾厄MOD】亵渎天神是在击败什么Boss后解锁的?',
        type: QuestionType.SINGLE,
        options: [
            { key: 'A', value: '月亮领主' },
            { key: 'B', value: '丛林龙' },
            { key: 'C', value: '光之女皇' },
            { key: 'D', value: '石巨人' }
        ],
        answer: 'B',
        explanation: '亵渎天神在击败丛林龙(Yharon)后解锁',
        difficulty: Difficulty.HARD,
        tags: ['灾厄MOD', 'Boss', '亵渎天神', '丛林龙']
    },

    {
        id: 'terraria_021',
        category: '泰拉瑞亚',
        question: '蜂王可以通过破坏什么来召唤?',
        type: QuestionType.FILLBLANK,
        answer: '幼虫',
        explanation: '蜂王通过破坏地下丛林蜂巢中的幼虫来召唤',
        difficulty: Difficulty.EASY,
        acceptableAnswers: ['幼虫', '蜂王幼虫', '蜂巢幼虫'],
        tags: ['Boss', '蜂王', '召唤', '丛林']
    },

    {
        id: 'terraria_022',
        category: '泰拉瑞亚',
        question: '三叉戟是什么职业的武器?',
        type: QuestionType.SINGLE,
        options: [
            { key: 'A', value: '近战' },
            { key: 'B', value: '远程' },
            { key: 'C', value: '魔法' },
            { key: 'D', value: '召唤' }
        ],
        answer: 'A',
        explanation: '三叉戟是近战类武器,可以投掷并回收',
        difficulty: Difficulty.EASY,
        tags: ['武器', '职业', '近战', '三叉戟']
    },

    {
        id: 'terraria_023',
        category: '泰拉瑞亚',
        question: '【灾厄MOD】阿娜希塔和利维坦是同时出现的双子Boss',
        type: QuestionType.TRUEFALSE,
        options: [
            { key: 'A', value: '正确' },
            { key: 'B', value: '错误' }
        ],
        answer: 'B',
        explanation: '阿娜希塔(Anahita)和利维坦(Leviathan)不是是成对出现的水系Boss，利维坦会在后续战斗中出现',
        difficulty: Difficulty.NORMAL,
        trivia: '击败其中一个,另一个会狂暴!',
        tags: ['灾厄MOD', 'Boss', '双子', '阿娜希塔']
    },

    {
        id: 'terraria_024',
        category: '泰拉瑞亚',
        question: '猪鲨公爵只能在白天召唤',
        type: QuestionType.TRUEFALSE,
        options: [
            { key: 'A', value: '正确' },
            { key: 'B', value: '错误' }
        ],
        answer: 'B',
        explanation: '猪鲨公爵可以在任何时间召唤,但白天会进入狂暴状态',
        difficulty: Difficulty.HARD,
        trivia: '白天的猪鲨公爵伤害极高,非常难打!',
        tags: ['Boss', '猪鲨公爵', '召唤', '机制']
    },

    {
        id: 'terraria_025',
        category: '泰拉瑞亚',
        question: '【灾厄MOD】史莱姆之神是以下哪种生物?',
        type: QuestionType.SINGLE,
        options: [
            { key: 'A', value: '巨型蠕虫' },
            { key: 'B', value: '飞龙' },
            { key: 'C', value: '史莱姆' },
            { key: 'D', value: '骷髅' }
        ],
        answer: 'C',
        explanation: '史莱姆之神(The Slime God)是由两个巨型史莱姆组成的Boss',
        difficulty: Difficulty.NORMAL,
        trivia: '史莱姆之神由地狱史莱姆和黑暗史莱姆组成!',
        tags: ['灾厄MOD', 'Boss', '史莱姆之神', '史莱姆']
    }
]