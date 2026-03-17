<template>
  <div>
    <div class="section-header">
      <div class="section-title">
        <span class="icon">📚</span>
        <span>全部板块</span>
      </div>
    </div>
    <div class="forum-grid">
      <router-link v-for="forum in forums" :key="forum.id" :to="`/forum/${forum.id}`" class="forum-card">
        <div class="forum-card-header">
          <div class="forum-card-avatar" :class="getForumClass(forum.name)">
            {{ forum.name.charAt(0) }}
          </div>
          <div class="forum-card-info">
            <div class="forum-card-title">{{ forum.name }}</div>
            <div class="forum-card-desc">{{ forum.description }}</div>
          </div>
        </div>
        <div class="forum-card-stats">
          <div class="stat-badge">
            <span>📝</span>
            <strong>{{ forum.postCount }}</strong> 帖子
          </div>
          <div class="stat-badge">
            <span>👥</span>
            <strong>{{ forum.followCount }}</strong> 关注
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { forumApi } from '../api'

const forums = ref([])

const getForumClass = (name) => {
  const map = {
    '水吧': 'water',
    '技术吧': 'tech',
    '游戏吧': 'game',
    '生活吧': 'life'
  }
  return map[name] || 'water'
}

const loadForums = async () => {
  try {
    const res = await forumApi.getForums()
    // 响应拦截器已经返回 response.data
    if (res && res.code === 200) {
      forums.value = res.data || []
    } else {
      window.showToast('加载板块失败', 'error')
    }
  } catch (e) {
    window.showToast('加载板块失败：网络错误', 'error')
  }
}

onMounted(() => {
  loadForums()
})
</script>

<style scoped>
.section-header {
  padding: 24px 32px;
  border-bottom: 1px solid #e5e7eb;
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
}

.forum-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 32px;
}

.forum-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  display: block;
}

.forum-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.16);
}

.forum-card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.forum-card-avatar {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.forum-card-avatar.water {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.forum-card-avatar.tech {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.forum-card-avatar.game {
  background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
}

.forum-card-avatar.life {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.forum-card-info {
  flex: 1;
}

.forum-card-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
}

.forum-card-desc {
  font-size: 13px;
  color: #9ca3af;
}

.forum-card-stats {
  display: flex;
  gap: 20px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.stat-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6b7280;
}

.stat-badge strong {
  color: #1a1a2e;
  font-weight: 600;
}

@media (max-width: 768px) {
  .forum-grid {
    grid-template-columns: 1fr;
  }
}
</style>
