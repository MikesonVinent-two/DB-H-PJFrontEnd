<template>
  <el-menu
    :default-active="activeIndex"
    class="navbar"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    <div class="logo-container">
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
          <el-avatar :size="32" :src="currentUser?.avatar" :icon="UserFilled" />
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
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
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

const activeIndex = computed(() => route.name as string)
const isLoggedIn = computed(() => userStore.isLoggedIn)
const currentUser = computed(() => userStore.currentUser)

const handleSelect = (key: string) => {
  if (key !== 'logout' && key !== 'user') {
    router.push({ name: key })
  }
}

const handleLogout = async () => {
  await userStore.logout()
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 60px;
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
  height: 60px;
  line-height: 60px;
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
  height: 60px;
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
</style>
