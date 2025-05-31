import api from './index'
import { apiUrls } from '@/config'

/**
 * 标签推荐请求参数接口
 */
export interface RecommendTagsRequest {
  text: string
  questionType?: string
  existingTags?: string[]
}

/**
 * 标签推荐响应接口
 */
export interface RecommendTagsResponse {
  tags: string[]
  confidence: number[]
}

/**
 * 获取标签推荐
 * @param params 推荐参数
 * @returns 推荐的标签列表
 */
export const recommendTags = (params: RecommendTagsRequest) => {
  return api.post<unknown, RecommendTagsResponse>(
    apiUrls.tags.recommend,
    params
  )
}

/**
 * 获取所有可用标签
 */
export const getAllTags = () => {
  return api.get<unknown, { tags: string[] }>(
    apiUrls.tags.all
  )
}
