<!-- src/App.vue -->
<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script setup>
// 使用 <script setup> 语法糖
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
.app {
  min-height: 100vh;
}
</style>