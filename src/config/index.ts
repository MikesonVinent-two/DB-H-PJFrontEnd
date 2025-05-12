// 应用配置
export const appConfig = {
  title: import.meta.env.VITE_APP_TITLE || '前端项目',
  env: import.meta.env.VITE_APP_ENV || 'development',
  // API配置
  api: {
    baseUrl: import.meta.env.VITE_APP_API_BASE_URL || 'https://m1.apifoxmock.com/m1/6367019-6063223-default',
    timeout: Number(import.meta.env.VITE_APP_API_TIMEOUT || 10000),
    contentType: 'application/json',
    // LLM API特殊配置
    llm: {
      chatTimeout: Number(import.meta.env.VITE_APP_LLM_CHAT_TIMEOUT || 60000), // 默认60秒
    }
  },
  // 其他全局配置
};

// API路径配置
export const apiUrls = {
  auth: {
    login: '/api/users/login',
    register: '/api/users/register',
    logout: '/api/users/logout',
  },
  user: {
    profile: '/api/users/profile',
  },
  // 其他API路径
};

export default {
  appConfig,
  apiUrls,
};
