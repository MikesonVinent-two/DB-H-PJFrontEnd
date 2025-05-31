import api from './index'
import { apiUrls } from '@/config'

// 回答生成批次状态枚举
export enum BatchStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  PAUSED = 'PAUSED'
}

// 全局参数结构
export interface GlobalParameters {
  temperature: number
  max_tokens: number
}

// 模型特定参数结构
export interface ModelSpecificParameters {
  [modelId: string]: {
    temperature?: number
    max_tokens?: number
    // 其他可能的模型特定参数
  }
}

// 回答生成批次创建数据结构
export interface AnswerGenerationBatchCreateData {
  name: string                         // 必填，批次名称
  description: string                  // 必填，批次描述
  datasetVersionId: number             // 必填，数据集版本ID
  answerAssemblyConfigId: number       // 必填，回答组装配置ID
  evaluationAssemblyConfigId: number   // 必填，评估组装配置ID
  llmModelIds: number[]                // 必填，LLM模型ID列表
  globalParameters: GlobalParameters   // 必填，全局参数
  modelSpecificParameters: ModelSpecificParameters // 必填，模型特定参数
  answerRepeatCount: number            // 必填，回答重复次数
  userId: number                       // 必填，用户ID
}

// 回答生成批次返回数据结构
export interface AnswerGenerationBatch {
  id: number
  name: string
  description: string
  datasetVersionId: number
  datasetVersionName: string
  status: BatchStatus
  creationTime: string
  answerAssemblyConfigId: number
  evaluationAssemblyConfigId: number
  globalParameters: GlobalParameters
  createdByUserId: number
  createdByUsername: string
  progressPercentage: number
  lastActivityTime: string
  resumeCount: number
  answerRepeatCount: number
  totalRuns: number
  pendingRuns: number
  completedRuns: number
  failedRuns: number
}

// 批次状态信息结构
export interface BatchStatusInfo {
  id: number
  name: string
  description: string
  datasetVersionId: number
  datasetVersionName: string
  status: BatchStatus
  creationTime: string
  answerAssemblyConfigId: number
  evaluationAssemblyConfigId: number
  globalParameters: GlobalParameters
  createdByUserId: number
  progressPercentage: number
  lastActivityTime: string
  resumeCount: number
  answerRepeatCount: number
}

// 运行状态接口
export interface RunStatus {
  runId: number
  status: string
}

// 模型连通性测试结果接口
export interface ModelConnectivityResult {
  connected: boolean
  modelName: string
  apiEndpoint: string
  modelId: number
  provider: string
  responseTime: number
  runs?: RunStatus[]
}

// 连通性测试结果接口
export interface ConnectivityTestResult {
  batchName: string
  totalModels: number
  modelResults: ModelConnectivityResult[]
  failedModels: number
  success: boolean
  passedModels: number
  batchId: number
  batchStatus: string
  testDuration: number
  timestamp: number
}

/**
 * 创建回答生成批次
 * @param data 回答生成批次数据
 * @returns 创建的回答生成批次信息
 */
export const createAnswerGenerationBatch = (data: AnswerGenerationBatchCreateData) => {
  return api.post<unknown, AnswerGenerationBatch>(apiUrls.answerGeneration.batches, data)
}

/**
 * 启动回答生成批次
 * @param batchId 批次ID
 * @returns 启动结果
 */
export const startAnswerGenerationBatch = (batchId: number | string) => {
  return api.post<unknown, Record<string, never>>(`${apiUrls.answerGeneration.startBatch}/${batchId}/start`)
}

/**
 * 暂停回答生成批次
 * @param batchId 批次ID
 * @param reason 暂停原因（可选）
 * @returns 暂停结果
 */
export const pauseAnswerGenerationBatch = (batchId: number | string, reason?: string) => {
  const params = reason ? { reason } : undefined
  return api.post<unknown, Record<string, never>>(
    `${apiUrls.answerGeneration.pauseBatch}/${batchId}/pause`,
    null,
    { params }
  )
}

/**
 * 恢复回答生成批次
 * @param batchId 批次ID
 * @returns 恢复结果
 */
export const resumeAnswerGenerationBatch = (batchId: number | string) => {
  return api.post<unknown, Record<string, never>>(`${apiUrls.answerGeneration.resumeBatch}/${batchId}/resume`)
}

/**
 * 获取回答生成批次状态
 * @param batchId 批次ID
 * @returns 批次状态信息
 */
export const getAnswerGenerationBatchStatus = (batchId: number | string) => {
  return api.get<unknown, BatchStatusInfo>(`${apiUrls.answerGeneration.getBatchStatus}/${batchId}`)
}

/**
 * 测试批次模型连通性
 * @param batchId 批次ID
 * @returns 连通性测试结果
 */
export const testBatchModelConnectivity = (batchId: number | string) => {
  return api.get<unknown, ConnectivityTestResult>(`${apiUrls.answerGeneration.testConnectivity}/${batchId}/test-connectivity`)
}
