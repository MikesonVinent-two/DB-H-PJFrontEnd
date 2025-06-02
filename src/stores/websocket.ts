import { defineStore } from 'pinia'
import { computed } from 'vue'
import websocketService from '@/services/websocket'
import {
  WebSocketConnectionStatus,
  WebSocketMessageType
} from '@/types/websocketTypes'
import type { WebSocketMessage } from '@/types/websocketTypes'

export const useWebSocketStore = defineStore('websocket', () => {
  // 从WebSocket服务获取状态
  const status = computed(() => websocketService.status.value)
  const lastError = computed(() => websocketService.lastError.value)
  const messages = computed(() => websocketService.messages.value)

  // 计算属性：是否已连接
  const isConnected = computed(() => status.value === WebSocketConnectionStatus.CONNECTED)

  // 计算属性：是否正在连接
  const isConnecting = computed(() => status.value === WebSocketConnectionStatus.CONNECTING)

  // 计算属性：是否有错误
  const hasError = computed(() => status.value === WebSocketConnectionStatus.ERROR)

  // 按类型过滤消息
  const getMessagesByType = (type: WebSocketMessageType) => {
    return messages.value.filter(msg => msg.type === type)
  }

  // 获取最新的特定类型消息
  const getLatestMessageByType = (type: WebSocketMessageType): WebSocketMessage | undefined => {
    const filteredMessages = getMessagesByType(type)
    return filteredMessages.length > 0 ? filteredMessages[filteredMessages.length - 1] : undefined
  }

  // 连接WebSocket
  const connect = (url?: string) => {
    websocketService.connect(url)
  }

  // 断开WebSocket连接
  const disconnect = () => {
    websocketService.disconnect()
  }

  // 发送消息
  const send = (destination: string, body: any): boolean => {
    return websocketService.send(destination, body)
  }

  // 订阅批次状态更新
  const subscribeToBatch = (batchId: number) => {
    websocketService.subscribeToBatchUpdates(batchId)
  }

  // 取消订阅批次状态更新
  const unsubscribeFromBatch = (batchId: number) => {
    websocketService.unsubscribeFromBatchUpdates(batchId)
  }

  // 清除消息历史
  const clearMessages = () => {
    websocketService.clearMessages()
  }

  return {
    // 状态
    status,
    lastError,
    messages,
    isConnected,
    isConnecting,
    hasError,

    // 方法
    connect,
    disconnect,
    send,
    subscribeToBatch,
    unsubscribeFromBatch,
    getMessagesByType,
    getLatestMessageByType,
    clearMessages
  }
})
