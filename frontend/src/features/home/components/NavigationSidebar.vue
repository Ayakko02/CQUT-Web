# 左侧导航边栏
<template>
  <!-- 左侧导航边栏 -->
  <div class="left-sidebar" :class="{ hidden: isHidden }">
    <!-- 四条平行斜线 -->
    <div class="divider-line divider-line-1"></div>
    <div class="divider-line divider-line-2"></div>
    <div class="divider-line divider-line-3"></div>
    <div class="divider-line divider-line-4"></div>

    <!-- 用户头像区域 -->
    <div class="user-avatar-section">
      <div class="user-avatar" @click="goToUserPage">
        <img src="/images/default-avatar.png" alt="用户头像">
      </div>
    </div>

    <!-- 导航项目 -->
    <div class="nav-item nav-item-news" @click="goToNews">
      <span class="nav-text">新闻</span>
    </div>

    <div class="nav-item nav-item-activity" @click="goToActivities">
      <span class="nav-text">活动</span>
    </div>

    <div class="nav-item nav-item-service" @click="goToServices">
      <span class="nav-text">服务</span>
    </div>
  </div>

  <!-- 左上角更多导航菜单 -->
  <div class="more-nav-menu" :class="{ hidden: isHidden }">
    <div class="more-nav-trigger">
      <span class="more-nav-text">更多功能</span>
      <span class="more-nav-icon">⌄</span>
    </div>
    <div class="more-nav-dropdown">
      <div class="nav-dropdown-item" @click="goToClubCulture">
        <span class="dropdown-text">社团门面</span>
      </div>
      <div class="nav-dropdown-item" @click="goToInteractiveCommunity">
        <span class="dropdown-text">互动茶楼</span>
      </div>
      <div class="nav-dropdown-item" @click="goToResourceHelp">
        <span class="dropdown-text">资源广场</span>
      </div>
      <div class="nav-dropdown-item" @click="goToMemberCenter">
        <span class="dropdown-text">意见邮箱</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useScrollControl } from '../composables/useScrollControl.js'

// Props
defineProps({
  currentTheme: {
    type: String,
    default: 'zero'
  },
  isHidden: {
    type: Boolean,
    default: false
  }
});

// 使用统一滚动控制系统 - 只获取侧边栏相关的状态和方法
const {
  isSidebarHidden: isHidden,
  forceShowSidebar,
  forceHideSidebar,
  currentScrollTop
} = useScrollControl()

// 页面跳转函数
const goToUserPage = () => {
  console.log('跳转到用户管理页面')
  // TODO: 实现页面跳转
}

const goToNews = () => {
  console.log('跳转到新闻页面')
  // TODO: 实现页面跳转
}

const goToActivities = () => {
  console.log('跳转到活动页面')
  // TODO: 实现页面跳转
}

const goToServices = () => {
  console.log('跳转到服务页面')
  // TODO: 实现页面跳转
}

const goToClubCulture = () => {
  console.log('跳转到社团文化页面')
  // TODO: 实现页面跳转
}

const goToInteractiveCommunity = () => {
  console.log('跳转到互动社区页面')
  // TODO: 实现页面跳转
}

const goToResourceHelp = () => {
  console.log('跳转到资源求助页面')
  // TODO: 实现页面跳转
}

const goToMemberCenter = () => {
  console.log('跳转到会员中心页面')
  // TODO: 实现页面跳转
}

// 生命周期 - 由于滚动监听在 useScrollControl 中已经自动处理，这里不需要手动管理
// onMounted(() => {
//   统一滚动控制系统会自动初始化
// })

// onUnmounted(() => {
//   统一滚动控制系统会自动清理
// })

// 暴露方法供父组件调用（可选）
defineExpose({
  forceShowSidebar,
  forceHideSidebar,
  isHidden,
  currentScrollTop
})
</script>

<style scoped>
/* 左侧导航边栏 */
.left-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100px;
  height: 30%;
  backdrop-filter: blur(15px);
  z-index: 8888;
  transform: translateY(0);
  opacity: 1;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
}

.left-sidebar.hidden {
  height: 0;
  transform: translateY(-50px);
  opacity: 0;
  transform-origin: bottom;
}

/* 四条平行斜线 */
.divider-line {
  position: absolute;
  width: 120px;
  height: 2px;
  background: linear-gradient(135deg,
  transparent 0%,
  #9333ea 25%,
  #c026d3 75%,
  transparent 100%);
  transform: rotate(-45deg);
  transform-origin: left center;
}

.divider-line::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 30%;
  height: 100%;
  background: linear-gradient(90deg,
  transparent 0%,
  rgba(255, 255, 255, 0.6) 50%,
  transparent 100%);
  animation: navLineGlow 3s ease-in-out infinite;
}

