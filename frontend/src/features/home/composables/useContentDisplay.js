// # 内容展示逻辑
import { ref } from 'vue'

let contentDisplayInstance = null

const contentData = {
    '社团简介': {
        title: '社团简介',
        content: `
            <p>CQUT动漫社成立于2018年，是一个充满活力的学生社团...</p>
            <p>我们致力于推广ACGN文化，为同学们提供交流平台...</p>
        `
    },
    '社团成就': {
        title: '社团成就',
        content: `
            <ul>
                <li>2020年获得校级优秀社团称号</li>
                <li>成功举办多场大型cosplay活动</li>
                <li>与多个高校建立合作关系</li>
            </ul>
        `
    },
    '社团文化': {
        title: '社团文化',
        content: `
            <p>零域·溯洄 - 两个分支代表不同的文化特色</p>
            <p>零域注重创新与前沿，溯洄传承经典与深度...</p>
        `
    }
}

export function useContentDisplay() {
    if (contentDisplayInstance) {
        return contentDisplayInstance
    }

    const isPanelVisible = ref(false)
    const isZeroNiangVisible = ref(false)
    const currentContentType = ref('')
    const areBackgroundElementsHidden = ref(false)
    const currentActiveContentType = ref(null)

    const handleButtonClick = (contentType) => {
        // 如果点击的是已激活的内容类型，则关闭面板
        if (currentActiveContentType.value === contentType) {
            closeInfoPanel(true)
            currentActiveContentType.value = null
        } else if (currentActiveContentType.value !== null) {
            // 如果有其他内容已激活，只切换内容
            switchInfoPanel(contentType)
            currentActiveContentType.value = contentType
        } else {
            // 如果没有激活的内容，直接显示面板
            showInfoPanel(contentType)
            currentActiveContentType.value = contentType
        }
    }

    const showInfoPanel = (contentType) => {
        currentContentType.value = contentType
        areBackgroundElementsHidden.value = true
        currentActiveContentType.value = contentType

        // 先设置可见但不透明，然后触发动画
        setTimeout(() => {
            isZeroNiangVisible.value = true
            // 再延迟触发面板动画
            setTimeout(() => {
                isPanelVisible.value = true
            }, 100)
        }, 300)
    }

    const closeInfoPanel = (restoreBackground = true) => {
        // 先隐藏面板动画
        isPanelVisible.value = false

        // 延迟隐藏零域娘
        setTimeout(() => {
            isZeroNiangVisible.value = false
            currentActiveContentType.value = null

            if (restoreBackground) {
                setTimeout(() => {
                    areBackgroundElementsHidden.value = false
                }, 100)
            }
        }, 300) // 等待面板动画完成
    }

    const switchInfoPanel = (contentType) => {
        isPanelVisible.value = false

        setTimeout(() => {
            currentContentType.value = contentType
            isPanelVisible.value = true
        }, 300)
    }

    const getCurrentContent = () => {
        return contentData[currentContentType.value] || contentData['社团简介']
    }

    contentDisplayInstance = {
        isPanelVisible,
        isZeroNiangVisible,
        areBackgroundElementsHidden,
        currentContentType,
        currentActiveContentType,
        showInfoPanel,
        closeInfoPanel,
        switchInfoPanel,
        handleButtonClick,
        getCurrentContent,
        contentData
    }

    return contentDisplayInstance
}