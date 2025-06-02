<template>
  <div class="answer-generation-batches">
    <el-page-header @back="goBack" title="返回" content="回答生成批次管理" />

    <div class="page-container">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card class="info-card">
            <template #header>
              <div class="card-header">
                <h2>批次管理</h2>
                <el-tooltip content="创建和管理回答生成批次，监控批次状态">
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
              </div>
            </template>
            <div class="card-content">
              <p>在此页面中，您可以创建新的回答生成批次，查看现有批次的状态，并管理批次的执行。通过WebSocket实时连接，您可以监控批次的进度和状态变化。</p>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="content-row">
        <el-col :span="24">
          <el-card>
            <template #header>
              <div class="card-header">
                <h2>WebSocket连接状态</h2>
              </div>
            </template>
            <div class="websocket-status-container">
              <WebSocketStatus />
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="content-row">
        <el-col :span="24">
          <el-card>
            <template #header>
              <div class="card-header">
                <h2>批次列表</h2>
                <el-button type="primary" @click="router.push('/runtime/create-answer-batch')" :icon="Plus">
                  创建批次
                </el-button>
              </div>
            </template>
            <div class="batch-list">
              <el-table :data="batches" style="width: 100%">
                <el-table-column prop="id" label="ID" width="80" />
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
                <el-table-column prop="creationTime" label="创建时间" width="180">
                  <template #default="scope">
                    {{ formatDate(scope.row.creationTime) }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="280">
                  <template #default="scope">
                    <el-button-group>
                      <el-button
                        type="primary"
                        size="small"
                        @click="monitorBatch(scope.row.id)"
                        :icon="Monitor"
                      >
                        监控
                      </el-button>
                      <el-button
                        type="success"
                        size="small"
                        @click="startBatch(scope.row.id)"
                        :icon="VideoPlay"
                        :disabled="scope.row.status !== 'PENDING'"
                      >
                        启动
                      </el-button>
                      <el-button
                        type="warning"
                        size="small"
                        @click="pauseBatch(scope.row.id)"
                        :icon="VideoPause"
                        :disabled="scope.row.status !== 'GENERATING_ANSWERS'"
                      >
                        暂停
                      </el-button>
                      <el-button
                        type="info"
                        size="small"
                        @click="resumeBatch(scope.row.id)"
                        :icon="VideoPlay"
                        :disabled="scope.row.status !== 'PAUSED'"
                      >
                        恢复
                      </el-button>
                    </el-button-group>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 不再需要创建批次对话框，已经创建了独立页面 -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  InfoFilled,
  Plus,
  Monitor,
  VideoPlay,
  VideoPause
} from '@element-plus/icons-vue'
import WebSocketStatus from '@/components/WebSocketStatus.vue'
import { useWebSocketStore } from '@/stores/websocket'
import {
  startAnswerGenerationBatch,
  pauseAnswerGenerationBatch,
  resumeAnswerGenerationBatch,
  BatchStatus,
  type AnswerGenerationBatch
} from '@/api/answerGenerationBatch'
import { WebSocketMessageType } from '@/types/websocketTypes'
import type { BatchStatusUpdateData } from '@/types/websocketTypes'

const router = useRouter()
const wsStore = useWebSocketStore()

// 批次列表数据
const batches = ref<AnswerGenerationBatch[]>([])

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

// 获取批次状态类型
const getBatchStatusType = (status: string) => {
  switch (status) {
    case BatchStatus.COMPLETED:
      return 'success'
    case BatchStatus.FAILED:
      return 'danger'
    case BatchStatus.PAUSED:
      return 'warning'
    case BatchStatus.GENERATING_ANSWERS:
    case BatchStatus.RESUMING:
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
    case BatchStatus.COMPLETED:
      return 'success'
    case BatchStatus.FAILED:
      return 'exception'
    case BatchStatus.PAUSED:
      return 'warning'
    default:
      return ''
  }
}

// 监控批次
const monitorBatch = (batchId: number) => {
  router.push({
    name: 'batch-monitor',
    query: { batchId: batchId.toString() }
  })
}

// 启动批次
const startBatch = async (batchId: number) => {
  try {
    await startAnswerGenerationBatch(batchId)
    ElMessage.success('批次已启动')
    loadBatches()
  } catch (error) {
    ElMessage.error('启动批次失败: ' + (error instanceof Error ? error.message : '未知错误'))
  }
}

// 暂停批次
const pauseBatch = async (batchId: number) => {
  try {
    await pauseAnswerGenerationBatch(batchId)
    ElMessage.success('批次已暂停')
    loadBatches()
  } catch (error) {
    ElMessage.error('暂停批次失败: ' + (error instanceof Error ? error.message : '未知错误'))
  }
}

// 恢复批次
const resumeBatch = async (batchId: number) => {
  try {
    await resumeAnswerGenerationBatch(batchId)
    ElMessage.success('批次已恢复')
    loadBatches()
  } catch (error) {
    ElMessage.error('恢复批次失败: ' + (error instanceof Error ? error.message : '未知错误'))
  }
}

