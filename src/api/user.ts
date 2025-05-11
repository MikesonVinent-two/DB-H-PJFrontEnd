import api from './index';

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  email: string;
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  role: string;
  createdAt: string;
}

/**
 * 用户登录
 */
export const login = (data: LoginData) => {
  return api.post<any, { token: string; user: UserInfo }>('/auth/login', data);
};

/**
 * 用户注册
 */
export const register = (data: RegisterData) => {
  return api.post<any, { token: string; user: UserInfo }>('/auth/register', data);
};

/**
 * 获取当前用户信息
 */
export const getUserInfo = () => {
  return api.get<any, UserInfo>('/user/profile');
};

/**
 * 更新用户信息
 */
export const updateUserInfo = (data: Partial<UserInfo>) => {
  return api.put<any, UserInfo>('/user/profile', data);
};

/**
 * 登出
 */
export const logout = () => {
  return api.post('/auth/logout');
};
