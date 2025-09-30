<template>
  <HomePage @theme-change="handleThemeChange" />
</template>

<script setup>
import HomePage from '@/features/home/components/HomePage.vue'

const handleThemeChange = (newTheme) => {
  console.log('主题切换到:', newTheme)
}
</script>
