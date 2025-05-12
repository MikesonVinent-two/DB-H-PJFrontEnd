<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'
import { UserRole } from '@/api/user'

const userStore = useUserStore()
const currentUser = computed(() => userStore.currentUser)

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
</script>

<template>
  <div class="home-view">
    <div class="container">
      <div class="welcome-section">
        <h1>欢迎使用前端项目</h1>
        <p class="subtitle">这是一个使用Vue 3 + TypeScript + Vite构建的前端项目</p>

        <div class="user-info" v-if="currentUser">
          <h2>用户信息</h2>
          <div class="user-card">
            <div class="user-avatar">
              <img v-if="currentUser.avatar" :src="currentUser.avatar" alt="用户头像" />
              <div v-else class="avatar-placeholder">
                {{ currentUser.username.charAt(0).toUpperCase() }}
              </div>
            </div>
            <div class="user-details">
              <p><strong>用户名:</strong> {{ currentUser.username }}</p>
              <p><strong>邮箱:</strong> {{ currentUser.email }}</p>
              <p>
                <strong>角色:</strong>
                <span :class="['role-badge', `role-${currentUser.role.toLowerCase()}`]">
                  {{ getRoleName(currentUser.role) }}
                </span>
              </p>
              <p>
                <strong>注册时间:</strong> {{ new Date(currentUser.createdAt).toLocaleString() }}
              </p>
            </div>
          </div>
        </div>

        <div class="features-section">
          <h2>项目功能</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">🔒</div>
              <h3>用户认证</h3>
              <p>完整的用户注册、登录和退出功能</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🔄</div>
              <p>API集成</p>
              <p>与后端API无缝集成</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📱</div>
              <h3>响应式设计</h3>
              <p>适配各种屏幕尺寸的界面</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">⚡</div>
              <h3>高性能</h3>
              <p>基于Vite构建，快速加载和热更新</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  padding: 40px 0;
}

.welcome-section {
  text-align: center;
  margin-bottom: 60px;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 16px;
  color: var(--primary-color);
}

.subtitle {
  font-size: 1.2rem;
  color: var(--light-text);
  margin-bottom: 40px;
}

.user-info {
  max-width: 600px;
  margin: 0 auto 60px;
  padding: 20px;
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.user-card {
  display: flex;
  align-items: center;
  padding: 20px;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 20px;
  flex-shrink: 0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
}

.user-details {
  text-align: left;
}

.user-details p {
  margin-bottom: 8px;
}

.features-section {
  margin-top: 40px;
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 30px;
  color: var(--text-color);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.feature-card {
  background-color: var(--white);
  border-radius: 8px;
  padding: 30px 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.feature-card h3 {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: var(--primary-color);
}

.feature-card p {
  color: var(--light-text);
}

@media (max-width: 768px) {
  .user-card {
    flex-direction: column;
    text-align: center;
  }

  .user-avatar {
    margin-right: 0;
    margin-bottom: 20px;
  }

  .user-details {
    text-align: center;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}

.role-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.9em;
  font-weight: 500;
}

.role-user {
  background-color: #e3f2fd;
  color: #1976d2;
}

.role-admin {
  background-color: #fce4ec;
  color: #c2185b;
}

.role-expert {
  background-color: #f3e5f5;
  color: #7b1fa2;
}
</style>
