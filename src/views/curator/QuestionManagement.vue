<template>
  <div class="question-management">
    <el-card class="management-card">
      <template #header>
        <div class="card-header">
          <h2>原始问题管理</h2>
        </div>
      </template>
      <div class="management-content">
        <p>正在施工中...</p>
        <p>此页面将用于管理原始问题，包括录入、编辑、删除原始问题等功能。</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 后续添加原始问题管理相关逻辑
</script>

<style scoped>
.question-management {
  padding: 20px;
}

.management-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.management-content {
  padding: 20px 0;
}
</style>
