<template>
  <!-- 根容器 -->
  <div class="app-root">
    <!-- 涟漪容器 -->
    <div class="ripple-container" @click="createRipple"></div>
    
    <div class="app-container">
      <!-- 加载动画 -->
     <div v-if="loading" class="loading">
  <div class="loading-character">
    <img 
      src="/asset/少女祈祷中1.gif" 
      alt="少女祈祷中" 
      class="loading-gif"
    >
  </div>
  <div class="loading-text">正在召唤题目...</div>
  <div class="loading-subtext">再等等嘛~</div>
</div>
      <!-- 背景层 - 视差滚动效果 -->
      <div class="background">
        <div class="bg-scroll-layer layer-1" :style="layer1Style"></div>
        <div class="bg-scroll-layer layer-2" :style="layer2Style"></div>
        <div class="bg-scroll-layer layer-3" :style="layer3Style"></div>
        <div class="background-filter"></div>
      </div>

      <!-- 弹幕组件 -->
      <DanmakuLayer 
        :initial-danmakus="initialDanmakus"
        @newDanmaku="handleNewDanmaku"
        @playSound="playSound"
      />

      <!-- 主内容区 -->
      <div class="container">
        <div class="main-content">
          <!-- 主体玻璃面板 -->
          <div 
            class="glass-panel" 
            :class="{ 
              'quiz-mode': currentView === 'quiz', 
              'empty-state': isEmptyState,
              'category-mode': currentView === 'categories',
              'subcategory-mode': currentView === 'subcategories'
            }"
            :style="glassPanelStyle"
          >
            <!-- 空状态（题库加载失败） -->
            <div v-if="isEmptyState" class="empty-container">
              <div class="empty-character"> <img src="/asset/轻音哭哭.gif" alt="哭泣小人" class="crying-animation"></div>
              <h2 class="empty-title">题库娘离家出走了QAQ</h2>
              <p class="empty-desc">请稍后再试，或者联系管理员修复~</p>
              <button class="empty-retry" @click="retryLoadData">重新加载</button>
            </div>

            <!-- 标题区 -->
            <h1 class="main-title" :class="{ hidden: currentView === 'quiz' || currentView === 'subcategories' }">
              <span class="title-accent">CQUT</span>动漫社问答挑战
            </h1>
            
            <!-- 一级分类选择界面 -->
            <div v-if="currentView === 'categories' && !isEmptyState" class="categories-container">
              <p class="category-intro">选择一个领域开始挑战吧！</p>
              <div class="categories-flow">
                <div 
                  v-for="(category, index) in categories" 
                  :key="category.id" 
                  class="category-card"
                  :class="{ 
                    selected: category.id === selectedCategory?.id,
                    'combo-active': comboCount > 0 && lastSelectedCategoryId === category.id
                  }"
                  :style="categoryCardStyle(category, index)"
                  @click="selectCategory(category)"
                  @mouseenter="handleCardHover(category.id, true)"
                  @mouseleave="handleCardHover(category.id, false)"
                >
                  <div class="category-microanim" :class="`microanim-${category.type}`"></div>
                  <i :class="category.icon" class="category-icon"></i>
                  <h3 class="category-name">{{ category.name }}</h3>
                  <div class="category-count">
                    <i class="fas fa-question-circle"></i> {{ getTotalQuestions(category) }}题
                  </div>
                  <div v-if="comboCount > 0 && lastSelectedCategoryId === category.id" class="combo-badge">
                    {{ comboCount }} Combo!
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 二级分类选择界面 -->
            <div v-if="currentView === 'subcategories' && !isEmptyState" class="subcategories-container">
              <!-- 中心的一级分类圆形卡片 -->
              <div 
                class="main-category-circle"
                :style="{
                  backgroundColor: selectedCategory?.color,
                  transform: `scale(${mainCategoryScale})`
                }"
                @click="handleBackToMainCategories"
              >
                <i :class="selectedCategory?.icon" class="main-category-icon"></i>
                <div class="main-category-name">{{ selectedCategory?.name }}</div>
                <div class="back-indicator">
                  <i class="fas fa-arrow-left"></i> 返回
                </div>
              </div>
              
              <!-- 环绕的二级分类圆形卡片 -->
              <div 
                class="subcategory-circle"
                v-for="(sub, index) in selectedCategory?.subcategories || []"
                :key="sub.id"
                :style="subcategoryPosition(index, selectedCategory?.subcategories.length || 0)"
                @click="selectSubcategory(sub)"
                @mouseenter="playSound('hover')"
              >
                <i :class="sub.icon" class="subcategory-icon"></i>
                <div class="subcategory-name">{{ sub.name }}</div>
                <div class="subcategory-count">{{ sub.questions.length }}题</div>
              </div>
            </div>
            
            <!-- 答题界面 -->
            <div v-if="currentView === 'quiz' && !isEmptyState" class="quiz-container">
              <div class="quiz-header">
                <div class="quiz-category-badge">
                  <i :class="selectedSubcategory?.icon || selectedCategory?.icon"></i> 
                  {{ selectedSubcategory ? `${selectedCategory?.name} - ${selectedSubcategory.name}` : selectedCategory?.name }}
                </div>
                <div class="quiz-stats">
                  <span>已答对: {{ correctAnswers }}题</span>
                  <span v-if="comboCount > 0" class="combo-stat">| {{ comboCount }} Combo</span>
                </div>
              </div>
              
              <div class="question-card">
                <div class="question-number">问题 {{ currentQuestionIndex + 1 }}</div>
                <div class="question-text">{{ currentQuestion.question }}</div>
                
                <!-- 答案区域 -->
                <div v-if="showAnswer" class="answer-section">
                  <div class="answer-emoji" :class="answerEmojiClass"></div>
                  <h3 class="answer-title">{{ answerTitle }}</h3>
                  <p class="answer-text">{{ currentQuestion.answer }}</p>
                  <div v-if="currentQuestion.clubTip" class="club-tip">
                    <i class="fas fa-lightbulb"></i> {{ currentQuestion.clubTip }}
                  </div>
                </div>
              </div>
              
              <div class="quiz-actions">
                <button 
                  class="quiz-btn action-retry" 
                  @click="handleRetryQuestion"
                  :disabled="showAnswer"
                >
                  <i class="fas fa-redo"></i> 换一题
                </button>
                
                <button 
                  class="quiz-btn action-answer" 
                  @click="handleShowAnswer"
                  v-if="!showAnswer"
                >
                  <i class="fas fa-lightbulb"></i> 看答案
                </button>
                
                <button 
                  class="quiz-btn action-continue" 
                  @click="handleContinue"
                  v-if="showAnswer"
                >
                  <i class="fas fa-arrow-right"></i> 继续
                </button>
                
                <button class="quiz-btn action-back" @click="handleBackToSubcategories">
                  <i class="fas fa-arrow-left"></i> 返回
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 音乐播放器组件 -->
      <MusicPlayer 
        ref="musicPlayer"
        :initial-volume="70"
        :auto-play="true"
        @trackChange="handleMusicTrackChange"
        @play="handleMusicPlay"
        @pause="handleMusicPause"
        @volumeChange="handleVolumeChange"
      />

      <!-- 底部引流区 -->
      <div class="footer-section">
        <div class="footer-text">CQUT动漫社 - 零域与溯回</div>
        <div class="club-recruit">
          <span>想找同好？</span>
          <button class="recruit-btn" @click="showRecruitQr">
            加入我们 <i class="fas fa-users"></i>
          </button>
        </div>
        <!-- 二维码弹窗 -->
        <div v-if="showQrCode" class="qr-modal">
          <div class="qr-overlay" @click="showQrCode = false"></div>
          <div class="qr-content">
            <button class="qr-close" @click="showQrCode = false">
              <i class="fas fa-times"></i>
            </button>
            <h3 class="qr-title">扫码加入社团QQ群</h3>
            <div class="qr-code">
              <div class="qr-placeholder">QQ群二维码</div>
            </div>
            <p class="qr-desc">群号：123456789（示例）</p>
          </div>
        </div>
      </div>

      <!-- 成就/彩蛋弹窗 -->
      <div v-if="showPopup" class="popup-container">
        <div class="popup-overlay" @click="closePopup"></div>
        <div class="popup-content" :class="popupType">
          <div class="popup-icon">
            <i v-if="popupType === 'achievement'" class="fas fa-trophy"></i>
            <i v-if="popupType === 'combo'" class="fas fa-fire"></i>
            <i v-if="popupType === 'legendary'" class="fas fa-crown"></i>
            <i v-if="popupType === 'category-love'" class="fas fa-heart"></i>
          </div>
          <h3 class="popup-title">{{ popupTitle }}</h3>
          <p class="popup-message">{{ popupMessage }}</p>
          <button class="popup-close" @click="closePopup">
            确定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, nextTick } from 'vue';
