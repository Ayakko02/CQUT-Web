// backend/server.js
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 最简单的CORS配置 - 允许所有来源
app.use(cors());

// 其他中间件
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 路由配置
const quizRoutes = require('./routes/quiz');
app.use('/api/quiz', quizRoutes);

// 启动服务器
const server = app.listen(PORT, () => {
  console.log(`✅ 后端运行在：http://localhost:${PORT}`);
});

// WebSocket 服务
const startWebSocketServer = require('./services/websocket/index');
startWebSocketServer(server);