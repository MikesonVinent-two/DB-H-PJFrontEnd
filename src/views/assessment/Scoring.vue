<template>
  <div class="scoring-page">
    <!-- 页面标题 -->
    <div class="page-title">
      <h1>批次评分详情</h1>
      <p v-if="batchData?.batchInfo" class="subtitle">
        {{ batchData.batchInfo.name }} - {{ batchData.batchInfo.description }}
      </p>
    </div>

    <!-- 批次选择 -->
    <el-card class="selection-card" shadow="hover">
      <div class="selection-row">
        <div class="selection-item">
          <label>选择批次：</label>
          <el-select
            v-model="selectedBatchId"
            placeholder="请选择批次"
            @change="onBatchChange"
            style="width: 300px"
          >
            <el-option
              v-for="batch in availableBatches"
              :key="batch.id"
              :label="`${batch.name} (${batch.description})`"
              :value="batch.id"
            />
          </el-select>
        </div>
        <div class="selection-item">
          <label>筛选模型：</label>
          <el-select
            v-model="selectedModelIds"
            placeholder="选择模型（不选则显示全部）"
            multiple
            collapse-tags
            style="width: 400px"
            @change="onModelFilterChange"
          >
            <el-option
              v-for="model in availableModels"
              :key="model.id"
              :label="`${model.name} (${model.provider})`"
              :value="model.id"
            />
          </el-select>
        </div>
        <div class="selection-actions">
          <el-button type="primary" @click="refreshData" :loading="loading">
            <el-icon><Refresh /></el-icon>
            刷新数据
          </el-button>
          <el-button @click="exportData" :disabled="!batchData">
            <el-icon><Download /></el-icon>
            导出报告
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-section">
      <el-skeleton :rows="8" animated />
    </div>

    <!-- 主要内容 -->
    <template v-else-if="batchData">
      <!-- 概览统计 -->
      <div class="overview-section">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-icon models">
                  <el-icon><Monitor /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ batchData.overview.total_models }}</div>
                  <div class="stat-label">参与模型</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-icon evaluations">
                  <el-icon><Document /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ batchData.overview.total_evaluations }}</div>
                  <div class="stat-label">总评测数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-icon evaluators">
                  <el-icon><User /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ batchData.overview.total_evaluators }}</div>
                  <div class="stat-label">评测员数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-icon score">
                  <el-icon><DataAnalysis /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ safeNumber(overallAverageScore).toFixed(1) }}</div>
                  <div class="stat-label">平均分数</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 图表区域 -->
      <div class="charts-section">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card class="chart-card">
              <template #header>
                <span>评分分布</span>
              </template>
              <div ref="scoreDistributionChart" class="chart-container"></div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="chart-card">
              <template #header>
                <span>题型统计</span>
              </template>
              <div class="type-stats">
                <div v-for="(stat, type) in questionTypeStats" :key="type" class="type-item">
                  <div class="type-header">
                    <el-tag :type="getQuestionTypeTagType(type)" size="small">
                      {{ getQuestionTypeName(type) }}
                    </el-tag>
                    <span class="type-count">{{ stat.count }}题</span>
                  </div>
                  <div class="type-progress">
                    <el-progress
                      :percentage="Math.round((stat.averageScore / 100) * 100)"
                      :color="getScoreColor(stat.averageScore)"
                      :show-text="false"
                    />
                    <span class="score-value">{{ safeNumber(stat.averageScore).toFixed(1) }}分</span>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 模型排名 -->
      <div class="ranking-section">
        <el-card>
          <template #header>
            <div class="ranking-header">
              <span>模型排名</span>
              <el-radio-group v-model="sortBy" size="small" @change="onSortChange">
                <el-radio-button label="overall">综合评分</el-radio-button>
                <el-radio-button label="objective">客观题</el-radio-button>
                <el-radio-button label="subjective">主观题</el-radio-button>
              </el-radio-group>
            </div>
          </template>

          <el-table :data="sortedModelScores" stripe>
            <el-table-column prop="rank" label="排名" width="80" align="center">
              <template #default="{ row }">
                <el-tag :type="getRankTagType(row.rank)" size="small">
                  #{{ row.rank }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column label="模型信息" min-width="200">
              <template #default="{ row }">
                <div>
                  <div class="model-name">{{ row.modelInfo.name }}</div>
                  <div class="model-meta">
                    <el-tag size="small" type="info">{{ row.modelInfo.provider }}</el-tag>
                    <span class="model-version">{{ row.modelInfo.version }}</span>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="overallScore" label="综合评分" width="120" align="center">
              <template #default="{ row }">
                <div class="score-display">
                  <div class="score-number">{{ safeNumber(row.overallScore).toFixed(1) }}</div>
                  <el-progress
                    :percentage="Math.round(safeNumber(row.overallScore))"
                    :color="getScoreColor(row.overallScore)"
                    :show-text="false"
                    :stroke-width="4"
                  />
                </div>
              </template>
            </el-table-column>

            <el-table-column label="客观题" width="100" align="center">
              <template #default="{ row }">
                <div class="score-display">
                  <div class="score-number">{{ safeNumber(row.objectiveScores?.average_score).toFixed(1) }}</div>
                  <div class="score-count">{{ row.objectiveScores?.total_answers || 0 }}题</div>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="主观题(AI)" width="100" align="center">
              <template #default="{ row }">
                <div class="score-display">
                  <div class="score-number">{{ safeNumber(row.subjectiveAiScores?.average_score).toFixed(1) }}</div>
                  <div class="score-count">{{ row.subjectiveAiScores?.total_answers || 0 }}题</div>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="主观题(人工)" width="100" align="center">
              <template #default="{ row }">
                <div class="score-display">
                  <div class="score-number">{{ safeNumber(row.subjectiveHumanScores?.average_score).toFixed(1) }}</div>
                  <div class="score-count">{{ row.subjectiveHumanScores?.total_answers || 0 }}题</div>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="180" align="center">
              <template #default="{ row }">
                <el-button size="small" type="primary" @click="viewModelDetails(row)">
                  查看详情
                </el-button>
                <el-button size="small" @click="compareModel(row)">
                  对比分析
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </template>

    <!-- 空状态 -->
    <div v-else class="empty-section">
      <el-empty description="暂无数据">
        <el-button type="primary" @click="loadAvailableBatches">
          加载批次数据
        </el-button>
      </el-empty>
    </div>

    <!-- 模型详情弹窗 -->
    <el-dialog
      v-model="showDetailDialog"
      title="模型详细评分"
      width="80%"
      :before-close="handleDetailDialogClose"
    >
      <ModelDetailView
        v-if="selectedModelForDetail"
        :batch-id="selectedBatchId"
        :model-info="selectedModelForDetail"
        @close="showDetailDialog = false"
      />
    </el-dialog>

    <!-- 模型对比弹窗 -->
    <el-dialog
      v-model="showCompareDialog"
      title="模型对比分析"
      width="90%"
      :before-close="handleCompareDialogClose"
    >
      <ModelCompareView
        v-if="selectedModelsForCompare.length > 0"
        :batch-id="selectedBatchId"
        :models="selectedModelsForCompare"
        @close="showCompareDialog = false"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as echarts from 'echarts'
