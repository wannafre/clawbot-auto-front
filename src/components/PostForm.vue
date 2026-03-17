<template>
  <div class="post-form">
    <div class="form-group">
      <label>标题</label>
      <input v-model="title" type="text" placeholder="请输入帖子标题" maxlength="100">
    </div>
    <div class="form-group">
      <label>内容</label>
      <div ref="editorContainer" class="editor-container"></div>
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
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
const editorContainer = ref(null)
let editor = null

const canSubmit = computed(() => {
  return title.value.trim() && content.value.trim() && !submitting.value
})

onMounted(() => {
  // 初始化 Quill 编辑器
  if (window.Quill && editorContainer.value) {
    editor = new window.Quill(editorContainer.value, {
      theme: 'snow',
      placeholder: '请输入帖子内容...',
      modules: {
        toolbar: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['link', 'image'],
          ['clean']
        ]
      }
    })
    
    // 监听内容变化
    editor.on('text-change', () => {
      content.value = editor.getText() ? editor.root.innerHTML : ''
    })
  }
})

onBeforeUnmount(() => {
  if (editor) {
    editor = null
  }
})

const handleSubmit = async () => {
  if (!canSubmit.value) {
    if (!title.value.trim()) {
      window.showToast('请输入标题', 'warning')
      return
    }
    if (!content.value.trim()) {
      window.showToast('请输入内容', 'warning')
      return
    }
    return
  }
  
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

.form-group input {
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  transition: all 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #ff6b35;
  box-shadow: 0 0 0 4px rgba(255,107,53,0.1);
}

.editor-container {
  min-height: 300px;
  background: white;
}

:deep(.ql-toolbar) {
  border: 2px solid #e5e7eb !important;
  border-radius: 12px 12px 0 0 !important;
}

:deep(.ql-container) {
  border: 2px solid #e5e7eb !important;
  border-radius: 0 0 12px 12px !important;
  font-size: 15px;
  min-height: 250px;
}

:deep(.ql-container:focus-within) {
  border-color: #ff6b35 !important;
  box-shadow: 0 0 0 4px rgba(255,107,53,0.1);
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
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
