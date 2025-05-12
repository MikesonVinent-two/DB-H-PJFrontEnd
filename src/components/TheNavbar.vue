<template>
  <el-menu
    :default-active="activeIndex"
    class="navbar"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    <!-- 左侧 Logo 和标题 -->
    <div class="navbar-left">
      <div class="logo-container" @click="router.push('/')" role="button">
      <img src="@/assets/logo.svg" alt="Logo" class="logo" />
      <span class="title">AI问答系统</span>
      </div>
    </div>

    <!-- 右侧功能区 -->
    <div class="navbar-right">
      <template v-if="isLoggedIn && currentUser">
        <!-- 对话按钮 -->
        <el-menu-item index="chat" class="nav-item">
          <el-tooltip content="开始对话" placement="bottom" :show-after="500">
            <div class="nav-button">
        <el-icon><ChatDotRound /></el-icon>
              <span class="nav-text">对话</span>
            </div>
          </el-tooltip>
        </el-menu-item>

        <!-- 模型配置按钮 -->
        <el-menu-item index="model-settings" class="nav-item" @click="handleModelConfig">
          <el-tooltip content="配置AI模型" placement="bottom" :show-after="500">
            <div class="nav-button">
          <el-icon><Setting /></el-icon>
              <span class="nav-text">配置</span>
            </div>
          </el-tooltip>
        </el-menu-item>

        <!-- 用户头像 -->
        <el-dropdown trigger="click" class="user-dropdown">
          <div class="user-avatar">
            <el-avatar :size="32" :src="currentUser.avatar">
              {{ currentUser.username?.charAt(0).toUpperCase() }}
            </el-avatar>
          </div>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <div class="user-info-header">
                  <el-avatar :size="48" :src="currentUser.avatar">
                    {{ currentUser.username?.charAt(0).toUpperCase() }}
                  </el-avatar>
                  <div class="user-info-main">
                    <span class="user-info-name">{{ currentUser.username }}</span>
                    <span class="user-info-role">{{ getRoleName(currentUser.role) }}</span>
                  </div>
                </div>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <el-icon><User /></el-icon>个人信息
              </el-dropdown-item>
              <el-dropdown-item>
                <el-icon><List /></el-icon>历史记录
              </el-dropdown-item>
              <el-dropdown-item divided @click="handleLogout">
                <el-icon><SwitchButton /></el-icon>退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
    </template>

    <template v-else>
        <el-menu-item index="login" class="auth-item">
        <el-icon><User /></el-icon>
        登录
      </el-menu-item>
        <el-menu-item index="register" class="auth-item">
        <el-icon><Plus /></el-icon>
        注册
      </el-menu-item>
    </template>
    </div>
  </el-menu>

  <!-- 模型选择器组件 -->
  <ModelSelector ref="modelSelectorRef" />
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { UserRole } from '@/api/user'
import type { UserInfo } from '@/api/user'
import { ElMessage } from 'element-plus'
import {
  User,
  UserFilled,
  Setting,
  SwitchButton,
  ChatDotRound,
  List,
  Plus,
  Message,
  Calendar,
  ArrowDown,
} from '@element-plus/icons-vue'
import ModelSelector from './ModelSelector.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 添加本地状态跟踪登录状态，确保立即响应
const localIsLoggedIn = ref(!!localStorage.getItem('user'))

// 添加用户信息加载状态
const isLoadingUserInfo = ref(false)

const activeIndex = computed(() => route.name as string)

// 从内存中获取用户信息
const currentUser = computed(() => {
  // 优先从内存中获取
  if (window.userInfo) {
    return window.userInfo
  }

  // 尝试从localStorage获取
  const storedUserInfo = localStorage.getItem('userInfo')
  if (storedUserInfo) {
    try {
      const parsedUser = JSON.parse(storedUserInfo)
      // 验证用户信息完整性
      if (parsedUser && parsedUser.username && parsedUser.role) {
        return parsedUser
      }
    } catch (e) {
      console.error('解析用户信息失败:', e)
    }
  }

  // 最后从store获取
  return userStore.currentUser
})

// 使用本地状态而不是直接依赖store
const isLoggedIn = computed(() => {
  return !!currentUser.value
})

const modelSelectorRef = ref<InstanceType<typeof ModelSelector> | null>(null)

const handleSelect = (key: string) => {
  if (key !== 'model-settings' && key !== 'logout' && key !== 'user') {
    router.push({ name: key })
  }
}

// 处理角色名称显示
const getRoleName = (role: UserRole | undefined) => {
  if (!role) return '未知角色'
  switch (role) {
    case UserRole.USER:
      return '普通用户'
    case UserRole.ADMIN:
      return '管理员'
    case UserRole.EXPERT:
      return '专家'
    default:
      return '未知角色'
  }
}