import DanmakuLayer from '../components/DanmakuLayer.vue';
import MusicPlayer from '../components/QuizScreen.vue';

// 基础状态管理
const loading = ref(true);
const isEmptyState = ref(false);
const currentView = ref('categories');
const selectedCategory = ref(null);
const selectedSubcategory = ref(null);
const lastSelectedCategoryId = ref(null);
const categoryClickCount = ref({});
const categories = ref([]);
const currentQuestion = ref({ question: '', answer: '', type: 'normal', clubTip: '' });
const currentQuestionIndex = ref(0);
const showAnswer = ref(false);
const correctAnswers = ref(0);
const comboCount = ref(0);
const mainCategoryScale = ref(0);

// 音乐播放器引用
const musicPlayer = ref(null);

// API基础URL
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000/api' 
  : '/api';

// 弹幕初始数据
const initialDanmakus = ref([
  { text: '进击的巨人太好看了！', color: '#ff6b6b', speed: 'medium' },
  { text: '有人喜欢火影忍者吗？', color: '#4cd964', speed: 'slow' },
  { text: '我是社团新人，请多指教！', color: '#66bbff', speed: 'fast' },
  { text: '这个问答好难啊QAQ', color: '#ffcb69', speed: 'medium' },
  { text: '招新啦！', color: '#c774e8', speed: 'medium' }
]);

