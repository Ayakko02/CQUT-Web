# 搜索框

<template>
  <!-- 右上角搜索框 -->
  <div class="search-container" :class="{
    hidden: isHidden,
    'zero-theme': currentTheme === 'zero',
    'suhui-theme': currentTheme === 'suhui'
  }">
    <div class="search-input-wrapper">
      <input
          type="text"
          class="search-input"
          ref="searchInputRef"
          v-model="searchQuery"
          :placeholder="searchPlaceholder"
          @keypress="handleKeyPress"
          @focus="handleFocus"
          @blur="handleBlur"
      >
      <button
          class="search-btn"
          @click="performSearch"
          :disabled="!searchQuery.trim()"
      >
        <span class="search-icon">🔍</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSearchContainer } from '../composables/useSearchContainer.js'

// Props
const props = defineProps({
  currentTheme: {
    type: String,
    default: 'zero'
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: '搜索页面内容...'
  }
})

// Emits
const emit = defineEmits(['search'])

// 使用搜索逻辑
const {
  searchQuery,
  searchHistory,
  isSearching,
  performSearch: handleSearch,
  clearSearch,
  addToHistory,
  getSearchSuggestions
} = useSearchContainer()

// 模板引用
const searchInputRef = ref(null)

// 计算属性
const searchPlaceholder = computed(() => {
  if (props.currentTheme === 'suhui') {
    return props.placeholder.replace('搜索', '寻觅')
  }
  return props.placeholder
})

// 方法
const performSearch = async () => {
  if (!searchQuery.value.trim()) return

  const result = await handleSearch()
  if (result) {
    emit('search', {
      query: searchQuery.value,
      results: result
    })
  }
}

const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    performSearch()
  }
}

const handleFocus = () => {
  console.log('[SearchContainer] 搜索框获得焦点')
}

const handleBlur = () => {
  console.log('[SearchContainer] 搜索框失去焦点')
}

// 暴露方法供父组件调用
defineExpose({
  focus: () => searchInputRef.value?.focus(),
  clear: () => clearSearch(),
  getQuery: () => searchQuery.value
})

onMounted(() => {
  console.log('[SearchContainer] 搜索组件已挂载')
})
</script>

<style scoped>
/* 右上角搜索框 */
.search-container {
  position: fixed;
  top: 20px;
  right: 295px;
  z-index: 8900;
  transform: translateY(0);
  opacity: 1;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.search-container.hidden {
  transform: translateY(-80px);
  opacity: 0;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  background: transparent;
  backdrop-filter: blur(15px);
  border: 2px solid rgba(147, 51, 234, 0.3);
  border-radius: 8px;
  padding: 5px 12px;
  transition: all 0.3s ease;
}

.search-input-wrapper:hover,
.search-input-wrapper:focus-within {
  border-color: #9333ea;
  background: rgba(147, 51, 234, 0.1);
  box-shadow: 0 8px 25px rgba(147, 51, 234, 0.3);
}

.search-input {
  background: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 14px;
  width: 150px;
  padding: 8px 12px;
  transition: all 0.3s ease;
}

.search-input:focus {
  width: 200px;
  color: white;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.search-input::selection {
  background: rgba(147, 51, 234, 0.5);
  color: white;
}

.search-btn {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
}

.search-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.search-btn:hover:not(:disabled) {
  background: rgba(147, 51, 234, 0.3);
  transform: scale(1.1);
}

.search-icon {
  font-size: 16px;
}

/* 零域主题样式 */
.search-container.zero-theme .search-input-wrapper {
  border-color: rgba(147, 51, 234, 0.3);
}

.search-container.zero-theme .search-input-wrapper:hover,
.search-container.zero-theme .search-input-wrapper:focus-within {
  border-color: #9333ea;
  background: rgba(147, 51, 234, 0.1);
  box-shadow: 0 8px 25px rgba(147, 51, 234, 0.3);
}

.search-container.zero-theme .search-btn:hover:not(:disabled) {
  background: rgba(147, 51, 234, 0.3);
}

.search-container.zero-theme .search-input::selection {
  background: rgba(147, 51, 234, 0.5);
}

/* 溯洄主题样式 */
.search-container.suhui-theme .search-input-wrapper {
  border-color: rgba(218, 165, 32, 0.3);
}

.search-container.suhui-theme .search-input-wrapper:hover,
.search-container.suhui-theme .search-input-wrapper:focus-within {
  border-color: #daa520;
  background: rgba(218, 165, 32, 0.1);
  box-shadow: 0 8px 25px rgba(218, 165, 32, 0.3);
}

.search-container.suhui-theme .search-btn:hover:not(:disabled) {
  background: rgba(218, 165, 32, 0.3);
}

.search-container.suhui-theme .search-input::selection {
  background: rgba(218, 165, 32, 0.5);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-container {
    right: 20px;
    top: 15px;
  }

  .search-input {
    width: 120px;
    font-size: 13px;
  }

  .search-input:focus {
    width: 160px;
  }
}
</style>