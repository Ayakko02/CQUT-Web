├── 📁 CQUT Web/    # Git仓库根目录
│   ├── 📁 frontend/              # Vue.js前端应用 (SPA)
│   ├── 📁 backend/               # Node.js后端API服务
│   ├── 📁 database/              # 数据库脚本与迁移
│   ├── 📁 deployment/            # 部署相关配置
│   └── 📄 README.md              # 项目说明文档


frontend/
├── public/                       # 静态资源
├── src/
│   ├── assets/                  # 公共资源(图片、样式等)
│   ├── components/              # 全局通用组件
│   │   ├── common/             # 纯UI组件(Button, Modal等)
│   │   └── layout/             # 布局组件(Header, Footer, Nav)
│   ├── composables/            # Vue组合式函数
│   ├── router/                 # 路由配置
│   ├── stores/                 # 状态管理(Pinia)
│   │   ├── auth.js            # 认证状态
│   │   ├── ui.js              # UI状态(主题、侧边栏等)
│   │   └── notifications.js   # 通知状态
│   ├── services/               # API服务层
│   │   ├── api.js             # Axios实例和拦截器
│   │   ├── auth.js            # 认证相关API
│   │   ├── news.js            # 新闻相关API
│   │   ├── events.js          # 活动相关API
│   │   └── quiz.js            # 小程序相关API
│   ├── views/                  # 页面级组件
│   │   ├── Home.vue           # 首页
│   │   ├── About.vue          # 关于我们
│   │   ├── News.vue           # 资讯中心
│   │   ├── Events.vue         # 活动页面
│   │   ├── Gallery.vue        # 作品画廊
│   │   └── Admin/             # 管理后台页面
│   ├── features/              # 【特性模块】功能模块
│   │   └── quiz/              # ACGN浓度测试小程序
│   │       ├── index.js       # 模块导出
│   │       ├── components/    # 小程序专用组件
│   │       │   ├── QuizHome.vue
│   │       │   ├── QuizScreen.vue
│   │       │   └── DanmakuLayer.vue
│   │       ├── composables/   # 小程序组合式函数
│   │       │   ├── useQuiz.js
│   │       │   └── useDanmaku.js
│   │       ├── assets/        # 小程序专用资源
│   │       └── router.js      # 小程序内部路由(如果需要)
│   ├── App.vue                # 根组件
│   └── main.js               # 应用入口
├── index.html                # HTML模板
├── package.json
├── vite.config.js           # Vite配置
└── .env.*                   # 环境变量



backend/
├── config/                     # 配置文件
│   ├── database.js            # 数据库配置
│   ├── passport.js            # 认证策略配置
│   └── constants.js           # 常量定义
├── controllers/               # 控制器
│   ├── authController.js      # 认证控制器
│   ├── newsController.js      # 新闻控制器
│   ├── eventsController.js    # 活动控制器
│   ├── quizController.js      # 小程序控制器
│   └── uploadController.js    # 文件上传控制器
├── middleware/                # 自定义中间件
│   ├── auth.js               # 认证中间件
│   ├── validation.js         # 数据验证中间件
│   ├── errorHandler.js       # 错误处理中间件
│   └── logger.js             # 日志中间件
├── models/                   # 数据模型
│   ├── User.js              # 用户模型
│   ├── News.js              # 新闻模型
│   ├── Event.js             # 活动模型
│   ├── QuizQuestion.js      # 题目模型
│   ├── QuizDanmaku.js       # 弹幕模型
│   └── index.js             # 模型关联导出
├── routes/                   # 路由定义
│   ├── index.js             # 路由入口
│   ├── auth.js              # 认证路由
│   ├── news.js              # 新闻路由
│   ├── events.js            # 活动路由
│   ├── quiz.js              # 小程序路由
│   └── upload.js            # 上传路由
├── services/                 # 业务逻辑服务
│   ├── authService.js       # 认证服务
│   ├── newsService.js       # 新闻服务
│   ├── eventsService.js     # 活动服务
│   ├── quizService.js       # 小程序服务
│   └── emailService.js      # 邮件服务
├── utils/                   # 工具函数
│   ├── helpers.js          # 通用辅助函数
│   ├── validators.js       # 数据验证器
│   └── logger.js           # 日志工具
├── app.js                  # Express应用配置
├── server.js              # 服务器入口
└── package.json