// 加载题库数据
const loadQuizData = async () => {
  try {
    loading.value = true;
    
    // 从后端API获取数据
    const response = await fetch(`${API_BASE_URL}/quiz/all`);
    
    if (response.ok) {
      const data = await response.json();
      categories.value = data.categories || [];
      console.log('从后端API加载题库成功');
    } else {
      throw new Error('后端API请求失败');
    }
  } catch (error) {
    console.error('题库加载失败:', error);
    isEmptyState.value = true;
  } finally {
    loading.value = false;
    
    // 检查是否有数据
    if (categories.value.length === 0) {
      isEmptyState.value = true;
    }
  }
};

// 重新加载数据
const retryLoadData = () => {
  isEmptyState.value = false;
  loadQuizData();
};

// 获取随机题目（从后端API）
const getRandomQuestion = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/quiz/random`);
    if (response.ok) {
      const question = await response.json();
      return question;
    } else {
      throw new Error('API请求失败');
    }
  } catch (error) {
    console.error('无法从API获取随机题目:', error);
    // 如果API失败，返回错误题目
    return { 
      question: '题目加载失败，请稍后重试', 
      answer: '网络连接问题', 
      type: 'error',
      clubTip: ''
    };
  }
};

// 处理新弹幕
const handleNewDanmaku = (danmaku) => {
  console.log('新弹幕:', danmaku);
  if (danmaku.text.includes('管理员')) {
    playSound('danmaku');
  }
};

// 音乐播放器事件处理
const handleMusicTrackChange = (event) => {
  console.log('音乐切换:', event);
};

const handleMusicPlay = () => {
  console.log('音乐开始播放');
};

const handleMusicPause = () => {
  console.log('音乐暂停');
};

const handleVolumeChange = (volume) => {
  console.log('音量改变:', volume);
};

// 弹窗相关
const showPopup = ref(false);
const popupType = ref('achievement');
const popupTitle = ref('');
const popupMessage = ref('');

// 引流相关
const showQrCode = ref(false);

// 背景动画相关
const layer1X = ref(0);
const layer2X = ref(0);
const layer3X = ref(0);
let animationFrameId = null;
const bgImages = {
  layer1: [
    '/asset/lay7.jpg',

  ],
  layer2: [
    '/asset/lay6.jpg',

  ],
  layer3: [
    '/asset/lay1.jpg',

  ]
};

// 计算一级分类的总题目数
const getTotalQuestions = (category) => {
  if (!category.subcategories) return 0;
  return category.subcategories.reduce((total, sub) => {
    return total + (sub.questions ? sub.questions.length : 0);
  }, 0);
};

// 点击涟漪效果
const createRipple = (e) => {
  const rippleContainer = document.querySelector('.ripple-container');
  const ripple = document.createElement('span');
  
  // 鲜艳的颜色选择
  const colors = [
    'rgba(255, 69, 0, 0.7)',    // 橙色
    'rgba(138, 43, 226, 0.7)',  // 紫色
    'rgba(0, 191, 255, 0.7)',   // 天蓝色
    'rgba(255, 105, 180, 0.7)', // 粉色
    'rgba(0, 255, 127, 0.7)',   // 绿色
    'rgba(255, 215, 0, 0.7)'    // 金色
  ];
  
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  // 增大涟漪尺寸，确保可见性
  const x = e.clientX;
  const y = e.clientY;
  const size = Math.max(window.innerWidth, window.innerHeight) * 0.6;
  
  // 设置涟漪样式
  ripple.style.position = 'absolute';
  ripple.style.left = `${x - size/2}px`;
  ripple.style.top = `${y - size/2}px`;
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.background = randomColor;
  ripple.style.borderRadius = '50%';
  ripple.style.transform = 'scale(0)';
  ripple.style.opacity = '0.7';
  ripple.style.pointerEvents = 'none';
  ripple.style.animation = 'ripple 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards';
  ripple.style.zIndex = '99999';
  
  // 添加到容器并播放音效
  rippleContainer.appendChild(ripple);
  playSound('click');
  
  // 动画结束后移除元素
  setTimeout(() => {
    ripple.remove();
  }, 1000);
};

// 背景动画逻辑
const updateBackground = () => {
  // 上层和下层向左流动，中层向右流动
  layer1X.value = (layer1X.value - 0.1) % 100;
  layer2X.value = (layer2X.value + 0.07) % 100;
  layer3X.value = (layer3X.value - 0.04) % 100;
  animationFrameId = requestAnimationFrame(updateBackground);
};

// 背景层样式
const layer1Style = computed(() => ({
  transform: `translateX(${layer1X.value}%)`,
  backgroundImage: `url(${bgImages.layer1[0]})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'repeat-x'
}));
const layer2Style = computed(() => ({
  transform: `translateX(${layer2X.value}%)`,
  backgroundImage: `url(${bgImages.layer2[0]})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'repeat-x'
}));
const layer3Style = computed(() => ({
  transform: `translateX(${layer3X.value}%)`,
  backgroundImage: `url(${bgImages.layer3[0]})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'repeat-x'
}));

