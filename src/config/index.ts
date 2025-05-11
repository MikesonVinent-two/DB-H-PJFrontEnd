// 应用配置
export const appConfig = {
  title: import.meta.env.VITE_APP_TITLE || '前端项目',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  // 其他全局配置
};

// API路径配置
export const apiUrls = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
  },
  user: {
    profile: '/user/profile',
  },
  // 其他API路径
};

export default {
  appConfig,
  apiUrls,
};
