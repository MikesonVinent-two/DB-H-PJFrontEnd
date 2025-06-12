import api from './index'
import { apiUrls } from '@/config'

/**
 * 题型统计信息接口
 */
export interface QuestionTypeStatistics {
  count: number       // 该类型题目数量
  averageScore: number // 平均得分
}

/**
 * 重复索引统计信息接口
 */
export interface RepeatIndexStatistic {
  typeStatistics: {   // 各题型统计
    [key: string]: QuestionTypeStatistics
  }
  count: number       // 总题目数量
  averageScore: number // 平均得分
}

/**
 * 批次客观题评测结果接口
 */
export interface BatchObjectiveEvaluationResult {
  repeatIndexStatistics: {  // 重复索引统计
    [key: string]: RepeatIndexStatistic
  }
  totalAnswers: number     // 总答案数量
  failedCount: number      // 失败数量
  typeStatistics: {        // 各题型统计
    [key: string]: QuestionTypeStatistics
  }
  successCount: number     // 成功数量
  averageScore: number     // 平均得分
}

/**
 * 评测一个批次中的所有客观题
 * @param batchId 批次ID
 * @param options 可选参数
 * @returns 评测结果
 *
 * 接口路径: /api/evaluations/batch/{batchId}/objective-questions
 * 请求方法: POST
 *
 * 可选参数:
 * - evaluatorId: 评测者ID
 * - userId: 用户ID
 */
export const evaluateBatchObjectiveQuestions = (
  batchId: number | string,
  options?: {
    evaluatorId?: number | string
    userId?: number | string
  }
) => {
  const params = options || {}
  return api.post<unknown, BatchObjectiveEvaluationResult>(
    `${apiUrls.evaluations.batchObjectiveQuestions}/${batchId}/objective-questions`,
    {},
    { params }
  )
}

/**
 * 批量评测主观题请求接口
 */
export interface BatchSubjectiveEvaluationRequest {
  batchId: number
  evaluatorId: number
  userId: number
  subjectivePromptId: number
  evaluationAssemblyConfigId: number
  criteriaIds: number[]
}

/**
 * 批量评测主观题响应接口
 */
export interface BatchSubjectiveEvaluationResponse {
  success: boolean
  message: string
  evaluationRunId: number
  batchId: number
  status: string
}

/**
 * 批量评测主观题
 * @param data 批量评测主观题请求数据
 * @returns 评测运行信息
 *
 * 接口路径: /api/evaluations/batch/subjective
 * 请求方法: POST
 *
 * 示例请求:
 * ```json
 * {
 *   "batchId": 1001,                      // 批次ID
 *   "evaluatorId": 2001,                  // 评测者ID
 *   "userId": 3001,                       // 用户ID
 *   "subjectivePromptId": 4001,          // 主观题提示ID
 *   "evaluationAssemblyConfigId": 5001,   // 评测组装配置ID
 *   "criteriaIds": [1, 2, 3]             // 评分标准ID列表
 * }
 * ```
 */
export const evaluateBatchSubjective = (data: BatchSubjectiveEvaluationRequest) => {
  return api.post<unknown, BatchSubjectiveEvaluationResponse>(
    apiUrls.evaluations.batchSubjective,
    data
  )
}

/**
 * 评分标准详情接口
 */
export interface DetailScore {
  criterion: string    // 评分标准名称
  score: number        // 该标准的得分(0-100)
  comments?: string    // 可选，该标准的评语
}

/**
 * 评测员评测某个回答请求接口
 */
export interface HumanEvaluationRequest {
  llmAnswerId: number   // 大模型回答ID
  evaluatorId: number   // 评测者ID
  overallScore: number  // 总体评分(0-100)
  comments: string      // 评语
  detailScores: DetailScore[] // 详细评分项
  userId: number        // 提交用户ID
}

/**
 * 评测结果详情评分接口
 */
export interface EvaluationDetailScore {
  id: number           // 详细评分ID
  criterionId: number  // 评分标准ID
  criterionName: string // 评分标准名称
  score: number        // 得分
  comments: string     // 评语
}

