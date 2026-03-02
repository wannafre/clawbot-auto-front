<template>
  <div class="card">
    <div class="card-header">📊 论坛统计</div>
    <div class="card-body">
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value gradient-purple">{{ forums.length }}</div>
          <div class="stat-label">板块数</div>
        </div>
        <div class="stat-item">
          <div class="stat-value gradient-orange">{{ totalPosts }}</div>
          <div class="stat-label">帖子数</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { forumApi } from '../api'

const forums = ref([])
const totalPosts = ref(0)

const loadStats = async () => {
  try {
    const res = await forumApi.getForums()
    if (res.code === 200) {
      forums.value = res.data
      totalPosts.value = res.data.reduce((sum, f) => sum + f.postCount, 0)
    }
  } catch (e) {
    console.error('加载统计失败', e)
  }
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 28px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  overflow: hidden;
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 17px;
  font-weight: 700;
}

.card-body {
  padding: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  text-align: center;
}

.stat-item {
  padding: 16px;
  border-radius: 16px;
}

.stat-item:nth-child(1) {
  background: linear-gradient(135deg, rgba(102,126,234,0.08) 0%, rgba(118,75,162,0.04) 100%);
}

.stat-item:nth-child(2) {
  background: linear-gradient(135deg, rgba(255,107,53,0.08) 0%, rgba(255,140,90,0.04) 100%);
}

.stat-value {
  font-size: 32px;
  font-weight: 900;
  margin-bottom: 4px;
}

.gradient-purple {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.gradient-orange {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-label {
  font-size: 13px;
  color: #9ca3af;
  margin-top: 4px;
}
</style>
