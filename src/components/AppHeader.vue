<template>
  <header class="header">
    <router-link to="/" class="logo">
      <span class="logo-icon">🏛️</span>
      <span>贴吧</span>
    </router-link>
    <nav class="nav">
      <router-link to="/" class="nav-item">首页</router-link>
      <a href="#" class="nav-item" @click.prevent="handleHot">🔥 热门</a>
      <a href="#" class="nav-item" @click.prevent="handleNew">📰 最新</a>
    </nav>
    <div class="user-area">
      <template v-if="userStore.isLoggedIn">
        <button class="btn btn-ghost" @click="handleCheckIn">
          <span>📅</span> 签到
        </button>
        <span class="username">👤 {{ userStore.user.username }}</span>
        <router-link to="/profile" class="btn btn-ghost">个人中心</router-link>
        <button class="btn btn-outline" @click="handleLogout">退出</button>
      </template>
      <template v-else>
        <button class="btn btn-primary" @click="showLoginModal = true">🔑 登录</button>
      </template>
    </div>
    
    <!-- 登录弹窗 -->
    <LoginModal v-model="showLoginModal" @success="handleLoginSuccess" />
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/user'
import { forumApi } from '../api'
import LoginModal from './LoginModal.vue'

const userStore = useUserStore()
const showLoginModal = ref(false)

const handleHot = () => {
  window.location.hash = '/hot'
}

const handleNew = () => {
  window.location.hash = '/new'
}

const handleCheckIn = async () => {
  if (!userStore.isLoggedIn) {
    window.showToast('请先登录再签到', 'warning')
    showLoginModal.value = true
    return
  }
  
  try {
    const res = await forumApi.checkIn()
    if (res.code === 200) {
      if (res.data.alreadyCheckedIn) {
        window.showToast(res.data.message, 'info')
      } else {
        window.showToast(`✅ ${res.data.message} (+${res.data.exp}经验)`, 'success')
      }
    } else {
      window.showToast(res.message || '签到失败', 'error')
    }
  } catch (e) {
    window.showToast('签到失败：' + e.message, 'error')
  }
}

const handleLoginSuccess = () => {
  window.showToast('欢迎回来！', 'success')
}

const handleLogout = () => {
  userStore.logout()
  window.showToast('👋 已退出登录', 'info')
}
</script>

<style scoped>
.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0,0,0,0.06);
  padding: 0 40px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'ZCOOL KuaiLe', cursive;
  font-size: 28px;
  font-weight: 900;
  background: linear-gradient(135deg, #ff6b35 0%, #ff4757 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  cursor: pointer;
  transition: transform 0.3s;
  text-decoration: none;
}

.logo:hover {
  transform: scale(1.05);
}

.logo-icon {
  font-size: 36px;
}

.nav {
  display: flex;
  gap: 8px;
}

.nav-item {
  padding: 10px 20px;
  border-radius: 12px;
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
}

.nav-item:hover {
  color: #ff6b35;
  background: rgba(255,107,53,0.05);
}

.nav-item.router-link-active {
  background: #ff6b35;
  color: white;
}

.user-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

.username {
  color: #6b7280;
  font-size: 14px;
}

.btn {
  padding: 10px 24px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.btn-primary {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(255,107,53,0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255,107,53,0.4);
}

.btn-outline {
  background: transparent;
  border: 2px solid #e5e7eb;
  color: #6b7280;
}

.btn-outline:hover {
  border-color: #ff6b35;
  color: #ff6b35;
}

.btn-ghost {
  background: rgba(255,107,53,0.1);
  color: #ff6b35;
}

.btn-ghost:hover {
  background: rgba(255,107,53,0.2);
}
</style>