import {
  Refresh,
  Download,
  Monitor,
  Document,
  User,
  DataAnalysis,
  Sort
} from '@element-plus/icons-vue'

// API imports
import {
  getBatchComprehensiveScores,
  type BatchComprehensiveScoresResponse,
  type ModelScore,
  type BatchInfo,
  type ModelInfo
} from '@/api/evaluations'
import { getAllAnswerGenerationBatches, type AnswerGenerationBatch } from '@/api/answerGenerationBatch'

// 组件导入
import ModelDetailView from './components/ModelDetailView.vue'
import ModelCompareView from './components/ModelCompareView.vue'

// 响应式数据
const route = useRoute()
const router = useRouter()

const loading = ref(false)
const selectedBatchId = ref<number | null>(null)
const selectedModelIds = ref<number[]>([])
const batchData = ref<BatchComprehensiveScoresResponse | null>(null)
const availableBatches = ref<AnswerGenerationBatch[]>([])
const availableModels = ref<ModelInfo[]>([])
const sortBy = ref('overall')

// 弹窗相关
const showDetailDialog = ref(false)
const showCompareDialog = ref(false)
const selectedModelForDetail = ref<ModelScore | null>(null)
const selectedModelsForCompare = ref<ModelScore[]>([])

// 图表引用
const scoreDistributionChart = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

