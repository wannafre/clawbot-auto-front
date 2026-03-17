<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isLogin ? '🔑 用户登录' : '✨ 用户注册'"
    :width="480"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    :show-close="true"
    append-to-body
    center
    class="login-dialog"
    @close="$emit('update:modelValue', false)"
  >
    <!-- 滑块验证码 -->
    <div class="captcha-container" v-if="showCaptcha">
      <div class="captcha-header">
        <span>🧩 滑动验证</span>
        <button class="captcha-refresh" @click="loadCaptcha">🔄</button>
      </div>
      <div class="captcha-image" ref="captchaImageRef">
        <img :src="captchaData.bgImage" alt="背景" class="bg-img" />
        <div class="slider-mask" :style="{ width: sliderPosition + 'px' }"></div>
        <div class="slider-block" :style="{ left: sliderPosition + 'px' }">
          <img :src="captchaData.sliderImage" alt="滑块" class="slider-img" />
        </div>
      </div>
      <div class="slider-track" ref="sliderTrackRef" @mousedown="startDrag" @touchstart="startDrag">
        <div class="slider-text">{{ sliderText }}</div>
        <div class="slider-button" :style="{ left: sliderPosition + 'px' }">→</div>
      </div>
    </div>

    <!-- 登录表单 -->
    <div v-if="isLogin && !showCaptcha">
      <div class="form-group">
        <label>用户名</label>
        <el-input v-model="loginForm.username" placeholder="请输入用户名" :prefix-icon="User" />
      </div>
      <div class="form-group">
        <label>密码</label>
        <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password />
      </div>
      <el-button type="primary" @click="handleLogin" :loading="loginLoading" style="width: 100%">
        {{ loginLoading ? '登录中...' : '立即登录' }}
      </el-button>
      <div class="form-switch">
        还没有账号？<a @click="isLogin = false">立即注册</a>
      </div>
    </div>

    <!-- 注册表单 -->
    <div v-else-if="!showCaptcha">
      <div class="form-group">
        <label>用户名</label>
        <el-input v-model="registerForm.username" placeholder="请输入用户名" :prefix-icon="User" />
      </div>
      <div class="form-group">
        <label>邮箱</label>
        <el-input v-model="registerForm.email" type="email" placeholder="请输入邮箱" :prefix-icon="Message" />
      </div>
      <div class="form-group">
        <label>密码</label>
        <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" show-password />
      </div>
      <el-button type="primary" @click="handleRegister" :loading="registerLoading" style="width: 100%">
        {{ registerLoading ? '注册中...' : '立即注册' }}
      </el-button>
      <div class="form-switch">
        已有账号？<a @click="isLogin = false">立即登录</a>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { User, Message } from '@element-plus/icons-vue'
import { authApi, captchaApi } from '../api'
import { useUserStore } from '../stores/user'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'success'])

const userStore = useUserStore()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isLogin = ref(true)
const showCaptcha = ref(false)
const loginLoading = ref(false)
const registerLoading = ref(false)
const captchaLoading = ref(false)
const sliderPosition = ref(0)
const sliderText = ref('向右滑动填充拼图')
const captchaData = ref({})
const captchaId = ref('')

const loginForm = ref({
  username: '',
  password: ''
})

const registerForm = ref({
  username: '',
  email: '',
  password: '',
  captchaId: '',
  captchaCode: ''
})

const loadCaptcha = async () => {
  try {
    const res = await captchaApi.generate()
    if (res.code === 200) {
      captchaData.value = res.data
      captchaId.value = res.data.captchaId
    }
  } catch (e) {
    console.error('验证码加载失败', e)
  }
}

