// frontend/src/features/quiz/data/questions/games/overwatch.js

import { QuestionType, Difficulty } from '../../constants'

/**
 * ============================================
 * 守望先锋 (Overwatch) 题库
 * ============================================
 * 共 18 题
 */

export default [
    {
        id: 'ow_001',
        category: '守望先锋',
        question: '在5v5的模式中,重装英雄具有独特的职责被动,下列哪个不是重装职责被动?',
        type: QuestionType.SINGLE,
        options: [
            { key: 'A', value: '受到的击退效果降低' },
            { key: 'B', value: '造成伤害时会减少目标的回血效果' },
            { key: 'C', value: '被爆头时收到的伤害减少' },
            { key: 'D', value: '治疗和被治疗时获得的终极技能充能效果降低' }
        ],
        answer: 'B',
        explanation: '造成伤害减少回血是输出英雄的职责被动,不是重装的',
        difficulty: Difficulty.NORMAL,
        tags: ['重装', '职责被动', '5v5', '机制']
    },

    {
        id: 'ow_002',
        category: '守望先锋',
        question: '源氏的E技能"闪"具有强大的反弹能力,下列哪个东西不能被反弹?',
        type: QuestionType.SINGLE,
        options: [
            { key: 'A', value: '查莉亚的重力喷涌' },
            { key: 'B', value: '死神的死亡绽放' },
            { key: 'C', value: '西格玛的质量吸附' },
            { key: 'D', value: '路霸的链钩' }
        ],
        answer: 'C',
        explanation: '西格玛的质量吸附不能被源氏的闪反弹',
        difficulty: Difficulty.HARD,
        tags: ['源氏', '反弹', '技能', '机制']
    },

    {
        id: 'ow_003',
        category: '守望先锋',
        question: '末日铁拳是守望先锋中一个定位独特的输出英雄,下列哪个技能不是末日铁拳的?',
        type: QuestionType.SINGLE,
        options: [
            { key: 'A', value: '铁臂' },
            { key: 'B', value: '毁天灭地' },
            { key: 'C', value: '裂地重拳' },
            { key: 'D', value: '火箭重拳' }
        ],
        answer: 'A',
        explanation: '铁臂不是末日铁拳的技能',
        difficulty: Difficulty.NORMAL,
        tags: ['末日铁拳', '技能', '英雄']
    },

    {
        id: 'ow_004',
        category: '守望先锋',
        question: '禅雅塔是一位独具特色的辅助类英雄,下列哪个说法是错误的?',
        type: QuestionType.SINGLE,
        options: [
            { key: 'A', value: '禅雅塔的子弹没有距离衰减' },
            { key: 'B', value: '禅雅塔的"谐"会为目标队友提供缓慢回血的buff' },
            { key: 'C', value: '禅雅塔的"乱"会减少敌方英雄的伤害' },
            { key: 'D', value: '禅雅塔在"圣"期间不会受到任何debuff' }
        ],
        answer: 'C',
        explanation: '禅雅塔的"乱"是增加敌方受到的伤害,而不是减少敌方造成的伤害',
        difficulty: Difficulty.NORMAL,
        tags: ['禅雅塔', '辅助', '技能', '机制']
    },

    {
        id: 'ow_005',
        category: '守望先锋',
        question: '半藏作为一个强烈日本风格的弓箭手,下列哪个技能不是半藏的?',
        type: QuestionType.SINGLE,
        options: [
            { key: 'A', value: '音' },
            { key: 'B', value: '岚' },
            { key: 'C', value: '攀' },
            { key: 'D', value: '诛' }
        ],
        answer: 'D',
        explanation: '诛不是半藏的技能',
        difficulty: Difficulty.NORMAL,
        tags: ['半藏', '技能', '英雄']
    },

    {
        id: 'ow_006',
        category: '守望先锋',
        question: '拉玛刹在守望先锋的世界观里带领智械进行反抗,下列那句话不是他说的?',
        type: QuestionType.SINGLE,
        options: [
            { key: 'A', value: '感受我的痛苦！' },
            { key: 'B', value: '不经历冲突,怎能不断进化' },
            { key: 'C', value: '让他们归于大地' },
            { key: 'D', value: '一招误判,满盘皆输' }
        ],
        answer: 'B',
        explanation: '"不经历冲突,怎能不断进化"不是拉玛刹的台词',
        difficulty: Difficulty.HARD,
        tags: ['拉玛刹', '台词', '剧情']
    },

    {
        id: 'ow_007',
        category: '守望先锋',
        question: '地形杀是守望先锋中独居特色的击杀方式,下列哪位技能没有强制位移的能力?',
        type: QuestionType.SINGLE,
        options: [
            { key: 'A', value: '黑百合的钩爪' },
            { key: 'B', value: '卢西奥的音波' },
            { key: 'C', value: '探奇的钻头突刺' },
            { key: 'D', value: '堡垒的A-36战术榴弹' }
        ],
        answer: 'A',
        explanation: '黑百合的钩爪是自己的位移技能,不能强制移动敌人',
        difficulty: Difficulty.EASY,
        tags: ['地形杀', '位移', '技能']
    },

    {
        id: 'ow_008',
        category: '守望先锋',
        question: '扎克女王是守望先锋中功能全面的重装英雄,下列哪个能力不是其能力范围?',
        type: QuestionType.SINGLE,
        options: [
            { key: 'A', value: '治疗队友' },
            { key: 'B', value: '强制位移' },
            { key: 'C', value: '为队友提供机动性' },
            { key: 'D', value: '让敌方无法受到治疗' }
        ],
        answer: 'A',
        explanation: '扎克女王不能治疗队友',
        difficulty: Difficulty.NORMAL,
        tags: ['扎克女王', '重装', '能力']
    },

    {
        id: 'ow_009',
        category: '守望先锋',
        question: '雾子的"铃"能够清除队友所受的debuff,下列哪个不能被"铃"清除?',
        type: QuestionType.SINGLE,
        options: [
            { key: 'A', value: '禅雅塔的乱' },
            { key: 'B', value: '扎克女王的轰翻天' },
            { key: 'C', value: '狂鼠的捕兽夹' },
            { key: 'D', value: '安娜的麻醉针' }
        ],
        answer: 'C',
        explanation: '狂鼠的捕兽夹是物理控制,不能被雾子的铃清除',
        difficulty: Difficulty.HARD,
        tags: ['雾子', '辅助', 'debuff清除', '机制']
    },

    {
        id: 'ow_010',
        category: '守望先锋',
        question: '神话武器是守望先锋中独特的武器,他不具有的功能有?',
        type: QuestionType.SINGLE,
        options: [
            { key: 'A', value: '独特的击杀特效' },
            { key: 'B', value: '独特的检视动画' },
            { key: 'C', value: '独特的攻击音效' },
            { key: 'D', value: '独特的英雄语音' }
        ],
        answer: 'D',
        explanation: '神话武器不包含独特的英雄语音',
        difficulty: Difficulty.NORMAL,
        tags: ['神话武器', '皮肤', '系统']
    },

    {
        id: 'ow_011',
        category: '守望先锋',
        question: '布里吉塔的大招十分强力,开启大招时,获得的强化不包括?',
        type: QuestionType.SINGLE,
        options: [
            { key: 'A', value: '获得护甲' },
            { key: 'B', value: '获得移速' },
            { key: 'C', value: '为周围盟友提供额外生命值' },
            { key: 'D', value: '强化屏障护盾' }
        ],
        answer: 'B',
        explanation: '布里吉塔的大招不提供移速加成',
        difficulty: Difficulty.NORMAL,
        tags: ['布里吉塔', '大招', '辅助']
    },

    {
        id: 'ow_012',
        category: '守望先锋',
        question: '奥丽莎的强固防御极其烦人,在她开启强固防御后,获得的强化不包括?',
        type: QuestionType.SINGLE,
        options: [
            { key: 'A', value: '无法被爆头' },
            { key: 'B', value: '降低所受到的伤害' },
            { key: 'C', value: '不可阻挡' },
            { key: 'D', value: '免疫负面效果' }
        ],
        answer: 'D',
        explanation: '奥丽莎的强固防御不能免疫负面效果',
        difficulty: Difficulty.NORMAL,
        tags: ['奥丽莎', '重装', '技能']
    },

    {
        id: 'ow_013',
        category: '守望先锋',
        question: '黄甲是守望先锋中珍贵的血量资源,带有减伤的能力,下列英雄无自带黄甲的是?',
        type: QuestionType.SINGLE,
        options: [
            { key: 'A', value: '西格玛' },
            { key: 'B', value: '破坏球' },
            { key: 'C', value: '托比昂' },
            { key: 'D', value: '布里吉塔' }
        ],
        answer: 'A',
        explanation: '西格玛没有自带黄甲,他只有护盾',
        difficulty: Difficulty.HARD,
        tags: ['黄甲', '护甲', '机制']
    },

    {
        id: 'ow_014',
        category: '守望先锋',
        question: '莫伊拉的消散可以让闪光粘在身上的脉冲炸弹掉落在地',
        type: QuestionType.TRUEFALSE,
        options: [
            { key: 'A', value: '正确' },
            { key: 'B', value: '错误' }
        ],
        answer: 'A',
        explanation: '莫伊拉的消散能够让脉冲炸弹掉落',
        difficulty: Difficulty.NORMAL,
        trivia: '这是莫伊拉的一个强力反制能力!',
        tags: ['莫伊拉', '闪光', '脉冲炸弹', '机制']
    },

    {
        id: 'ow_015',
        category: '守望先锋',
        question: '黑影的电子脉冲能够入侵巴蒂斯特的增幅矩阵',
        type: QuestionType.TRUEFALSE,
        options: [
            { key: 'A', value: '正确' },
            { key: 'B', value: '错误' }
        ],
        answer: 'A',
        explanation: '黑影的电子脉冲可以入侵增幅矩阵',
        difficulty: Difficulty.NORMAL,
        tags: ['黑影', '巴蒂斯特', '入侵', '机制']
    },

    {
        id: 'ow_016',
        category: '守望先锋',
        question: '莱因哈特的冲锋和毛加的蛮力冲撞对撞时,双方都会倒地',
        type: QuestionType.TRUEFALSE,
        options: [
            { key: 'A', value: '正确' },
            { key: 'B', value: '错误' }
        ],
        answer: 'B',
        explanation: '对撞时两者会弹开,但不会倒地',
        difficulty: Difficulty.NORMAL,
        tags: ['莱因哈特', '毛加', '冲锋', '机制']
    },

    {
        id: 'ow_017',
        category: '守望先锋',
        question: '艾什的鲍勃在5v5预设模式中,带有重装的职责被动',
        type: QuestionType.TRUEFALSE,
        options: [
            { key: 'A', value: '正确' },
            { key: 'B', value: '错误' }
        ],
        answer: 'A',
        explanation: '鲍勃被视为重装单位,拥有重装职责被动',
        difficulty: Difficulty.HARD,
        trivia: '鲍勃是游戏中唯一拥有职责被动的召唤物!',
        tags: ['艾什', '鲍勃', '重装', '职责被动']
    },

    {
        id: 'ow_018',
        category: '守望先锋',
        question: '禅雅塔开启"圣"之后,能够继续推车',
        type: QuestionType.TRUEFALSE,
        options: [
            { key: 'A', value: '正确' },
            { key: 'B', value: '错误' }
        ],
        answer: 'B',
        explanation: '禅雅塔开启超然入圣后无法推车或占点',
        difficulty: Difficulty.NORMAL,
        tags: ['禅雅塔', '大招', '推车', '机制']
    }
]