// 分类卡片样式
const categoryCardStyle = (category, index) => ({
  background: category.color,
  transform: `translateY(${category.yOffset || (Math.sin(Date.now() * 0.001 + index) * 5)}px) rotate(${category.rotation || 0}deg) scale(${category.scale || 1})`,
  boxShadow: category.isHovered 
    ? `0 0 25px ${category.glowColor}, 0 8px 20px rgba(0, 0, 0, 0.3)` 
    : '0 8px 20px rgba(0, 0, 0, 0.25)',
  opacity: category.opacity !== undefined ? category.opacity : 1,
  zIndex: category.zIndex || 10,
  transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
});

// 处理卡片悬停效果
const handleCardHover = (categoryId, isHovered) => {
  const category = categories.value.find(cat => cat.id === categoryId);
  if (category) {
    category.isHovered = isHovered;
    if (isHovered) {
      category.scale = 1.08;
      playSound('hover');
    } else if (!category.selected) {
      category.scale = 1;
    }
  }
};

// 主体面板样式
const glassPanelStyle = computed(() => ({
  transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
  minHeight: currentView === 'subcategories' ? '600px' : '550px'
}));

// 二级分类位置计算
const subcategoryPosition = (index, total) => {
  // 计算角度（圆周分布）
  const angle = (index / total) * Math.PI * 2;
  // 半径（根据屏幕大小调整）
  const radius = Math.min(window.innerWidth, window.innerHeight) * 0.25;
  // 计算位置
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  
  return {
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
    backgroundColor: selectedCategory?.color,
    transform: 'translate(-50%, -50%) scale(1)',
    opacity: 1,
    transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
  };
};

// 答案相关计算属性
const answerEmojiClass = computed(() => {
  return 'answer-emoji ' + (currentQuestion.value.emoji ? 'custom-emoji' : 'default-emoji');
});

const answerTitle = computed(() => {
  return currentQuestion.value.emoji ? `${currentQuestion.value.emoji} 回答正确！` : '回答正确！';
});

// 一级分类选择处理
const selectCategory = (category) => {
  playSound('select');
  
  // 更新点击计数
  categoryClickCount.value[category.id] = (categoryClickCount.value[category.id] || 0) + 1;
  
  // 检查是否连续点击同一领域3次以上
  if (categoryClickCount.value[category.id] >= 3) {
    showCategoryLovePopup(category);
  }
  
  // 处理连击逻辑
  if (lastSelectedCategoryId.value === category.id) {
    comboCount.value++;
    if (comboCount.value % 3 === 0) {
      showComboPopup(comboCount.value);
    }
  } else {
    comboCount.value = 1;
  }
  lastSelectedCategoryId.value = category.id;
  
  // 记录选择的分类
  selectedCategory.value = category;
  selectedSubcategory.value = null;
  
  // 切换对应领域的背景音乐
  if (musicPlayer.value) {
    musicPlayer.value.changeTrack(category.type);
  }
  
  // 其他卡片隐藏并向外滑出
  categories.value.forEach(cat => {
    if (cat.id !== category.id) {
      // 随机方向滑出
      const angle = Math.random() * Math.PI * 2;
      const distance = window.innerWidth * 1.5;
      
      cat.transition = 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)';
      cat.xOffset = Math.cos(angle) * distance;
      cat.yOffset = Math.sin(angle) * distance;
      cat.opacity = 0;
      cat.zIndex = 5;
    } else {
      // 选中的卡片放大并移到中心
      cat.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
      cat.scale = 1.2;
      cat.rotation = 0;
      cat.zIndex = 20;
    }
  });
  
  // 延迟切换到二级分类界面，等待动画完成
  setTimeout(() => {
    currentView.value = 'subcategories';
    // 触发中心圆形的动画
    mainCategoryScale.value = 0;
    nextTick(() => {
      setTimeout(() => {
        mainCategoryScale.value = 1;
      }, 50);
    });
  }, 800);
};

// 二级分类选择处理
const selectSubcategory = (subcategory) => {
  playSound('select');
  selectedSubcategory.value = subcategory;
  
  // 隐藏所有二级分类
  document.querySelectorAll('.subcategory-circle').forEach((el, index) => {
    setTimeout(() => {
      el.style.transform = 'translate(-50%, -50%) scale(0)';
      el.style.opacity = '0';
    }, index * 100);
  });
  
  // 缩小中心分类
  setTimeout(() => {
    mainCategoryScale.value = 0;
    
    // 切换到答题界面
    setTimeout(() => {
      currentView.value = 'quiz';
      // 从API获取随机题目
      selectRandomQuestion();
    }, 500);
  }, 500);
};

// 随机选择问题
const selectRandomQuestion = async () => {
  if (!selectedSubcategory.value) return;
  
  const question = await getRandomQuestion();
  currentQuestion.value = question;
  showAnswer.value = false;
  
  // 播放出题音效
  playSound('question');
};

// 答题界面操作
const handleRetryQuestion = () => {
  playSound('retry');
  selectRandomQuestion();
};

const handleShowAnswer = () => {
  playSound('answer');
  showAnswer.value = true;
  // 答对计数增加
  correctAnswers.value++;
  
  // 检查是否达成成就
  checkAchievements();
};

const handleContinue = () => {
  playSound('continue');
  selectRandomQuestion();
};