.divider-line-1 { top: 95px; left: 0; }
.divider-line-2 { top: 160px; left: 0; }
.divider-line-3 { top: 225px; left: 0; }
.divider-line-4 { top: 290px; left: 0; }

@keyframes navLineGlow {
  0% { left: -30%; opacity: 0; }
  50% { opacity: 1; }
  100% { left: 100%; opacity: 0; }
}

/* 用户头像区域 */
.user-avatar-section {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
}

.user-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid rgba(147, 51, 234, 0.5);
  box-shadow: 0 4px 15px rgba(147, 51, 234, 0.3);
}

.user-avatar:hover {
  transform: scale(1.1);
  border-color: #9333ea;
  box-shadow: 0 6px 20px rgba(147, 51, 234, 0.5);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 导航项目 */
.nav-item {
  position: absolute;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 3;
}

.nav-item-news { top: 85px; left: 15px; }
.nav-item-activity { top: 150px; left: 15px; }
.nav-item-service { top: 210px; left: 15px; }

.nav-text {
  color: white;
  font-size: 14px;
  font-weight: bold;
  display: inline-block;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
  letter-spacing: 1px;
  transform: rotate(-45deg);
  white-space: nowrap;
}

.nav-item:hover .nav-text {
  color: #e879f9;
  transform: rotate(-45deg) scale(1.1);
  text-shadow:
      2px 2px 4px rgba(0, 0, 0, 0.7),
      0 0 10px rgba(147, 51, 234, 0.8);
}

.nav-item::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle,
  rgba(147, 51, 234, 0.3),
  transparent);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.3s, height 0.3s;
  pointer-events: none;
  z-index: -1;
}

.nav-item:active::before {
  width: 60px;
  height: 60px;
}

/* 更多功能菜单 */
.more-nav-menu {
  position: fixed;
  width: 150px;
  top: 0;
  left: 110px;
  z-index: 8900;
  transform: translateY(0);
  opacity: 1;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.more-nav-menu.hidden {
  transform: translateY(-80px);
  opacity: 0;
}

.more-nav-trigger {
  backdrop-filter: blur(15px);
  border: 2px solid rgba(147, 51, 234, 0.3);
  border-radius: 8px;
  padding: 12px 20px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  min-width: 100px;
  justify-content: space-between;
}

.more-nav-trigger:hover {
  border-color: #9333ea;
  background: rgba(147, 51, 234, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(147, 51, 234, 0.3);
}

.more-nav-text {
  font-size: 14px;
  font-weight: bold;
}

.more-nav-icon {
  font-size: 12px;
  transition: transform 0.3s ease;
}

.more-nav-menu:hover .more-nav-icon {
  transform: rotate(180deg);
}

.more-nav-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0;
  backdrop-filter: blur(5px);
  border: 2px solid rgba(147, 51, 234, 0.3);
  border-radius: 8px;
  padding: 8px 0;
  min-width: 150px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

.more-nav-menu:hover .more-nav-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.nav-dropdown-item {
  padding: 12px 20px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.nav-dropdown-item:hover {
  background: rgba(147, 51, 234, 0.3);
  transform: translateX(5px);
}

.dropdown-text {
  font-size: 14px;
  font-weight: 500;
}

/* 主题切换样式 */
.more-nav-menu.suhui-theme .more-nav-trigger {
  border-color: rgba(218, 165, 32, 0.3);
}

.more-nav-menu.suhui-theme .more-nav-trigger:hover {
  border-color: #daa520;
  background: rgba(218, 165, 32, 0.2);
  box-shadow: 0 8px 25px rgba(218, 165, 32, 0.3);
}

.more-nav-menu.suhui-theme .more-nav-dropdown {
  border-color: rgba(218, 165, 32, 0.3);
}

.more-nav-menu.suhui-theme .nav-dropdown-item:hover {
  background: rgba(218, 165, 32, 0.3);
}

/* 主题切换 */

.arc-announcement.suhui-theme path[stroke="url(#zeroGradient)"] {
  stroke: url(#suhuiGradient);
}

.arc-announcement.suhui-theme #arcGradient stop:nth-child(3) {
  stop-color: rgba(218, 165, 32, 0.8);
}

.arc-announcement.suhui-theme text {
  fill: #ffe55c;
}


@media (max-width: 768px) {
  .left-sidebar {
    width: 100px;
  }

  .user-avatar {
    width: 30px;
    height: 30px;
  }

  .nav-text {
    font-size: 12px;
  }

  .nav-item {
    left: 20px;
  }
}
</style>