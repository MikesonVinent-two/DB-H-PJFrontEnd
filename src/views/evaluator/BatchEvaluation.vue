<template>
  <div class="batch-evaluation">
    <el-card class="evaluation-card">
      <template #header>
        <div class="card-header">
          <h2>批次评测</h2>
        </div>
      </template>
      <div class="evaluation-content">
        <p>正在施工中...</p>
        <p>此页面将用于评测批次回答，包括查看批次、评测大模型回答等功能。</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 后续添加批次评测相关逻辑
</script>

<style scoped>
.batch-evaluation {
  padding: 20px;
}

.evaluation-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.evaluation-content {
  padding: 20px 0;
}
</style>