// 返回按钮处理
const handleBackToSubcategories = () => {
  playSound('back');
  currentView.value = 'subcategories';
  mainCategoryScale.value = 1;
  
  // 重新显示二级分类
  setTimeout(() => {
    document.querySelectorAll('.subcategory-circle').forEach(el => {
      el.style.transform = 'translate(-50%, -50%) scale(1)';
      el.style.opacity = '1';
    });
  }, 300);
};

const handleBackToMainCategories = () => {
  playSound('back');
  
  // 隐藏二级分类
  document.querySelectorAll('.subcategory-circle').forEach(el => {
    el.style.transform = 'translate(-50%, -50%) scale(0)';
    el.style.opacity = '0';
  });
  
  // 缩小中心分类
  mainCategoryScale.value = 0;
  
  // 返回一级分类
  setTimeout(() => {
    // 重置所有分类卡片
    categories.value.forEach(cat => {
      cat.transition = 'all 0.5s ease';
      cat.xOffset = 0;
      cat.yOffset = 0;
      cat.opacity = 1;
      cat.scale = 1;
      cat.rotation = 0;
      cat.zIndex = 10;
      cat.isHovered = false;
    });
    
    currentView.value = 'categories';
    // 切换回默认音乐
    if (musicPlayer.value) {
      musicPlayer.value.changeTrack('default');
    }
  }, 500);
};

// 检查成就达成
const checkAchievements = () => {
  const achievements = [
    { count: 3, message: '动漫新手 - 已答对3题！', type: 'achievement' },
    { count: 5, message: '动漫达人 - 已答对5题！', type: 'achievement' },
    { count: 10, message: '动漫大师 - 已答对10题！', type: 'achievement' },
    { count: 15, message: '二次元专家 - 已答对15题！', type: 'achievement' }
  ];
  
  const achieved = achievements.find(ach => ach.count === correctAnswers.value);
  if (achieved) {
    showPopup.value = true;
    popupType.value = achieved.type;
    popupTitle.value = '达成成就！';
    popupMessage.value = achieved.message;
    playSound('achievement');
  }
};

// 显示连击弹窗
const showComboPopup = (count) => {
  showPopup.value = true;
  popupType.value = 'combo';
  popupTitle.value = `${count} Combo！`;
  popupMessage.value = count >= 5 ? '你是真爱粉吧！太厉害了！' : '保持状态，继续加油！';
  playSound('combo');
};

// 显示领域偏好弹窗
const showCategoryLovePopup = (category) => {
  showPopup.value = true;
  popupType.value = 'category-love';
  popupTitle.value = `喜欢${category.name}呢！`;
  popupMessage.value = `看来你对${category.name}很感兴趣呢！我们社团也有很多同好哦~`;
  playSound('like');
};

// 关闭弹窗
const closePopup = () => {
  showPopup.value = false;
};

// 显示招募二维码
const showRecruitQr = () => {
  showQrCode.value = true;
  playSound('click');
};

// 音效系统 - 解决与背景音乐的冲突
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let isAudioContextStarted = false;

const playSound = async (type) => {
  try {
    // 确保AudioContext已经启动（解决浏览器自动播放策略）
    if (!isAudioContextStarted && audioContext.state === 'suspended') {
      await audioContext.resume();
      isAudioContextStarted = true;
    }

    // 音效文件映射
    const soundFiles = {
      click: '/asset/水下气泡音效1.mp3',
      select: '/asset/水下气泡音效1.mp3',
      hover: '/asset/水下气泡音效1.mp3',
      answer: '/asset/水下气泡音效1.mp3',
      continue: '/asset/水下气泡音效1.mp3',
      back: '/asset/水下气泡音效1.mp3',
      question: '/asset/水下气泡音效1.mp3',
      retry: '/asset/水下气泡音效1.mp3',
      danmaku: '/asset/水下气泡音效1.mp3',
      achievement: '/asset/水下气泡音效1.mp3',
      combo: '/asset/水下气泡音效1.mp3',
      like: '/asset/水下气泡音效1.mp3',
      legendary: '/asset/水下气泡音效1.mp3'
    };

    const audioFile = soundFiles[type];
    if (!audioFile) {
      console.warn(`未找到音效类型: ${type}`);
      return;
    }

    // 使用fetch获取音频数据，避免与HTML5 Audio冲突
    const response = await fetch(audioFile);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    // 创建音频源
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    
    // 创建增益节点控制音量
    const gainNode = audioContext.createGain();
    
    // 音量设置
    const volumes = {
      click: 0.7,
      select: 0.8,
      hover: 0.4,
      answer: 0.8,
      continue: 0.7,
      back: 0.6,
      question: 0.7,
      retry: 0.6,
      danmaku: 0.5,
      achievement: 0.9,
      combo: 0.8,
      like: 0.7,
      legendary: 1.0
    };
    
    gainNode.gain.value = volumes[type] || 0.7;
    
    // 连接节点
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // 播放
    source.start(0);
    
  } catch (error) {
    console.log('音效播放失败:', error);
    // 降级方案：使用HTML5 Audio（可能会暂停背景音乐）
    fallbackPlaySound(type);
  }
};