const formatDate = (date: string | undefined) => {
  if (!date) return '未知'
  try {
    return new Date(date).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (e) {
    console.error('日期格式化失败:', e)
    return '格式错误'
  }
}

// 处理用户登录事件
const handleUserLogin = async (event: CustomEvent<UserInfo>) => {
  const userData = event.detail
  if (!userData) return

  isLoadingUserInfo.value = true
  try {
    // 立即更新本地登录状态
    localIsLoggedIn.value = true

    // 确保window.userInfo存在
    if (!window.userInfo) {
      window.userInfo = userData
    }

    // 更新localStorage
    localStorage.setItem('userInfo', JSON.stringify(userData))
  } catch (error) {
    console.error('更新用户信息失败:', error)
  } finally {
    isLoadingUserInfo.value = false
  }
}

// 生命周期钩子
onMounted(() => {
  console.log('Debug: TheNavbar mounted')
  console.log('Debug: modelSelectorRef:', modelSelectorRef.value)
  window.addEventListener('user-login', ((e: Event) => handleUserLogin(e as CustomEvent<UserInfo>)) as EventListener)

  // 如果内存中已有用户信息，直接使用
  if (window.userInfo) {
    handleUserLogin(new CustomEvent('user-login', { detail: window.userInfo }))
  }
})

onUnmounted(() => {
  window.removeEventListener('user-login', ((e: Event) => handleUserLogin(e as CustomEvent<UserInfo>)) as EventListener)
})

const handleLogout = async () => {
  try {
    // 清理所有存储
    window.userInfo = undefined
    localStorage.removeItem('userInfo')
    localStorage.removeItem('user')  // 同时清除 'user' 存储
    localStorage.removeItem('token') // 清除 token
    sessionStorage.removeItem('userInfo')
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('token')

    // 更新状态
    localIsLoggedIn.value = false

    // 执行登出操作
    await userStore.logout()

    // 确保视图更新
    await nextTick()

    // 额外清理，防止因数据不同步导致的问题
    if (userStore.currentUser) {
      userStore.$reset && userStore.$reset()
    }

    // 强制重定向到登录页面，确保导航栏刷新
    router.push('/login')

    // 可选：强制刷新页面以确保所有状态重置
    // window.location.href = '/login'

    ElMessage.success('已退出登录')
  } catch (error) {
    console.error('退出登录失败:', error)
    ElMessage.error('退出登录失败，请刷新页面重试')
  }
}

// 处理模型配置
const handleModelConfig = () => {
  if (modelSelectorRef.value) {
    modelSelectorRef.value.toggleConfig()
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: var(--navbar-height, 60px);
  padding: 0;
  background: linear-gradient(135deg, #1890ff 0%, #1d39c4 100%);
  border: none;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.navbar-left,
.navbar-right {
  display: flex;
  align-items: center;
  height: 100%;
}

.navbar-left {
  padding-left: 24px;
}

.navbar-right {
  padding-right: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  height: var(--navbar-height, 60px);
  padding: 0 12px;
  border-radius: 4px;
}

.logo-container:hover {
  background: rgba(255, 255, 255, 0.1);
}

.logo {
  height: 32px;
  margin-right: 12px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
}

/* 导航项样式 */
.nav-item {
  padding: 0 12px;
  margin: 0 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-text {
  font-size: 14px;
}

:deep(.el-menu--horizontal) {
  border: none;
}

:deep(.el-menu-item),
:deep(.el-dropdown-trigger) {
  color: rgba(255, 255, 255, 0.85) !important;
  height: var(--navbar-height, 60px);
  line-height: var(--navbar-height, 60px);
  padding: 0 16px;
  font-size: 14px;
  transition: all 0.3s ease;
}

:deep(.el-menu-item:hover),
.user-avatar:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: #ffffff !important;
}

:deep(.el-menu-item.is-active) {
  background-color: rgba(255, 255, 255, 0.15) !important;
  color: #ffffff !important;
  border-bottom: 2px solid #ffffff !important;
}

/* 用户头像样式 */
.user-dropdown {
  height: var(--navbar-height, 60px);
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-avatar {
  padding: 0 12px;
  height: 100%;
  display: flex;
  align-items: center;
  border-radius: 4px;
  transition: all 0.3s ease;
}

/* 用户信息样式 */
.user-info-header {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-info-name {
  font-size: 16px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.user-info-role {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  background: var(--el-color-primary-light-9);
  padding: 2px 8px;
  border-radius: 12px;
  display: inline-block;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
}

:deep(.el-icon) {
  font-size: 16px;
}

/* 登录注册按钮样式 */
.auth-item {
  margin: 0 4px;
  border-radius: 4px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .navbar-left {
    padding-left: 16px;
  }

  .navbar-right {
    padding-right: 16px;
  }

  .title {
    display: none;
  }

  .nav-text {
    display: none;
  }

  .nav-item {
    padding: 0 8px;
  }
}
</style>