// 工具函数
const safeNumber = (value: any): number => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return 0
  }
  return Number(value)
}

// 计算属性
const overallAverageScore = computed(() => {
  if (!batchData.value?.modelScores?.length) return 0
  const total = batchData.value.modelScores.reduce((sum, model) => sum + safeNumber(model.overallScore), 0)
  return total / batchData.value.modelScores.length
})

const questionTypeStats = computed(() => {
  if (!batchData.value?.overview) return {}

  const overview = batchData.value.overview
  return {
    'SINGLE_CHOICE': {
      count: overview.single_choice_count || 0,
      averageScore: overview.single_choice_avg || 0
    },
    'MULTIPLE_CHOICE': {
      count: overview.multiple_choice_count || 0,
      averageScore: overview.multiple_choice_avg || 0
    },
    'SIMPLE_FACT': {
      count: overview.simple_fact_count || 0,
      averageScore: overview.simple_fact_avg || 0
    },
    'SUBJECTIVE': {
      count: overview.subjective_count || 0,
      averageScore: overview.subjective_avg || 0
    }
  }
})

const sortedModelScores = computed(() => {
  if (!batchData.value?.modelScores) return []

  let scores = [...batchData.value.modelScores]

  // 根据选择的排序方式排序
  scores.sort((a, b) => {
    let scoreA = 0, scoreB = 0

    switch (sortBy.value) {
      case 'objective':
        scoreA = safeNumber(a.objectiveScores?.average_score)
        scoreB = safeNumber(b.objectiveScores?.average_score)
        break
      case 'subjective':
        scoreA = (safeNumber(a.subjectiveAiScores?.average_score) + safeNumber(a.subjectiveHumanScores?.average_score)) / 2
        scoreB = (safeNumber(b.subjectiveAiScores?.average_score) + safeNumber(b.subjectiveHumanScores?.average_score)) / 2
        break
      default:
        scoreA = safeNumber(a.overallScore)
        scoreB = safeNumber(b.overallScore)
    }

    return scoreB - scoreA
  })

  // 添加排名
  scores.forEach((score, index) => {
    score.rank = index + 1
  })

  return scores
})

// 样式相关函数
const getScoreColor = (score: number): string => {
  const safeScore = safeNumber(score)
  if (safeScore >= 90) return '#67C23A'
  if (safeScore >= 80) return '#E6A23C'
  if (safeScore >= 70) return '#F56C6C'
  return '#909399'
}

const getRankTagType = (rank: number): string => {
  if (rank === 1) return 'danger'
  if (rank === 2) return 'warning'
  if (rank === 3) return 'success'
  return 'info'
}

const getQuestionTypeTagType = (type: string): string => {
  const typeMap: Record<string, string> = {
    'SINGLE_CHOICE': 'success',
    'MULTIPLE_CHOICE': 'warning',
    'SIMPLE_FACT': 'info',
    'SUBJECTIVE': 'danger'
  }
  return typeMap[type] || 'info'
}

const getQuestionTypeName = (type: string): string => {
  const typeMap: Record<string, string> = {
    'SINGLE_CHOICE': '单选题',
    'MULTIPLE_CHOICE': '多选题',
    'SIMPLE_FACT': '简单事实题',
    'SUBJECTIVE': '主观题'
  }
  return typeMap[type] || type
}

// 数据加载函数
const loadAvailableBatches = async () => {
  try {
    loading.value = true
    const response = await getAllAnswerGenerationBatches()
    availableBatches.value = response || []
    console.log('成功加载批次列表:', availableBatches.value.length, '个批次')
  } catch (error) {
    console.error('加载批次失败:', error)
    ElMessage.error('加载批次失败')
    availableBatches.value = []
  } finally {
    loading.value = false
  }
}

