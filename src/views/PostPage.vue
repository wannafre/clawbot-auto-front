<template>
  <div style="padding: 32px;">
    <button class="btn btn-outline" @click="goBack" style="margin-bottom: 20px;">← 返回列表</button>
    <div v-if="loading" style="text-align: center; padding: 60px;">
      <div style="font-size: 48px; margin-bottom: 16px;">📖</div>
      <div style="color: #6b7280;">加载中...</div>
    </div>
    <div v-else-if="post">
      <div style="background: white; border-radius: 20px; padding: 24px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
          <div class="post-avatar" style="width: 50px; height: 50px; font-size: 20px;">{{ getAuthorInitial(post.author?.username) }}</div>
          <div>
            <div style="font-weight: 600;">{{ post.author?.username || '未知' }}</div>
            <div style="font-size: 13px; color: #9ca3af;">{{ formatDate(post.createdAt) }}</div>
          </div>
        </div>
        <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">{{ post.title }}</h1>
        <div style="font-size: 16px; line-height: 1.8; white-space: pre-wrap;">{{ post.content }}</div>
        <div style="display: flex; gap: 16px; margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
          <div class="post-stat"><span>👁️</span> {{ post.viewCount }} 阅读</div>
          <div class="post-stat"><span>💬</span> {{ post.replyCount }} 回复</div>
          <div class="post-stat"><span>👍</span> {{ post.likeCount }} 点赞</div>
        </div>
      </div>
      <div style="background: white; border-radius: 20px; padding: 24px;">
        <h2 style="font-size: 18px; font-weight: 700; margin-bottom: 20px;">💬 回复 {{ replies.length }}</h2>
        <div v-if="replies.length === 0" style="text-align: center; padding: 40px; color: #9ca3af;">暂无回复，快来抢沙发吧～</div>
        <div v-for="reply in replies" :key="reply.id" style="padding: 20px 0; border-bottom: 1px solid #e5e7eb;">
          <div style="display: flex; gap: 12px;">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #4a90d9 0%, #6ab0f3 100%); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; flex-shrink: 0;">{{ getAuthorInitial(reply.author?.username) }}</div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                <span style="font-weight: 600; color: #4a90d9;">{{ reply.author?.username || '未知' }}</span>
                <span style="font-size: 13px; color: #9ca3af;">{{ formatDate(reply.createdAt) }}</span>
                <span style="font-size: 13px; color: #9ca3af;">#{{ reply.floor }}楼</span>
              </div>
              <div style="font-size: 15px; line-height: 1.6; white-space: pre-wrap;">{{ reply.content }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { forumApi } from '../api'

const route = useRoute()
const router = useRouter()
const post = ref(null)
const replies = ref([])
const loading = ref(true)

const getAuthorInitial = (name) => name ? name.charAt(0) : '？'
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  const hours = Math.floor(diff / 3600000)
  if (hours < 24) return hours + '小时前'
  return date.toLocaleDateString('zh-CN')
}

const loadPost = async () => {
  loading.value = true
  try {
    const res = await forumApi.getPost(route.params.id)
    if (res.code === 200) {
      post.value = res.data
      const replyRes = await forumApi.getReplies(route.params.id)
      if (replyRes.code === 200) {
        replies.value = replyRes.data || []
      }
    }
  } catch (e) {
    window.showToast('加载帖子失败', 'error')
  }
  loading.value = false
}

const goBack = () => {
  const forumId = post.value?.forum?.id || 1
  router.push(`/forum/${forumId}`)
}

onMounted(() => {
  loadPost()
})
</script>

<style scoped>
.btn {
  padding: 10px 20px;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn:hover {
  border-color: #ff6b35;
  color: #ff6b35;
}

.post-avatar {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(255,107,53,0.3);
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
</style>
