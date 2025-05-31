<template>
  <div class="expert-dashboard">
    <el-card class="dashboard-card">
      <template #header>
        <div class="card-header">
          <h2>专家工作台</h2>
        </div>
      </template>
      <div class="dashboard-content">
        <p>正在施工中...</p>
        <p>这里将显示专家的工作概览和专业回答指标。</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 后续添加专家仪表盘相关逻辑
</script>

<style scoped>
.expert-dashboard {
  padding: 20px;
}

.dashboard-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-content {
  padding: 20px 0;
}
</style>
