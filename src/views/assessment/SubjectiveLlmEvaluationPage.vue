<template>
  <div class="subjective-llm-evaluation-page">
    <el-card class="page-header">
      <template #header>
        <div class="card-header">
          <div class="title-section">
            <h2>主观题大模型评测</h2>
            <el-tag class="batch-tag" type="info">批次: {{ batchName }}</el-tag>
          </div>
          <div class="header-actions">
            <el-button @click="goBack">
              <el-icon><Back /></el-icon>
              返回
            </el-button>
          </div>
        </div>
      </template>

      <!-- 模型选择和评测设置 -->
      <div v-if="!evaluating && !evaluationCompleted" class="model-selection">
        <h3>选择评测模型</h3>

        <el-alert
          type="info"
          :closable="false"
          show-icon
          style="margin-bottom: 20px;"
        >
          <p>请选择评测模型和评测配置。系统将使用选定的模型对主观题答案进行自动评分。</p>
        </el-alert>

        <div class="model-selection-form">
          <el-form :model="evaluationForm" label-width="120px">
            <el-form-item label="评测模型" required>
              <el-select v-model="evaluationForm.modelId" placeholder="请选择评测模型" style="width: 100%">
                <el-option
                  v-for="model in availableModels"
                  :key="model.id"
                  :label="model.name"
                  :value="model.id"
                >
                  <div class="model-option">
                    <span>{{ model.name }}</span>
                    <el-tag size="small" type="info" v-if="model.aiEvaluator">AI模型</el-tag>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="评测配置">
              <el-radio-group v-model="evaluationForm.useCustomPrompt">
                <el-radio :label="false">使用系统评测配置</el-radio>
                <el-radio :label="true" disabled>自定义提示词（不可用）</el-radio>
              </el-radio-group>
            </el-form-item>

            <template v-if="!evaluationForm.useCustomPrompt">
              <el-form-item label="提示词模板" required>
                <el-select v-model="evaluationForm.subjectivePromptId" placeholder="请选择提示词模板" style="width: 100%">
                  <el-option
                    v-for="prompt in availablePrompts"
                    :key="prompt.id"
                    :label="prompt.name"
                    :value="prompt.id"
                  >
                    <div class="prompt-option">
                      <span>{{ prompt.name }}</span>
                      <el-tooltip :content="prompt.description" placement="top">
                        <el-icon><InfoFilled /></el-icon>
                      </el-tooltip>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="评测组装配置" required>
                <el-select v-model="evaluationForm.evaluationAssemblyConfigId" placeholder="请选择评测组装配置" style="width: 100%">
                  <el-option
                    v-for="config in availableConfigs"
                    :key="config.id"
                    :label="config.name"
                    :value="config.id"
                  >
                    <div class="config-option">
                      <span>{{ config.name }}</span>
                      <el-tooltip :content="config.description" placement="top">
                        <el-icon><InfoFilled /></el-icon>
                      </el-tooltip>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </template>

            <el-form-item>
              <el-button type="primary" @click="startEvaluation" :loading="submitting">
                <el-icon><VideoPlay /></el-icon>
                开始评测
              </el-button>
              <el-button type="info" @click="testSelectedModel" :loading="testing">
                <el-icon><Connection /></el-icon>
                测试模型连通性
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- 评测状态 -->
      <div v-if="evaluating" class="evaluation-status">
        <el-alert
          title="评测进行中..."
          type="success"
          :closable="false"
          show-icon
        >
          <template #description>
            <div class="status-description">
              <p>系统正在使用大模型对主观题进行评测，请耐心等待。</p>
              <p>评测模型: {{ selectedModelName }}</p>
              <el-progress :percentage="evaluationProgress" :status="evaluationStatus"></el-progress>
            </div>
          </template>
        </el-alert>
      </div>

      <!-- 评测结果提示 -->
      <div v-if="evaluationCompleted" class="evaluation-result">
        <el-result
          icon="success"
          title="评测任务已提交"
          sub-title="系统正在后台处理评测任务，完成后可在评测结果页面查看详细信息。"
        >
          <template #extra>
            <el-button type="primary" @click="goBack">返回批次列表</el-button>
          </template>
        </el-result>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Back, VideoPlay, Connection, InfoFilled } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { evaluateBatchSubjective } from '@/api/evaluations'
