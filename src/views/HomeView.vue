<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
</script>

<template>
  <div class="home-view">
    <div class="container">
      <div class="welcome-section">
        <h1>欢迎使用AI问答系统</h1>
        <p class="subtitle">这是一个使用Vue 3 + TypeScript + Vite构建的智能问答系统</p>

        <div class="features-section">
          <h2>项目功能</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">🤖</div>
              <h3>智能对话</h3>
              <p>基于先进的AI模型，提供智能、准确的问答服务</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🔒</div>
              <h3>用户认证</h3>
              <p>完整的用户注册、登录和权限管理功能</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📱</div>
              <h3>响应式设计</h3>
              <p>适配各种屏幕尺寸的现代化界面</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">⚡</div>
              <h3>高性能</h3>
              <p>基于Vite构建，快速加载和热更新</p>
            </div>
          </div>
        </div>

        <div class="get-started-section">
          <h2>开始使用</h2>
          <p>点击右上角的"对话"按钮，开始您的AI问答之旅</p>
          <el-button type="primary" size="large" @click="$router.push('/chat')">
            开始对话
            <el-icon class="el-icon--right"><ArrowRight /></el-icon>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  padding: 100px 0 30px;
  min-height: calc(100vh - var(--navbar-height));
  background-color: var(--background-color);
}

.container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 var(--container-padding);
}

.welcome-section {
  text-align: center;
  margin-bottom: 60px;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 16px;
  color: var(--primary-color);
  background: linear-gradient(135deg, #1890ff 0%, #1d39c4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.2rem;
  color: var(--light-text);
  margin-bottom: 40px;
}

.features-section {
  margin: 60px 0;
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 30px;
  color: var(--text-color);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
  margin-top: 40px;
  padding: 0 20px;
}

.feature-card {
  background-color: var(--white);
  border-radius: 12px;
  padding: 40px 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
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
  line-height: 1.6;
}

.get-started-section {
  margin-top: 60px;
  padding: 40px;
  background: linear-gradient(135deg, rgba(24, 144, 255, 0.1) 0%, rgba(29, 57, 196, 0.1) 100%);
  border-radius: 12px;
}

.get-started-section h2 {
  margin-bottom: 16px;
}

.get-started-section p {
  margin-bottom: 24px;
  color: var(--light-text);
}

.el-button {
  padding: 12px 24px;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .home-view {
    padding: 60px 0 20px;
  }

  h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 0 10px;
}

  .feature-card {
    padding: 30px 20px;
}

  .get-started-section {
    padding: 30px 20px;
    margin: 40px 10px 0;
}
}
</style>
