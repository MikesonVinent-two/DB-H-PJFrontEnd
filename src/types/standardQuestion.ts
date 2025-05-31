import { QuestionType, DifficultyLevel } from '@/api/standardData'

/**
 * 标准问题基础接口
 */
export interface StandardQuestionBase {
  userId: number                      // 必填，用户ID
  questionText: string                // 必填，问题文本
  questionType: QuestionType          // 必填，问题类型
  difficulty: DifficultyLevel        // 必填，难度级别
  tags: string[]                     // 必填，标签列表
  commitMessage: string              // 必填，提交信息
  originalRawQuestionId?: number     // 选填，原始问题ID
}

/**
 * 标准问题列表项接口
 */
export interface StandardQuestionItem {
  id: number
  userId: number
  questionText: string
  questionType: QuestionType
  difficulty: string
  tags: string[]
  parentStandardQuestionId?: number
}

/**
 * 分页信息接口
 */
export interface PageInfo {
  pageNumber: number
  pageSize: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  offset: number
  paged: boolean
  unpaged: boolean
}

/**
 * 排序信息接口
 */
export interface SortInfo {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}

/**
 * 标准问题分页响应接口
 */
export interface StandardQuestionPageResponse {
  content: StandardQuestionItem[]
  pageable: PageInfo
  totalPages: number
  last: boolean
  totalElements: number
  size: number
  number: number
  sort: SortInfo
  first: boolean
  numberOfElements: number
  empty: boolean
}

/**
 * 标签操作类型枚举
 */
export enum TagOperationType {
  ADD = 'ADD',         // 添加标签
  REMOVE = 'REMOVE',   // 移除标签
  REPLACE = 'REPLACE'  // 替换标签
}

/**
 * 标签操作请求接口
 */
export interface TagOperationRequest {
  questionId: number
  userId: number
  operationType: TagOperationType
  tags: string[]
  commitMessage: string
}

/**
 * 标签操作响应接口
 */
export interface TagOperationResponse {
  question: StandardQuestionItem
  message: string
  status: 'success' | 'error'
}

/**
 * 删除操作响应接口
 */
export interface DeleteOperationResponse {
  success: boolean
  message: string
}
