import api from './index'

// 用户角色枚举
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  EXPERT = 'EXPERT',
}

export interface LoginData {
  username: string
  password: string
}

export interface RegisterData {
  username: string // 必填，4-50个字符
  password: string // 必填，6-100个字符
  email: string // 必填，需要符合邮箱格式
  role?: UserRole // 可选，默认为"USER"
}

export interface UserInfo {
  id: number
  username: string
  email: string
  avatar?: string
  role: UserRole
  createdAt: string
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
 */
export const login = (data: LoginData) => {
  return api.post<any, UserInfo>('/api/users/login', data)
}

/**
 * 用户注册
 */
export const register = (data: RegisterData) => {
  return api.post<any, UserInfo>('/api/users/register', data)
}

/**
 * 获取当前用户信息
 */
export const getUserInfo = () => {
  return api.get<any, UserInfo>('/api/users/profile')
}

/**
 * 更新用户信息
 */
export const updateUserInfo = (data: Partial<UserInfo>) => {
  return api.put<any, UserInfo>('/api/users/profile', data)
}

/**
 * 登出
 */
export const logout = (data: LogoutData) => {
  return api.post<any, LogoutResponse>('/api/users/logout', data)
}