/**
 * 评测员评测某个回答响应接口
 */
export interface HumanEvaluationResponse {
  success: boolean     // 操作是否成功
  message: string      // 提示信息
  data: {
    evaluationId: number // 评测记录ID
    llmAnswerId: number  // 大模型回答ID
    evaluatorId: number  // 评测者ID
    overallScore: number // 总体评分
    comments: string     // 评语
    detailScores: EvaluationDetailScore[] // 详细评分项
    createdBy: number    // 创建用户ID
    createdAt: string    // 创建时间
    status: string       // 评测状态
  }
}

/**
 * 评测员评测某个回答
 * @param data 评测请求数据
 * @returns 评测结果
 *
 * 接口路径: /api/evaluations/human
 * 请求方法: POST
 *
 * 示例请求:
 * ```json
 * {
 *   "llmAnswerId": 123,           // 必填，大模型回答ID
 *   "evaluatorId": 456,           // 必填，评测者ID
 *   "overallScore": 85.5,         // 必填，总体评分(0-100)
 *   "comments": "评测总体评语",     // 可选，评语
 *   "detailScores": [             // 可选，详细评分项
 *     {
 *       "criterion": "逻辑性",     // 必填，评分标准名称
 *       "score": 90.0,            // 必填，该标准的得分(0-100)
 *       "comments": "该项评语"     // 可选，该标准的评语
 *     }
 *   ],
 *   "userId": 789                 // 必填，提交用户ID
 * }
 * ```
 */
export const submitHumanEvaluation = (data: HumanEvaluationRequest) => {
  return api.post<unknown, HumanEvaluationResponse>(
    apiUrls.evaluations.humanEvaluation,
    data
  )
}

/**
 * 标准问题接口
 */
export interface StandardQuestion {
  id: number
  questionText: string
  questionType: string
  creationTime: string
  questionTags: unknown[]
  datasetMappings: unknown[]
  tags: unknown[]
}

/**
 * 模型回答运行信息接口
 */
export interface ModelAnswerRun {
  id: number
  runIndex: number
  runTime: string
  status: string
  resumeCount: number
  completedQuestionsCount: number
  failedQuestionsCount: number
}

/**
 * 数据集问题映射接口
 */
export interface DatasetQuestionMapping {
  id: number
  standardQuestion: StandardQuestion
  createdAt: string
}

/**
 * 回答信息接口
 */
export interface Answer {
  id: number
  modelAnswerRun: ModelAnswerRun
  datasetQuestionMapping: DatasetQuestionMapping
  answerText: string
  generationStatus: string
  generationTime: string
  promptUsed: string
  otherMetadata: string
  repeatIndex: number
}

/**
 * 标准答案接口
 */
export interface StandardAnswer {
  answerText: string
  scoringGuidance: string
  type: string
}

/**
 * 未评测答案信息接口
 */
export interface UnevaluatedAnswer {
  standardQuestion: StandardQuestion
  answer: Answer
  standardAnswer: StandardAnswer
}

/**
 * 未评测答案分页结果接口
 */
export interface UnevaluatedAnswersResponse {
  size: number
  unevaluatedAnswers: UnevaluatedAnswer[]
  totalPages: number
  page: number
  totalCount: number
}

/**
 * 获取批次中未评测的答案
 * @param batchId 批次ID
 * @param options 可选参数
 * @returns 未评测答案分页结果
 *
 * 接口路径: /api/evaluations/batch/{batchId}/unevaluated
 * 请求方法: GET
 *
 * 可选参数:
 * - evaluatorId: 评测者ID
 * - page: 页码（从0开始）
 * - size: 每页大小
 */
export const getBatchUnevaluatedAnswers = (
  batchId: number | string,
  options?: {
    evaluatorId?: number | string
    page?: number | string
    size?: number | string
  }
) => {
  const params = options || {}
  return api.get<unknown, UnevaluatedAnswersResponse>(
    `${apiUrls.evaluations.batchUnevaluated}/${batchId}/unevaluated`,
    { params }
  )
}

/**
 * 评分标准统计信息接口
 */
