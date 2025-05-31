<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
</script>

<template>
  <div class="home-view-wrapper">
    <div class="home-view">
      <div class="welcome-container">
        <div class="welcome-content">
          <div class="logo-container">
            <img src="@/assets/logo.svg" alt="Logo" class="logo" />
          </div>
          <h1 class="welcome-title">欢迎使用 AI 问答系统</h1>
          <p class="welcome-description">
            基于先进的自然语言处理技术，为您提供智能、精准的问答服务
          </p>
          <div class="action-container">
            <el-button type="primary" size="large" @click="$router.push('/chat')" class="start-button">
              开始对话
              <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 强制覆盖App.vue中的样式 */
:deep(.main-content) {
  margin-left: 0 !important;
}

.home-view-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.home-view {
  height: 100%;
  width: 100%;
  max-width: 1200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  overflow: hidden;
  position: relative;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.welcome-container {
  width: 100%;
  max-width: 800px;
  padding: 0 40px;
  z-index: 2;
  display: flex;
  justify-content: center;
}

.welcome-content {
  text-align: center;
  padding: 60px 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.8s ease-out;
  width: 100%;
}

.logo-container {
  margin-bottom: 30px;
}

.logo {
  width: 120px;
  height: auto;
}

.welcome-title {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #4c84ff 0%, #2a5cdb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: slideUp 0.5s ease-out;
}

.welcome-description {
  font-size: 1.4rem;
  color: #666;
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  animation: slideUp 0.7s ease-out;
}

.action-container {
  margin-top: 40px;
  animation: slideUp 0.9s ease-out;
}

.start-button {
  padding: 15px 40px;
  font-size: 1.2rem;
  border-radius: 30px;
  transition: transform 0.3s, box-shadow 0.3s;
  background: linear-gradient(135deg, #4c84ff 0%, #2a5cdb 100%);
  border: none;
}

.start-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(74, 132, 255, 0.4);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .welcome-container {
    padding: 0 20px;
  }

  .welcome-content {
    padding: 40px 15px;
  }

  .welcome-title {
    font-size: 2.2rem;
  }

  .welcome-description {
    font-size: 1.2rem;
    margin-bottom: 30px;
  }

  .logo {
    width: 90px;
  }
}

@media (max-width: 480px) {
  .welcome-title {
    font-size: 1.8rem;
  }

  .welcome-description {
    font-size: 1rem;
  }

  .start-button {
    padding: 12px 30px;
    font-size: 1.1rem;
  }

  .logo {
    width: 70px;
  }
}
</style>
