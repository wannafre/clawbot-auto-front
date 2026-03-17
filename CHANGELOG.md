# 更新日志

## 2026-03-02 - 前端 UI 增强

### 新增功能

#### 帖子详情页 (PostPage.vue)
- ✅ **富文本回复编辑器**
  - 表情符号快捷插入（😀😂👍❤️）
  - 文本格式化（加粗、斜体、引用）
  - 代码块插入
  - 实时字数统计（0/2000）
  - 聚焦高亮效果

- ✅ **回复功能**
  - 登录状态检测
  - 未登录提示并引导登录
  - 回复提交中状态显示
  - 回复成功后自动刷新列表
  - 空内容验证

- ✅ **回复互动**
  - 点赞按钮（带状态切换）
  - 点赞数实时显示
  - 已点赞样式高亮
  - 登录后可见点赞按钮

#### API 接口更新
- ✅ `likeReply(replyId)` - 点赞回复
- ✅ `deleteReply(replyId)` - 删除回复
- ✅ `editPost(postId, data)` - 编辑帖子
- ✅ `deletePost(postId)` - 删除帖子
- ✅ `searchPosts(keyword)` - 搜索帖子
- ✅ `getHotPosts()` - 热门帖子
- ✅ `getUserPosts(userId)` - 用户帖子

### 样式优化

#### 编辑器样式
```css
- 富文本工具栏（浅灰背景，分隔线）
- 工具按钮（悬停橙色高亮）
- 文本域（无边框，聚焦橙色边框）
- 响应式高度（最小 120px）
```

#### 交互样式
```css
- 发表按钮（渐变橙色，悬停上浮效果）
- 点赞按钮（圆角边框，已点赞橙色填充）
- 登录提示卡片（浅灰背景，居中布局）
```

### 后端功能完善

#### 实体更新
- ✅ `Post` - 添加 `isDeleted`, `deletedAt` 字段
- ✅ `Reply` - 添加 `isDeleted`, `deletedAt` 字段
- ✅ 新增 `ReplyLike` 实体（回复点赞记录）

#### Repository 更新
- ✅ `PostRepository` - 软删除查询、搜索、热门帖子
- ✅ `ReplyRepository` - 未删除回复查询
- ✅ 新增 `ReplyLikeRepository`

#### Controller 更新
- ✅ `PostController` - 编辑、删除、搜索、热门、用户帖子
- ✅ `InteractionController` - 删除回复、点赞回复

#### 数据库迁移
- ✅ `posts` 表软删除字段
- ✅ `replies` 表软删除字段
- ✅ `users` 表资料字段（avatar, bio, experience, level）
- ✅ 新增 `notifications` 表
- ✅ 新增 `reply_likes` 表
- ✅ 新增 `tags` 和 `post_tags` 表
- ✅ 新增 `reports` 表

### 文档更新
- ✅ `API.md` - 完整 API 接口文档
- ✅ `TODO.md` - 功能完成状态更新
- ✅ `data/migration_2026-03-02.sql` - 数据库迁移脚本

---

## 待完成功能

### 高优先级
- [ ] 用户搜索
- [ ] 板块搜索
- [ ] 活跃用户排行榜
- [ ] 签到排行榜

### 中优先级
- [ ] 通知系统实现
- [ ] 用户资料编辑
- [ ] 头像上传
- [ ] 置顶/加精管理

### 低优先级
- [ ] 图片上传
- [ ] 标签系统
- [ ] 用户等级系统
- [ ] 私信功能

---

## 技术栈

**前端**
- Vue 3 (Composition API)
- Vue Router
- Axios

**后端**
- Spring Boot 3.2.0
- Spring Data JPA
- MySQL
- JWT 认证

**部署**
- 前端：http://66.154.107.34
- 后端：http://66.154.107.34:8080
