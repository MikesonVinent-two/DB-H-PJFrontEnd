<template>
  <div class="evaluator-management">
    <el-card class="management-card">
      <template #header>
        <div class="card-header">
          <h2>评测员管理</h2>
        </div>
      </template>
      <div class="management-content">
        <p>正在施工中...</p>
        <p>此页面将用于管理评测员，包括设置用户为评测员、撤销评测员权限等。</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 后续添加评测员管理相关逻辑
</script>

<style scoped>
.evaluator-management {
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
