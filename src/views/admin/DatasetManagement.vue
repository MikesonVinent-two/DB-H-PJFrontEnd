<template>
  <div class="dataset-management">
    <el-card class="management-card">
      <template #header>
        <div class="card-header">
          <h2>数据集管理</h2>
        </div>
      </template>
      <div class="management-content">
        <p>正在施工中...</p>
        <p>此页面将用于管理数据集，包括创建新版本、更新现有版本等功能。</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 后续添加数据集管理相关逻辑
</script>

<style scoped>
.dataset-management {
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
