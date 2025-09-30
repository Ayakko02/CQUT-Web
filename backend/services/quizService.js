// backend/services/quizService.js
const fs = require('fs');
const path = require('path');

// 题库数据路径
const QUIZ_DATA_PATH = path.join(__dirname, '../../database/quizzes.json');

// 读取题库数据
let quizData = null;

const loadQuizData = () => {
  try {
    if (fs.existsSync(QUIZ_DATA_PATH)) {
      const data = fs.readFileSync(QUIZ_DATA_PATH, 'utf8');
      quizData = JSON.parse(data);
      console.log('✅ 题库数据加载成功');
    } else {
      console.error('❌ 题库数据文件不存在:', QUIZ_DATA_PATH);

    }
  } catch (error) {
    console.error('❌ 加载题库数据失败:', error);
    quizData = { categories: [] };
  }
};

// 初始化加载数据
loadQuizData();

// 获取随机题目
const getQuizQuestion = () => {
  if (!quizData || !quizData.categories || quizData.categories.length === 0) {
    return null;
  }

  try {
    // 收集所有题目
    const allQuestions = [];
    quizData.categories.forEach(category => {
      if (category.subcategories) {
        category.subcategories.forEach(subcategory => {
          if (subcategory.questions) {
            subcategory.questions.forEach(question => {
              allQuestions.push(question);
            });
          }
        });
      }
    });

    if (allQuestions.length === 0) {
      return null;
    }

    // 随机选择一道题
    const randomIndex = Math.floor(Math.random() * allQuestions.length);
    return allQuestions[randomIndex];
  } catch (error) {
    console.error('❌ 获取随机题目失败:', error);
    return null;
  }
};

// 获取所有题目
const getAllQuestions = () => {
  return quizData || { categories: [] };
};

module.exports = {
  getQuizQuestion,
  getAllQuestions,
  loadQuizData
};