import { getEvaluators, type EvaluatorInfo, testAiEvaluatorConnectivity } from '@/api/evaluator'
import { getActiveEvaluationSubjectivePrompts, type EvaluationSubjectivePromptInfo } from '@/api/evaluationSubjectivePrompt'
import { getAllActiveEvaluationConfigs, type EvaluationConfigInfo } from '@/api/evaluationPromptAssembly'

// 路由
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 批次信息
const batchId = computed(() => route.params.batchId as string)
const batchName = computed(() => route.query.batchName as string || '未命名批次')

// 状态
const loading = ref(false)
const submitting = ref(false)
const testing = ref(false)
const evaluating = ref(false)
const evaluationCompleted = ref(false)
const evaluationProgress = ref(0)
const selectedModelName = ref('')

// 可用模型
const availableModels = ref<EvaluatorInfo[]>([])
// 可用提示词模板
const availablePrompts = ref<EvaluationSubjectivePromptInfo[]>([])
// 可用评测组装配置
const availableConfigs = ref<EvaluationConfigInfo[]>([])

// 评测表单
const evaluationForm = reactive({
  modelId: '',
  prompt: '请评估以下回答的质量，考虑准确性、完整性、逻辑性和表达清晰度。给出1-100的分数和详细评价。',
  subjectivePromptId: null as number | null,
  evaluationAssemblyConfigId: null as number | null,
  useCustomPrompt: false  // 默认使用系统评测配置
})

// 评测状态
const evaluationStatus = computed(() => {
  if (evaluationProgress.value < 100) return ''
  return 'success'
})

// 返回上一页
const goBack = () => {
  router.push({ name: 'Evaluations' })
}

// 加载模型列表和提示词配置
const loadData = async () => {
  try {
    loading.value = true

    // 获取可用模型
    const evaluators = await getEvaluators()
    // 过滤出LLM类型的评测器作为可用模型
    availableModels.value = evaluators.filter(evaluator => evaluator.evaluatorType === 'AI_MODEL')

    if (availableModels.value.length > 0) {
      evaluationForm.modelId = availableModels.value[0].id.toString()
    } else {
      ElMessage.warning('没有可用的评测模型')
    }

    // 获取提示词模板
    try {
      const prompts = await getActiveEvaluationSubjectivePrompts()
      availablePrompts.value = prompts
      if (prompts.length > 0) {
        evaluationForm.subjectivePromptId = prompts[0].id
      }
    } catch (error) {
      console.error('获取提示词模板失败:', error)
      ElMessage.warning('获取提示词模板失败')
    }

    // 获取评测组装配置
    try {
      const response = await getAllActiveEvaluationConfigs()
      availableConfigs.value = response.configs
      if (response.configs.length > 0) {
        evaluationForm.evaluationAssemblyConfigId = response.configs[0].id
      }
    } catch (error) {
      console.error('获取评测组装配置失败:', error)
      ElMessage.warning('获取评测组装配置失败')
    }
  } catch (error) {
    console.error('获取可用模型失败:', error)
    ElMessage.error('获取可用模型失败')
  } finally {
    loading.value = false
  }
}

