// 应用配置
export const appConfig = {
  title: import.meta.env.VITE_APP_TITLE || '前端项目',
  env: import.meta.env.VITE_APP_ENV || 'development',
  // API配置
  api: {
    // baseUrl: 'https://m1.apifoxmock.com/m1/6367019-6063223-default',
    baseUrl: 'http://localhost:8080',
    contentType: 'application/json',
    timeout: 10000, // 普通请求超时时间：10秒
    // LLM API特殊配置
    llm: {
      chatTimeout: 600000, // LLM聊天请求超时时间：60秒
    },
  },
  storage: {
    tokenKey: 'token',
    userKey: 'user',
    apiConfigKey: 'apiConfig',
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

// 默认API配置
export const defaultApiConfig = {
  apiUrl: 'https://api.openai.com/v1',
  apiKey: '',
}

// 系统角色配置
export const systemRoles = {
  default: '你是一个专业的助手，请用中文回答问题。',
  developer: '你是一个专业的开发者助手，擅长编程相关问题。',
  translator: '你是一个专业的翻译助手，精通多国语言互译。',
}

// 模型配置
export const modelConfig = {
  defaultModel: 'gpt-4',
  defaultTemperature: 0.7,
  defaultMaxTokens: 2000,
}

export default {
  appConfig,
  apiUrls,
  defaultApiConfig,
  systemRoles,
  modelConfig,
};
