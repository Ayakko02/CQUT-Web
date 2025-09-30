<!-- src/views/Home.vue -->
<template>
  <div class="home">
    <h1>🎉 ACGN 问答平台</h1>
    <p>正在进入测试模式...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 页面加载后立即跳转到 Quiz 小程序
onMounted(() => {
  router.push('/quiz')
})
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #ffecd2;
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  text-align: center;
}
</style>