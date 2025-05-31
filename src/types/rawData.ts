/**
 * 原始问题项接口
 */
export interface RawQuestionItem {
  id: number
  sourceUrl: string
  sourceSite: string
  title: string
  content: string
  crawlTime: string
  tags: string[]
  standardQuestionId: number | null
  standardized: boolean
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
 * 原始问题分页响应接口
 */
export interface RawQuestionPageResponse {
  content: RawQuestionItem[]
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
