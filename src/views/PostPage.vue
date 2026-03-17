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
        <div class="post-content" v-html="postContentHtml"></div>
        <div style="display: flex; gap: 16px; margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
          <div class="post-stat"><span>👁️</span> {{ post.viewCount }} 阅读</div>
          <div class="post-stat"><span>💬</span> {{ post.replyCount }} 回复</div>
          <div class="post-stat"><span>👍</span> {{ post.likeCount }} 点赞</div>
        </div>
      </div>
      <!-- 回复输入框 -->
      <div style="background: white; border-radius: 20px; padding: 24px; margin-bottom: 20px;">
        <h2 style="font-size: 18px; font-weight: 700; margin-bottom: 16px;">💬 发表回复</h2>
        <div v-if="!isLoggedIn" style="text-align: center; padding: 30px; background: #f8fafc; border-radius: 12px;">
          <div style="font-size: 14px; color: #6b7280; margin-bottom: 12px;">登录后即可发表回复</div>
          <button class="btn btn-primary" @click="showLoginModal = true">立即登录</button>
        </div>
        <div v-else>
          <div class="rich-editor" :class="{ 'focused': isFocused }">
            <!-- 工具栏 -->
            <div class="editor-toolbar">
              <button @click="insertEmoji('😀')" title="表情" class="toolbar-btn">😀</button>
              <button @click="insertEmoji('😂')" title="表情" class="toolbar-btn">😂</button>
              <button @click="insertEmoji('👍')" title="表情" class="toolbar-btn">👍</button>
              <button @click="insertEmoji('❤️')" title="表情" class="toolbar-btn">❤️</button>
              <div class="toolbar-divider"></div>
              <button @click="formatText('bold')" title="加粗" class="toolbar-btn"><b>B</b></button>
              <button @click="formatText('italic')" title="斜体" class="toolbar-btn"><i>I</i></button>
              <button @click="formatText('quote')" title="引用" class="toolbar-btn">"</button>
              <div class="toolbar-divider"></div>
              <button @click="insertCode" title="代码" class="toolbar-btn">&lt;/&gt;</button>
            </div>
            <!-- 输入框 -->
            <textarea 
              v-model="replyContent"
              @focus="isFocused = true"
              @blur="isFocused = false"
              placeholder="写下你的回复..."
              class="editor-textarea"
            ></textarea>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
            <div style="font-size: 13px; color: #9ca3af;">
              {{ replyContent.length }} / 2000
            </div>
            <button 
              @click="submitReply"
              :disabled="!replyContent.trim() || submitting"
              class="btn btn-primary"
              style="padding: 10px 24px;"
            >
              {{ submitting ? '发送中...' : '发表回复' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 回复列表 -->
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
                <button 
                  v-if="isLoggedIn && reply.author?.id !== currentUserId"
                  @click="likeReply(reply)"
                  class="btn-like"
                  :class="{ 'liked': reply.isLiked }"
                >
                  👍 {{ reply.likeCount || 0 }}
                </button>
              </div>
              <div style="font-size: 15px; line-height: 1.6;" v-html="getReplyHtml(reply.content)"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { forumApi } from '../api'
import { marked } from 'marked'

const route = useRoute()
const router = useRouter()
const post = ref(null)
const replies = ref([])
const loading = ref(true)

// 回复相关
const replyContent = ref('')
const isFocused = ref(false)
const submitting = ref(false)
const showLoginModal = ref(false)

// 用户登录状态
const isLoggedIn = computed(() => !!localStorage.getItem('forumToken'))
const currentUserId = computed(() => {
  const token = localStorage.getItem('forumToken')
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.userId
  } catch {
    return null
  }
})

// 富文本渲染
const renderHtml = (text) => {
  if (!text) return ''
  return marked.parse(text || '')
}

// 帖子内容 HTML
const postContentHtml = computed(() => {
  return renderHtml(post.value?.content)
})

// 回复内容 HTML
const getReplyHtml = (content) => {
  return renderHtml(content)
}

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

// 富文本编辑器功能
const insertEmoji = (emoji) => {
  const textarea = document.querySelector('.editor-textarea')
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = replyContent.value
  replyContent.value = text.substring(0, start) + emoji + text.substring(end)
  setTimeout(() => {
    textarea.focus()
    textarea.selectionStart = textarea.selectionEnd = start + emoji.length
  }, 0)
}

const formatText = (type) => {
  const textarea = document.querySelector('.editor-textarea')
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = replyContent.value
  const selected = text.substring(start, end)
  
  let formatted = ''
  if (type === 'bold') {
    formatted = `**${selected || '加粗文字'}**`
  } else if (type === 'italic') {
    formatted = `*${selected || '斜体文字'}*`
  } else if (type === 'quote') {
    formatted = `\n> ${selected || '引用内容'}\n`
  }
  
  replyContent.value = text.substring(0, start) + formatted + text.substring(end)
  setTimeout(() => {
    textarea.focus()
  }, 0)
}

const insertCode = () => {
  const textarea = document.querySelector('.editor-textarea')
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = replyContent.value
  const selected = text.substring(start, end)
  
  const formatted = `\n\`${selected || '代码内容'}\`\n`
  replyContent.value = text.substring(0, start) + formatted + text.substring(end)
  setTimeout(() => {
    textarea.focus()
  }, 0)
}

// 提交回复
const submitReply = async () => {
  if (!replyContent.value.trim()) {
    window.showToast('请输入回复内容', 'error')
    return
  }
  
  if (!isLoggedIn.value) {
    showLoginModal.value = true
    return
  }
  
  submitting.value = true
  try {
    const res = await forumApi.createReply(route.params.id, {
      content: replyContent.value
    })
    
    if (res.code === 200) {
      window.showToast('回复成功！', 'success')
      replyContent.value = ''
      // 重新加载回复列表
      const replyRes = await forumApi.getReplies(route.params.id)
      if (replyRes.code === 200) {
        replies.value = replyRes.data || []
      }
      // 重新加载帖子以更新回复数
      loadPost()
    } else {
      window.showToast(res.message || '回复失败', 'error')
    }
  } catch (e) {
    window.showToast('回复失败：' + e.message, 'error')
  }
  submitting.value = false
}

// 点赞回复
const likeReply = async (reply) => {
  if (!isLoggedIn.value) {
    showLoginModal.value = true
    return
  }
  
  try {
    const res = await forumApi.likeReply(reply.id)
    if (res.code === 200) {
      reply.likeCount = res.data.likeCount
      reply.isLiked = res.data.liked
      window.showToast(res.data.liked ? '点赞成功' : '已取消点赞', 'success')
    }
  } catch (e) {
    window.showToast('点赞失败', 'error')
  }
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

.btn-primary {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 10px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(255,107,53,0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255,107,53,0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 富文本编辑器样式 */
.rich-editor {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
  background: white;
}

.rich-editor.focused {
  border-color: #ff6b35;
  box-shadow: 0 0 0 3px rgba(255,107,53,0.1);
}

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  flex-wrap: wrap;
}

.toolbar-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: #4b5563;
}

.toolbar-btn:hover {
  background: #ff6b35;
  color: white;
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background: #e5e7eb;
  margin: 0 4px;
}

.editor-textarea {
  width: 100%;
  min-height: 120px;
  border: none;
  padding: 16px;
  font-size: 15px;
  line-height: 1.6;
  resize: vertical;
  font-family: inherit;
  outline: none;
  box-sizing: border-box;
}

.editor-textarea::placeholder {
  color: #9ca3af;
}

.btn-like {
  padding: 4px 10px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 16px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  color: #6b7280;
}

.btn-like:hover {
  border-color: #ff6b35;
  color: #ff6b35;
}

.btn-like.liked {
  background: #ff6b35;
  border-color: #ff6b35;
  color: white;
}

/* 富文本内容样式 */
.post-content {
  font-size: 16px;
  line-height: 1.8;
  color: #1a1a2e;
}

.post-content :deep(h1),
.post-content :deep(h2),
.post-content :deep(h3) {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  color: #1a1a2e;
}

.post-content :deep(p) {
  margin-bottom: 16px;
}

.post-content :deep(strong) {
  font-weight: 600;
  color: #1a1a2e;
}

.post-content :deep(em) {
  font-style: italic;
}

.post-content :deep(blockquote) {
  border-left: 4px solid #ff6b35;
  padding-left: 16px;
  margin: 16px 0;
  color: #6b7280;
  font-style: italic;
}

.post-content :deep(code) {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #e83e8c;
}

.post-content :deep(pre) {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 16px 0;
}

.post-content :deep(pre code) {
  background: none;
  padding: 0;
  color: #495057;
}

.post-content :deep(ul),
.post-content :deep(ol) {
  padding-left: 24px;
  margin-bottom: 16px;
}

.post-content :deep(li) {
  margin-bottom: 8px;
}

.post-content :deep(img) {
  max-width: 100%;
  border-radius: 8px;
  margin: 16px 0;
}
</style>
