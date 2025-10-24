# CQUT动漫社网站架构文档

> **更新时间**: 2024-12-19  
> **项目版本**: v1.0  
> **架构类型**: 前后端分离 + 微服务架构

## 📋 项目概述

CQUT动漫社网站是一个现代化的社团管理平台，采用前后端分离架构，支持双主题（零域·溯洄）设计，集成了ACGN文化展示、成员管理、活动组织等功能。

### 🎯 核心特色
- **双城设计**: 零域（紫色科技风）+ 溯洄（金色传统风）
- **ACGN测试**: 3D交互式浓度测试小程序
- **音乐系统**: 双主题音乐播放器，支持主题联动
- **流星雨特效**: 动态背景特效系统
- **响应式设计**: 完美适配PC和移动端

---

## 🎯 架构设计原则

### 1. **模块化设计**
- **功能模块独立**: 每个feature模块都是独立的功能单元
- **组件可复用**: 全局组件可在多个模块中使用
- **职责单一**: 每个文件和模块都有明确的职责

### 2. **分层架构**
```
视图层 (views/) → 功能层 (features/) → 组件层 (components/) → 服务层 (services/) → 数据层 (API/Store)
```

### 3. **数据流设计**
- **单向数据流**: 使用Pinia进行状态管理
- **API统一**: 通过services层统一管理API调用
- **组合式函数**: 使用composables复用业务逻辑

---

## 🚦 开发规范

### 📁 文件命名规范
- **Vue组件**: PascalCase (如: `HomePage.vue`)
- **JavaScript文件**: camelCase (如: `useTheme.js`)
- **CSS文件**: kebab-case (如: `dual-city.css`)
- **目录**: kebab-case (如: `club-info/`)

### 🎨 代码组织规范
- **组件导入顺序**: Vue API → 第三方库 → 本地组件 → 工具函数
- **文件结构**: `<template>` → `<script setup>` → `<style scoped>`
- **注释**: 每个功能模块和复杂函数都需要注释说明

### 🔄 开发流程
1. **功能开发**: 在对应的feature模块中开发
2. **组件提取**: 可复用的组件提取到components目录
3. **API集成**: 通过services层调用后端API
4. **状态管理**: 使用Pinia管理全局状态
5. **路由配置**: 在router目录中配置路由

---

## 🛠️ 开发环境配置

### 前端环境
```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 后端环境
```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env

# 启动开发服务器
npm run dev
```

### 数据库初始化
```bash
# 创建数据库
mysql -u root -p < database/schema.sql

# 导入种子数据
mysql -u root -p < database/seed.sql
```

---

## 📊 核心功能模块详解

### 🏠 首页模块 (features/home/)
**功能**: 双城（零域·溯洄）展示页面
- **主要组件**: HomePage, ZeroCity, SuhuiCity, DualCityLayout
- **核心特性**: 页面翻转、主题切换、音乐联动、流星雨特效
- **技术特点**: 3D CSS变换、响应式布局、动画效果

### 🎯 ACGN测试模块 (features/quiz/)
**功能**: 交互式ACGN浓度测试
- **主要组件**: QuizApp, QuizHome, QuizScreen, QuizResult
- **核心特性**: 3D卡片选择、弹幕系统、进度跟踪、结果分析
- **技术特点**: 3D变换、动态评分、数据持久化

### 🔄 共享模块 (features/shared/)
**功能**: 跨模块的通用功能
- **主要组件**: 通用对话框、加载状态、错误处理
- **核心特性**: API调用、认证、通知、本地存储
- **技术特点**: 组合式函数、工具库、常量管理

---

## 🎨 主题系统架构


### 主题切换机制
1. **自动切换**: 页面翻转时自动切换主题
2. **音乐联动**: 主题切换时自动切换对应歌单
3. **特效同步**: 流星雨、粒子效果跟随主题变化
4. **偏好记忆**: 用户偏好存储到本地和服务器

---

## 📱 响应式设计

### 断点设计
- **移动端**: < 768px
- **平板端**: 768px - 1024px
- **桌面端**: > 1024px

### 适配策略
- **移动端优先**: 采用移动端优先的响应式设计
- **触摸适配**: 针对移动端的触摸交互优化
- **性能优化**: 移动端减少动画和特效强度

---

## 🔒 安全架构

### 前端安全
- **XSS防护**: Vue.js内置XSS防护
- **CSRF防护**: 使用CSRF token
- **内容安全策略**: 配置CSP头部

### 后端安全
- **认证**: JWT + Refresh Token机制
- **授权**: 基于角色的访问控制(RBAC)
- **数据验证**: 输入数据严格验证
- **限流**: API访问频率限制

### 数据安全
- **密码加密**: bcrypt哈希加密
- **敏感数据**: 环境变量存储
- **数据备份**: 定期自动备份


## 🔄 版本控制与部署

### Git工作流
```
main分支      ← 生产环境 (自动部署)
  ↑