export interface CriterionStats {
  totalScore: number    // 该标准的总分
  count: number         // 评测数量
  averageScore: number  // 平均分
}

/**
 * 题型统计信息接口
 */
export interface QuestionTypeStatInfo {
  count: number         // 该类型的题目数量
  averageScore: number  // 平均分
}

/**
 * 评测运行统计结果接口
 */
export interface EvaluationRunResultsResponse {
  evaluationRunId: number           // 评测运行ID
  runName: string                   // 运行名称
  status: string                    // 状态
  startTime: string                 // 开始时间
  endTime: string                   // 结束时间
  totalEvaluations: number          // 总评测数量
  averageScore: number              // 平均分
  minScore: number                  // 最低分
  maxScore: number                  // 最高分
  scoreDistribution: {              // 分数分布
    '90-100': number
    '80-89': number
    '70-79': number
    '60-69': number
    '0-59': number
  }
  criteriaStats: {                  // 评分标准统计
    [criterionName: string]: CriterionStats
  }
  questionTypeStats: {              // 题型统计
    [questionType: string]: QuestionTypeStatInfo
  }
}

/**
 * 获取评测运行的统计结果
 * @param runId 评测运行ID
 * @returns 评测运行统计结果
 *
 * 接口路径: /api/evaluations/runs/{runId}/results
 * 请求方法: GET
 */
export const getEvaluationRunResults = (runId: number | string) => {
  return api.get<unknown, EvaluationRunResultsResponse>(
    `${apiUrls.evaluations.runResults}/${runId}/results`
  )
}

/**
 * 待人工评测的答案项
 */
export interface PendingHumanEvaluationItem {
  id: number
  questionId: number
  questionText: string
  questionType: string
  difficultyLevel: string
  answerText: string
  modelId: number
  modelName: string
  modelVersion: string
  batchId: number
  standardAnswer?: {
    id: number
    answerText: string
    alternativeAnswers: string[]
  }
  evaluationCriteria?: {
    id: number
    name: string
    description: string
    maxScore: number
    weight: number
  }[]
}

/**
 * 待人工评测回答列表响应
 */
export interface PendingHumanEvaluationResponse {
  items: PendingHumanEvaluationItem[]
  totalItems: number
  totalPages: number
  currentPage: number
  pageSize: number
  success: boolean
}

/**
 * 获取待人工评测的回答列表
 * @param params 查询参数
 * @returns 待人工评测的回答列表
 */
export const getPendingHumanEvaluations = (params?: {
  userId?: number | string
  batchId?: number | string
  modelIds?: string
  questionType?: string
  page?: number | string
  size?: number | string
  evaluatorId?: number | string
}) => {
  return api.get<unknown, PendingHumanEvaluationResponse>(
    apiUrls.evaluations.humanPending,
    { params }
  )
}

/**
 * 已完成人工评测的答案项
 */
export interface CompletedHumanEvaluationItem {
  evaluationId: number
  llmAnswerId: number
  questionId: number
  questionText: string
  questionType: string
  difficultyLevel: string
  answerText: string
  modelId: number
  modelName: string
  modelVersion: string
  batchId: number
  evaluatorId: number
  score: number
  comments: string
  evaluationTime: string
  standardAnswer?: {
    id: number
    answerText: string
    alternativeAnswers: string[]
  }
  detailScores?: {
    criterionId: number
    criterionName: string
    score: number
    comments: string
  }[]
}

/**
 * 已完成人工评测回答列表响应
 */
export interface CompletedHumanEvaluationResponse {
  items: CompletedHumanEvaluationItem[]
  totalItems: number
  totalPages: number
  currentPage: number
  pageSize: number
  success: boolean
}

/**
 * 获取已完成人工评测的回答列表
 * @param params 查询参数
 * @returns 已完成人工评测的回答列表
 */
export const getCompletedHumanEvaluations = (params?: {
  userId?: number | string
  evaluatorId?: number | string
  batchId?: number | string
  modelIds?: string
  questionType?: string
  page?: number | string
  size?: number | string
}) => {
  return api.get<unknown, CompletedHumanEvaluationResponse>(
    apiUrls.evaluations.humanCompleted,
    { params }
  )
}