// 降级播放方案
const fallbackPlaySound = async (type) => {
  try {
    const audioFile = '/asset/水下气泡音效1.mp3';
    const audio = new Audio(audioFile);
    
    const volumes = {
      click: 0.7,
      select: 0.8,
      hover: 0.4,
      answer: 0.8,
      continue: 0.7,
      back: 0.6,
      question: 0.7,
      retry: 0.6,
      danmaku: 0.5,
      achievement: 0.9,
      combo: 0.8,
      like: 0.7,
      legendary: 1.0
    };
    
    audio.volume = volumes[type] || 0.7;
    
    // 设置不暂停其他音频
    audio.muted = false;
    
    await audio.play();
  } catch (error) {
    console.log('降级音效播放失败:', error);
  }
};

// 生命周期钩子
onMounted(() => {
  // 初始化分类卡片
  categories.value.forEach(cat => {
    cat.rotation = 0;
    cat.yOffset = 0;
    cat.isHovered = false;
  });
  
  // 加载题库数据
  loadQuizData();
  
  // 开始背景动画
  updateBackground();
  
  // 组件卸载时清理
  onUnmounted(() => {
    cancelAnimationFrame(animationFrameId);
  });
});
</script>
<style scoped>
/* 基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  background: #0f0f1a;
  color: #fff;
  min-height: 100vh;
  overflow: hidden;
}

.app-root {
  position: relative;
  min-height: 100vh;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  z-index: 20; /* 主内容区层级高于弹幕 */
}

/* 点击涟漪样式 - 优化可见性 */
.ripple-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 99999; /* 确保在最外层，不会被任何元素遮挡 */
}

@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 0.7; /* 更高的不透明度 */
  }
  70% {
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

/* 背景层样式 - 上中下横向流动 */
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5; /* 背景层级最低，不遮挡主内容 */
  overflow: hidden;
}

.bg-scroll-layer {
  position: absolute;
  width: 300%; /* 三倍宽度确保横向无缝滚动 */
  height: 33.333%; /* 每层占页面1/3高度 */
  opacity: 1; /* 完全不透明 */
  will-change: transform;
  background-size: cover;
  background-position: center;
  background-repeat: repeat-x;
}

.layer-1 {
  top: 0;
  animation: bgLeftShift 20s linear infinite;
   background-position: center top; /* 确保背景图片从顶部开始对齐 */

}

.layer-2 {
  top: 33.333%;
  animation: bgRightShift 25s linear infinite;
   background-position: center top; /* 确保背景图片从顶部开始对齐 */
 
}

.layer-3 {
  top: 66.666%;
  animation: bgLeftShift 30s linear infinite;
 
}

@keyframes bgLeftShift {
  0% { transform: translateX(0); }
  100% { transform: translateX(-33.333%); }
}

@keyframes bgRightShift {
  0% { transform: translateX(-33.333%); }
  100% { transform: translateX(0); }
}

/* 主内容区样式 */
.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
}

.glass-panel {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 30px;
  width: 90%;
  max-width: 1000px;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.glass-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
}

.main-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.2rem;
  color: #ffcb69;
  text-shadow: 0 0 15px rgba(255, 203, 105, 0.5);
  transition: all 0.5s ease;
}

.title-accent {
  color: #ff6b6b;
  text-shadow: 0 0 15px rgba(255, 107, 107, 0.7);
}

.hidden {
  opacity: 0;
  transform: translateY(-20px);
  pointer-events: none;
}

/* 空状态样式 */
.empty-container {
  text-align: center;
  padding: 40px 20px;
}

.empty-character {
  font-size: 5rem;
  margin-bottom: 20px;
  animation: bounce 2s infinite;
}

.empty-title {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #ff6b6b;
}

.empty-desc {
  color: #e0e0e0;
  margin-bottom: 30px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.empty-retry {
  background: rgba(102, 187, 255, 0.2);
  color: #66bbff;
  border: none;
  padding: 12px 25px;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.empty-retry:hover {
  background: rgba(102, 187, 255, 0.3);
  transform: translateY(-3px);
}

/* 一级分类选择界面样式 */
.categories-container {
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.category-intro {
  text-align: center;
  margin-bottom: 30px;
  font-size: 1.2rem;
  color: #e0e0e0;
}

.categories-flow {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  width: 100%;
  max-width: 800px;
  perspective: 1000px;
}

.category-card {
  position: relative;
  padding: 25px 15px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  will-change: transform, box-shadow;
}

.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
}

.category-card.combo-active::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255,215,0,0.3) 0%, rgba(255,215,0,0) 70%);
  animation: pulse 2s infinite;
  pointer-events: none;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

.category-microanim {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  opacity: 0.7;
}

.microanim-anime {
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="white" stroke-width="2"><animate attributeName="r" values="40;45;40" dur="3s" repeatCount="indefinite"/></circle></svg>') center/cover no-repeat;
}

.microanim-game {
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M30,50 L70,50 M50,30 L50,70" stroke="white" stroke-width="3"><animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/></path></svg>') center/cover no-repeat;
}

.microanim-quote {
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="20" y="60" font-size="30" fill="white">"</text><animate attributeName="y" values="60;55;60" dur="3s" repeatCount="indefinite"/></svg>') center/cover no-repeat;
}

