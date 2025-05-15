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

// 日志工具函数
const logChatRequest = (request: ChatRequest) => {
  console.group('🚀 发送聊天请求')
  console.log('时间:', new Date().toLocaleString())
  console.log('API URL:', request.api)
  console.log('API Key:', request.apiKey)
  console.log('模型:', request.model)
  console.log('消息内容:', request.message)
  console.log('系统提示词:', request.systemPrompts)
  console.log('温度:', request.temperature)
  console.log('最大Token:', request.maxTokens)
  console.groupEnd()
}

const logChatResponse = (response: ChatResponse) => {
  console.group('📨 收到AI回复')
  console.log('时间:', new Date().toLocaleString())
  console.log('状态:', response.success ? '成功' : '失败')
  console.log('模型:', response.model)
  console.log('Token数量:', response.tokenCount)
  console.log('响应时间:', response.responseTime + 'ms')
  console.log('回复内容:', response.content)
  if (response.metadata) {
    console.group('元数据')
    console.log('ID:', response.metadata.id)
    console.log('创建时间:', new Date(response.metadata.created * 1000).toLocaleString())
    console.log('使用情况:', {
      提示词Token: response.metadata.usage.prompt_tokens,
      回复Token: response.metadata.usage.completion_tokens,
      总Token: response.metadata.usage.total_tokens
    })
    console.groupEnd()
  }
  if (!response.success) {
    console.error('错误信息:', response.errorMessage)
  }
  console.groupEnd()
}

const logError = (error: Error, context: string) => {
  console.group('❌ 错误')
  console.log('时间:', new Date().toLocaleString())
  console.log('上下文:', context)
  console.error('错误信息:', error.message)
  console.error('错误堆栈:', error.stack)
  console.groupEnd()
}

/**
 * 发送聊天请求到LLM
 * @param data 聊天请求参数
 * @returns 聊天响应
 */
export const sendChatRequest = async (data: ChatRequest): Promise<ChatResponse> => {
  try {
    const startTime = Date.now()
    const url = `${appConfig.api.baseUrl}/api/llm/chat`

    // 打印请求信息
    logChatRequest(data)

    // 发送请求
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

    const result = await response.json() as ChatResponse
    result.responseTime = Date.now() - startTime

    // 打印响应信息
    logChatResponse(result)

    return result
  } catch (error) {
    // 打印错误信息
    logError(error instanceof Error ? error : new Error(String(error)), 'sendChatRequest')
    throw error
  }
}

/**
 * 获取可用的LLM模型列表
 * @param data 请求参数
 * @returns 模型列表
 */
export const getAvailableModels = async (data: GetModelsRequest): Promise<ModelInfo[]> => {
  try {
    const url = `${appConfig.api.baseUrl}/api/llm/models`

    console.group('🔍 获取可用模型')
    console.log('时间:', new Date().toLocaleString())
    console.log('API URL:', url)
    console.log('请求参数:', data)
    console.groupEnd()

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

    const models = await response.json() as ModelInfo[]

    console.group('📋 可用模型列表')
    console.log('时间:', new Date().toLocaleString())
    console.log('模型数量:', models.length)
    console.table(models)
    console.groupEnd()

    return models
  } catch (error) {
    logError(error instanceof Error ? error : new Error(String(error)), 'getAvailableModels')
    throw error
  }
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
