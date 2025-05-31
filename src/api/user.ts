import api from './index'
import { apiUrls } from '@/config'

// 用户角色枚举
export enum UserRole {
  ADMIN = 'ADMIN',
  CURATOR = 'CURATOR',
  EXPERT = 'EXPERT',
  ANNOTATOR = 'ANNOTATOR',
  REFEREE = 'REFEREE',
  CROWDSOURCE_USER = 'CROWDSOURCE_USER'
}

export interface LoginData {
  username: string
  password: string
}

export interface RegisterData {
  username: string // 必填，4-50个字符
  password: string // 必填，6-100个字符
  contactInfo: string // 必填，需要符合联系方式格式
  role?: UserRole // 可选，默认为"CROWDSOURCE_USER"
}

export interface UserInfo {
  id: number
  username: string
  name: string | null
  role: UserRole
  contactInfo: string
  createdAt: string
  updatedAt: string
  email?: string
}

// 登录响应结构
export interface LoginResponse {
  id: number
  username: string
  name: string | null
  role: UserRole
  contactInfo: string
  isEvaluator: boolean
  evaluatorId?: number // 可选，仅当isEvaluator为true时存在
}

export interface LogoutData {
  id: number
  username: string
}

export interface LogoutResponse {
  message: string
}

/**
 * 用户登录
 * @param data 登录数据
 * @returns 登录响应，包含用户基本信息和评测员相关信息
 *
 * 当用户是评测员时，返回中会包含evaluatorId字段
 * 当用户不是评测员时，返回中不包含evaluatorId字段，isEvaluator为false
 */
export const login = async (data: LoginData) => {
  // 登录并获取用户信息
  return api.post<unknown, LoginResponse>(apiUrls.auth.login, data)
}

/**
 * 用户注册
 */
export const register = (data: RegisterData) => {
  return api.post<unknown, UserInfo>(apiUrls.auth.register, data)
}

/**
 * 获取当前用户信息
 */
export const getUserInfo = async () => {
  const userJson = localStorage.getItem('user')
  if (!userJson) {
    throw new Error('未登录')
  }

  try {
    const user = JSON.parse(userJson) as LoginResponse
    return user
  } catch (e) {
    console.error('获取用户信息失败', e)
    throw new Error('获取用户信息失败')
  }
}

/**
 * 根据ID获取用户信息
 * @param userId 用户ID
 * @returns 用户详细信息
 */
export const getUserById = (userId: string | number) => {
  if (!userId) {
    throw new Error('用户ID不能为空')
  }
  // 使用profile接口获取用户信息
  return api.get<unknown, UserInfo>(`${apiUrls.user.profile}/${userId}`)
}

/**
 * 更新用户信息
 */
export const updateUserInfo = (data: Partial<UserInfo>) => {
  return api.put<unknown, UserInfo>(apiUrls.user.profile, data)
}

/**
 * 登出
 */
export const logout = (data: LogoutData) => {
  return api.post<unknown, LogoutResponse>(apiUrls.auth.logout, data)
}