develop分支   ← 开发环境 (测试部署)
  ↑
feature/xxx   ← 功能开发分支
```

### 部署流程
1. **开发完成**: feature分支合并到develop
2. **测试验证**: develop分支部署到测试环境
3. **生产发布**: develop合并到main，自动部署生产环境
4. **回滚机制**: 支持快速回滚到上一版本


## 📞 技术支持

### 开发团队联系方式
- **项目负责人**: Ayakko 1402786158
- **技术负责人**: Ayakko 1402786158
- **项目仓库**: [https://github.com/Ayakko02/CQUT-Web.git]

### 技术栈官方文档
- [Vue.js 官方文档](https://vuejs.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [Express.js 文档](https://expressjs.com/)
- [MySQL 官方文档](https://dev.mysql.com/doc/)

---

**文档版本**: v1.0  
**最后更新**: 2024-12-19  
**维护者**: Ayakko

## 🏗️ 整体架构

```
CQUT Web/
├── 📁 frontend/                # Vue.js前端应用 (SPA)
├── 📁 backend/                 # Node.js后端API服务
├── 📁 database/                # 数据库脚本与迁移
├── 📁 deployment/              # 部署相关配置
├── 📄 .gitignore              # Git忽略文件
├── 📄 architecture.md         # 架构文档（本文件）
└── 📄 README.md               # 项目说明文档
```

---

## 🎨 Frontend 前端架构

### 📦 技术栈
- **框架**: Vue 3 + Composition API
- **构建工具**: Vite
- **样式**: Tailwind CSS + 自定义CSS
- **路由**: Vue Router 4
- **状态管理**: Pinia
- **类型检查**: JavaScript (可扩展TypeScript)

### 📁 目录结构详解

```
frontend/
├── 📄 index.html                  # HTML入口模板
├── 📄 package.json               # 依赖配置
├── 📄 vite.config.js             # Vite构建配置
├── 📄 tailwind.config.js         # Tailwind CSS配置
├── 📄 .env.example               # 环境变量模板
│
├── 📁 public/                    # 静态资源目录
│   ├── 📁 audio/                 # 音频文件 - 零域/溯洄音乐
│   ├── 📁 fonts/                 # 字体文件
│   └── 📁 images/                # 静态图片 - 吉祥物、背景等
│
└── 📁 src/                       # 源代码目录
    ├── 📄 App.vue                # 根组件
    ├── 📄 main.js                # 应用入口
    │
    ├── 📁 assets/                # 编译时资源
    │   ├── 📁 data/              # 静态数据文件
    │   │   ├── 📄 club-content.js      # 社团内容数据
    │   │   ├── 📄 music-playlists.js   # 音乐播放列表
    │   │   ├── 📄 navigation.js        # 导航配置
    │   │   └── 📄 quiz-questions.js    # 题库数据
    │   ├── 📁 images/            # 编译时图片
    │   └── 📁 styles/            # 样式文件
    │       ├── 📄 animations.css       # 动画样式
    │       ├── 📄 base.css             # 基础样式
    │       ├── 📄 components.css       # 组件样式
    │       ├── 📄 responsive.css       # 响应式样式
    │       └── 📁 themes/              # 主题样式
    │           ├── 📄 zero.css         # 零域主题
    │           └── 📄 suhui.css        # 溯洄主题
    │
    ├── 📁 components/            # 全局组件
    │   ├── 📁 common/            # 通用基础组件
    │   │   ├── 📄 LoadingSpinner.vue   # 加载动画
    │   │   ├── 📄 ModalDialog.vue      # 模态对话框
    │   │   ├── 📄 NotificationToast.vue # 通知提示
    │   │   ├── 📄 TheFooter.vue        # 页面底部
    │   │   └── 📄 TheHeader.vue        # 页面头部
    │   ├── 📁 layout/            # 布局组件
    │   │   ├── 📄 DualCityLayout.vue   # 双城布局容器
    │   │   ├── 📄 MeteorShower.vue     # 流星雨特效
    │   │   ├── 📄 MusicPlayer.vue      # 音乐播放器
    │   │   ├── 📄 NavigationSidebar.vue # 侧边导航
    │   │   └── 📄 SearchContainer.vue   # 搜索容器
    │   └── 📁 widgets/           # 功能组件
    │       ├── 📄 AnnouncementArc.vue  # 圆弧公告栏
    │       ├── 📄 DanmakuLayer.vue     # 弹幕层
    │       ├── 📄 FlipButton.vue       # 翻转按钮
    │       ├── 📄 HistoryTimeline.vue  # 历史时间线
    │       └── 📄 InfoPanel.vue        # 信息面板
    │
    ├── 📁 composables/           # Vue组合式函数
    │   ├── 📄 useAnimation.js          # 动画控制
    │   ├── 📄 useLocalStorage.js       # 本地存储
    │   ├── 📄 useMeteorShower.js       # 流星雨控制
    │   ├── 📄 useMusic.js              # 音乐播放
    │   ├── 📄 useScrollSync.js         # 滚动同步
    │   └── 📄 useTheme.js              # 主题管理
    │
    ├── 📁 config/                # 配置文件
    │   ├── 📄 api.js                   # API配置
    │   ├── 📄 app.js                   # 应用配置
    │   └── 📄 themes.js                # 主题配置
    │
    ├── 📁 features/              # 功能模块
    │   ├── 📁 admin/             # 管理后台模块 (待开发)
    │   ├── 📁 club-info/         # 社团信息模块 (待开发)
    │   ├── 📁 community/         # 社区互动模块 (待开发)
    │   ├── 📁 events/            # 活动管理模块 (待开发)
    │   ├── 📁 home/              # 🏠 首页功能模块
    │   │   ├── 📄 index.js             # 模块导出入口
    │   │   ├── 📁 assets/              # 首页专用资源
    │   │   │   ├── 📁 images/          # 首页图片
    │   │   │   └── 📁 styles/          # 首页样式
    │   │   │       ├── 📄 animations.css    # 首页动画
    │   │   │       ├── 📄 dual-city.css     # 双城布局样式
    │   │   │       └── 📄 responsive.css    # 首页响应式
    │   │   ├── 📁 components/          # 首页专用组件
    │   │   │   ├── 📄 CityDivider.vue       # 城市分隔线
    │   │   │   ├── 📄 GuideButtons.vue      # 引导按钮组
    │   │   │   ├── 📄 HistoryTimeline.vue   # 历史时间线
    │   │   │   ├── 📄 HomePage.vue          # 首页主体
    │   │   │   ├── 📄 InfoPanel.vue         # 信息面板
    │   │   │   ├── 📄 ScrollIndicator.vue   # 滚动指示器
    │   │   │   ├── 📄 SuhuiCity.vue         # 溯洄组件
    │   │   │   └── 📄 ZeroCity.vue          # 零域组件
    │   │   ├── 📁 composables/         # 首页专用逻辑
    │   │   │   ├── 📄 useCityTransition.js  # 城市切换
    │   │   │   ├── 📄 useContentDisplay.js  # 内容展示
    │   │   │   ├── 📄 useFlipAnimation.js   # 翻转动画
    │   │   │   ├── 📄 useScrollControl.js   # 滚动控制
    │   │   │   └── 📄 useThemeSwitch.js     # 主题切换
    │   │   └── 📁 data/                # 首页数据
    │   │       ├── 📄 city-content.js       # 城市内容
    │   │       ├── 📄 guide-config.js       # 引导配置
    │   │       └── 📄 history-timeline.js   # 历史数据
    │   ├── 📁 news/              # 新闻资讯模块 (待开发)
    │   ├── 📁 quiz/              # 🎯 ACGN测试模块
    │   │   ├── 📄 index.js             # 模块导出入口
    │   │   ├── 📁 assets/              # 测试专用资源
    │   │   │   ├── 📁 images/          # 测试图片
    │   │   │   └── 📁 styles/          # 测试样式
    │   │   │       ├── 📄 categories.css    # 分类卡片样式
    │   │   │       ├── 📄 danmaku.css       # 弹幕样式
    │   │   │       └── 📄 quiz-3d.css       # 3D效果样式
    │   │   ├── 📁 components/          # 测试专用组件
    │   │   │   ├── 📄 CategoryCard.vue      # 分类卡片
    │   │   │   ├── 📄 DanmakuLayer.vue      # 弹幕层
    │   │   │   ├── 📄 ProgressBar.vue       # 进度条
    │   │   │   ├── 📄 QuestionCard.vue      # 题目卡片
    │   │   │   ├── 📄 QuizApp.vue           # 测试应用主体
    │   │   │   ├── 📄 QuizHome.vue          # 测试首页
    │   │   │   ├── 📄 QuizResult.vue        # 结果页面
    │   │   │   └── 📄 QuizScreen.vue        # 答题界面
    │   │   ├── 📁 composables/         # 测试专用逻辑
    │   │   │   ├── 📄 useDanmaku.js         # 弹幕逻辑
    │   │   │   ├── 📄 useQuiz.js            # 测试核心逻辑
    │   │   │   ├── 📄 useQuizAnimation.js   # 测试动画
    │   │   │   ├── 📄 useQuizState.js       # 测试状态管理
    │   │   │   └── 📄 useScoring.js         # 评分算法
    │   │   └── 📁 data/                # 测试数据
    │   │       ├── 📄 categories.js         # 分类配置
    │   │       ├── 📄 scoring-rules.js      # 评分规则
    │   │       └── 📁 questions/           # 题目数据库
    │   │           └── 📄 anime.js          # 动画题目
    │   ├── 📁 services/          # 服务功能模块 (待开发)
    │   └── 📁 shared/            # 🔄 共享功能模块
    │       ├── 📄 index.js             # 共享模块导出
    │       ├── 📁 components/          # 跨模块共享组件
    │       │   ├── 📄 ConfirmDialog.vue     # 确认对话框
    │       │   ├── 📄 EmptyState.vue        # 空状态
    │       │   ├── 📄 ErrorBoundary.vue     # 错误边界
    │       │   ├── 📄 LoadingSpinner.vue    # 加载动画
    │       │   └── 📄 Toast.vue             # 提示消息
    │       ├── 📁 composables/         # 跨模块共享逻辑
    │       │   ├── 📄 useApi.js             # API调用
    │       │   ├── 📄 useAuth.js            # 认证逻辑
    │       │   ├── 📄 useLocalStorage.js    # 本地存储
    │       │   ├── 📄 useNotification.js    # 通知逻辑
    │       │   └── 📄 usePermission.js      # 权限检查
    │       └── 📁 utils/               # 共享工具函数
    │           ├── 📄constants.js          # 常量定义
    │           ├── 📄 formatters.js         # 格式化工具
    │           ├── 📄 helpers.js            # 辅助函数
    │           └── 📄 validators.js         # 验证工具
    │
    ├── 📁 router/                # Vue Router路由配置
    │   ├── 📄 guards.js                # 路由守卫
    │   ├── 📄 index.js                 # 路由主配置
    │   └── 📁 routes/                  # 路由模块分组
    │       ├── 📄 about.js             # 关于页面路由
    │       ├── 📄 admin.js             # 管理后台路由
    │       ├── 📄 community.js         # 社区路由
    │       ├── 📄 events.js            # 活动路由
    │       ├── 📄 home.js              # 首页路由
    │       ├── 📄 news.js              # 新闻路由
    │       ├── 📄 quiz.js              # 测试路由
    │       └── 📄 services.js          # 服务路由
    │
    ├── 📁 services/              # API服务层
    │   ├── 📄 api.js                   # API基础配置
    │   ├── 📄 auth.js                  # 认证API
    │   ├── 📄 events.js                # 活动API
    │   ├── 📄 music.js                 # 音乐API
    │   ├── 📄 news.js                  # 新闻API
    │   ├── 📄 quiz.js                  # 测试API
    │   └── 📄 upload.js                # 上传API
    │
    ├── 📁 stores/                # Pinia状态管理
    │   ├── 📄 index.js                 # Store主入口
    │   ├── 📄 auth.js                  # 认证状态
    │   ├── 📄 music.js                 # 音乐状态
    │   ├── 📄 notifications.js         # 通知状态
    │   ├── 📄 theme.js                 # 主题状态
    │   └── 📄 ui.js                    # UI状态
    │
    └── 📁 views/                 # 页面组件（路由入口）
        ├── 📄 Home.vue                 # 🏠 首页入口
        ├── 📁 About/                   # 关于页面组
        │   ├── 📄 index.vue            # 关于首页
        │   ├── 📄 Achievements.vue     # 社团成就
        │   ├── 📄 ClubHistory.vue      # 社团历史
        │   ├── 📄 Culture.vue          # 社团文化
        │   └── 📄 Members.vue          # 成员介绍
        ├── 📁 Admin/                   # 管理后台页面组
        │   ├── 📄 index.vue            # 管理首页
        │   ├── 📄 ContentManage.vue    # 内容管理
        │   ├── 📄 Dashboard.vue        # 管理面板
        │   ├── 📄 SystemSettings.vue   # 系统设置
        │   └── 📄 UserManage.vue       # 用户管理
        ├── 📁 Community/               # 社区页面组
        │   ├── 📄 index.vue            # 社区首页
        │   ├── 📄 Forum.vue            # 论坛首页
        │   ├── 📄 Gallery.vue          # 作品画廊
        │   ├── 📄 TopicDetail.vue      # 话题详情
        │   └── 📄 TopicList.vue        # 话题列表
        ├── 📁 Error/                   # 错误页面组
        │   ├── 📄 NotFound.vue         # 404页面
        │   ├── 📄 ServerError.vue      # 500页面
        │   └── 📄 Unauthorized.vue     # 401页面
        ├── 📁 Events/                  # 活动页面组
        │   ├── 📄 index.vue            # 活动首页
        │   ├── 📄 EventCalendar.vue    # 活动日历
        │   ├── 📄 EventDetail.vue      # 活动详情
        │   └── 📄 EventsList.vue       # 活动列表
        ├── 📁 News/                    # 新闻页面组
        │   ├── 📄 index.vue            # 新闻首页
        │   ├── 📄 NewsDetail.vue       # 新闻详情
        │   ├── 📄 NewsList.vue         # 新闻列表
        │   └── 📄 NewsSearch.vue       # 新闻搜索
        └── 📁 Services/                # 服务页面组
            ├── 📄 index.vue            # 服务首页
            ├── 📄 BusinessForm.vue     # 业务办理
            ├── 📄 ContactUs.vue        # 联系我们
            └── 📄 ResourceDownload.vue # 资源下载
