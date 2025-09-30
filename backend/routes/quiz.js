// D:\code\CQUT-Web\backend\routes\quiz.js

const express = require('express');
const router = express.Router();
const quizService = require('../services/quizService');

// GET /api/quiz/random - 获取随机一道题
router.get('/random', (req, res) => {
  const question = quizService.getQuizQuestion();
  if (!question) {
    return res.status(500).json({ error: '题库为空或加载失败' });
  }
  res.json(question);
});

// GET /api/quiz/all - 获取所有题目
router.get('/all', (req, res) => {
  res.json(quizService.getAllQuestions());
});

module.exports = router;