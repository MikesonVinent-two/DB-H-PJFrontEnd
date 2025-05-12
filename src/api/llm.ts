import api from './index'

// 系统提示类型
export interface SystemPrompt {
  role?: string
  content?: string
}

// 模型信息接口
export interface ModelInfo {
  id: string
  name: string
  provider: string
  description: null | string
  maxTokens: null | number
  available: boolean
  pricePerToken: null | number
}

// 获取模型请求接口
export interface GetModelsRequest {
  apiUrl: string
  apiKey: string
}

// 请求参数接口
export interface ChatRequest {
  api: string
  apiKey: string
  model: string
  message: string
  temperature?: number
  maxTokens?: number
  systemPrompts: SystemPrompt[]
}

// 使用情况接口
export interface Usage {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}

// 消息接口
export interface Message {
  role: string
  content: string
}

// 选项接口
export interface Choice {
  message: Message
  finish_reason: string
  index: number
}

// 元数据接口
export interface Metadata {
  id: string
  object: string
  created: number
  model: string
  usage: Usage
  choices: Choice[]
}

// 响应接口
export interface ChatResponse {
  content: string
  model: string
  tokenCount: number
  responseTime: number
  success: boolean
  errorMessage: null | string
  metadata: Metadata
}

/**
 * 发送聊天请求到LLM
 * @param data 聊天请求参数
 * @returns 聊天响应
 */
export const sendChatRequest = (data: ChatRequest) => {
  return api.post<ChatRequest, ChatResponse>('/api/llm/chat', data)
}

/**
 * 获取可用的LLM模型列表
 * @param data 请求参数
 * @returns 模型列表
 */
export const getAvailableModels = (data: GetModelsRequest) => {
  return api.post<GetModelsRequest, ModelInfo[]>('/api/llm/models', data)
}

// 创建默认的聊天请求配置
export const createDefaultChatRequest = (
  message: string,
  customSystemPrompts?: SystemPrompt[],
): ChatRequest => {
  return {
    api: 'https://api.openai.com/v1/chat/completions',
    apiKey: '', // 需要在使用时设置
    model: 'gpt-4',
    message,
    temperature: 0.7,
    maxTokens: 2000,
    systemPrompts: customSystemPrompts || [
      {
        role: 'system',
        content: '你是一个专业的助手，请用中文回答问题。',
      },
    ],
  }
}

// 创建默认的模型请求配置
export const createDefaultModelsRequest = (apiKey: string): GetModelsRequest => {
  return {
    apiUrl: 'https://api.openai.com/v1',
    apiKey,
  }
}
