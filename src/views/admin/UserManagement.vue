<template>
  <div class="user-management">
    <el-card class="management-card">
      <template #header>
        <div class="card-header">
          <h2>用户管理</h2>
        </div>
      </template>
      <div class="management-content">
        <p>正在施工中...</p>
        <p>此页面将用于管理系统用户，包括创建、编辑、删除用户及分配角色权限。</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 后续添加用户管理相关逻辑
</script>

<style scoped>
.user-management {
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
