import axios from 'axios'

const API_BASE = 'http://66.154.107.34:8080/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器 - 添加 Token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('forumToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器
api.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error)
)

// API 方法
export const forumApi = {
  getForums: () => api.get('/forums'),
  getForum: (id) => api.get(`/forums/${id}`),
  getPosts: (forumId, page = 0) => api.get(`/posts/forum/${forumId}?page=${page}&size=20`),
  getPost: (id) => api.get(`/posts/${id}`),
  getReplies: (postId) => api.get(`/posts/${postId}/replies`),
  createPost: (data) => api.post('/posts', data),
  createReply: (postId, data) => api.post(`/posts/${postId}/replies`, data),
  toggleLike: (postId) => api.post(`/interact/post/${postId}/like`),
  toggleFavorite: (postId, userId) => api.post(`/interact/post/${postId}/favorite?userId=${userId}`),
  checkIn: () => api.post('/checkin'),
  // 回复相关
  likeReply: (replyId) => api.post(`/interact/reply/${replyId}/like`),
  deleteReply: (replyId) => api.delete(`/interact/reply/${replyId}`),
  // 帖子相关
  editPost: (postId, data) => api.put(`/posts/${postId}`, data),
  deletePost: (postId) => api.delete(`/posts/${postId}`),
  searchPosts: (keyword, page = 0) => api.get(`/posts/search?keyword=${keyword}&page=${page}&size=20`),
  getHotPosts: (page = 0) => api.get(`/posts/hot?page=${page}&size=20`),
  getUserPosts: (userId, page = 0) => api.get(`/posts/user/${userId}?page=${page}&size=20`)
}

export const authApi = {
  login: (data) => api.post('/api/auth/login', data),
  register: (data) => api.post('/api/auth/register', data)
}

export const captchaApi = {
  generate: () => api.get('/captcha/generate'),
  verify: (data) => api.post('/captcha/verify', data)
}

export default api