// 加载批次列表
const loadBatches = async () => {
  // 这里应该调用API获取批次列表
  // 由于没有现成的API，这里使用模拟数据
  batches.value = [
    {
      id: 1,
      name: '批次测试 - GPT-4',
      description: 'GPT-4模型测试批次',
      datasetVersionId: 1,
      datasetVersionName: '测试数据集 v1.0',
      status: BatchStatus.COMPLETED,
      creationTime: '2023-05-20T14:30:00',
      answerAssemblyConfigId: 1,
      globalParameters: { param1: 'value1', param2: 'value2' },
      createdByUserId: 1,
      createdByUsername: 'admin',
      progressPercentage: 100,
      lastActivityTime: '2023-05-20T15:30:00',
      resumeCount: 0,
      answerRepeatCount: 3,
      totalRuns: 100,
      pendingRuns: 0,
      completedRuns: 100,
      failedRuns: 0
    },
    {
      id: 2,
      name: '批次测试 - Claude 3',
      description: 'Claude 3模型测试批次',
      datasetVersionId: 1,
      datasetVersionName: '测试数据集 v1.0',
      status: BatchStatus.GENERATING_ANSWERS,
      creationTime: '2023-05-21T10:15:00',
      answerAssemblyConfigId: 1,
      globalParameters: { param1: 'value1', param2: 'value2' },
      createdByUserId: 1,
      createdByUsername: 'admin',
      progressPercentage: 75,
      lastActivityTime: '2023-05-21T11:30:00',
      resumeCount: 0,
      answerRepeatCount: 3,
      totalRuns: 100,
      pendingRuns: 25,
      completedRuns: 75,
      failedRuns: 0
    },
    {
      id: 3,
      name: '批次测试 - Gemini',
      description: 'Gemini模型测试批次',
      datasetVersionId: 2,
      datasetVersionName: '测试数据集 v2.0',
      status: BatchStatus.PAUSED,
      creationTime: '2023-05-22T09:00:00',
      answerAssemblyConfigId: 2,
      globalParameters: { param1: 'value1', param2: 'value2' },
      createdByUserId: 1,
      createdByUsername: 'admin',
      progressPercentage: 45,
      lastActivityTime: '2023-05-22T10:30:00',
      resumeCount: 1,
      answerRepeatCount: 2,
      totalRuns: 80,
      pendingRuns: 44,
      completedRuns: 36,
      failedRuns: 0
    },
    {
      id: 4,
      name: '批次测试 - Mixtral',
      description: 'Mixtral模型测试批次',
      datasetVersionId: 2,
      datasetVersionName: '测试数据集 v2.0',
      status: BatchStatus.PENDING,
      creationTime: '2023-05-23T14:00:00',
      answerAssemblyConfigId: 2,
      globalParameters: { param1: 'value1', param2: 'value2' },
      createdByUserId: 1,
      createdByUsername: 'admin',
      progressPercentage: 0,
      lastActivityTime: '2023-05-23T14:00:00',
      resumeCount: 0,
      answerRepeatCount: 1,
      totalRuns: 50,
      pendingRuns: 50,
      completedRuns: 0,
      failedRuns: 0
    },
    {
      id: 5,
      name: '批次测试 - Llama 3',
      description: 'Llama 3模型测试批次',
      datasetVersionId: 3,
      datasetVersionName: '测试数据集 v3.0',
      status: BatchStatus.FAILED,
      creationTime: '2023-05-24T09:30:00',
      answerAssemblyConfigId: 1,
      globalParameters: { param1: 'value1', param2: 'value2' },
      createdByUserId: 1,
      createdByUsername: 'admin',
      progressPercentage: 23,
      lastActivityTime: '2023-05-24T10:15:00',
      resumeCount: 0,
      answerRepeatCount: 3,
      totalRuns: 100,
      pendingRuns: 77,
      completedRuns: 20,
      failedRuns: 3
    }
  ]
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 处理WebSocket批次状态更新
const handleBatchStatusUpdate = (data: BatchStatusUpdateData) => {
  if (!data || !data.batchId) return

  // 查找并更新批次状态
  const batchIndex = batches.value.findIndex(b => b.id === data.batchId)
  if (batchIndex >= 0) {
    batches.value[batchIndex] = {
      ...batches.value[batchIndex],
      ...data,
      status: data.status as BatchStatus
    }
  }
}

// 监听WebSocket消息
const setupWebSocketListeners = () => {
  // 如果WebSocket未连接，则连接
  if (!wsStore.isConnected && !wsStore.isConnecting) {
    wsStore.connect()
  }

  // 监听批次状态更新消息
  const unsubscribe = watch(() => wsStore.messages, (newMessages, oldMessages) => {
    if (!newMessages || newMessages.length === 0) return
    if (!oldMessages || oldMessages.length === 0) {
      // 首次获取消息，检查所有消息
      newMessages.forEach((msg) => {
        if (msg.type === WebSocketMessageType.STATUS_CHANGE ||
            msg.type === WebSocketMessageType.TASK_COMPLETED ||
            msg.type === WebSocketMessageType.TASK_FAILED) {
          handleBatchStatusUpdate(msg.data as BatchStatusUpdateData)
        }
      })
      return
    }

    // 只处理新增的消息
    const newlyAddedMessages = newMessages.slice(oldMessages.length)
    newlyAddedMessages.forEach((msg) => {
      if (msg.type === WebSocketMessageType.STATUS_CHANGE ||
          msg.type === WebSocketMessageType.TASK_COMPLETED ||
          msg.type === WebSocketMessageType.TASK_FAILED) {
        handleBatchStatusUpdate(msg.data as BatchStatusUpdateData)
      }
    })
  }, { deep: true })

  // 返回取消订阅函数
  return unsubscribe
}

onMounted(() => {
  // 加载批次列表
  loadBatches()

  // 设置WebSocket监听
  const unsubscribe = setupWebSocketListeners()

  // 组件卸载时取消订阅
  onUnmounted(() => {
    unsubscribe()
  })
})
</script>

<style scoped>
.answer-generation-batches {
  padding: 20px;
}

.page-container {
  margin-top: 20px;
}

.content-row {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.websocket-status-container {
  margin-bottom: 16px;
}

.batch-list {
  margin-top: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
