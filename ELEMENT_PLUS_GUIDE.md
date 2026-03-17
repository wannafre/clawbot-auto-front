# Element Plus 使用指南

## 📦 已安装

- ✅ `element-plus` - Vue 3 组件库
- ✅ `@element-plus/icons-vue` - Element Plus 图标库

## 🎯 快速开始

### 全局使用（已配置）

在 `src/main.js` 中已全局注册 Element Plus，所有页面可以直接使用：

```vue
<template>
  <el-button type="primary">主要按钮</el-button>
  <el-input v-model="text" placeholder="请输入内容" />
</template>
```

### 常用组件示例

#### 1. 按钮 (Button)
```vue
<el-button>默认按钮</el-button>
<el-button type="primary">主要按钮</el-button>
<el-button type="success">成功按钮</el-button>
<el-button type="warning">警告按钮</el-button>
<el-button type="danger">危险按钮</el-button>
<el-button type="info">信息按钮</el-button>

<!-- 带图标 -->
<el-button :icon="Search">搜索</el-button>
<el-button type="primary" :icon="Download">下载</el-button>
```

#### 2. 表单 (Form)
```vue
<el-form :model="form" label-width="80px">
  <el-form-item label="用户名">
    <el-input v-model="form.username" />
  </el-form-item>
  <el-form-item label="密码">
    <el-input v-model="form.password" type="password" />
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">提交</el-button>
  </el-form-item>
</el-form>
```

#### 3. 对话框 (Dialog)
```vue
<el-dialog v-model="dialogVisible" title="标题">
  <span>这是一段内容</span>
  <template #footer>
    <el-button @click="dialogVisible = false">取消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确定</el-button>
  </template>
</el-dialog>
```

#### 4. 消息提示 (Message)
```javascript
import { ElMessage } from 'element-plus'

// 成功
ElMessage.success('操作成功！')

// 警告
ElMessage.warning('请注意此操作')

// 错误
ElMessage.error('操作失败')

// 信息
ElMessage.info('这是一条提示信息')
```

#### 5. 确认框 (MessageBox)
```javascript
import { ElMessageBox } from 'element-plus'

ElMessageBox.confirm(
  '此操作将永久删除该文件，是否继续？',
  '警告',
  {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }
)
  .then(() => {
    ElMessage.success('删除成功')
  })
  .catch(() => {
    ElMessage.info('已取消删除')
  })
```

#### 6. 标签 (Tag)
```vue
<el-tag>默认</el-tag>
<el-tag type="success">成功</el-tag>
<el-tag type="info">信息</el-tag>
<el-tag type="warning">警告</el-tag>
<el-tag type="danger">危险</el-tag>

<!-- 可关闭 -->
<el-tag closable>可关闭</el-tag>

<!-- 圆角 -->
<el-tag round>圆角</el-tag>
```

#### 7. 徽章 (Badge)
```vue
<el-badge :value="12" class="item">
  <el-button>评论</el-button>
</el-badge>

<el-badge :value="new" class="item">
  <el-button>消息</el-button>
</el-badge>
```

#### 8. 卡片 (Card)
```vue
<el-card class="box-card">
  <template #header>
    <div class="card-header">
      <span>卡片名称</span>
    </div>
  </template>
  <div>卡片内容</div>
</el-card>
```

#### 9. 分页 (Pagination)
```vue
<el-pagination
  v-model:current-page="currentPage"
  :page-size="20"
  :total="100"
  layout="total, prev, pager, next"
/>
```

#### 10. 加载 (Loading)
```vue
<el-loading v-loading="loading">
  <div>内容区域</div>
</el-loading>

<!-- 指令方式 -->
<div v-loading="loading">内容区域</div>
```

## 🎨 论坛页面应用建议

### 1. 顶部导航栏
```vue
<el-menu mode="horizontal" :ellipsis="false">
  <el-menu-item index="1">首页</el-menu-item>
  <el-menu-item index="2">板块</el-menu-item>
  <el-menu-item index="3">热门</el-menu-item>
</el-menu>
```

### 2. 帖子列表
```vue
<el-card v-for="post in posts" :key="post.id" class="post-card">
  <div class="post-header">
    <el-avatar :size="40">{{ post.author }}</el-avatar>
    <div class="post-info">
      <div class="post-title">{{ post.title }}</div>
      <el-tag size="small">{{ post.forum }}</el-tag>
    </div>
  </div>
  <div class="post-stats">
    <el-badge :value="post.replyCount" class="stat-item">
      <el-button icon="ChatDotRound">回复</el-button>
    </el-badge>
    <el-button :icon="Star">点赞 {{ post.likeCount }}</el-button>
  </div>
</el-card>
```

### 3. 回复编辑器
```vue
<el-input
  v-model="replyContent"
  type="textarea"
  :rows="4"
  placeholder="写下你的回复..."
/>
<el-button type="primary" @click="submitReply">
  <el-icon><Promotion /></el-icon>
  发表回复
</el-button>
```

### 4. 用户头像
```vue
<el-avatar :size="50" :src="user.avatar">
  {{ user.username.charAt(0) }}
</el-avatar>
```

### 5. 搜索框
```vue
<el-input
  v-model="searchText"
  placeholder="搜索帖子..."
  :prefix-icon="Search"
  clearable
/>
```

## 📱 响应式支持

Element Plus 自带响应式，配合 CSS 可以实现移动端适配：

```vue
<el-row :gutter="20">
  <el-col :xs="24" :sm="12" :md="8" :lg="6">
    <el-card>内容</el-card>
  </el-col>
</el-row>
```

## 🎯 下一步

1. **替换现有组件** - 将论坛页面的原生组件替换为 Element Plus
2. **统一样式** - 使用 Element Plus 的设计语言
3. **添加更多交互** - 利用 Element Plus 的丰富组件提升用户体验

## 📚 官方文档

- [Element Plus 文档](https://element-plus.org/zh-CN/)
- [图标库](https://element-plus.org/zh-CN/component/icon.html)
- [主题定制](https://element-plus.org/zh-CN/guide/theming.html)
