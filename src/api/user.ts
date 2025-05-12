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
export const login = async (data: LoginData) => {
  // 登录并直接获取完整的用户信息
  const loginResponse = await api.post<unknown, UserInfo>('/api/users/login', data)
  if (loginResponse && loginResponse.id) {
    // 登录成功后直接获取用户详细信息
    const userInfo = await api.get<unknown, UserInfo>(`/api/users/profile/${loginResponse.id}`)
    return userInfo
  }
  return loginResponse
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
export const getUserInfo = async () => {
  const userJson = localStorage.getItem('user')
  if (!userJson) {
    throw new Error('未登录')
  }

  try {
    const user = JSON.parse(userJson)
    // 确保获取完整的用户信息
    const userInfo = await getUserById(user.id)
    return userInfo
  } catch (e) {
    console.error('获取用户信息失败', e)
    throw new Error('获取用户信息失败')
  }
}

/**
 * 根据ID获取用户信息
 */
export const getUserById = (userId: string | number) => {
  if (!userId) {
    throw new Error('用户ID不能为空')
  }
  // 使用profile接口获取完整的用户信息
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
