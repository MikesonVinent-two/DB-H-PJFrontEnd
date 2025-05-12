<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheNavbar from '@/components/TheNavbar.vue'
import { useUserStore } from '@/stores/user'
import { computed, onMounted } from 'vue'

const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.isLoggedIn)

// 在组件挂载时获取用户信息
onMounted(async () => {
  if (localStorage.getItem('token')) {
    await userStore.fetchUserInfo()
  }
})

const handleLogout = () => {
  userStore.logout()
}
</script>

<template>
  <div class="app">
    <TheNavbar />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
/* 全局样式 */
:root {
  --primary-color: #4c84ff;
  --secondary-color: #3a70e3;
  --text-color: #333;
  --light-text: #666;
  --border-color: #eee;
  --background-color: #f5f7fa;
  --white: #fff;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: var(--text-color);
  line-height: 1.6;
  background-color: var(--background-color);
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

a {
  text-decoration: none;
  color: var(--primary-color);
}

/* 应用布局 */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  padding: 20px 0;
}

/* 头部导航 */
.app-header {
  background-color: var(--white);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.app-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.logo a {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
}

.main-nav {
  display: flex;
  gap: 20px;
}

.main-nav a {
  color: var(--text-color);
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s;
}

.main-nav a:hover {
  background-color: rgba(76, 132, 255, 0.1);
}

.main-nav a.router-link-active {
  color: var(--primary-color);
  background-color: rgba(76, 132, 255, 0.1);
}

.logout-link {
  cursor: pointer;
}

/* 页脚 */
.app-footer {
  background-color: var(--white);
  padding: 20px 0;
  border-top: 1px solid var(--border-color);
  text-align: center;
  color: var(--light-text);
  font-size: 0.9rem;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans',
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  background-color: #f0f2f5;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 60px;
  width: 100%;
  box-sizing: border-box;
}
</style>