```

---

## ⚙️ Backend 后端架构

### 📦 技术栈
- **运行时**: Node.js
- **框架**: Express.js
- **数据库**: MySQL + Redis
- **认证**: JWT + Passport.js
- **文件上传**: Multer
- **邮件服务**: Nodemailer

### 📁 目录结构详解

```
backend/
├── 📄 app.js                    # Express应用配置
├── 📄 server.js                 # 服务器入口
├── 📄 package.json             # 依赖配置
├── 📄 .env.example             # 环境变量模板
│
├── 📁 config/                  # 配置文件目录
│   ├── 📄constants.js          # 常量定义
│   ├── 📄 database.js           # 数据库配置
│   ├── 📄 email.js              # 邮件配置
│   ├── 📄 passport.js           # 认证策略配置
│   ├── 📄 redis.js              # Redis配置
│   └── 📄 upload.js             # 上传配置
│
├── 📁 controllers/             # 控制器目录
│   ├── 📄 adminController.js    # 管理控制器
│   ├── 📄 authController.js     # 认证控制器
│   ├── 📄 eventsController.js   # 活动控制器
│   ├── 📄 homeController.js     # 首页控制器
│   ├── 📄 musicController.js    # 音乐控制器
│   ├── 📄 newsController.js     # 新闻控制器
│   ├── 📄 quizController.js     # 测试控制器
│   └── 📄 uploadController.js   # 上传控制器
│
├── 📁 middleware/              # 中间件目录
│   ├── 📄 auth.js               # 认证中间件
│   ├── 📄 cors.js               # 跨域中间件
│   ├── 📄 errorHandler.js       # 错误处理中间件
│   ├── 📄 logger.js             # 日志中间件
│   ├── 📄 rateLimit.js          # 限流中间件
│   ├── 📄 upload.js             # 上传中间件
│   └── 📄 validation.js         # 数据验证中间件
│
├── 📁 models/                  # 数据模型目录
│   ├── 📄 index.js              # 模型关联导出
│   ├── 📄 Announcement.js       # 公告模型
│   ├── 📄 ClubHistory.js        # 社团历史模型
│   ├── 📄 Event.js              # 活动模型
│   ├── 📄 MusicTrack.js         # 音乐模型
│   ├── 📄 News.js               # 新闻模型
│   ├── 📄 QuizDanmaku.js        # 弹幕模型
│   ├── 📄 QuizQuestion.js       # 题目模型
│   ├── 📄 QuizResult.js         # 测试结果模型
│   ├── 📄 User.js               # 用户模型
│   └── 📄 UserPreference.js     # 用户偏好模型
│
├── 📁 routes/                  # 路由定义目录
│   ├── 📄 index.js              # 路由入口
│   ├── 📄 admin.js              # 管理路由
│   ├── 📄 auth.js               # 认证路由
│   ├── 📄 events.js             # 活动路由
│   ├── 📄 music.js              # 音乐路由
│   ├── 📄 news.js               # 新闻路由
│   ├── 📄 public.js             # 公开路由
│   ├── 📄 quiz.js               # 测试路由
│   └── 📄 upload.js             # 上传路由
│
├── 📁 services/                # 业务逻辑服务层
│   ├── 📄 authService.js        # 认证服务
│   ├── 📄 cacheService.js       # 缓存服务
│   ├── 📄 emailService.js       # 邮件服务
│   ├── 📄 eventsService.js      # 活动服务
│   ├── 📄 musicService.js       # 音乐服务
│   ├── 📄 newsService.js        # 新闻服务
│   ├── 📄 notificationService.js # 通知服务
│   ├── 📄 quizService.js        # 测试服务
│   └── 📄 uploadService.js      # 上传服务
│
└── 📁 utils/                   # 工具函数目录
    ├── 📄 dateUtils.js          # 日期工具
    ├── 📄 encryption.js         # 加密工具
    ├── 📄 helpers.js            # 通用辅助函数
    ├── 📄 logger.js             # 日志工具
    ├── 📄 responseUtils.js      # 响应工具
    ├── 📄 tokenUtils.js         # Token工具
    └── 📄 validators.js         # 数据验证器
