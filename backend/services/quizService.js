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

// 从指定二级分类获取随机题目
// 参数: subcategoryId - 二级分类的ID
const getQuizQuestionBySubcategory = (subcategoryId) => {
  if (!quizData || !quizData.categories || quizData.categories.length === 0) {
    console.log('❌ 题库数据为空或未正确加载');
    return null;
  }

  try {
    // 将传入的ID转换为数字类型，与数据中的ID类型保持一致
    const targetId = Number(subcategoryId);
    
    // 遍历分类查找指定的二级分类
    for (const category of quizData.categories) {
      if (category.subcategories && category.subcategories.length > 0) {
        // 查找匹配ID的二级分类
        const targetSubcategory = category.subcategories.find(
          sub => sub.id === targetId  // 使用转换后的数字ID进行比较
        );
        
        // 如果找到目标二级分类且有题目
        if (targetSubcategory) {
          console.log(`✅ 找到二级分类: ${targetSubcategory.name} (ID: ${targetId})`);
          
          if (targetSubcategory.questions && targetSubcategory.questions.length > 0) {
            console.log(`📝 该分类包含 ${targetSubcategory.questions.length} 道题目`);
            // 从该二级分类中随机选择一道题
            const randomIndex = Math.floor(Math.random() * targetSubcategory.questions.length);
            return {
              ...targetSubcategory.questions[randomIndex],
              subcategoryId: targetSubcategory.id,
              subcategoryName: targetSubcategory.name
            };
          } else {
            console.log(`❌ 二级分类ID ${targetId} 下没有题目`);
            return null;
          }
        }
      }
    }

    // 未找到指定的二级分类
    console.log(`❌ 未找到ID为${targetId}的二级分类`);
    return null;
  } catch (error) {
    console.error('❌ 获取指定分类题目失败:', error);
    return null;
  }
};

// 获取所有题目
const getAllQuestions = () => {
  return quizData || { categories: [] };
};

module.exports = {
  getQuizQuestionBySubcategory,
  getAllQuestions,
  loadQuizData
};
    