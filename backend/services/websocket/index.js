// backend/services/websocket/index.js
const WebSocket = require('ws');
// const QuizService = require('../quizService'); // 暂时注释，避免报错,如果不需要持久保存弹幕就用不着这个

// 存储所有连接的客户端
const clients = new Set();

// 向所有客户端广播消息
function broadcastAll(message) {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// 处理弹幕消息持久化（暂时空实现）
async function handleDanmakuMessage(message) {
  // try {
  //   await QuizService.saveDanmaku({
  //     text: message.text,
  //     timestamp: message.timestamp,
  //     quizId: message.quizId || 'default'
  //   });
  // } catch (error) {
  //   console.error('保存弹幕失败:', error);
  // }
}

// WebSocket启动函数
function startWebSocketServer(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('🎮 新用户连接到 WebSocket');

    // 发送欢迎消息
    ws.send(JSON.stringify({
      type: 'welcome',
      message: '欢迎来到弹幕系统！'
    }));

    // 处理客户端消息
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());

        // 补充必要字段
        if (!message.type) message.type = 'danmaku';
        if (!message.timestamp) message.timestamp = Date.now();

        // 内容过滤
        if (message.text && typeof message.text === 'string') {
          message.text = message.text.replace(/<[^>]*>?/gm, ''); // XSS 防护
          if (message.text.length > 100) {
            message.text = message.text.substring(0, 100) + '...';
          }
        }

        // 补全前端可能没传的字段
        message.top = message.top || (Math.random() * 80 + 5);
        message.color = message.color || '#ffffff';
        message.size = message.size || (Math.floor(Math.random() * 4) + 16);
        message.speed = message.speed || (Math.random() * 5 + 5);

        // 广播消息（直接发 message，或包装成 { type: 'danmaku', data: message }）
        broadcastAll(JSON.stringify(message));

        // 保存弹幕（如果需要）
        if (message.type === 'danmaku') {
          await handleDanmakuMessage(message);
        }
      } catch (error) {
        console.error('消息处理错误:', error);
      }
    });

ws.on('close', () => {
  clients.delete(ws);
  console.log('🔌 用户断开连接');
});

    ws.on('error', (error) => {
      console.error('WebSocket 错误:', error);
    });
  });

  console.log('[WebSocket] 服务已启动');
  return wss;
}

module.exports = startWebSocketServer;