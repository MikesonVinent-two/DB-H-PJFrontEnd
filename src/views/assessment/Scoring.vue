<template>
  <div class="scoring">
    <el-card class="page-header">
      <template #header>
        <div class="card-header">
          <h2>评分管理</h2>
          <div class="header-actions">
            <el-button type="primary" @click="refreshData" :loading="loading">
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
          </div>
        </div>
      </template>
    </el-card>

    <!-- 评测批次选择 -->
    <el-card class="batch-select-card">
      <div class="batch-select-container">
        <span class="select-label">选择批次：</span>
        <el-select
          v-model="selectedBatchId"
          placeholder="请选择批次"
          filterable
          clearable
          @change="handleBatchChange"
          style="width: 300px"
        >
          <el-option
            v-for="batch in batches"
            :key="batch.id"
            :label="`${batch.name} (${batch.datasetVersionName})`"
            :value="batch.id"
          />
        </el-select>
      </div>
    </el-card>

    <!-- 评测结果总览 -->
    <el-card v-if="evaluationResults" class="results-overview-card">
      <template #header>
        <div class="card-header">
          <h3>评测结果总览</h3>
        </div>
      </template>

      <div class="overview-container">
        <div class="overview-item">
          <div class="overview-label">批次名称</div>
          <div class="overview-value">{{ evaluationResults.runName }}</div>
        </div>
        <div class="overview-item">
          <div class="overview-label">评测状态</div>
          <div class="overview-value">
            <el-tag :type="getStatusType(evaluationResults.status)">
              {{ getStatusText(evaluationResults.status) }}
            </el-tag>
          </div>
        </div>
        <div class="overview-item">
          <div class="overview-label">开始时间</div>
          <div class="overview-value">{{ formatDateTime(evaluationResults.startTime) }}</div>
        </div>
        <div class="overview-item">
          <div class="overview-label">结束时间</div>
          <div class="overview-value">{{ formatDateTime(evaluationResults.endTime) }}</div>
        </div>
        <div class="overview-item">
          <div class="overview-label">评测总数</div>
          <div class="overview-value">{{ evaluationResults.totalEvaluations }}</div>
        </div>
        <div class="overview-item">
          <div class="overview-label">平均分数</div>
          <div class="overview-value score">{{ evaluationResults.averageScore.toFixed(2) }}</div>
        </div>
        <div class="overview-item">
          <div class="overview-label">最高分数</div>
          <div class="overview-value high-score">{{ evaluationResults.maxScore.toFixed(2) }}</div>
        </div>
        <div class="overview-item">
          <div class="overview-label">最低分数</div>
          <div class="overview-value low-score">{{ evaluationResults.minScore.toFixed(2) }}</div>
        </div>
      </div>
    </el-card>

    <!-- 分数分布 -->
    <div v-if="evaluationResults" class="stats-container">
      <el-card class="score-distribution-card">
        <template #header>
          <div class="card-header">
            <h3>分数分布</h3>
          </div>
        </template>
        <div class="chart-container">
          <div ref="scoreDistributionChart" class="chart"></div>
        </div>
      </el-card>

      <!-- 评分标准统计 -->
      <el-card class="criteria-stats-card">
        <template #header>
          <div class="card-header">
            <h3>评分标准统计</h3>
          </div>
        </template>
        <el-table :data="criteriaStats" border style="width: 100%">
          <el-table-column prop="name" label="评分标准" min-width="120" />
          <el-table-column prop="count" label="评测数量" width="100" />
          <el-table-column prop="averageScore" label="平均分" width="100">
            <template #default="{ row }">
              {{ row.averageScore.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column label="平均分分布" min-width="200">
            <template #default="{ row }">
              <el-progress
                :percentage="row.averageScore"
                :color="getScoreColor(row.averageScore)"
                :format="format => `${format.toFixed(2)}分`"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 题型统计 -->
    <el-card v-if="evaluationResults" class="question-type-stats-card">
      <template #header>
        <div class="card-header">
          <h3>题型统计</h3>
        </div>
      </template>
      <el-table :data="questionTypeStats" border style="width: 100%">
        <el-table-column prop="type" label="题型" min-width="120">
          <template #default="{ row }">
            {{ getQuestionTypeText(row.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="count" label="数量" width="100" />
        <el-table-column prop="averageScore" label="平均分" width="100">
          <template #default="{ row }">
            {{ row.averageScore.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="平均分分布" min-width="200">
          <template #default="{ row }">
            <el-progress
              :percentage="row.averageScore"
              :color="getScoreColor(row.averageScore)"
              :format="format => `${format.toFixed(2)}分`"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 暂无数据提示 -->
    <el-card v-if="!evaluationResults && !loading" class="no-data-card">
      <el-empty description="请选择批次查看评测结果">
        <template #image>
          <el-icon :size="64" color="#909399"><DataAnalysis /></el-icon>
        </template>
      </el-empty>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh, DataAnalysis } from '@element-plus/icons-vue'
import { getAllAnswerGenerationBatches, BatchStatus } from '@/api/answerGenerationBatch'
import { getEvaluationRunResults, type EvaluationRunResultsResponse } from '@/api/evaluations'
import { onBeforeUnmount } from 'vue'
import * as echarts from 'echarts/core'
import { BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// 注册ECharts组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer
])

// 状态
const loading = ref(false)
const batches = ref([])
const selectedBatchId = ref<number | null>(null)
const evaluationResults = ref<EvaluationRunResultsResponse | null>(null)

// 图表实例
let scoreDistributionChartInstance: echarts.ECharts | null = null
const scoreDistributionChart = ref<HTMLElement | null>(null)

// 评分标准统计数据
const criteriaStats = computed(() => {
  if (!evaluationResults.value?.criteriaStats) return []

  return Object.entries(evaluationResults.value.criteriaStats).map(([key, value]) => ({
    name: key,
    count: value.count,
    averageScore: value.averageScore,
    totalScore: value.totalScore
  }))
})

// 题型统计数据
const questionTypeStats = computed(() => {
  if (!evaluationResults.value?.questionTypeStats) return []

  return Object.entries(evaluationResults.value.questionTypeStats).map(([key, value]) => ({
    type: key,
    count: value.count,
    averageScore: value.averageScore
  }))
})

// 获取状态类型对应的Tag类型
const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    'PENDING': 'info',
    'EVALUATING': 'warning',
    'COMPLETED': 'success',
    'FAILED': 'danger'
  }
  return statusMap[status] || ''
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'PENDING': '待处理',
    'EVALUATING': '评测中',
    'COMPLETED': '已完成',
    'FAILED': '失败'
  }
  return statusMap[status] || status
}

// 获取问题类型文本
const getQuestionTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    'SINGLE_CHOICE': '单选题',
    'MULTIPLE_CHOICE': '多选题',
    'SIMPLE_FACT': '简单事实题',
    'SUBJECTIVE': '主观题'
  }
  return typeMap[type] || type
}

