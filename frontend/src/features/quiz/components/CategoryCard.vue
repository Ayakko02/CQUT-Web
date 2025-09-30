# 分类卡片组件
<template>
  <div 
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
</template>

<script setup>
defineProps({
  category: Object,
  index: Number,
  selectedCategory: Object,
  comboCount: Number,
  lastSelectedCategoryId: String
});

const emit = defineEmits(['select', 'hover']);

const selectCategory = (category) => {
  emit('select', category);
};

const handleCardHover = (categoryId, isHovered) => {
  emit('hover', { categoryId, isHovered });
};

const getTotalQuestions = (category) => {
  if (!category.subcategories) return 0;
  return category.subcategories.reduce((total, sub) => {
    return total + (sub.questions ? sub.questions.length : 0);
  }, 0);
};

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
</script>

<style scoped>
@import '../assets/styles/categories.css';
</style>