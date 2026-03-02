<template>
  <div class="toast-container" v-if="toasts.length > 0">
    <div v-for="(toast, index) in toasts" :key="index" class="toast" :class="toast.type">
      <span class="toast-icon">{{ toast.icon }}</span>
      <span class="toast-message">{{ toast.message }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const toasts = ref([])

const showToast = (message, type = 'info') => {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }
  toasts.value.push({ message, type, icon: icons[type] })
  setTimeout(() => {
    toasts.value.shift()
  }, 3000)
}

onMounted(() => {
  window.showToast = showToast
})

onUnmounted(() => {
  delete window.showToast
})
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toast {
  min-width: 280px;
  max-width: 450px;
  padding: 16px 24px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 20px 60px rgba(0,0,0,0.16);
  display: flex;
  align-items: center;
  gap: 12px;
  animation: slideDown 0.3s ease;
  border-left: 4px solid;
}

.toast.success { border-left-color: #10b981; }
.toast.error { border-left-color: #ef4444; }
.toast.warning { border-left-color: #f59e0b; }
.toast.info { border-left-color: #3b82f6; }

.toast-icon { font-size: 20px; }
.toast-message { flex: 1; font-size: 14px; color: #1a1a2e; }

@keyframes slideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