// 获取分数对应的颜色
const getScoreColor = (score: number) => {
  if (score >= 90) return '#67C23A'
  if (score >= 80) return '#409EFF'
  if (score >= 70) return '#E6A23C'
  if (score >= 60) return '#F56C6C'
  return '#909399'
}

// 格式化日期时间
const formatDateTime = (dateStr?: string) => {
  if (!dateStr) return '暂无'

  try {
    const date = new Date(dateStr)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch (e) {
    return dateStr
  }
}

// 处理批次变更
const handleBatchChange = async (batchId: number | null) => {
  if (!batchId) {
    evaluationResults.value = null
    return
  }

  try {
    loading.value = true
    const results = await getEvaluationRunResults(batchId)
    evaluationResults.value = results

    // 设置一个小延迟，确保DOM已经更新
    setTimeout(() => {
      renderScoreDistributionChart()
    }, 100)
  } catch (error) {
    console.error('获取评测结果失败:', error)
    ElMessage.error('获取评测结果失败')
    evaluationResults.value = null
  } finally {
    loading.value = false
  }
}

// 渲染分数分布图表
const renderScoreDistributionChart = () => {
  if (!scoreDistributionChart.value || !evaluationResults.value) return

  if (scoreDistributionChartInstance) {
    scoreDistributionChartInstance.dispose()
  }

  scoreDistributionChartInstance = echarts.init(scoreDistributionChart.value)

  const { scoreDistribution } = evaluationResults.value
  const data = [
    { name: '90-100分', value: scoreDistribution['90-100'] || 0, color: '#67C23A' },
    { name: '80-89分', value: scoreDistribution['80-89'] || 0, color: '#409EFF' },
    { name: '70-79分', value: scoreDistribution['70-79'] || 0, color: '#E6A23C' },
    { name: '60-69分', value: scoreDistribution['60-69'] || 0, color: '#F56C6C' },
    { name: '0-59分', value: scoreDistribution['0-59'] || 0, color: '#909399' }
  ]

  const option = {
    title: {
      text: '分数分布统计',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: data.map(item => item.name)
    },
    series: [
      {
        name: '分数分布',
        type: 'bar',
        data: data.map(item => ({
          value: item.value,
          name: item.name,
          itemStyle: {
            color: item.color
          }
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ],
    xAxis: {
      type: 'category',
      data: data.map(item => item.name)
    },
    yAxis: {
      type: 'value'
    }
  }

  scoreDistributionChartInstance.setOption(option)
}

// 刷新数据
const refreshData = async () => {
  try {
    loading.value = true

    // 获取所有批次
    const batchList = await getAllAnswerGenerationBatches()

    // 过滤并处理数据
    batches.value = batchList.filter(batch =>
      batch.status === BatchStatus.COMPLETED
    )

    // 如果有已选中的批次，刷新评测结果
    if (selectedBatchId.value) {
      await handleBatchChange(selectedBatchId.value)
    }
  } catch (error) {
    console.error('获取批次列表失败:', error)
    ElMessage.error('获取批次列表失败')
    batches.value = []
  } finally {
    loading.value = false
  }
}

// 监听窗口大小变化，调整图表大小
const handleResize = () => {
  if (scoreDistributionChartInstance) {
    scoreDistributionChartInstance.resize()
  }
}

// 监听评测结果变化
watch(evaluationResults, () => {
  if (evaluationResults.value) {
    setTimeout(() => {
      renderScoreDistributionChart()
    }, 100)
  }
})

// 组件挂载
onMounted(() => {
  refreshData()
  window.addEventListener('resize', handleResize)
})

// 组件卸载前清理
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (scoreDistributionChartInstance) {
    scoreDistributionChartInstance.dispose()
    scoreDistributionChartInstance = null
  }
})
</script>

<style scoped>
.scoring {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.batch-select-card {
  margin-bottom: 20px;
}

.batch-select-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.select-label {
  font-weight: bold;
}

.results-overview-card {
  margin-bottom: 20px;
}

.overview-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.overview-item {
  padding: 15px;
  border-radius: 4px;
  background-color: #f8f9fa;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.overview-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.overview-value {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.score {
  color: #409EFF;
}

.high-score {
  color: #67C23A;
}

.low-score {
  color: #F56C6C;
}

.stats-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.chart-container {
  width: 100%;
  height: 300px;
}

.chart {
  width: 100%;
  height: 100%;
}

.question-type-stats-card {
  margin-bottom: 20px;
}

.no-data-card {
  padding: 50px 20px;
  text-align: center;
}

.development-notice {
  display: none;
}

@media (max-width: 768px) {
  .stats-container {
    grid-template-columns: 1fr;
  }

  .overview-container {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>
