/**
 * 创建数据集版本的请求接口
 */
export interface CreateDatasetVersionRequest {
  versionNumber: string
  name: string
  description: string
  standardQuestionIds: number[]
  userId: number
}

/**
 * 数据集版本响应接口
 */
export interface DatasetVersionResponse {
  id: number
  versionNumber: string
  name: string
  description: string
  creationTime: string
  createdByUserId: number
  createdByUserName: string
  questionCount: number
}

/**
 * 分页信息接口
 */
export interface PageInfo {
  sort: {
    sorted: boolean
    unsorted: boolean
    empty: boolean
  }
  pageNumber: number
  pageSize: number
  offset: number
  paged: boolean
  unpaged: boolean
}

/**
 * 排序信息接口
 */
export interface SortInfo {
  sorted: boolean
  unsorted: boolean
  empty: boolean
}

/**
 * 数据集版本分页响应接口
 */
export interface DatasetVersionPageResponse {
  content: DatasetVersionResponse[]
  pageable: PageInfo
  totalPages: number
  totalElements: number
  last: boolean
  first: boolean
  size: number
  number: number
  sort: SortInfo
  numberOfElements: number
  empty: boolean
}

/**
 * 更新数据集版本的请求接口
 */
export interface UpdateDatasetVersionRequest {
  name: string
  description: string
  standardQuestionsToAdd: number[]
  standardQuestionsToRemove: number[]
  userId: number
}

/**
 * 删除数据集版本的请求接口
 */
export interface DeleteDatasetVersionRequest {
  userId: number
}

/**
 * 删除操作响应接口
 */
export interface DeleteOperationResponse {
  success: boolean
  message: string
}

/**
 * 克隆数据集版本的请求接口
 */
export interface CloneDatasetVersionRequest {
  newVersionNumber: string
  newName: string
  description: string
  userId: number
}

/**
 * 获取所有数据集版本的查询参数
 */
export interface GetAllDatasetVersionsParams {
  name?: string
}

/**
 * 数据集问题项接口
 */
export interface DatasetQuestionItem {
  id: number
  datasetVersionId: number
  datasetVersionName: string
  standardQuestionId: number
  standardQuestionText: string
  orderInDataset: number
}

/**
 * 数据集问题分页响应接口
 */
export interface DatasetQuestionPageResponse {
  content: DatasetQuestionItem[]
  pageable: PageInfo
  totalPages: number
  totalElements: number
  last: boolean
  first: boolean
  size: number
  number: number
  sort: SortInfo
  numberOfElements: number
  empty: boolean
}
