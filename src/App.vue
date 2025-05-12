<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheNavbar from '@/components/TheNavbar.vue'
import { useUserStore } from '@/stores/user'
import { onMounted, onUnmounted } from 'vue'

const userStore = useUserStore()

// 监听storage事件，当localStorage发生变化时（比如在其他标签页登出）更新状态
const handleStorageChange = (event: StorageEvent) => {
  if (event.key === 'user') {
    if (!event.newValue) {
      // 用户被清除，立即清除本地状态
      userStore.currentUser = null
      console.log('用户登出: 检测到本地存储变化，已清除用户状态')
    } else if (event.newValue !== event.oldValue) {
      // 用户信息变化，重新加载
      userStore.fetchUserInfo()
      console.log('用户信息变化: 检测到本地存储变化，已更新用户状态')
    }
  }
}

// 在组件挂载时获取用户信息并添加事件监听器
onMounted(async () => {
  console.log('应用挂载: 开始获取用户信息')
  // 检查本地存储中是否有用户信息
  await userStore.fetchUserInfo()
  console.log('应用挂载: 用户信息获取完成', !!userStore.currentUser)

  // 添加事件监听器
  window.addEventListener('storage', handleStorageChange)
})

// 在组件卸载时移除事件监听器
onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange)
})
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
  --container-width: 1600px;
  --container-padding: 40px;
  --navbar-height: 60px;
  --navbar-with-margin: 80px;
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
  min-width: 320px;
}

.container {
  width: 100%;
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 var(--container-padding);
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
  width: 100%;
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
  padding-top: var(--navbar-with-margin);
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

/* 响应式布局调整 */
@media (max-width: 1700px) {
  :root {
    --container-width: 1400px;
    --container-padding: 30px;
  }
}

@media (max-width: 1500px) {
  :root {
    --container-width: 1200px;
    --container-padding: 25px;
  }
}

@media (max-width: 1300px) {
  :root {
    --container-width: 1000px;
    --container-padding: 20px;
  }
}

@media (max-width: 1100px) {
  :root {
    --container-width: 90%;
    --container-padding: 15px;
  }
}
</style>
