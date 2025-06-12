<template>
  <div class="subjective-human-evaluation-page">
    <!-- 批次ID无效时的提示 -->
    <el-card v-if="!isValidBatchId" class="error-card">
      <el-result
        icon="error"
        title="无效的批次ID"
        sub-title="未找到有效的批次信息，请返回评测页面重新选择批次。"
      >
        <template #extra>
          <el-button type="primary" @click="goBack">返回评测页面</el-button>
        </template>
      </el-result>
    </el-card>

    <template v-else>
      <el-card class="page-header">
        <template #header>
          <div class="card-header">
            <div class="title-section">
              <h2>主观题人工评测</h2>
              <el-tag class="batch-tag" type="info">批次: {{ batchName }}</el-tag>
            </div>
            <div class="header-actions">
              <el-button @click="goBack">
                <el-icon><Back /></el-icon>
                返回
              </el-button>
              <el-button type="primary" @click="loadNextAnswer" :loading="loading">
                <el-icon><RefreshRight /></el-icon>
                {{ currentAnswer ? '下一题' : '开始评测' }}
              </el-button>
            </div>
          </div>
        </template>

        <!-- 评测进度统计 -->
        <el-row class="evaluation-progress" :gutter="20">
          <el-col :span="8">
            <el-card shadow="hover" class="progress-card">
              <template #header>
                <div class="progress-header">
                  <el-icon><Histogram /></el-icon>
                  <span>评测进度</span>
                </div>
              </template>
              <el-progress
                :percentage="evaluationProgress"
                :format="progressFormat"
                :status="evaluationProgress === 100 ? 'success' : ''"
                :stroke-width="18"
              />
              <div class="progress-stats">
                <div class="stat-item">
                  <span class="stat-label">已评测:</span>
                  <span class="stat-value">{{ evaluationStats.completed }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">未评测:</span>
                  <span class="stat-value">{{ evaluationStats.pending }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">总数量:</span>
                  <span class="stat-value">{{ evaluationStats.total }}</span>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="16">
            <el-card shadow="hover" class="progress-card">
              <template #header>
                <div class="progress-header">
                  <el-icon><DataAnalysis /></el-icon>
                  <span>评分统计</span>
                </div>
              </template>
              <div class="score-stats">
                <div class="stat-item">
                  <span class="stat-label">平均分:</span>
                  <span class="stat-value">{{ evaluationStats.averageScore.toFixed(1) }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">最高分:</span>
                  <span class="stat-value">{{ evaluationStats.maxScore }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">最低分:</span>
                  <span class="stat-value">{{ evaluationStats.minScore }}</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 评测内容 -->
        <div v-if="currentAnswer" class="evaluation-content">
          <div class="answer-info">
            <h3>问题信息</h3>
            <div class="info-row">
              <span class="info-label">问题:</span>
              <span>{{ currentQuestion?.questionText }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">类型:</span>
              <span>{{ getQuestionTypeText(currentQuestion?.questionType) }}</span>
            </div>

            <h3>模型回答</h3>
            <div class="info-row">
              <span>{{ currentAnswer.answer?.answerText }}</span>
            </div>

            <h3>标准答案</h3>
            <div class="info-row" v-if="currentAnswer.standardAnswer">
              <span>{{ currentAnswer.standardAnswer.answerText }}</span>
            </div>
            <div class="info-row" v-else>
              <span>暂无标准答案</span>
            </div>
          </div>

          <el-divider>评分</el-divider>

          <div class="evaluation-form">
            <el-form :model="evaluationForm" label-width="120px">
              <el-form-item label="总体评分">
                <el-slider
                  v-model="evaluationForm.overallScore"
                  :min="0"
                  :max="100"
                  :step="1"
                  show-input
                  :marks="{0: '0', 60: '60', 80: '80', 100: '100'}"
                />
              </el-form-item>

              <el-form-item label="评语">
                <el-input
                  v-model="evaluationForm.comments"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入评语"
                />
              </el-form-item>

              <el-divider>详细评分项</el-divider>

              <div v-for="(item, index) in evaluationForm.detailScores" :key="index" class="criterion-item">
                <span class="criterion-name">{{ item.criterionName }}</span>
                <el-slider
                  v-model="item.score"
                  :min="0"
                  :max="100"
                  :step="1"
                  show-input
                />
                <el-input
                  v-model="item.comments"
                  type="textarea"
                  :rows="2"
                  :placeholder="`${item.criterionName}评语`"
                />
              </div>

              <div class="form-actions">
                <el-button type="primary" @click="submitEvaluation" :loading="submitting">
                  提交评测
                </el-button>
              </div>
            </el-form>
          </div>
        </div>

        <!-- 无题目提示 -->
        <div v-else-if="noMoreAnswers" class="no-answers">
          <el-empty description="该批次暂无需要评测的答案" />
        </div>

        <!-- 加载中 -->
        <div v-else-if="loading" class="loading-container">
          <el-skeleton :rows="10" animated />
        </div>

        <!-- 已评测答案列表 -->
        <el-divider>已评测答案</el-divider>
        <div class="evaluated-answers">
          <el-table
            v-loading="loadingEvaluated"
            :data="evaluatedAnswers"
            stripe
            style="width: 100%"
            max-height="400"
          >
            <el-table-column prop="questionText" label="问题" min-width="200" show-overflow-tooltip />
            <el-table-column prop="answerText" label="回答" min-width="200" show-overflow-tooltip />
            <el-table-column prop="score" label="评分" width="100">
              <template #default="scope">
                <el-tag :type="getScoreTagType(scope.row.score)">
                  {{ scope.row.score }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="comments" label="评语" min-width="150" show-overflow-tooltip />
            <el-table-column prop="evaluationTime" label="评测时间" width="180">
              <template #default="scope">
                {{ formatDate(scope.row.evaluationTime) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button type="primary" link @click="viewEvaluationDetail(scope.row)">
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination
              v-model:current-page="evaluatedAnswersPage"
              v-model:page-size="evaluatedAnswersPageSize"
              :page-sizes="[5, 10, 20, 50]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="evaluatedAnswersTotal"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </el-card>

      <!-- 评测详情对话框 -->
      <el-dialog
        v-model="evaluationDetailDialog.visible"
        title="评测详情"
        width="60%"
        destroy-on-close
      >
        <div v-if="evaluationDetailDialog.data" class="evaluation-detail">
          <div class="detail-section">
            <h3>问题</h3>
            <p>{{ evaluationDetailDialog.data.questionText }}</p>
          </div>
          <div class="detail-section">
            <h3>模型回答</h3>
            <p>{{ evaluationDetailDialog.data.answerText }}</p>
          </div>
          <div class="detail-section">
            <h3>评分: {{ evaluationDetailDialog.data.score }}</h3>
            <p>{{ evaluationDetailDialog.data.comments }}</p>
          </div>
          <div class="detail-section">
            <h3>详细评分</h3>
            <el-table :data="evaluationDetailDialog.data.evaluationDetails || []" border>
              <el-table-column prop="criterionName" label="评分项" />
              <el-table-column prop="score" label="分数" width="100" />
              <el-table-column prop="comments" label="评语" min-width="200" show-overflow-tooltip />
            </el-table>
          </div>
        </div>
      </el-dialog>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Back, RefreshRight, Histogram, DataAnalysis } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import {
  submitHumanEvaluation as submitHumanEval,
  getBatchUnevaluatedAnswers,
  getCompletedHumanEvaluations,
  type HumanEvaluationRequest,
  type UnevaluatedAnswer,
  type StandardQuestion
} from '@/api/evaluations'

// 路由
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 批次信息
const batchId = computed(() => route.params.batchId as string)
const batchName = computed(() => route.query.batchName as string || '未命名批次')

// 检查批次ID是否有效
const isValidBatchId = computed(() => {
  return !!batchId.value && batchId.value !== 'undefined' && batchId.value !== 'null'
})

// 状态
const loading = ref(false)
const submitting = ref(false)
const noMoreAnswers = ref(false)
const loadingEvaluated = ref(false)

// 当前评测数据
const currentQuestion = ref<StandardQuestion | null>(null)
const currentAnswer = ref<UnevaluatedAnswer | null>(null)

// 评分表单
const evaluationForm = reactive({
  overallScore: 70,
  comments: '',
  detailScores: [
    { criterionId: 1, criterionName: '准确性', score: 70, comments: '' },
    { criterionId: 2, criterionName: '完整性', score: 70, comments: '' },
    { criterionId: 3, criterionName: '逻辑性', score: 70, comments: '' },
    { criterionId: 4, criterionName: '表达清晰度', score: 70, comments: '' }
  ]
})

// 评测统计
const evaluationStats = reactive({
  completed: 0,
  pending: 0,
  total: 0,
  averageScore: 0,
  maxScore: 0,
  minScore: 0
})

// 已评测答案分页
const evaluatedAnswers = ref<any[]>([])
const evaluatedAnswersPage = ref(1)
const evaluatedAnswersPageSize = ref(10)
const evaluatedAnswersTotal = ref(0)

// 评测详情对话框
const evaluationDetailDialog = reactive({
  visible: false,
  data: null as any
})

// 计算评测进度百分比
const evaluationProgress = computed(() => {
  if (evaluationStats.total === 0) return 0
  return Math.round((evaluationStats.completed / evaluationStats.total) * 100)
})

// 格式化进度显示
const progressFormat = (percentage: number) => {
  return `${percentage}%`
}

// 获取问题类型文本
const getQuestionTypeText = (type?: string) => {
  const typeMap: Record<string, string> = {
    'SINGLE_CHOICE': '单选题',
    'MULTIPLE_CHOICE': '多选题',
    'SIMPLE_FACT': '简单事实题',
    'SUBJECTIVE': '主观题'
  }
  return typeMap[type || ''] || type || '未知类型'
}

// 根据分数获取标签类型
const getScoreTagType = (score: number) => {
  if (score >= 90) return 'success'
  if (score >= 80) return 'primary'
  if (score >= 60) return 'warning'
  return 'danger'
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString()
}

// 初始化评分表单
const initEvaluationForm = () => {
  evaluationForm.overallScore = 70
  evaluationForm.comments = ''
  evaluationForm.detailScores.forEach(item => {
    item.score = 70
    item.comments = ''
  })
}

// 返回上一页
const goBack = () => {
  router.push({ name: 'Evaluations' })
}

// 加载下一个待评测答案
const loadNextAnswer = async () => {
  try {
    loading.value = true
    noMoreAnswers.value = false

    const userData = userStore.getCurrentUser()

    const response = await getBatchUnevaluatedAnswers(batchId.value, {
      evaluatorId: userData?.evaluatorId,
      page: 0,
      size: 1
    })

    if (response.unevaluatedAnswers && response.unevaluatedAnswers.length > 0) {
      const firstAnswer = response.unevaluatedAnswers[0]
      currentQuestion.value = firstAnswer.standardQuestion
      currentAnswer.value = firstAnswer
      initEvaluationForm()
    } else {
      currentQuestion.value = null
      currentAnswer.value = null
      noMoreAnswers.value = true
      ElMessage.info('该批次暂无需要评测的答案')
    }
  } catch (error) {
    console.error('获取待评测答案失败:', error)
    ElMessage.error('获取待评测答案失败')
  } finally {
    loading.value = false
  }
}

// 提交评测
const submitEvaluation = async () => {
  if (!currentAnswer.value || !currentAnswer.value.answer) {
    ElMessage.error('评测数据不完整')
    return
  }

  try {
    submitting.value = true
    const userData = userStore.getCurrentUser()

    const evaluationData: HumanEvaluationRequest = {
      llmAnswerId: currentAnswer.value.answer.id,
      evaluatorId: userData?.evaluatorId || 0,
      overallScore: evaluationForm.overallScore,
      comments: evaluationForm.comments,
      detailScores: evaluationForm.detailScores.map(item => ({
        criterion: item.criterionName,
        score: item.score,
        comments: item.comments
      })),
      userId: userData?.id || 0
    }

    await submitHumanEval(evaluationData)
    ElMessage.success('评测提交成功')

    // 更新评测统计和已评测答案列表
    await loadEvaluationStats()
    await loadEvaluatedAnswers()

    // 检查是否还有未评测的答案
    await checkNextUnevaluatedAnswer()
  } catch (error) {
    console.error('评测提交失败:', error)
    ElMessage.error('评测提交失败')
  } finally {
    submitting.value = false
  }
}

// 检查下一个未评测的答案
const checkNextUnevaluatedAnswer = async () => {
  try {
    const userData = userStore.getCurrentUser()
    const response = await getBatchUnevaluatedAnswers(
      batchId.value,
      {
        evaluatorId: userData?.evaluatorId,
        page: 0,
        size: 1
      }
    )

    if (response.unevaluatedAnswers && response.unevaluatedAnswers.length > 0) {
      ElMessageBox.confirm(
        '还有未评测的答案，是否继续评测？',
        '继续评测',
        {
          confirmButtonText: '继续评测',
          cancelButtonText: '稍后再说',
          type: 'info'
        }
      ).then(() => {
        loadNextAnswer()
      }).catch(() => {
        // 用户选择稍后再说，清空当前答案
        currentQuestion.value = null
        currentAnswer.value = null
      })
    } else {
      // 没有更多答案了
      currentQuestion.value = null
      currentAnswer.value = null
      noMoreAnswers.value = true
      ElMessage.info('该批次所有答案已评测完成')
    }
  } catch (error) {
    console.error('检查下一个未评测答案失败:', error)
  }
}

// 加载评测统计
const loadEvaluationStats = async () => {
  try {
    const userData = userStore.getCurrentUser()

    // 获取已评测答案数量
    const completedResponse = await getCompletedHumanEvaluations({
      batchId: batchId.value,
      evaluatorId: userData?.evaluatorId,
      userId: userData?.id,
      page: 0,
      size: 10
    })

    // 获取未评测答案数量
    const pendingResponse = await getBatchUnevaluatedAnswers(batchId.value, {
      evaluatorId: userData?.evaluatorId,
      page: 0,
      size: 10
    })

    // 更新统计数据
    evaluationStats.completed = completedResponse.totalItems || 0
    evaluationStats.pending = pendingResponse.totalElements || 0
    evaluationStats.total = evaluationStats.completed + evaluationStats.pending

    // 计算平均分、最高分和最低分
    if (completedResponse.items && completedResponse.items.length > 0) {
      // 如果有评测数据，计算统计信息
      const scores = completedResponse.items.map(item => item.score)
      evaluationStats.averageScore = scores.reduce((a, b) => a + b, 0) / scores.length
      evaluationStats.maxScore = Math.max(...scores)
      evaluationStats.minScore = Math.min(...scores)
    } else {
      // 无评测数据时的默认值
      evaluationStats.averageScore = 0
      evaluationStats.maxScore = 0
      evaluationStats.minScore = 0
    }
  } catch (error) {
    console.error('加载评测统计失败:', error)
  }
}

// 加载已评测答案
const loadEvaluatedAnswers = async () => {
  try {
    loadingEvaluated.value = true
    const userData = userStore.getCurrentUser()

    const response = await getCompletedHumanEvaluations({
      batchId: batchId.value,
      evaluatorId: userData?.evaluatorId,
      userId: userData?.id,
      page: evaluatedAnswersPage.value - 1,
      size: evaluatedAnswersPageSize.value
    })

    evaluatedAnswers.value = response.items || []
    evaluatedAnswersTotal.value = response.totalItems || 0
  } catch (error) {
    console.error('加载已评测答案失败:', error)
    ElMessage.error('加载已评测答案失败')
  } finally {
    loadingEvaluated.value = false
  }
}

// 查看评测详情
const viewEvaluationDetail = (row: any) => {
  evaluationDetailDialog.data = row
  evaluationDetailDialog.visible = true
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  evaluatedAnswersPageSize.value = size
  loadEvaluatedAnswers()
}

// 当前页变化
const handleCurrentChange = (page: number) => {
  evaluatedAnswersPage.value = page
  loadEvaluatedAnswers()
}

// 初始化
onMounted(() => {
  // 只有在批次ID有效时才加载评测统计和已评测答案
  if (isValidBatchId.value) {
    loadEvaluationStats()
    loadEvaluatedAnswers()
  }
})

// 定义组件名称
defineOptions({
  name: 'SubjectiveHumanEvaluationPage'
})
</script>

<style scoped>
.subjective-human-evaluation-page {
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

.title-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.batch-tag {
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.evaluation-progress {
  margin-bottom: 20px;
}

.progress-card {
  height: 100%;
}

.progress-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

.progress-stats, .score-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  display: block;
  margin-top: 5px;
}

.evaluation-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.answer-info {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 15px;
  background-color: #f8f8f8;
}

.info-row {
  margin-bottom: 10px;
  display: flex;
  align-items: flex-start;
}

.info-label {
  font-weight: bold;
  width: 80px;
  margin-right: 10px;
}

.criterion-item {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.criterion-name {
  font-weight: bold;
  margin-bottom: 10px;
  display: block;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.no-answers {
  padding: 40px 0;
  text-align: center;
}

.loading-container {
  padding: 20px;
}

.evaluated-answers {
  margin-top: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.evaluation-detail {
  padding: 10px;
}

.detail-section {
  margin-bottom: 20px;
}

.detail-section h3 {
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #ebeef5;
}

.error-card {
  margin: 100px auto;
  max-width: 600px;
}
</style>
