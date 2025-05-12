<template>
  <el-menu
    :default-active="activeIndex"
    class="navbar"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    <div class="logo-container" @click="router.push('/')" role="button">
      <img src="@/assets/logo.svg" alt="Logo" class="logo" />
      <span class="title">AI问答系统</span>
    </div>

    <div class="flex-grow" />

    <template v-if="isLoggedIn">
      <el-menu-item index="chat">
        <el-icon><ChatDotRound /></el-icon>
        对话
      </el-menu-item>
      <el-menu-item index="history">
        <el-icon><List /></el-icon>
        历史记录
      </el-menu-item>
      <el-sub-menu index="user">
        <template #title>
          <el-avatar :size="32" :src="currentUser?.avatar">
            {{ currentUser?.username?.charAt(0).toUpperCase() }}
          </el-avatar>
          <span class="username">{{ currentUser?.username }}</span>
        </template>
        <el-menu-item index="profile">
          <el-icon><User /></el-icon>
          个人信息
        </el-menu-item>
        <el-menu-item index="settings">
          <el-icon><Setting /></el-icon>
          设置
        </el-menu-item>
        <el-menu-item-group title="用户详情">
          <el-menu-item class="user-info-item" disabled>
            <strong>邮箱：</strong>{{ currentUser?.email }}
          </el-menu-item>
          <el-menu-item class="user-info-item" disabled>
            <strong>角色：</strong>{{ getRoleName(currentUser?.role) }}
          </el-menu-item>
          <el-menu-item class="user-info-item" disabled>
            <strong>注册时间：</strong>{{ formatDate(currentUser?.createdAt) }}
          </el-menu-item>
        </el-menu-item-group>
        <el-divider />
        <el-menu-item index="logout" @click="handleLogout">
          <el-icon><SwitchButton /></el-icon>
          退出登录
        </el-menu-item>
      </el-sub-menu>
    </template>

    <template v-else>
      <el-menu-item index="login" route="/login">
        <el-icon><User /></el-icon>
        登录
      </el-menu-item>
      <el-menu-item index="register" route="/register">
        <el-icon><Plus /></el-icon>
        注册
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { UserRole } from '@/api/user'
import {
  User,
  UserFilled,
  Setting,
  SwitchButton,
  ChatDotRound,
  List,
  Plus,
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 添加本地状态跟踪登录状态，确保立即响应
const localIsLoggedIn = ref(!!localStorage.getItem('user'))

const activeIndex = computed(() => route.name as string)
// 使用本地状态而不是直接依赖store
const isLoggedIn = computed(() => localIsLoggedIn.value && userStore.isLoggedIn)
const currentUser = computed(() => userStore.currentUser)

const handleSelect = (key: string) => {
  if (key !== 'logout' && key !== 'user') {
    router.push({ name: key })
  }
}

const handleLogout = async () => {
  // 立即更新本地状态，确保UI立刻响应
  localIsLoggedIn.value = false

  // 然后执行实际的登出操作
  await userStore.logout()

  // 确保视图更新
  await nextTick()
}

const getRoleName = (role: UserRole) => {
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
  return new Date(date).toLocaleString()
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
  padding: 0 24px;
  background: linear-gradient(135deg, #1890ff 0%, #1d39c4 100%);
  border: none;
}

:deep(.el-menu--horizontal) {
  border: none;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  color: rgba(255, 255, 255, 0.85) !important;
  height: var(--navbar-height, 60px);
  line-height: var(--navbar-height, 60px);
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: #ffffff !important;
}

:deep(.el-menu-item.is-active) {
  background-color: rgba(255, 255, 255, 0.15) !important;
  color: #ffffff !important;
  border-bottom: 2px solid #ffffff !important;
}

.logo-container {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: var(--navbar-height, 60px);
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.logo-container:hover {
  opacity: 0.9;
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

.flex-grow {
  flex-grow: 1;
}

.username {
  margin-left: 8px;
  font-size: 14px;
}

:deep(.el-icon) {
  margin-right: 4px;
  font-size: 18px;
}

:deep(.el-sub-menu__title) {
  display: flex;
  align-items: center;
}

:deep(.el-menu--popup) {
  min-width: 200px;
}

.user-info-item {
  font-size: 13px;
  height: 36px !important;
  line-height: 36px !important;
  padding: 0 16px;
  color: var(--el-text-color-regular) !important;
}

.user-info-item strong {
  margin-right: 8px;
  color: var(--el-text-color-secondary);
}

:deep(.el-divider--horizontal) {
  margin: 8px 0;
}
</style>
