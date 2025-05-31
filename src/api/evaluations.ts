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
  batchId: string | number    // 批次ID
  evaluatorId: string | number // 评测者ID（必须是AI模型类型）
  userId: string | number      // 操作用户ID
}

/**
 * 批量评测主观题
 * @param data 批量评测主观题请求数据
 * @returns 空对象
 *
 * 接口路径: /api/evaluations/batch/subjective
 * 请求方法: POST
 *
 * 示例请求:
 * ```json
 * {
 *     "batchId": "number",     // 批次ID
 *     "evaluatorId": "number", // 评测者ID（必须是AI模型类型）
 *     "userId": "number"       // 操作用户ID
 * }
 * ```
 */
export const evaluateBatchSubjective = (data: BatchSubjectiveEvaluationRequest) => {
  return api.post<unknown, Record<string, never>>(
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
