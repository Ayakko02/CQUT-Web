<template>
  <div class="quiz-home">
    <!-- 一级分类选择界面 -->
    <div v-if="currentView === 'categories'" class="categories-container">
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
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CategoryCard from './CategoryCard.vue';

const props = defineProps({
  categories: Array,
  currentView: String,
  selectedCategory: Object,
  comboCount: Number,
  lastSelectedCategoryId: String
});

const emit = defineEmits(['select-category', 'card-hover']);

const selectCategory = (category) => {
  emit('select-category', category);
};

const handleCardHover = ({ categoryId, isHovered }) => {
  emit('card-hover', { categoryId, isHovered });
};
</script>

<style scoped>
@import '../assets/styles/categories.css';

.quiz-home {
  width: 100%;
}
</style>