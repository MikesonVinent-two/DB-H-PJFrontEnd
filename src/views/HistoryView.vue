<template>
  <div class="history-view">
    <div class="container">
      <div class="history-header">
        <h1>历史记录</h1>
        <p class="subtitle">查看您的历史对话记录</p>
      </div>

      <div class="history-container">
        <!-- 历史记录内容将在这里实现 -->
        <div class="placeholder-content">
          <el-empty description="历史记录功能开发中..." />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 历史记录相关逻辑将在这里实现
</script>

<style scoped>
.history-view {
  padding: 20px;
  height: 100%;
  background-color: var(--background-color);
  display: flex;
  justify-content: center;
}

.container {
  width: 100%;
  max-width: 1200px;
  padding: 20px;
}

.history-header {
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

.history-container {
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
