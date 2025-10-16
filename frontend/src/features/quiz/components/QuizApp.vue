<template>
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
              <div class="empty-character"> 
                <img src="/asset/轻音哭哭.gif" alt="哭泣小人" class="crying-animation">
              </div>
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
                <CategoryCard
                  v-for="(category, index) in categories"
                  :key="category.id"
                  :category="category"
                  :index="index"
                  :selected-category="selectedCategory"
                  :combo-count="comboCount"
                  :last-selected-category-id="lastSelectedCategoryId"
                  @select="selectCategory"
                  @hover="handleCardHover"
                />
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
              <QuizScreen
                :selected-category="selectedCategory"
                :selected-subcategory="selectedSubcategory"
                :current-question="currentQuestion"
                :current-question-index="currentQuestionIndex"
                :correct-answers="correctAnswers"
                :combo-count="comboCount"
                :show-answer="showAnswer"
                @retry-question="handleRetryQuestion"
                @show-answer="handleShowAnswer"
                @continue="handleContinue"
                @back-to-subcategories="handleBackToSubcategories"
                @update-correct-count="handleUpdateCorrectCount"
                @update-combo="handleUpdateCombo"
                @answer-submitted="handleAnswerSubmitted"
              />
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
import DanmakuLayer from './DanmakuLayer.vue';
import MusicPlayer from './MusicPlayer.vue';
import CategoryCard from './CategoryCard.vue';
import QuizScreen from './QuizScreen.vue';

// 基础状态管理
const loading = ref(true);
const isEmptyState = ref(false);
const currentView = ref('categories');
const selectedCategory = ref(null);
const selectedSubcategory = ref(null);
const lastSelectedCategoryId = ref(null);
const lastSelectedSubcategoryId = ref(null);
const categoryClickCount = ref({});
const categories = ref([]);
const currentQuestion = ref({ question: '', answer: '', type: 'normal', clubTip: '' });
const currentQuestionIndex = ref(0);
const showAnswer = ref(false);
const correctAnswers = ref(0);
const comboCount = ref(0);
const mainCategoryScale = ref(0);
const showQrCode = ref(false);
const showPopup = ref(false);
const popupType = ref('achievement');
const popupTitle = ref('');
const popupMessage = ref('');

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

// 背景动画相关
const layer1X = ref(0);
const layer2X = ref(0);
const layer3X = ref(0);
let animationFrameId = null;
const bgImages = {
  layer1: ['/asset/lay7.jpg'],
  layer2: ['/asset/lay6.jpg'],
  layer3: ['/asset/lay1.jpg']
};