```

---

## 🗄️ Database 数据库架构

### 📦 技术栈
- **主数据库**: MySQL 8.0
- **缓存**: Redis
- **数据库工具**: 原生SQL + 连接池

### 📁 目录结构

```
database/
├── 📄 schema.sql               # 数据库架构定义
└── 📄 seed.sql                 # 种子数据
```

### 🔗 核心数据表

| 表名 | 用途 | 关键字段 |
|------|------|----------|
| `users` | 用户信息 | id, username, email, role |
| `user_preferences` | 用户偏好 | user_id, theme, meteor_level |
| `news` | 新闻资讯 | id, title, content, category |
| `events` | 活动管理 | id, title, date, status |
| `quiz_questions` | 测试题目 | id, category, question, answer |
| `quiz_results` | 测试结果 | user_id, category, score |
| `music_tracks` | 音乐信息 | id, title, artist, playlist |
| `club_history` | 社团历史 | id, year, milestone, description |

---

## 🚀 Deployment 部署架构

### 📦 技术栈
- **容器化**: Docker + Docker Compose
- **Web服务器**: Nginx
- **CI/CD**: GitHub Actions
- **监控**: Prometheus + Grafana

### 📁 目录结构

```
deployment/
├── 📁 docker/                  # Docker配置
│   ├── 📄 docker-compose.yml   # 容器编排
│   ├── 📄 Dockerfile.backend   # 后端镜像
│   ├── 📄 Dockerfile.frontend  # 前端镜像
│   └── 📄 Dockerfile.nginx     # Nginx镜像
│
├── 📁 nginx/                   # Nginx配置
│   ├── 📄 nginx.conf           # 主配置
│   ├── 📁 sites/               # 站点配置
│   └── 📁 ssl/                 # SSL证书
│
├── 📁 scripts/                 # 部署脚本
│   ├── 📄 backup.sh            # 备份脚本
│   ├── 📄 deploy.sh            # 部署脚本
│   ├── 📄 init-server.sh       # 服务器初始化
│   └── 📄 update.sh            # 更新脚本
│
├── 📁 ci-cd/                   # CI/CD配置
│   └── 📁 .github/workflows/   # GitHub Actions
│
├── 📁 monitoring/              # 监控配置
│   ├── 📁 prometheus/          # Prometheus配置
│   ├── 📁 grafana/             # Grafana配置
│   └── 📁 logs/                # 日志配置
│
└── 📁 security/                # 安全配置
    ├── 📄 fail2ban.conf        # 入侵防护
    ├── 📄 firewall.rules       # 防火墙规则
    └── 📄 ssl-config.conf      # SSL配置
