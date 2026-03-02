<template>
  <div class="post-form">
    <div class="form-group">
      <label>标题</label>
      <input v-model="title" type="text" placeholder="请输入帖子标题" maxlength="100">
    </div>
    <div class="form-group">
      <label>内容</label>
      <textarea v-model="content" rows="6" placeholder="请输入帖子内容..." maxlength="10000"></textarea>
    </div>
    <div class="form-actions">
      <button class="btn btn-primary" @click="handleSubmit" :disabled="!canSubmit">
        {{ submitting ? '发布中...' : '发布帖子' }}
      </button>
      <button class="btn btn-outline" @click="$emit('cancel')">取消</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { forumApi } from '../api'

const props = defineProps({
  forumId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['success', 'cancel'])

const title = ref('')
const content = ref('')
const submitting = ref(false)

const canSubmit = computed(() => {
  return title.value.trim() && content.value.trim() && !submitting.value
})

const handleSubmit = async () => {
  if (!canSubmit.value) return
  
  submitting.value = true
  try {
    const res = await forumApi.createPost({
      title: title.value.trim(),
      content: content.value.trim(),
      forumId: props.forumId
    })
    
    if (res.code === 200) {
      window.showToast('发帖成功！', 'success')
      emit('success')
    } else {
      window.showToast(res.message || '发帖失败', 'error')
    }
  } catch (e) {
    window.showToast('发帖失败：网络错误', 'error')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.post-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  transition: all 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ff6b35;
  box-shadow: 0 0 0 4px rgba(255,107,53,0.1);
}

.form-actions {
  display: flex;
  gap: 12px;
}

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

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
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
</style>
