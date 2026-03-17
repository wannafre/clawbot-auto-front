<template>
  <el-dialog
    v-model="dialogVisible"
    title="📝 发新帖"
    :width="800"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    :show-close="true"
    append-to-body
    center
    class="new-post-dialog"
    @close="$emit('update:modelValue', false)"
  >
    <PostForm :forumId="forumId" @success="handleSuccess" @cancel="$emit('update:modelValue', false)" />
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'
import PostForm from './PostForm.vue'

const props = defineProps({
  modelValue: Boolean,
  forumId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleSuccess = () => {
  emit('update:modelValue', false)
  emit('success')
}
</script>

<style>
.new-post-dialog .el-dialog__header {
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  margin-right: 0;
}

.new-post-dialog .el-dialog__title {
  font-size: 20px;
  font-weight: 700;
}

.new-post-dialog .el-dialog__body {
  padding: 0;
}

.new-post-dialog .el-dialog__footer {
  display: none;
}
</style>
