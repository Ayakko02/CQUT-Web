# 404错误页面

<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1 class="error-title">页面未找到</h1>
      <p class="error-message">抱歉，您访问的页面不存在</p>

      <div class="error-actions">
        <button class="back-btn" @click="goBack">
          <i class="fas fa-arrow-left"></i>
          返回上页
        </button>
        <button class="home-btn" @click="goHome">
          <i class="fas fa-home"></i>
          回到首页
        </button>
      </div>

      <div class="mascot">🌸</div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1a3e 50%, #0a0e27 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 20px;
}

.not-found-content {
  text-align: center;
  max-width: 600px;
}

.error-code {
  font-size: 8rem;
  font-weight: bold;
  background: linear-gradient(135deg, #8a61ff, #ff61dc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 20px;
  animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.error-title {
  font-size: 2rem;
  margin-bottom: 15px;
  color: white;
}

.error-message {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 40px;
}

.error-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.back-btn,
.home-btn {
  padding: 12px 30px;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.back-btn {
  background: rgba(138, 97, 255, 0.2);
  border: 2px solid rgba(138, 97, 255, 0.5);
  color: white;
}

.back-btn:hover {
  background: rgba(138, 97, 255, 0.4);
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(138, 97, 255, 0.3);
}

.home-btn {
  background: linear-gradient(135deg, #8a61ff, #ff61dc);
  color: white;
}

.home-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(255, 97, 220, 0.4);
}

.mascot {
  font-size: 5rem;
  margin-top: 40px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@media (max-width: 768px) {
  .error-code {
    font-size: 5rem;
  }

  .error-title {
    font-size: 1.5rem;
  }

  .error-actions {
    flex-direction: column;
  }

  .back-btn,
  .home-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>