<!--活动卡片-->

<template>
  <div class="event-card" @click="$emit('click')">
    <!-- 活动封面 -->
    <div class="card-cover">
      <img :src="event.cover || '/placeholder-event.jpg'" :alt="event.title">
      <div class="card-badge" :class="event.status">
        {{ statusText }}
      </div>
    </div>

    <!-- 活动信息 -->
    <div class="card-content">
      <h3 class="card-title">{{ event.title }}</h3>
      <p class="card-desc">{{ event.description }}</p>

      <div class="card-meta">
        <div class="meta-item">
          <i class="fas fa-calendar"></i>
          <span>{{ event.date }}</span>
        </div>
        <div class="meta-item">
          <i class="fas fa-map-marker-alt"></i>
          <span>{{ event.location }}</span>
        </div>
      </div>

      <div class="card-footer">
        <div class="participants">
          <i class="fas fa-users"></i>
          <span>{{ event.participants }} 人参与</span>
        </div>
        <button class="join-btn">
          {{ event.status === 'ongoing' ? '立即参与' : '查看详情' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  event: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])

const statusText = computed(() => {
  const statusMap = {
    ongoing: '进行中',
    upcoming: '即将开始',
    ended: '已结束'
  }
  return statusMap[props.event.status] || '未知'
})
</script>

<style scoped>
.event-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.event-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(138, 97, 255, 0.3);
  border-color: rgba(138, 97, 255, 0.5);
}

.card-cover {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.event-card:hover .card-cover img {
  transform: scale(1.1);
}

.card-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 6px 15px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
  backdrop-filter: blur(10px);
}

.card-badge.ongoing {
  background: rgba(76, 175, 80, 0.9);
  color: white;
}

.card-badge.upcoming {
  background: rgba(255, 193, 7, 0.9);
  color: #333;
}

.card-badge.ended {
  background: rgba(158, 158, 158, 0.9);
  color: white;
}

.card-content {
  padding: 20px;
}

.card-title {
  font-size: 1.3rem;
  margin-bottom: 10px;
  color: white;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-desc {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.meta-item i {
  color: #8a61ff;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.participants {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.join-btn {
  padding: 8px 20px;
  background: linear-gradient(135deg, #8a61ff, #ff61dc);
  border: none;
  border-radius: 20px;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.join-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(138, 97, 255, 0.4);
}
</style>