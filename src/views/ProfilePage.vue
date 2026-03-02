<template>
  <div style="padding: 32px;">
    <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 24px;">👤 个人中心</h1>
    <div v-if="!userStore.isLoggedIn" style="text-align: center; padding: 60px;">
      <div style="font-size: 48px; margin-bottom: 16px;">🔑</div>
      <div style="color: #6b7280; margin-bottom: 24px;">请先登录</div>
      <button class="btn btn-primary" @click="goLogin">去登录</button>
    </div>
    <div v-else style="text-align: center; padding: 40px;">
      <div style="width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 40px; font-weight: 700; margin: 0 auto 16px; box-shadow: 0 8px 24px rgba(255,107,53,0.3);">
        {{ userStore.user.username.charAt(0) }}
      </div>
      <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 8px;">{{ userStore.user.username }}</h2>
      <div style="display: inline-block; padding: 6px 16px; background: linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(255,140,90,0.05) 100%); color: #ff6b35; border-radius: 20px; font-size: 14px; font-weight: 600; margin-bottom: 24px;">
        LV.{{ userStore.user.level }}
      </div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 400px; margin: 0 auto;">
        <div style="padding: 16px; background: #f8fafc; border-radius: 16px;">
          <div style="font-size: 24px; font-weight: 700; color: #1a1a2e;">{{ userStore.user.exp || 0 }}</div>
          <div style="font-size: 12px; color: #9ca3af; margin-top: 4px;">经验值</div>
        </div>
        <div style="padding: 16px; background: #f8fafc; border-radius: 16px;">
          <div style="font-size: 24px; font-weight: 700; color: #1a1a2e;">0</div>
          <div style="font-size: 12px; color: #9ca3af; margin-top: 4px;">发帖</div>
        </div>
        <div style="padding: 16px; background: #f8fafc; border-radius: 16px;">
          <div style="font-size: 24px; font-weight: 700; color: #1a1a2e;">0</div>
          <div style="font-size: 12px; color: #9ca3af; margin-top: 4px;">回复</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const goLogin = () => {
  window.showToast('登录功能开发中～', 'info')
}
</script>

<style scoped>
.btn {
  padding: 14px 32px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s;
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
</style>
