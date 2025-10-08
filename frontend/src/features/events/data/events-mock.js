// 模拟数据

// frontend/src/features/events/data/events-mock.js

export const mockEvents = [
    {
        id: 1,
        title: 'ACGN文化浓度测试',
        description: '测测你的二次元浓度有多高！答题赢取专属称号',
        category: 'game',
        cover: '/images/events/quiz-cover.jpg',
        date: '2025-01-15',
        location: '线上活动',
        status: 'ongoing',
        participants: 1234,
        isQuiz: true
    },
    {
        id: 2,
        title: '春季Cosplay大赛',
        description: '展示你的角色扮演才华，丰厚奖品等你来拿',
        category: 'cosplay',
        cover: '/images/events/cosplay-cover.jpg',
        date: '2025-02-20',
        location: '学校礼堂',
        status: 'upcoming',
        participants: 567
    },
    {
        id: 3,
        title: '动漫电影观影会',
        description: '一起观看经典动漫电影《你的名字》',
        category: 'movie',
        cover: '/images/events/movie-cover.jpg',
        date: '2025-01-10',
        location: '阶梯教室A101',
        status: 'ended',
        participants: 89
    }
]