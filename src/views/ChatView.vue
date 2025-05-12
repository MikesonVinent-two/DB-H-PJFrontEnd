<template>
  <div class="chat-view">
    <div class="container">
      <div class="chat-header">
        <h1>AI 对话</h1>
        <p class="subtitle">与AI助手进行智能对话</p>
      </div>

      <div class="chat-container">
        <!-- 聊天内容将在这里实现 -->
        <div class="placeholder-content">
          <el-empty description="聊天功能开发中..." />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 聊天相关逻辑将在这里实现
</script>

<style scoped>
.chat-view {
  padding: 80px 0 30px;
  min-height: calc(100vh - var(--navbar-height));
  background-color: var(--background-color);
}

.container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 var(--container-padding);
}

.chat-header {
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

.chat-container {
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