const loadBatchData = async () => {
  if (!selectedBatchId.value) return

  try {
    loading.value = true
    const response = await getBatchComprehensiveScores(selectedBatchId.value)
    batchData.value = response

    // 更新可用模型列表
    if (response.modelScores) {
      availableModels.value = response.modelScores.map(score => score.modelInfo)
    }

    // 渲染图表
    nextTick(() => {
      renderScoreDistributionChart()
    })
  } catch (error) {
    console.error('加载批次数据失败:', error)
    ElMessage.error('加载批次数据失败')
  } finally {
    loading.value = false
  }
}

// 事件处理函数
const onBatchChange = () => {
  loadBatchData()
}

const onModelFilterChange = () => {
  // 实现模型筛选逻辑
}

const onSortChange = () => {
  // 排序逻辑已在计算属性中实现
}

const refreshData = () => {
  loadBatchData()
}

const exportData = () => {
  ElMessage.info('导出功能开发中...')
}

const viewModelDetails = (model: ModelScore) => {
  selectedModelForDetail.value = model
  showDetailDialog.value = true
}

const compareModel = (model: ModelScore) => {
  selectedModelsForCompare.value = [model]
  showCompareDialog.value = true
}

const handleDetailDialogClose = () => {
  showDetailDialog.value = false
  selectedModelForDetail.value = null
}

const handleCompareDialogClose = () => {
  showCompareDialog.value = false
  selectedModelsForCompare.value = []
}

// 图表渲染
const renderScoreDistributionChart = () => {
  if (!scoreDistributionChart.value || !batchData.value) return

  if (chartInstance) {
    chartInstance.dispose()
  }

  chartInstance = echarts.init(scoreDistributionChart.value)

  const option = {
    title: {
      text: '评分分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    xAxis: {
      type: 'category',
      data: ['0-60', '60-70', '70-80', '80-90', '90-100']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [5, 10, 15, 20, 8], // 示例数据
      type: 'bar',
      itemStyle: {
        color: '#409EFF'
      }
    }]
  }

  chartInstance.setOption(option)
}

// 生命周期
onMounted(async () => {
  const batchId = route.params.batchId || route.query.batchId
  if (batchId) {
    selectedBatchId.value = Number(batchId)
  }

  await loadAvailableBatches()

  if (selectedBatchId.value) {
    await loadBatchData()
  }
})

// 监听窗口大小变化
watch(() => showDetailDialog.value, () => {
  if (!showDetailDialog.value) {
    nextTick(() => {
      if (chartInstance) {
        chartInstance.resize()
      }
    })
  }
})
</script>

<style scoped>
.scoring-page {
  padding: 20px;
}

.page-title {
  margin-bottom: 20px;
}

.page-title h1 {
  margin: 0 0 8px 0;
  font-size: 24px;
  color: #303133;
}

.subtitle {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.selection-card {
  margin-bottom: 20px;
}

.selection-row {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.selection-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.selection-item label {
  font-weight: 500;
  color: #606266;
  white-space: nowrap;
}

.selection-actions {
  margin-left: auto;
  display: flex;
  gap: 10px;
}

.loading-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
}

.overview-section {
  margin-bottom: 20px;
}

.stat-card {
  height: 100px;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 100%;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

.stat-icon.models {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.evaluations {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.evaluators {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.score {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.charts-section {
  margin-bottom: 20px;
}

.chart-card {
  height: 350px;
}

.chart-card .el-card__body {
  height: calc(100% - 57px);
  display: flex;
  flex-direction: column;
}

.chart-container {
  height: 280px;
}

.type-stats {
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.type-item {
  margin-bottom: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8px 0;
}

.type-item:last-child {
  margin-bottom: 0;
}

.type-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.type-count {
  font-size: 12px;
  color: #909399;
}

.type-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.score-value {
  font-weight: 500;
  color: #303133;
  min-width: 50px;
  text-align: right;
}

.ranking-section {
  margin-bottom: 20px;
}

.ranking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.model-name {
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.model-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.model-version {
  font-size: 12px;
  color: #909399;
}

.score-display {
  text-align: center;
}

.score-number {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.score-count {
  font-size: 12px;
  color: #909399;
}

.empty-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: white;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .scoring-page {
    padding: 16px;
  }

  .selection-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .selection-actions {
    margin-left: 0;
    width: 100%;
  }
}
</style>
