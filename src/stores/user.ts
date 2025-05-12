import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getUserInfo, getUserById, login, logout as apiLogout, register as apiRegister } from '@/api/user'
import type { UserInfo, LoginData, LogoutData, RegisterData } from '@/api/user'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {
  const router = useRouter()
  const currentUser = ref<UserInfo | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isLoggedIn = computed(() => {
    // 同时检查本地存储和当前用户对象
    return !!localStorage.getItem('user') && !!currentUser.value
  })

  // 从localStorage加载用户信息
  function loadUserFromStorage() {
    const userJson = localStorage.getItem('user')
    if (userJson) {
      try {
        currentUser.value = JSON.parse(userJson)
      } catch (err) {
        console.error('解析存储的用户数据失败', err)
        localStorage.removeItem('user')
        currentUser.value = null
      }
    }
  }

  // 获取用户信息
  async function fetchUserInfo() {
    // 首先尝试从本地存储加载
    loadUserFromStorage()

    // 如果本地存储中有用户信息，直接使用
    if (currentUser.value) {
      return
    }

    // 如果没有本地存储，则尝试通过API获取（会默认获取ID为1的用户或本地存储中的用户）
    try {
      loading.value = true
      error.value = null
      currentUser.value = await getUserInfo()
      // 获取成功后保存到本地存储
      if (currentUser.value) {
        localStorage.setItem('user', JSON.stringify(currentUser.value))
      }
    } catch (err: Error | unknown) {
      error.value = err instanceof Error ? err.message : '获取用户信息失败'
      // 如果获取用户信息失败，清除本地存储
      localStorage.removeItem('user')
      currentUser.value = null
    } finally {
      loading.value = false
    }
  }

  // 根据ID获取用户信息
  async function getUserInfoById(userId: string | number) {
    try {
      loading.value = true
      error.value = null
      return await getUserById(userId)
    } catch (err: Error | unknown) {
      error.value = err instanceof Error ? err.message : `获取用户ID=${userId}的信息失败`
      return null
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
      // 将整个用户对象存储在本地存储中
      localStorage.setItem('user', JSON.stringify(response))
      currentUser.value = response
      return true
    } catch (err: Error | unknown) {
      error.value = err instanceof Error ? err.message : '登录失败'
      return false
    } finally {
      loading.value = false
    }
  }

  // 用户注册
  async function register(registerData: RegisterData) {
    try {
      loading.value = true
      error.value = null
      await apiRegister(registerData)
      return true
    } catch (err: Error | unknown) {
      error.value = err instanceof Error ? err.message : '注册失败'
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

      // 先保存必要的信息用于API调用
      let logoutData: LogoutData | null = null
      if (currentUser.value) {
        logoutData = {
          id: currentUser.value.id,
          username: currentUser.value.username,
        }
      }

      // 立即清除本地存储和状态，确保UI能立即响应
      localStorage.removeItem('user')
      currentUser.value = null
      error.value = null

      // 然后调用登出API
      if (logoutData) {
        try {
          await apiLogout(logoutData)
        } catch (e) {
          console.error('登出API调用失败，但本地状态已清除', e)
        }
      }

      // 跳转到登录页
      router.push('/login')
    } catch (err: Error | unknown) {
      error.value = err instanceof Error ? err.message : '登出失败'
      // 确保本地状态已清除
      localStorage.removeItem('user')
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
    getUserInfoById,
    loginUser,
    register,
    logout,
  }
})