// 加载题库数据
const loadQuizData = async () => {
  try {
    loading.value = true;
    
    // 从后端API获取所有题目数据
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

// 从选中的二级分类获取随机题目
const getRandomQuestionBySubcategory = async () => {
  if (!selectedSubcategory.value) return null;
  
  try {
    const response = await fetch(
      `${API_BASE_URL}/quiz/subcategory/${selectedSubcategory.value.id}`
    );
    
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('获取分类题目失败');
    }
  } catch (error) {
    console.error('无法获取分类题目:', error);
    return { 
      id: 'error',
      question: '题目加载失败，请稍后重试', 
      answer: '网络连接问题', 
      type: 'error',
      clubTip: ''
    };
  }
};

// 从当前二级分类中选择下一题 - 简化逻辑
const selectNextQuestion = async () => {
  // 每次点击下一题都重新获取随机题目
  const question = await getRandomQuestionBySubcategory();
  
  if (question) {
    currentQuestion.value = {
      ...question,
      // 确保有必要的字段
      id: question.id || `question-${Date.now()}`,
      type: question.type || 'normal'
    };
    showAnswer.value = false;
    currentQuestionIndex.value++;
    playSound('question');
    console.log('获取到新题目:', currentQuestion.value.question);
    return true;
  } else {
    currentQuestion.value = {
      id: 'no-questions',
      question: '没有找到题目',
      answer: '该分类下没有可用题目',
      type: 'error',
      clubTip: ''
    };
    showAnswer.value = true;
    return false;
  }
};

// 点击涟漪效果
const createRipple = (e) => {
  const rippleContainer = document.querySelector('.ripple-container');
  const ripple = document.createElement('span');
  
  const colors = [
    'rgba(255, 69, 0, 0.7)',
    'rgba(138, 43, 226, 0.7)',
    'rgba(0, 191, 255, 0.7)',
    'rgba(255, 105, 180, 0.7)',
    'rgba(0, 255, 127, 0.7)',
    'rgba(255, 215, 0, 0.7)'
  ];
  
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  const x = e.clientX;
  const y = e.clientY;
  const size = Math.max(window.innerWidth, window.innerHeight) * 0.6;
  
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
  
  rippleContainer.appendChild(ripple);
  playSound('click');
  
  setTimeout(() => {
    ripple.remove();
  }, 1000);
};

// 背景动画逻辑
const updateBackground = () => {
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

// 主体面板样式
const glassPanelStyle = computed(() => ({
  transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
  minHeight: currentView.value === 'subcategories' ? '600px' : '550px'
}));

// 二级分类位置计算
const subcategoryPosition = (index, total) => {
  const angle = (index / total) * Math.PI * 2;
  const radius = Math.min(window.innerWidth, window.innerHeight) * 0.25;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  
  return {
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
    backgroundColor: selectedCategory.value?.color,
    transform: 'translate(-50%, -50%) scale(1)',
    opacity: 1,
    transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
  };
};

// 事件处理
const handleNewDanmaku = (danmaku) => {
  console.log('新弹幕:', danmaku);
  if (danmaku.text.includes('管理员')) {
    playSound('danmaku');
  }
};

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

// 卡片悬停效果
const handleCardHover = ({ categoryId, isHovered }) => {
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

// 一级分类选择处理
const selectCategory = (category) => {
  playSound('select');
  
  categoryClickCount.value[category.id] = (categoryClickCount.value[category.id] || 0) + 1;
  
  if (categoryClickCount.value[category.id] >= 3) {
    showCategoryLovePopup(category);
  }
  
  if (lastSelectedCategoryId.value === category.id) {
    comboCount.value++;
    if (comboCount.value % 3 === 0) {
      showComboPopup(comboCount.value);
    }
  } else {
    comboCount.value = 1;
  }
  lastSelectedCategoryId.value = category.id;
  
  selectedCategory.value = category;
  selectedSubcategory.value = null;
  
  if (musicPlayer.value) {
    musicPlayer.value.changeTrack(category.type);
  }
  
  categories.value.forEach(cat => {
    if (cat.id !== category.id) {
      const angle = Math.random() * Math.PI * 2;
      const distance = window.innerWidth * 1.5;
      
      cat.transition = 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)';
      cat.xOffset = Math.cos(angle) * distance;
      cat.yOffset = Math.sin(angle) * distance;
      cat.opacity = 0;
      cat.zIndex = 5;
    } else {
      cat.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
      cat.scale = 1.2;
      cat.rotation = 0;
      cat.zIndex = 20;
    }
  });
  
  setTimeout(() => {
    currentView.value = 'subcategories';
    mainCategoryScale.value = 0;
    nextTick(() => {
      setTimeout(() => {
        mainCategoryScale.value = 1;
      }, 50);
    });
  }, 800);
};

// 二级分类选择处理 - 修改为直接进入答题
const selectSubcategory = async (subcategory) => {
  playSound('select');
  selectedSubcategory.value = subcategory;
  
  document.querySelectorAll('.subcategory-circle').forEach((el, index) => {
    setTimeout(() => {
      el.style.transform = 'translate(-50%, -50%) scale(0)';
      el.style.opacity = '0';
    }, index * 100);
  });
  
  setTimeout(() => {
    mainCategoryScale.value = 0;
    
    setTimeout(async () => {
      // 重置状态
      currentQuestionIndex.value = 0;
      showAnswer.value = false;
      
      // 切换到答题界面并获取第一题
      currentView.value = 'quiz';
      await selectNextQuestion();
    }, 500);
  }, 500);
};

// 答题界面操作 - 修改为直接获取新题目
const handleRetryQuestion = () => {
  playSound('retry');
  selectNextQuestion();
};

const handleShowAnswer = () => {
  playSound('answer');
  showAnswer.value = true;
};

const handleContinue = () => {
  playSound('continue');
  selectNextQuestion();
};

// 处理答对计数更新
const handleUpdateCorrectCount = (isCorrect) => {
  if (isCorrect) {
    correctAnswers.value++;
    checkAchievements();
  }
};

// 处理连击数更新
const handleUpdateCombo = (data) => {
  if (data.isCorrect) {
    // 如果和上次是同一二级分类，连击数加1，否则重置为1
    if (lastSelectedSubcategoryId.value === data.subcategoryId) {
      comboCount.value++;
    } else {
      comboCount.value = 1;
    }
    lastSelectedSubcategoryId.value = data.subcategoryId;
    
    // 每3连击显示一次弹窗
    if (comboCount.value % 3 === 0) {
      showComboPopup(comboCount.value);
    }
  } else {
    // 答错时重置连击数
    comboCount.value = 0;
    lastSelectedSubcategoryId.value = null;
  }
};

// 处理题目回答后的逻辑
const handleAnswerSubmitted = (questionId, isCorrect) => {
  // 更新连击数
  if (isCorrect) {
    handleUpdateCombo({
      isCorrect: true,
      subcategoryId: selectedSubcategory.value.id
    });
  } else {
    handleUpdateCombo({
      isCorrect: false
    });
  }
};

// 返回按钮处理
const handleBackToSubcategories = () => {
  playSound('back');
  currentView.value = 'subcategories';
  mainCategoryScale.value = 1;
  
  setTimeout(() => {
    document.querySelectorAll('.subcategory-circle').forEach(el => {
      el.style.transform = 'translate(-50%, -50%) scale(1)';
      el.style.opacity = '1';
    });
  }, 300);
};

const handleBackToMainCategories = () => {
  playSound('back');
  
  document.querySelectorAll('.subcategory-circle').forEach(el => {
    el.style.transform = 'translate(-50%, -50%) scale(0)';
    el.style.opacity = '0';
  });
  
  mainCategoryScale.value = 0;
  
  setTimeout(() => {
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
    if (musicPlayer.value) {
      musicPlayer.value.changeTrack('default');
    }
  }, 500);
};

// 成就系统
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

const showComboPopup = (count) => {
  showPopup.value = true;
  popupType.value = 'combo';
  popupTitle.value = `${count} Combo！`;
  popupMessage.value = count >= 5 ? '你是真爱粉吧！太厉害了！' : '保持状态，继续加油！';
  playSound('combo');
};

const showCategoryLovePopup = (category) => {
  showPopup.value = true;
  popupType.value = 'category-love';
  popupTitle.value = `喜欢${category.name}呢！`;
  popupMessage.value = `看来你对${category.name}很感兴趣呢！我们社团也有很多同好哦~`;
  playSound('like');
};

const closePopup = () => {
  showPopup.value = false;
};

const showRecruitQr = () => {
  showQrCode.value = true;
  playSound('click');
};

// 音效系统
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let isAudioContextStarted = false;

const playSound = async (type) => {
  try {
    if (!isAudioContextStarted && audioContext.state === 'suspended') {
      await audioContext.resume();
      isAudioContextStarted = true;
    }

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
    if (!audioFile) return;

    const response = await fetch(audioFile);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    
    const gainNode = audioContext.createGain();
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
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    source.start(0);
    
  } catch (error) {
    console.log('音效播放失败:', error);
    fallbackPlaySound(type);
  }
};

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
    audio.muted = false;
    await audio.play();
  } catch (error) {
    console.log('降级音效播放失败:', error);
  }
};