/**
 * 主观题大模型评测结果项
 */
export interface SubjectiveEvaluationResultItem {
  answer_id: number
  answer_text: string
  run_id: number
  model_id: number
  model_name: string
  question_id: number
  question_text: string
  question_type: string
  score: number
  comments: string
  evaluation_results?: {
    criteriaScores?: {
      criterionId: number
      criterionName: string
      score: number
      comments: string
    }[]
    suggestions?: string
    strengths?: string
    weaknesses?: string
  }
}

/**
 * 主观题大模型评测结果响应
 */
export interface SubjectiveEvaluationResultResponse {
  items: SubjectiveEvaluationResultItem[]
  totalItems: number
  totalPages: number
  currentPage: number
  pageSize: number
  success: boolean
}

/**
 * 获取主观题大模型评测详细结果
 * @param params 查询参数
 * @returns 主观题大模型评测详细结果
 */
export const getSubjectiveEvaluationResults = (params?: {
  batchId?: number | string
  modelIds?: string
  evaluatorId?: number | string
  page?: number | string
  size?: number | string
}) => {
  return api.get<unknown, SubjectiveEvaluationResultResponse>(
    apiUrls.evaluations.subjectiveResults,
    { params }
  )
}

/**
 * 主观题所有评测员评测结果项
 */
export interface SubjectiveEvaluationAllEvaluatorsResultItem {
  answerId: number
  answerText: string
  runId: number
  modelId: number
  modelName: string
  questionId: number
  questionText: string
  questionType: string
  evaluations: {
    evaluationId: number
    score: number
    comments: string
    evaluatorId: number
    evaluatorName: string
    evaluatorType: string
    userId?: number
    username?: string
    evaluationResults?: {
      criterionScores?: {
        criterionId: number
        criterionName: string
        score: number
        comments: string
      }[]
      strengths?: string
      weaknesses?: string
      suggestions?: string
    }
  }[]
}

/**
 * 主观题所有评测员评测结果响应
 */
export interface SubjectiveEvaluationAllEvaluatorsResponse {
  items: SubjectiveEvaluationAllEvaluatorsResultItem[]
  totalItems: number
  totalPages: number
  currentPage: number
  pageSize: number
  success: boolean
}

/**
 * 获取主观题所有评测员的评测详细结果
 * @param params 查询参数
 * @returns 主观题所有评测员的评测详细结果
 *
 * 接口路径: /api/evaluations/subjective/results/all-evaluators
 * 请求方法: GET
 */
export const getSubjectiveEvaluationResultsAllEvaluators = (params?: {
  batchId?: number | string
  modelIds?: string
  page?: number | string
  size?: number | string
}) => {
  return api.get<unknown, SubjectiveEvaluationAllEvaluatorsResponse>(
    `${apiUrls.evaluations.subjectiveResultsAllEvaluators}`,
    { params }
  )
}

/**
 * 客观题详细评测结果项
 */
export interface ObjectiveEvaluationDetailItem {
  answerId: number
  answerText: string
  modelId: number
  modelName: string
  questionId: number
  questionText: string
  questionType: string
  score: number
  isCorrect: boolean
}

/**
 * 客观题详细评测结果响应
 */
export interface ObjectiveEvaluationDetailResponse {
  totalItems: number
  totalPages: number
  currentPage: number
  items: ObjectiveEvaluationDetailItem[]
  modelAverages: Record<string, number>
  typeAverages: Record<string, number>
}

/**
 * 获取批次中客观题的详细评测结果
 * @param params 查询参数
 * @returns 客观题详细评测结果
 *
 * 接口路径: /api/evaluations/objective/results
 * 请求方法: GET
 */
export const getObjectiveEvaluationResults = (params?: {
  batchId?: number | string
  modelIds?: string
  page?: number | string
  size?: number | string
}) => {
  return api.get<unknown, ObjectiveEvaluationDetailResponse>(
    apiUrls.evaluations.objectiveResults,
    { params }
  )
}
