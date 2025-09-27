// # 弧形公告栏逻辑

import { ref } from 'vue'

let announcementArcInstance = null

export function useAnnouncementArc() {
    if (announcementArcInstance) {
        return announcementArcInstance
    }

    // 公告文字内容（连续滚动显示）
    const announcementText = ref(
        '社团招新开始啦！欢迎加入CQUT动漫社　本周六晚7点观影会　Cosplay大赛报名中　原创音乐作品征集　'
    )

    // 动画控制状态
    const isPaused = ref(false)


    // 暂停动画
    const pauseAnimation = () => {
        isPaused.value = true

        // 查找SVG动画元素并暂停
        const animateElements = document.querySelectorAll('#announcementText animate')
        animateElements.forEach(element => {
            element.beginElement = element.beginElement || function() {}
            element.style.animationPlayState = 'paused'
            // 对于SVG animate标签，需要调用pauseAnimations()
            if (element.pauseAnimations) {
                element.pauseAnimations()
            }
        })

        console.log('[AnnouncementArc] 动画已暂停')
    }

    // 恢复动画
    const resumeAnimation = () => {
        isPaused.value = false

        // 查找SVG动画元素并恢复
        const animateElements = document.querySelectorAll('#announcementText animate')
        animateElements.forEach(element => {
            element.style.animationPlayState = 'running'
            // 对于SVG animate标签，需要调用unpauseAnimations()
            if (element.unpauseAnimations) {
                element.unpauseAnimations()
            }
        })

        console.log('[AnnouncementArc] 动画已恢复')
    }

    // 处理公告点击事件
    const handleAnnouncementClick = () => {
        // 获取当前显示的公告内容，判断应该跳转到哪里
        const currentText = announcementText.value

        // 简单的关键词匹配逻辑
        if (currentText.includes('招新')) {
            console.log('跳转到招新页面')
            // TODO: 实现页面跳转
            // this.$router.push('/recruitment')
        } else if (currentText.includes('观影会')) {
            console.log('跳转到观影会活动页面')
            // TODO: 实现页面跳转
            // this.$router.push('/events/movie-night')
        } else if (currentText.includes('Cosplay')) {
            console.log('跳转到Cosplay大赛页面')
            // TODO: 实现页面跳转
            // this.$router.push('/events/cosplay-contest')
        } else if (currentText.includes('音乐')) {
            console.log('跳转到音乐作品征集页面')
            // TODO: 实现页面跳转
            // this.$router.push('/submissions/music')
        } else {
            console.log('跳转到公告列表页面')
            // TODO: 实现页面跳转
            // this.$router.push('/announcements')
        }

        console.log('[AnnouncementArc] 公告被点击，内容:', currentText)
    }

    // 更新公告内容
    const updateAnnouncementText = (newText) => {
        announcementText.value = newText
        console.log('[AnnouncementArc] 公告内容已更新:', newText)
    }

    // 添加新公告到滚动文本
    const addAnnouncementToText = (newAnnouncement) => {
        const separator = '　' // 全角空格作为分隔符
        announcementText.value += separator + newAnnouncement + separator
        console.log('[AnnouncementArc] 新公告已添加到滚动文本')
    }

    // 设置动画速度
    const setAnimationSpeed = (duration = '25s') => {
        const animateElements = document.querySelectorAll('#announcementText animate')
        animateElements.forEach(element => {
            element.setAttribute('dur', duration)
        })
        console.log('[AnnouncementArc] 动画速度已设置为:', duration)
    }

    // 重置动画到起始位置
    const resetAnimation = () => {
        const animateElements = document.querySelectorAll('#announcementText animate')
        animateElements.forEach(element => {
            if (element.beginElement) {
                element.beginElement()
            }
        })
        console.log('[AnnouncementArc] 动画已重置')
    }

    // 获取当前动画状态
    const getAnimationState = () => {
        return {
            isPaused: isPaused.value,
            text: announcementText.value,
            textLength: announcementText.value.length
        }
    }

    // 预设公告模板
    const announcementTemplates = {
        recruitment: '🎉 社团招新火热进行中！加入我们，开启ACGN之旅！',
        event: '📅 精彩活动即将开始，不要错过哦！',
        cosplay: '🎭 Cosplay大赛报名开启，展示你的创意！',
        music: '🎵 原创音乐作品征集中，期待你的作品！',
        movie: '🎬 本周观影会，一起享受精彩时光！',
        contest: '🏆 各类比赛等你参加，奖品丰厚！'
    }

    // 使用模板快速设置公告
    const useTemplate = (templateName) => {
        if (announcementTemplates[templateName]) {
            updateAnnouncementText(announcementTemplates[templateName])
        } else {
            console.warn('[AnnouncementArc] 模板不存在:', templateName)
        }
    }

    // 批量设置多个公告
    const setMultipleAnnouncements = (announcements) => {
        const separator = '　'
        const combinedText = announcements.join(separator + separator)
        updateAnnouncementText(combinedText + separator)
    }

    // 创建单例实例
    announcementArcInstance = {
        // 响应式数据
        announcementText,
        isPaused,

        // 动画控制方法
        pauseAnimation,
        resumeAnimation,
        resetAnimation,
        setAnimationSpeed,

        // 内容管理方法
        updateAnnouncementText,
        addAnnouncementToText,
        useTemplate,
        setMultipleAnnouncements,

        // 交互方法
        handleAnnouncementClick,

        // 工具方法
        getAnimationState,

        // 预设模板
        announcementTemplates
    }

    return announcementArcInstance
}