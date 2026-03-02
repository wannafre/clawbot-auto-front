import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import ForumPage from '../views/ForumPage.vue'
import PostPage from '../views/PostPage.vue'
import ProfilePage from '../views/ProfilePage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/forum/:id',
    name: 'Forum',
    component: ForumPage
  },
  {
    path: '/post/:id',
    name: 'Post',
    component: PostPage
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
