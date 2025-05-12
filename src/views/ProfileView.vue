<template>
  <div class="profile-view">
    <div class="container">
      <div class="profile-header">
        <h1>个人信息</h1>
        <p class="subtitle">查看和编辑您的个人资料</p>
      </div>

      <div class="profile-container">
        <!-- 个人信息内容将在这里实现 -->
        <div class="placeholder-content">
          <el-empty description="个人信息功能开发中..." />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<style scoped>
.profile-view {
  padding: 80px 0 30px;
  min-height: calc(100vh - var(--navbar-height));
  background-color: var(--background-color);
}

.container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 var(--container-padding);
}

.profile-header {
  text-align: center;
  margin-bottom: 40px;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 16px;
  color: var(--primary-color);
}

.subtitle {
  font-size: 1.2rem;
  color: var(--light-text);
}

.profile-container {
  background-color: var(--white);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  min-height: 600px;
  padding: 20px;
}

.placeholder-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}
</style>
