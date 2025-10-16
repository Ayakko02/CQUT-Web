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
router.get('/subcategory/:subcategoryId', (req, res) => {
  try {
    const { subcategoryId } = req.params;
    console.log(`请求请求二级分类题目: ${subcategoryId}`);
    
    const question = quizService.getQuizQuestionBySubcategory(subcategoryId);
    
    if (!question) {
      return res.status(404).json({ 
        error: `未找到ID为${subcategoryId}的二级分类或该分类下没有题目` 
      });
    }
    
    res.json(question);
  } catch (error) {
    console.error('获取分类题目失败:', error);
    res.status(500).json({ error: '获取分类题目时发生错误' });
  }
});


module.exports = router;