// 测试模型连通性
const testSelectedModel = async () => {
  if (!evaluationForm.modelId) {
    ElMessage.warning('请先选择评测模型')
    return false
  }

  try {
    testing.value = true
    const result = await testAiEvaluatorConnectivity(parseInt(evaluationForm.modelId))
    if (result.success) {
      ElMessage.success(`模型连接测试成功: ${result.message}`)
      ElMessage.info(`响应示例: ${result.response}`)
      ElMessage.info(`响应时间: ${result.responseTime}ms`)
      return true
    } else {
      ElMessage.error(`模型连接测试失败: ${result.message || '未知错误'}`)
      return false
    }
  } catch (error) {
    console.error('测试模型连通性失败:', error)
    ElMessage.error('测试模型连通性失败')
    return false
  } finally {
    testing.value = false
  }
}

// 开始评测
const startEvaluation = async () => {
  if (!evaluationForm.modelId) {
    ElMessage.warning('请选择评测模型')
    return
  }

  if (!evaluationForm.useCustomPrompt) {
    if (!evaluationForm.subjectivePromptId) {
      ElMessage.warning('请选择提示词模板')
      return
    }
    if (!evaluationForm.evaluationAssemblyConfigId) {
      ElMessage.warning('请选择评测组装配置')
      return
    }
  } else {
    // 使用自定义提示词时，需要提示用户这个功能可能不可用
    ElMessage.warning('注意：自定义提示词功能可能不再支持，建议选择系统提示词模板')
  }

  // 先测试模型连通性
  testing.value = true
  const isConnected = await testSelectedModel()
  testing.value = false

  if (!isConnected) {
    return
  }

  try {
    submitting.value = true
    const userData = userStore.getCurrentUser()

    // 保存选中的模型名称用于显示
    const selectedModel = availableModels.value.find(m => m.id.toString() === evaluationForm.modelId)
    if (selectedModel) {
      selectedModelName.value = selectedModel.name
    }

    // 准备API请求参数
    const requestParams = {
      batchId: batchId.value,
      evaluatorId: parseInt(evaluationForm.modelId),
      userId: userData?.id || 0
    } as any

    // 如果选择了系统提示词模板和评测组装配置，则添加相应参数
    if (!evaluationForm.useCustomPrompt && evaluationForm.subjectivePromptId) {
      requestParams.subjectivePromptId = evaluationForm.subjectivePromptId
    }

    if (!evaluationForm.useCustomPrompt && evaluationForm.evaluationAssemblyConfigId) {
      requestParams.evaluationAssemblyConfigId = evaluationForm.evaluationAssemblyConfigId
    }

    // 调用评测API
    await evaluateBatchSubjective(requestParams)

    // 显示评测进度
    evaluating.value = true

    // 模拟进度
    startProgressSimulation()

    ElMessage.success('主观题评测已启动')
  } catch (error) {
    console.error('启动主观题评测失败:', error)
    ElMessage.error('启动主观题评测失败')
  } finally {
    submitting.value = false
  }
}

// 模拟进度
const startProgressSimulation = () => {
  let progress = 0
  const interval = setInterval(() => {
    if (progress >= 100) {
      clearInterval(interval)
      evaluationCompleted.value = true
      return
    }

    // 随机增加进度，模拟评测过程
    progress += Math.random() * 2
    evaluationProgress.value = Math.min(Math.round(progress), 100)

    if (evaluationProgress.value >= 100) {
      clearInterval(interval)
      evaluationCompleted.value = true
    }
  }, 1000)
}

// 初始化
onMounted(() => {
  if (!batchId.value) {
    ElMessage.error('批次ID不存在')
    goBack()
  }

  // 加载数据
  loadData()
})

// 定义组件名称
defineOptions({
  name: 'SubjectiveLlmEvaluationPage'
})
</script>

<style scoped>
.subjective-llm-evaluation-page {
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

.model-selection {
  margin: 20px 0;
}

.model-selection h3 {
  margin-bottom: 20px;
  font-size: 18px;
  color: #606266;
}

.model-selection-form {
  max-width: 800px;
}

.model-option, .prompt-option, .config-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.evaluation-status {
  margin: 20px 0;
}

.status-description {
  margin-top: 10px;
}

.evaluation-result {
  margin-top: 30px;
}
</style>
