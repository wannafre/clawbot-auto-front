import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(JSON.parse(localStorage.getItem('forumUser') || 'null'))
  const token = ref(localStorage.getItem('forumToken') || null)

  const isLoggedIn = computed(() => !!user.value && !!token.value)

  function login(userData) {
    user.value = userData
    token.value = userData.token
    localStorage.setItem('forumUser', JSON.stringify(userData))
    localStorage.setItem('forumToken', userData.token)
  }

  function setUser(userData, userToken) {
    user.value = userData
    token.value = userToken
    localStorage.setItem('forumUser', JSON.stringify(userData))
    localStorage.setItem('forumToken', userToken)
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('forumUser')
    localStorage.removeItem('forumToken')
  }

  return {
    user,
    token,
    isLoggedIn,
    login,
    setUser,
    logout
  }
})
