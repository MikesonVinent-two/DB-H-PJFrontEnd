<template>
  <div class="batch-monitor-view">
    <el-page-header @back="goBack" title="返回" content="批次实时监控" />

    <div class="monitor-container">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card class="info-card">
            <template #header>
              <div class="card-header">
                <h2>WebSocket实时监控</h2>
                <el-tooltip content="WebSocket用于实时接收服务器推送的消息，无需刷新页面即可获取最新数据">
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
            </template>
            <div class="card-content">
              <p>WebSocket技术允许在客户端和服务器之间建立持久连接，实现双向通信。在批次监控中，我们使用WebSocket来接收批次状态的实时更新，包括进度、运行状态等信息。</p>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="monitor-row">
        <el-col :span="24">
          <BatchStatusMonitor />
        </el-col>
      </el-row>

      <el-row :gutter="20" class="monitor-row">
        <el-col :span="24">
          <el-card>
            <template #header>
              <div class="card-header">
                <h2>批次列表</h2>
              </div>
            </template>
            <div class="batch-list">
              <el-table :data="recentBatches" style="width: 100%">
                <el-table-column prop="id" label="批次ID" width="80" />
                <el-table-column prop="name" label="批次名称" />
                <el-table-column prop="status" label="状态">
                  <template #default="scope">
                    <el-tag :type="getBatchStatusType(scope.row.status)">
                      {{ getBatchStatusText(scope.row.status) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="progressPercentage" label="进度">
                  <template #default="scope">
                    <el-progress
                      :percentage="scope.row.progressPercentage"
                      :status="getBatchProgressStatus(scope.row.status)"
                      :stroke-width="10"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                  <template #default="scope">
                    <el-button
                      type="primary"
                      size="small"
                      @click="monitorBatch(scope.row.id)"
                      :icon="Monitor"
                    >
                      监控
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { QuestionFilled, Monitor } from '@element-plus/icons-vue'
import BatchStatusMonitor from '@/components/BatchStatusMonitor.vue'
import { BatchStatus } from '@/api/answerGenerationBatch'

const router = useRouter()

// 模拟批次数据
const recentBatches = ref([
  { id: 1, name: '批次测试 - GPT-4', status: 'COMPLETED', progressPercentage: 100 },
  { id: 2, name: '批次测试 - Claude 3', status: 'GENERATING_ANSWERS', progressPercentage: 75 },
  { id: 3, name: '批次测试 - Gemini', status: 'PAUSED', progressPercentage: 45 },
  { id: 4, name: '批次测试 - Mixtral', status: 'PENDING', progressPercentage: 0 },
  { id: 5, name: '批次测试 - Llama 3', status: 'FAILED', progressPercentage: 23 },
])

// 获取批次状态类型
const getBatchStatusType = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'success'
    case 'FAILED':
      return 'danger'
    case 'PAUSED':
      return 'warning'
    case 'GENERATING_ANSWERS':
    case 'RESUMING':
      return 'primary'
    default:
      return 'info'
  }
}

// 获取批次状态文本
const getBatchStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'PENDING': '等待中',
    'GENERATING_ANSWERS': '生成回答中',
    'COMPLETED': '已完成',
    'FAILED': '失败',
    'PAUSED': '已暂停',
    'RESUMING': '恢复中'
  }

  return statusMap[status] || '未知'
}

// 获取批次进度状态
const getBatchProgressStatus = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'success'
    case 'FAILED':
      return 'exception'
    case 'PAUSED':
      return 'warning'
    default:
      return ''
  }
}

// 监控批次
const monitorBatch = (batchId: number) => {
  // 这里可以实现跳转到批次详情页或触发监控组件的批次切换
  console.log(`监控批次 ${batchId}`)

  // 示例：可以通过事件总线或其他方式通知BatchStatusMonitor组件
  // 这里简单通过重新加载页面并传递参数实现
  router.push({
    name: 'batch-monitor',
    query: { batchId }
  })
}

// 返回上一页
const goBack = () => {
  router.back()
}

onMounted(() => {
  // 这里可以加载最近的批次数据
  // loadRecentBatches()
})
</script>

<style scoped>
.batch-monitor-view {
  padding: 20px;
}

.monitor-container {
  margin-top: 20px;
}

.monitor-row {
  margin-top: 20px;
}

.info-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.card-content {
  color: #606266;
  line-height: 1.6;
}

.batch-list {
  margin-top: 10px;
}
</style>
