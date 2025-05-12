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
  return api.post<unknown, UserInfo>('/api/users/login', data)
}

/**
 * 用户注册
 */
export const register = (data: RegisterData) => {
  return api.post<unknown, UserInfo>('/api/users/register', data)
}

/**
 * 获取当前用户信息
 */
export const getUserInfo = () => {
  // 从本地存储获取当前用户ID
  const userJson = localStorage.getItem('user')
  let userId = '1' // 默认用户ID

  if (userJson) {
    try {
      const user = JSON.parse(userJson)
      userId = user.id.toString()
    } catch (e) {
      console.error('解析用户信息失败', e)
    }
  }

  // 使用getUserById实现
  return getUserById(userId)
}

/**
 * 根据用户ID获取用户信息
 */
export const getUserById = (userId: string | number) => {
  return api.get<unknown, UserInfo>(`/api/users/profile/${userId}`)
}

/**
 * 更新用户信息
 */
export const updateUserInfo = (data: Partial<UserInfo>) => {
  return api.put<unknown, UserInfo>('/api/users/profile', data)
}

/**
 * 登出
 */
export const logout = (data: LogoutData) => {
  return api.post<unknown, LogoutResponse>('/api/users/logout', data)
}
