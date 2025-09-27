// # 搜索框逻辑

import { ref, reactive, computed } from 'vue'
import {createRouter as router} from "vue-router";

let searchContainerInstance = null

export function useSearchContainer() {
    if (searchContainerInstance) {
        return searchContainerInstance
    }

    // 搜索状态
    const searchQuery = ref('')
    const isSearching = ref(false)
    const searchResults = ref([])
    const searchHistory = reactive([])

    // 搜索配置
    const maxHistoryLength = ref(10)
    const searchDelay = ref(300) // 防抖延迟

    // 搜索定时器
    let searchTimer = null

    // 搜索内容映射（模拟搜索数据库）
    const searchableContent = {
        // 页面内容
        '首页': { type: 'page', path: '/', description: '动漫社主页，零域·溯洄' },
        '新闻': { type: 'page', path: '/news', description: '最新资讯和公告' },
        '活动': { type: 'page', path: '/events', description: '精彩活动和赛事' },
        '服务': { type: 'page', path: '/services', description: '社团服务和业务办理' },
        '社团门面': { type: 'page', path: '/club-info', description: '社团介绍和文化展示' },
        '互动茶楼': { type: 'page', path: '/community', description: '会员交流和讨论区' },
        '资源广场': { type: 'page', path: '/resources', description: '学习资源和下载' },
        '意见邮箱': { type: 'page', path: '/contact', description: '反馈建议和联系方式' },

        // 功能内容
        '招新': { type: 'action', action: 'recruitment', description: '社团招新信息' },
        'cosplay': { type: 'action', action: 'cosplay', description: 'Cosplay活动和比赛' },
        '观影会': { type: 'action', action: 'movie', description: '观影活动安排' },
        '音乐': { type: 'action', action: 'music', description: '音乐相关活动' },
        '测试': { type: 'action', action: 'quiz', description: 'ACGN浓度测试' },

        // 主题内容
        '零域': { type: 'theme', theme: 'zero', description: '零域主题和文化' },
        '溯洄': { type: 'theme', theme: 'suhui', description: '溯洄主题和传统' },

        // 技术内容
        '流星雨': { type: 'effect', effect: 'meteor', description: '流星雨特效控制' },
        '音效': { type: 'effect', effect: 'audio', description: '音效和音乐播放' }
    }

    // 计算属性
    const hasSearchQuery = computed(() => searchQuery.value.trim().length > 0)
    const hasSearchResults = computed(() => searchResults.value.length > 0)
    const hasSearchHistory = computed(() => searchHistory.length > 0)

    // 执行搜索
    const performSearch = async () => {
        const query = searchQuery.value.trim()
        if (!query) {
            console.warn('[SearchContainer] 搜索词为空')
            return null
        }

        isSearching.value = true
        console.log('[SearchContainer] 执行搜索:', query)

        try {
            // 模拟搜索延迟
            await new Promise(resolve => setTimeout(resolve, 200))

            // 执行搜索逻辑
            const results = searchInContent(query)
            searchResults.value = results

            // 添加到搜索历史
            addToHistory(query)

            // 清空搜索框
            searchQuery.value = ''

            console.log('[SearchContainer] 搜索完成, 结果数量:', results.length)
            return results

        } catch (error) {
            console.error('[SearchContainer] 搜索出错:', error)
            return null
        } finally {
            isSearching.value = false
        }
    }

    // 在内容中搜索
    const searchInContent = (query) => {
        const results = []
        const lowerQuery = query.toLowerCase()

        // 搜索预定义内容
        Object.entries(searchableContent).forEach(([key, content]) => {
            const lowerKey = key.toLowerCase()
            const lowerDesc = content.description.toLowerCase()

            if (lowerKey.includes(lowerQuery) || lowerDesc.includes(lowerQuery)) {
                results.push({
                    id: key,
                    title: key,
                    description: content.description,
                    type: content.type,
                    relevance: calculateRelevance(lowerQuery, lowerKey, lowerDesc),
                    ...content
                })
            }
        })

        // 按相关性排序
        results.sort((a, b) => b.relevance - a.relevance)

        return results.slice(0, 10) // 最多返回10个结果
    }

    // 计算搜索相关性
    const calculateRelevance = (query, title, description) => {
        let relevance = 0

        // 标题完全匹配
        if (title === query) relevance += 100
        // 标题包含查询词
        else if (title.includes(query)) relevance += 50
        // 描述包含查询词
        if (description.includes(query)) relevance += 20

        // 查询词长度影响
        relevance += query.length

        return relevance
    }

    // 防抖搜索
    const debouncedSearch = (query) => {
        if (searchTimer) {
            clearTimeout(searchTimer)
        }

        searchTimer = setTimeout(() => {
            if (query.trim()) {
                performSearch()
            }
        }, searchDelay.value)
    }

    // 添加到搜索历史
    const addToHistory = (query) => {
        // 移除重复项
        const index = searchHistory.findIndex(item => item.query === query)
        if (index !== -1) {
            searchHistory.splice(index, 1)
        }

        // 添加到开头
        searchHistory.unshift({
            query,
            timestamp: new Date(),
            id: Date.now()
        })

        // 限制历史长度
        if (searchHistory.length > maxHistoryLength.value) {
            searchHistory.splice(maxHistoryLength.value)
        }

        console.log('[SearchContainer] 添加搜索历史:', query)
    }

    // 清空搜索
    const clearSearch = () => {
        searchQuery.value = ''
        searchResults.value = []
        isSearching.value = false

        if (searchTimer) {
            clearTimeout(searchTimer)
        }

        console.log('[SearchContainer] 清空搜索')
    }

    // 清空搜索历史
    const clearHistory = () => {
        searchHistory.splice(0)
        console.log('[SearchContainer] 清空搜索历史')
    }

    // 获取搜索建议
    const getSearchSuggestions = (query) => {
        if (!query || query.length < 2) return []

        const lowerQuery = query.toLowerCase()
        const suggestions = []

        Object.keys(searchableContent).forEach(key => {
            if (key.toLowerCase().includes(lowerQuery)) {
                suggestions.push({
                    text: key,
                    type: searchableContent[key].type,
                    description: searchableContent[key].description
                })
            }
        })

        return suggestions.slice(0, 5) // 最多5个建议
    }

    // 处理搜索结果点击
    const handleResultClick = (result) => {
        console.log('[SearchContainer] 点击搜索结果:', result)

        switch (result.type) {
            case 'page':
                router.push(result.path)
                break

            case 'action':
                // 执行特定动作
                handleSearchAction(result.action)
                break

            case 'theme':
                // 切换主题
                console.log('切换主题到:', result.theme)
                break

            case 'effect':
                // 控制特效
                handleEffectControl(result.effect)
                break
        }
    }

    // 处理搜索动作
    const handleSearchAction = (action) => {
        switch (action) {
            case 'recruitment':
                console.log('跳转到招新页面')
                break
            case 'cosplay':
                console.log('跳转到Cosplay活动')
                break
            case 'movie':
                console.log('跳转到观影会')
                break
            case 'music':
                console.log('跳转到音乐活动')
                break
            case 'quiz':
                console.log('跳转到ACGN测试')
                break
        }
    }

    // 处理特效控制
    const handleEffectControl = (effect) => {
        switch (effect) {
            case 'meteor':
                console.log('控制流星雨特效')
                // TODO: 调用流星雨控制函数
                break
            case 'audio':
                console.log('控制音效播放')
                // TODO: 调用音效控制函数
                break
        }
    }

    // 获取搜索统计
    const getSearchStats = () => {
        return {
            totalSearches: searchHistory.length,
            currentQuery: searchQuery.value,
            currentResults: searchResults.value.length,
            isSearching: isSearching.value,
            hasResults: hasSearchResults.value
        }
    }

    // 创建单例实例
    searchContainerInstance = {
        // 响应式数据
        searchQuery,
        isSearching,
        searchResults,
        searchHistory,
        maxHistoryLength,
        searchDelay,

        // 计算属性
        hasSearchQuery,
        hasSearchResults,
        hasSearchHistory,

        // 搜索方法
        performSearch,
        debouncedSearch,
        clearSearch,

        // 历史管理
        addToHistory,
        clearHistory,

        // 建议和结果处理
        getSearchSuggestions,
        handleResultClick,

        // 工具方法
        getSearchStats
    }

    return searchContainerInstance
}