// 生命周期
onMounted(() => {
  categories.value.forEach(cat => {
    cat.rotation = 0;
    cat.yOffset = 0;
    cat.isHovered = false;
  });
  
  loadQuizData();
  updateBackground();
  
  onUnmounted(() => {
    cancelAnimationFrame(animationFrameId);
  });
});
</script>

<style scoped>
@import './src/features/quiz/assets/styles/quiz-3d.css';

/* 基础样式 */
.app-root {
  position: relative;
  min-height: 100vh;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  z-index: 20;
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
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 30px;
  width: 90%;
  max-width: 1000px;
  position: relative;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
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

/* 分类相关样式 */
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

/* 答题界面容器 */
.quiz-container {
  padding: 10px 20px;
}

/* 背景层样式 */
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  overflow: hidden;
}

.bg-scroll-layer {
  position: absolute;
  width: 300%;
  height: 33.333%;
  opacity: 1;
  will-change: transform;
  background-size: cover;
  background-position: center;
  background-repeat: repeat-x;
}

.layer-1 { top: 0; }
.layer-2 { top: 33.333%; }
.layer-3 { top: 66.666%; }

.background-filter {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 6;
  backdrop-filter: blur(3px) saturate(180%);
  -webkit-backdrop-filter: blur(10px) saturate(180%);
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

.loading-gif {
  width: 100%;
  height: 100%;
  object-fit: contain;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .categories-flow {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .main-title {
    font-size: 1.8rem;
  }
  
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
</style>
