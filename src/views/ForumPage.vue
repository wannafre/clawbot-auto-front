<template>
  <div>
    <div class="section-header" v-if="forum">
      <div class="section-title">
        <span class="icon">💬</span>
        <span>{{ forum.name }}</span>
      </div>
      <button class="new-post-btn" @click="showPostForm = true">
        <span>➕</span> 发新帖
      </button>
    </div>
    
    <div class="post-list" v-if="posts.length > 0">
      <router-link v-for="post in posts" :key="post.id" :to="`/post/${post.id}`" class="post-item">
        <div class="post-header">
          <div class="post-avatar">{{ getAuthorInitial(post.authorName) }}</div>
          <div class="post-content">
            <div class="post-title">
              <span v-if="post.isTop" class="tag tag-hot">🔥 置顶</span>
              <span v-if="post.isGood" class="tag tag-good">⭐ 精</span>
              {{ post.title }}
            </div>
            <div class="post-meta">
              <span class="post-author">👤 {{ post.authorName || '未知' }}</span>
              <span>📅 {{ formatDate(post.createdAt) }}</span>
            </div>
            <div class="post-stats">
              <div class="post-stat"><span>👁️</span> {{ post.viewCount }}</div>
              <div class="post-stat"><span>💬</span> {{ post.replyCount }}</div>
              <div class="post-stat"><span>👍</span> {{ post.likeCount }}</div>
            </div>
          </div>
        </div>
      </router-link>
    </div>
    
    <div class="empty-state" v-else-if="loaded">
      <div class="empty-state-icon">📭</div>
      <div class="empty-state-text">该板块还没有帖子，快来发第一帖吧！</div>
    </div>
    
    <div class="empty-state" v-else>
      <div class="empty-state-icon">📖</div>
      <div class="empty-state-text">加载中...</div>
    </div>
    
    <div class="pagination" v-if="totalPages > 0">
      <button class="page-btn" @click="prevPage" :disabled="page === 0">← 上一页</button>
      <button v-for="pageNum in displayPages" :key="pageNum" class="page-btn" :class="{ active: page === pageNum - 1 }" @click="goToPage(pageNum - 1)">
        {{ pageNum }}
      </button>
      <button class="page-btn" @click="nextPage" :disabled="page >= totalPages - 1">下一页 →</button>
    </div>
  </div>
  
  <!-- 发帖弹窗（顶层） -->
  <NewPostModal v-model="showPostForm" :forumId="forumId" @success="handlePostSuccess" />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { forumApi } from '../api'
import NewPostModal from '../components/NewPostModal.vue'

const route = useRoute()
const forum = ref(null)
const posts = ref([])
const page = ref(0)
const totalPages = ref(0)
const loaded = ref(false)
const showPostForm = ref(false)

const forumId = computed(() => route.params.id)

const displayPages = computed(() => {
  const pages = []
  const maxVisible = 5
  if (totalPages.value <= maxVisible) {
    for (let i = 1; i <= totalPages.value; i++) pages.push(i)
  } else {
    let start = Math.max(1, page.value - 1)
    let end = Math.min(totalPages.value, start + maxVisible - 1)
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1)
    for (let i = start; i <= end; i++) pages.push(i)
  }
  return pages
})

const getAuthorInitial = (name) => name ? name.charAt(0) : '？'

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return minutes + '分钟前'
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return hours + '小时前'
  return date.toLocaleDateString('zh-CN')
}

const loadForum = async () => {
  try {
    const res = await forumApi.getForum(forumId.value)
    if (res && res.code === 200) {
      forum.value = res.data || null
    } else {
      window.showToast('加载板块失败', 'error')
    }
  } catch (e) {
    window.showToast('加载板块失败：网络错误', 'error')
  }
}

const loadPosts = async () => {
  loaded.value = false
  try {
    const res = await forumApi.getPosts(forumId.value, page.value)
    if (res && res.code === 200) {
      posts.value = res.data?.content || []
      totalPages.value = res.data?.totalPages || 0
    } else {
      window.showToast('加载帖子失败', 'error')
    }
  } catch (e) {
    window.showToast('加载帖子失败：网络错误', 'error')
  }
  loaded.value = true
}

const handlePostSuccess = () => {
  loadPosts()
}

const prevPage = () => {
  if (page.value > 0) {
    page.value--
    loadPosts()
  }
}

const nextPage = () => {
  if (page.value < totalPages.value - 1) {
    page.value++
    loadPosts()
  }
}

const goToPage = (pageNum) => {
  if (pageNum >= 0 && pageNum < totalPages.value) {
    page.value = pageNum
    loadPosts()
  }
}

watch(forumId, () => {
  page.value = 0
  loadForum()
  loadPosts()
})

onMounted(() => {
  loadForum()
  loadPosts()
})
</script>

<style scoped>
.section-header {
  padding: 24px 32px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
}

.new-post-btn {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 12px rgba(255,107,53,0.3);
  transition: all 0.3s;
}

.new-post-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255,107,53,0.4);
}

.post-list {
  padding: 0;
}

.post-item {
  padding: 24px 32px;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  color: inherit;
  display: block;
}

.post-item:hover {
  background: linear-gradient(135deg, rgba(255,107,53,0.02) 0%, rgba(74,144,217,0.02) 100%);
}

.post-item:hover .post-title {
  color: #ff6b35;
}

.post-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.post-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 18px;
  box-shadow: 0 2px 8px rgba(255,107,53,0.3);
  flex-shrink: 0;
}

.post-content {
  flex: 1;
  min-width: 0;
}

.post-title {
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 8px;
  transition: color 0.3s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
  color: #9ca3af;
  flex-wrap: wrap;
}

.post-author {
  color: #4a90d9;
  font-weight: 500;
}

.post-stats {
  display: flex;
  gap: 16px;
  margin-top: 12px;
}

.post-stat {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: #9ca3af;
  background: #f8fafc;
  padding: 5px 12px;
  border-radius: 20px;
}

.tag {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  margin-right: 8px;
}

.tag-hot {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  color: #e65100;
}

.tag-good {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  color: #2e7d32;
}

.empty-state {
  text-align: center;
  padding: 60px 40px;
  color: #9ca3af;
}

.empty-state-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 24px;
}

.page-btn {
  padding: 10px 18px;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  border-color: #ff6b35;
  color: #ff6b35;
  transform: translateY(-2px);
}

.page-btn.active {
  background: #ff6b35;
  color: white;
  border-color: transparent;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s;
}

.modal {
  background: white;
  border-radius: 28px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.16);
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  overflow-x: hidden;
  animation: slideUp 0.3s;
}

.modal-header {
  padding: 24px 32px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #9ca3af;
  transition: color 0.3s;
}

.modal-close:hover {
  color: #1a1a2e;
}

.modal-body {
  padding: 0;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
