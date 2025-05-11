import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getUserInfo, login, logout as apiLogout } from '@/api/user'
import type { UserInfo, LoginData } from '@/api/user'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {
  const router = useRouter()
  const currentUser = ref<UserInfo | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isLoggedIn = computed(() => {
    return !!currentUser.value && !!localStorage.getItem('token')
  })

  // 获取用户信息
  async function fetchUserInfo() {
    if (!localStorage.getItem('token')) {
      return
    }

    try {
      loading.value = true
      error.value = null
      currentUser.value = await getUserInfo()
    } catch (err: any) {
      error.value = err.message || '获取用户信息失败'
      // 如果获取用户信息失败，可能是token无效，清除token
      localStorage.removeItem('token')
      currentUser.value = null
    } finally {
      loading.value = false
    }
  }

  // 用户登录
  async function loginUser(loginData: LoginData) {
    try {
      loading.value = true
      error.value = null
      const response = await login(loginData)
      localStorage.setItem('token', response.token)
      currentUser.value = response.user
      return true
    } catch (err: any) {
      error.value = err.message || '登录失败'
      return false
    } finally {
      loading.value = false
    }
  }

  // 用户登出
  async function logout() {
    try {
      loading.value = true
      error.value = null

      // 如果有token，调用登出API
      if (localStorage.getItem('token')) {
        await apiLogout()
      }

      // 清除本地存储和状态
      localStorage.removeItem('token')
      currentUser.value = null

      // 跳转到登录页
      router.push('/login')
    } catch (err: any) {
      error.value = err.message || '登出失败'
      // 即使API调用失败，也清除本地存储
      localStorage.removeItem('token')
      currentUser.value = null
    } finally {
      loading.value = false
    }
  }

  return {
    currentUser,
    loading,
    error,
    isLoggedIn,
    fetchUserInfo,
    loginUser,
    logout
  }
})