.microanim-seiyuu {
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M30,30 Q50,10 70,30 Q50,50 30,30" fill="none" stroke="white" stroke-width="2"><animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/></path></svg>') center/cover no-repeat;
}

.microanim-manga {
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="30" y="30" width="40" height="50" rx="2" fill="none" stroke="white" stroke-width="2"><animate attributeName="x" values="30;28;30" dur="2s" repeatCount="indefinite"/></rect></svg>') center/cover no-repeat;
}

.microanim-cosplay {
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="20" fill="none" stroke="white" stroke-width="2"><animate attributeName="stroke-dashoffset" values="0;125;0" dur="3s" repeatCount="indefinite" stroke-dasharray="125"/></circle></svg>') center/cover no-repeat;
}

.category-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #fff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.category-name {
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.category-count {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
}

.combo-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #ffd700;
  color: #0f0f1a;
  font-weight: bold;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  animation: float 1.5s infinite ease-in-out;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* 二级分类选择界面样式 */
.subcategories-container {
  position: relative;
  width: 100%;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-category-circle {
  position: absolute;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 30;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.3), 0 0 40px var(--glow-color);
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
}

.main-category-circle::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
}

.main-category-icon {
  font-size: 3rem;
  color: white;
  margin-bottom: 10px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.main-category-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
  text-align: center;
  padding: 0 10px;
}

.back-indicator {
  position: absolute;
  bottom: 15px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  gap: 5px;
}

.subcategory-circle {
  position: absolute;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 20;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
}

.subcategory-circle::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
}

.subcategory-circle:hover {
  transform: translate(-50%, -50%) scale(1.1);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3), 0 0 30px var(--glow-color);
  z-index: 25;
}

.subcategory-icon {
  font-size: 2rem;
  color: white;
  margin-bottom: 8px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.subcategory-name {
  font-size: 1rem;
  font-weight: bold;
  color: white;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
  text-align: center;
  padding: 0 5px;
}

.subcategory-count {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 5px;
}

/* 答题界面样式 */
.quiz-container {
  padding: 10px 20px;
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.quiz-category-badge {
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 15px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.quiz-stats {
  color: #ffcb69;
  font-weight: 500;
}

.combo-stat {
  color: #ffd700;
  text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
}

.question-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  position: relative;
  transition: all 0.5s ease;
  min-height: 200px;
  display: flex;
  flex-direction: column;
}

.question-number {
  position: absolute;
  top: 15px;
  right: 15px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
}

.question-text {
  font-size: 1.4rem;
  line-height: 1.6;
  text-align: center;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}

.answer-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed rgba(255, 255, 255, 0.2);
  text-align: center;
  animation: fadeIn 0.5s ease;
}

.club-tip {
  margin-top: 15px;
  padding: 10px 15px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  font-size: 0.9rem;
  color: #ffcb69;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: fadeIn 1s ease;
}

.answer-emoji {
  font-size: 3rem;
  margin-bottom: 15px;
  animation: bounce 0.5s ease;
}

.default-emoji::before {
  content: '🎉';
}

.custom-emoji {
  font-size: 2.5rem;
}

.answer-title {
  color: #4cd964;
  margin-bottom: 15px;
  font-size: 1.3rem;
}

.answer-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #e0e0e0;
  padding: 0 10px;
}

.quiz-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.quiz-btn {
  padding: 12px 25px;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.action-retry {
  background: rgba(102, 187, 255, 0.2);
  color: #66bbff;
}

.action-retry:hover {
  background: rgba(102, 187, 255, 0.3);
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(102, 187, 255, 0.2);
}

.action-answer {
  background: rgba(76, 217, 100, 0.2);
  color: #4cd964;
}

.action-answer:hover {
  background: rgba(76, 217, 100, 0.3);
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(76, 217, 100, 0.2);
}

.action-continue {
  background: rgba(255, 203, 105, 0.2);
  color: #ffcb69;
}

.action-continue:hover {
  background: rgba(255, 203, 105, 0.3);
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(255, 203, 105, 0.2);
}

.action-back {
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
}

.action-back:hover {
  background: rgba(255, 107, 107, 0.3);
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.2);
}

.quiz-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 底部引流区样式 */
.footer-section {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 40;
  text-align: center;
}

.footer-text {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  margin-bottom: 10px;
}