const startDrag = (e) => {
  const startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX
  const trackWidth = 300
  
  const move = (e) => {
    const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX
    const diff = currentX - startX
    sliderPosition.value = Math.max(0, Math.min(diff, trackWidth))
  }

  const up = async () => {
    document.removeEventListener('mousemove', move)
    document.removeEventListener('mouseup', up)
    document.removeEventListener('touchmove', move)
    document.removeEventListener('touchend', up)

    // 计算滑块位置百分比 (0-100)
    const sliderPercentage = Math.round((sliderPosition.value / trackWidth) * 100)
    
    if (sliderPercentage > 80) {
      // 验证滑块
      try {
        const res = await captchaApi.verify({
          captchaId: captchaId.value,
          xPosition: sliderPercentage
        })
        if (res.code === 200 && res.data.success) {
          showCaptcha.value = false
          window.showToast('验证通过', 'success')
        } else {
          window.showToast(res.data.message || '验证失败，请重试', 'error')
          sliderPosition.value = 0
          loadCaptcha()
        }
      } catch (e) {
        window.showToast('验证失败', 'error')
        sliderPosition.value = 0
        loadCaptcha()
      }
    } else {
      window.showToast('请向右滑动完成验证', 'warning')
      sliderPosition.value = 0
    }
  }

  document.addEventListener('mousemove', move)
  document.addEventListener('mouseup', up)
  document.addEventListener('touchmove', move)
  document.addEventListener('touchend', up)
}

const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    window.showToast('请输入用户名和密码', 'warning')
    return
  }

  loginLoading.value = true
  try {
    const res = await authApi.login({
      username: loginForm.value.username,
      password: loginForm.value.password
    })
    if (res.code === 200) {
      userStore.login(res.data)
      emit('update:modelValue', false)
      emit('success')
      window.showToast('登录成功！', 'success')
    } else {
      window.showToast(res.message || '登录失败', 'error')
    }
  } catch (e) {
    window.showToast('登录失败：' + e.message, 'error')
  }
  loginLoading.value = false
}

const handleRegister = async () => {
  if (!registerForm.value.username || !registerForm.value.email || !registerForm.value.password) {
    window.showToast('请填写完整信息', 'warning')
    return
  }

  registerLoading.value = true
  try {
    const res = await authApi.register(registerForm.value)
    if (res.code === 200) {
      emit('update:modelValue', false)
      emit('success')
      window.showToast('注册成功！', 'success')
    } else {
      window.showToast(res.message || '注册失败', 'error')
    }
  } catch (e) {
    window.showToast('注册失败：' + e.message, 'error')
  }
  registerLoading.value = false
}

// 监听弹窗打开，加载验证码
watch(dialogVisible, (newVal) => {
  if (newVal) {
    loadCaptcha()
  }
})
</script>

<style>
.login-dialog .el-dialog__header {
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  margin-right: 0;
}

.login-dialog .el-dialog__title {
  font-size: 18px;
  font-weight: 700;
}

.login-dialog .el-dialog__body {
  padding: 20px;
}

.captcha-container {
  margin-bottom: 20px;
}

.captcha-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
}

.captcha-refresh {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #409EFF;
}

.captcha-image {
  position: relative;
  width: 300px;
  height: 160px;
  margin: 0 auto 12px;
  overflow: hidden;
  border-radius: 8px;
}

.bg-img, .slider-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slider-mask {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.slider-block {
  position: absolute;
  top: 0;
  height: 100%;
  width: 60px;
  overflow: hidden;
  z-index: 2;
  border: 2px solid #409EFF;
}

.slider-track {
  position: relative;
  width: 300px;
  height: 40px;
  margin: 0 auto;
  background: #f5f7fa;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid #e5e7eb;
}

.slider-text {
  position: absolute;
  font-size: 13px;
  color: #9ca3af;
  user-select: none;
}

.slider-button {
  position: absolute;
  left: 0;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #409EFF 0%, #67C23A 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  box-shadow: 0 2px 8px rgba(64,158,255,0.3);
  cursor: grab;
  transition: background 0.3s;
}

.slider-button:hover {
  background: linear-gradient(135deg, #67C23A 0%, #409EFF 100%);
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-switch {
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
  color: #6b7280;
}

.form-switch a {
  color: #409EFF;
  cursor: pointer;
  text-decoration: none;
}

.form-switch a:hover {
  text-decoration: underline;
}
</style>
