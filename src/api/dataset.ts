import api from './index'
import { apiUrls } from '@/config'
import type {
  CreateDatasetVersionRequest,
  UpdateDatasetVersionRequest,
  DeleteDatasetVersionRequest,
  CloneDatasetVersionRequest,
  GetAllDatasetVersionsParams,
  DeleteOperationResponse,
  DatasetVersionResponse,
  DatasetVersionPageResponse,
  DatasetQuestionPageResponse
} from '@/types/dataset'

/**
 * 创建数据集版本
 * @param data 数据集版本数据
 * @returns 创建的数据集版本信息
 */
export const createDatasetVersion = (data: CreateDatasetVersionRequest) => {
  return api.post<DatasetVersionResponse>(
    apiUrls.dataset.createVersion,
    data
  )
}


/**
 * 更新数据集版本
 * @param versionId 版本ID
 * @param data 更新数据（包含名称、描述、要添加和移除的问题ID）
 * @returns 更新后的数据集版本信息
 */
export const updateDatasetVersion = (
  versionId: number | string,
  data: UpdateDatasetVersionRequest
) => {
  return api.put<DatasetVersionResponse>(
    `${apiUrls.dataset.updateVersion}/${versionId}`,
    data
  )
}

/**
 * 删除数据集版本
 * @param versionId 版本ID
 * @param data 删除请求数据（包含userId）
 * @returns 删除操作响应
 */
export const deleteDatasetVersion = (
  versionId: number | string,
  data: DeleteDatasetVersionRequest
) => {
  return api.delete<DeleteOperationResponse>(
    `${apiUrls.dataset.deleteVersion}/${versionId}`,
    { data }
  )
}

/**
 * 克隆数据集版本
 * @param versionId 要克隆的版本ID
 * @param data 克隆请求数据（包含新版本号、名称、描述和用户ID）
 * @returns 克隆操作响应
 */
export const cloneDatasetVersion = (
  versionId: number | string,
  data: CloneDatasetVersionRequest
) => {
  return api.post<DatasetVersionResponse>(
    `${apiUrls.dataset.cloneVersion}/${versionId}/clone`,
    data
  )
}

/**
 * 获取所有数据集版本
 * @param params 查询参数
 * @returns 数据集版本列表
 */
export const getAllDatasetVersions = (params?: GetAllDatasetVersionsParams) => {
  return api.get<DatasetVersionResponse[]>(
    apiUrls.dataset.getVersions,
    { params }
  )
}

/**
 * 获取数据集问题列表（分页）
 * @param versionId 数据集版本ID
 * @param params 分页参数
 * @returns 分页的数据集问题列表
 */
export const getDatasetVersionQuestions = (
  versionId: number | string,
  params?: {
    page?: string
    size?: string
    sort?: string
  }
) => {
  return api.get<DatasetQuestionPageResponse>(
    `${apiUrls.dataset.getVersionQuestions}/${versionId}/questions/pageable`,
    { params }
  )
}