.club-recruit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.club-recruit span {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.recruit-btn {
  background: rgba(255, 203, 105, 0.2);
  color: #ffcb69;
  border: none;
  padding: 6px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.recruit-btn:hover {
  background: rgba(255, 203, 105, 0.3);
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(255, 203, 105, 0.2);
}

/* 二维码弹窗 */
.qr-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

.qr-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
}

.qr-content {
  position: relative;
  background: #0f0f1a;
  border-radius: 15px;
  padding: 30px;
  width: 90%;
  max-width: 350px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
  animation: scaleIn 0.3s ease;
}

@keyframes scaleIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.qr-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.2rem;
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.qr-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.qr-title {
  color: #ffcb69;
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.qr-code {
  width: 200px;
  height: 200px;
  margin: 0 auto 20px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  overflow: hidden;
}

.qr-placeholder {
  color: #333;
  font-size: 0.9rem;
  text-align: center;
  padding: 20px;
}

.qr-desc {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

/* 成就/彩蛋弹窗样式 */
.popup-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.popup-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
  pointer-events: auto;
  animation: fadeIn 0.3s ease;
}

.popup-content {
  position: relative;
  background: #0f0f1a;
  border-radius: 15px;
  padding: 30px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  border: 1px solid;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.5s ease;
  pointer-events: auto;
}

.popup-content.achievement {
  border-color: rgba(255, 203, 105, 0.3);
  box-shadow: 0 0 30px rgba(255, 203, 105, 0.2);
}

.popup-content.combo {
  border-color: rgba(255, 69, 0, 0.3);
  box-shadow: 0 0 30px rgba(255, 69, 0, 0.2);
}

.popup-content.legendary {
  border-color: rgba(255, 215, 0, 0.3);
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
  animation: legendaryPopup 0.6s ease, float 3s infinite alternate;
}

.popup-content.category-love {
  border-color: rgba(255, 105, 180, 0.3);
  box-shadow: 0 0 30px rgba(255, 105, 180, 0.2);
}

@keyframes legendaryPopup {
  0% { transform: scale(0) rotate(0deg); opacity: 0; }
  70% { transform: scale(1.1) rotate(5deg); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.popup-icon {
  font-size: 3rem;
  margin-bottom: 15px;
  color: #ffcb69;
}

.popup-content.achievement .popup-icon i { color: #ffcb69; }
.popup-content.combo .popup-icon i { color: #ff6b6b; }
.popup-content.legendary .popup-icon i { color: #ffd700; text-shadow: 0 0 15px rgba(255, 215, 0, 0.7); }
.popup-content.category-love .popup-icon i { color: #ff69b4; }

.popup-title {
  margin-bottom: 10px;
  font-size: 1.4rem;
  color: white;
}

.popup-message {
  color: #e0e0e0;
  margin-bottom: 25px;
  line-height: 1.6;
}

.popup-close {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 10px 25px;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.popup-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

/* 加载动画样式 */
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #0f0f1a;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-character {
  width: 120px;
  height: 120px;
  margin-bottom: 30px;
}

.character-sprite {
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%23ff6b6b"/><circle cx="35" cy="40" r="5" fill="white"/><circle cx="65" cy="40" r="5" fill="white"/><path d="M35,65 Q50,80 65,65" fill="none" stroke="white" stroke-width="3"/></svg>') center/contain no-repeat;
  animation: run 1s infinite linear;
}

@keyframes run {
  0% { transform: translateX(-50px) rotate(0deg); }
  50% { transform: translateX(50px) rotate(180deg); }
  100% { transform: translateX(-50px) rotate(360deg); }
}

.loading-text {
  font-size: 1.5rem;
  color: #ff6b6b;
  text-shadow: 0 0 10px rgba(255, 107, 107, 0.7);
  margin-bottom: 10px;
}

.loading-subtext {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
}

/* 动画效果 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes bounce {
  0% { transform: scale(0); }
  70% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .categories-flow {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .main-title {
    font-size: 1.8rem;
  }
  
  .question-text {
    font-size: 1.2rem;
  }
  
  /* 二级分类响应式调整 */
  .main-category-circle {
    width: 140px;
    height: 140px;
  }
  
  .main-category-icon {
    font-size: 2.5rem;
  }
  
  .main-category-name {
    font-size: 1rem;
  }
  
  .subcategory-circle {
    width: 110px;
    height: 110px;
  }
  
  .subcategory-icon {
    font-size: 1.5rem;
  }
  
  .subcategory-name {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .categories-flow {
    grid-template-columns: 1fr;
  }
  
  .quiz-actions {
    flex-direction: column;
    gap: 10px;
  }
  
  .quiz-btn {
    width: 100%;
    justify-content: center;
  }
  
  .loading-text {
    font-size: 1.2rem;
  }
  
  /* 二级分类在小屏幕上的调整 */
  .subcategory-circle {
    width: 90px;
    height: 90px;
  }
  
  .subcategory-name {
    font-size: 0.8rem;
  }
  
  .subcategory-count {
    display: none;
  }
}
.glass-panel {
  background: rgba(255, 255, 255, 0.12); /* 稍微提高透明度 */
  backdrop-filter: blur(20px); /* 增强模糊效果 */
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 30px;
  width: 90%;
  max-width: 1000px;
  position: relative;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1); /* 添加内发光 */
  overflow: hidden;
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}
/* 磨砂渐变滤镜层 */
.background-filter {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 6; /* 在背景层之上，主内容之下 */
  

  /* 磨砂玻璃效果 */
  backdrop-filter: blur(3px) saturate(180%);
  -webkit-backdrop-filter: blur(10px) saturate(180%);
  
  /* 添加一些纹理 */
  background-image: 
    radial-gradient(
      circle at 20% 80%,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(255, 255, 255, 0.05) 0%,
      transparent 50%
    );
}

/* 确保主内容层级正确 */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  z-index: 20; /* 确保在主内容在滤镜层之上 */
}
</style>
