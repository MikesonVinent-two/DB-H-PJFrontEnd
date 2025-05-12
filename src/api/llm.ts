import api from './index'
import axios from 'axios'
import { appConfig } from '@/config'

// 系统提示类型
export interface SystemPrompt {
  role: string
  content: string
}

// 模型信息接口
export interface ModelInfo {
  id: string
  name: string
  provider: string
  description?: string | null
  maxTokens?: number | null
  available: boolean
  pricePerToken?: number | null
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
  errorMessage?: string | null
  metadata: Metadata
}

/**
 * 发送聊天请求到LLM
 * @param data 聊天请求参数
 * @returns 聊天响应
 */
export const sendChatRequest = async (data: ChatRequest): Promise<ChatResponse> => {
  const url = `${appConfig.api.baseUrl}/api/llm/chat`
  // 使用fetch替代axios
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

/**
 * 获取可用的LLM模型列表
 * @param data 请求参数
 * @returns 模型列表
 */
export const getAvailableModels = async (data: GetModelsRequest): Promise<ModelInfo[]> => {
  const url = `${appConfig.api.baseUrl}/api/llm/models`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// 创建默认的聊天请求配置
export const createDefaultChatRequest = (
  message: string,
  customSystemPrompts?: SystemPrompt[]
): ChatRequest => {
  return {
    api: 'https://api.openai.com/v1/chat/completions',
    apiKey: '',
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

// 默认导出所有内容
export default {
  sendChatRequest,
  getAvailableModels,
  createDefaultChatRequest,
  createDefaultModelsRequest,
}
