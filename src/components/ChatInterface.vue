<!-- 聊天界面组件 -->
<template>
  <div class="chat-container">
    <!-- 模型选择器 -->
    <div class="model-selector-bar">
      <div class="current-model">
        <span class="model-label">当前模型：</span>
        <el-select
          v-model="selectedModel"
          placeholder="请选择模型"
          size="small"
          class="model-select"
          :loading="isLoadingModels"
          :disabled="isLoadingModels || availableModels.length === 0"
        >
          <el-option
            v-for="model in availableModels"
            :key="model.id"
            :label="model.name"
            :value="model.id"
            :disabled="!model.available"
          >
            <div class="model-option">
              <span>{{ model.name }}</span>
              <el-tag size="small" :type="model.available ? 'success' : 'danger'">
                {{ model.available ? '可用' : '不可用' }}
              </el-tag>
            </div>
          </el-option>
        </el-select>
      </div>
      <div class="model-info" v-if="currentModelInfo">
        <el-tooltip
          :content="currentModelInfo.description || '暂无描述'"
          placement="bottom"
          effect="light"
          :show-after="500"
        >
          <el-tag type="info" size="small">
            {{ currentModelInfo.provider }}
          </el-tag>
        </el-tooltip>
      </div>
    </div>

    <!-- 聊天消息列表 -->
    <div class="messages-container custom-scrollbar" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index" class="message-wrapper">
        <div :class="['message', message.role === 'user' ? 'user-message' : 'ai-message']">
          <div class="message-avatar">
            <el-avatar :size="40" :src="message.role === 'user' ? userAvatar : aiAvatar">
              {{ message.role === 'user' ? 'U' : 'AI' }}
            </el-avatar>
          </div>
          <div class="message-content" :class="{ 'with-tail': true }">
            <div class="message-header">
              <span class="sender-name">{{ message.role === 'user' ? '你' : 'AI助手' }}</span>
              <span class="message-time">{{ formatTime(message.timestamp) }}</span>
            </div>
            <div class="message-body">
              <template v-if="message.role === 'assistant'">
                <!-- 渲染思考过程 (如果有) -->
                <div v-if="extractThinking(message.content)" class="thinking-process">
                  <div class="thinking-header" @click="toggleThinking(index)">
                    <el-icon><Notebook /></el-icon>
                    <span>思考过程</span>
                    <el-icon :class="{ 'rotate-icon': expandedThinking.includes(index) }">
                      <ArrowDown />
                    </el-icon>
                  </div>
                  <div v-show="expandedThinking.includes(index)" class="thinking-content markdown-body"
                       v-html="renderThinking(message.content)"></div>
                </div>

                <!-- 渲染正常回复 -->
                <div v-html="renderContent(message.content)" class="markdown-body response-content"></div>
              </template>
              <div v-else>{{ message.content }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 加载状态指示器 -->
      <div v-if="isLoading" class="loading-indicator">
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span>AI正在思考中...</span>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-container">
      <div class="input-wrapper">
        <el-input
          v-model="userInput"
          type="textarea"
          :rows="3"
          placeholder="输入你的问题..."
          resize="none"
          @keydown.enter.exact.prevent="handleSend"
          @keydown.enter.shift.exact="newline"
          class="custom-input"
        />
        <el-button
          type="primary"
          :disabled="!userInput.trim() || isLoading"
          @click="handleSend"
          class="send-button"
        >
          <el-icon><Position /></el-icon>
          发送
        </el-button>
      </div>
      <div class="input-hint">
        按 Enter 发送，Shift + Enter 换行
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Position, Notebook, ArrowDown } from '@element-plus/icons-vue'
import { sendChatRequest, createDefaultChatRequest } from '@/api/llm'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { useLLMStore } from '@/stores/llm'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

const messages = ref<ChatMessage[]>([])
const userInput = ref('')
const isLoading = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
const userAvatar = ref('/src/assets/user-avatar.svg')
const aiAvatar = ref('/src/assets/ai-avatar.svg')
const llmStore = useLLMStore()
const selectedModel = ref('')
const isLoadingModels = computed(() => llmStore.isLoadingModels)
const availableModels = computed(() => llmStore.availableModels)
const currentModelInfo = computed(() =>
  availableModels.value.find(model => model.id === selectedModel.value)
)
const expandedThinking = ref<number[]>([]) // 存储已展开的思考过程消息索引

// 监听模型选择变化
watch(selectedModel, (newModel) => {
  if (newModel) {
    localStorage.setItem('selectedModel', newModel)
    window.selectedModel = newModel
  }
})

// 初始化时加载已选择的模型
const initSelectedModel = () => {
  const savedModel = localStorage.getItem('selectedModel')
  if (savedModel) {
    selectedModel.value = savedModel
    window.selectedModel = savedModel
  }
}

// 格式化时间
const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 切换思考过程的显示状态
const toggleThinking = (index: number) => {
  const position = expandedThinking.value.indexOf(index)
  if (position === -1) {
    expandedThinking.value.push(index)
  } else {
    expandedThinking.value.splice(position, 1)
  }
}

// 提取思考过程
const extractThinking = (content: string): string | null => {
  const match = content.match(/<think>([\s\S]*?)<\/think>/i)
  return match ? match[1].trim() : null
}

// 移除思考过程，只保留响应内容
const removeThinking = (content: string): string => {
  return content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim()
}

// 渲染思考过程
const renderThinking = (content: string): string => {
  const thinking = extractThinking(content)
  if (!thinking) return ''
  const html = marked.parse(thinking, { async: false }) as string
  return DOMPurify.sanitize(html)
}

// 渲染正常内容（排除思考过程）
const renderContent = (content: string): string => {
  const cleanContent = removeThinking(content)
  const html = marked.parse(cleanContent, { async: false }) as string
  return DOMPurify.sanitize(html)
}

// 检查是否已配置模型
const checkModelConfig = () => {
  const apiConfig = window.apiConfig
  if (!apiConfig || !apiConfig.apiKey || !apiConfig.apiUrl) {
    ElMessage.warning('请先配置API和选择模型')
    // 触发模型配置弹窗
    window.dispatchEvent(new Event('toggle-model-config'))
    return false
  }

  // 检查是否选择了模型
  if (!selectedModel.value) {
    ElMessage.warning('请先选择一个模型')
    return false
  }

  // 检查选择的模型是否可用
  const model = availableModels.value.find(m => m.id === selectedModel.value)
  if (!model?.available) {
    ElMessage.warning('当前选择的模型不可用，请选择其他模型')
    return false
  }

  return true
}

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 处理发送消息
const handleSend = async () => {
  const message = userInput.value.trim()
  if (!message || isLoading.value) return

  // 检查模型配置
  if (!checkModelConfig()) return

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: message,
    timestamp: Date.now()
  })

  userInput.value = ''
  isLoading.value = true
  await scrollToBottom()

  try {
    // 获取API配置
    const apiConfig = window.apiConfig
    if (!apiConfig || !apiConfig.apiKey || !apiConfig.apiUrl) {
      throw new Error('API 配置无效')
    }

    // 创建请求配置，使用选定的模型
    const chatRequest = createDefaultChatRequest(message)
    chatRequest.api = apiConfig.apiUrl
    chatRequest.apiKey = apiConfig.apiKey
    chatRequest.model = selectedModel.value // 直接使用选定的模型

    // 发送请求
    const response = await sendChatRequest(chatRequest)

    if (response.success) {
      // 添加AI回复
      messages.value.push({
        role: 'assistant',
        content: response.content,
        timestamp: Date.now()
      })
    } else {
      throw new Error(response.errorMessage || '未知错误')
    }
  } catch (error) {
    ElMessage.error('发送消息失败：' + (error instanceof Error ? error.message : '未知错误'))
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}

// 处理换行
const newline = () => {
  userInput.value += '\n'
}

onMounted(() => {
  // 初始欢迎消息
  messages.value.push({
    role: 'assistant',
    content: '你好！我是AI助手，有什么我可以帮你的吗？',
    timestamp: Date.now()
  })

  // 初始化选中的模型
  initSelectedModel()
})
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--navbar-height) - 40px);
  width: 100%;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
}

.model-selector-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eee;
}

.current-model {
  display: flex;
  align-items: center;
  gap: 8px;
}

.model-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
}

.model-select {
  width: 200px;
}

.model-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.model-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-select-dropdown__item) {
  padding: 8px 12px;
}

:deep(.el-tag) {
  margin-left: 8px;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f9f9f9;
  width: 100%;
  position: relative;
}

.message-wrapper {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  width: 100%;
  position: relative;
}

.message {
  display: flex;
  max-width: 85%;
  width: 100%;
}

.user-message {
  justify-content: flex-end;
}

.ai-message {
  justify-content: flex-start;
}

.message-avatar {
  margin: 0 12px;
}

.message-content {
  background-color: #fff;
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  max-width: calc(100% - 80px);
  width: 100%;
}

.user-message .message-content {
  background-color: #ecf5ff;
  border: 1px solid #d9ecff;
}

.ai-message .message-content {
  background-color: #fff;
  border: 1px solid #eee;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 14px;
}

.sender-name {
  font-weight: bold;
}

.message-time {
  color: #999;
  font-size: 12px;
}

.message-body {
  word-break: break-word;
  line-height: 1.6;
}

.input-container {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  background-color: #fff;
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
}

.custom-input {
  flex: 1;
}

.send-button {
  margin-left: 10px;
  height: 40px;
  padding: 0 20px;
}

.input-hint {
  margin-top: 5px;
  font-size: 12px;
  color: #999;
  text-align: right;
}

.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  color: #666;
}

.typing-indicator {
  display: flex;
  margin-right: 8px;
}

.typing-indicator span {
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background-color: #666;
  margin: 0 2px;
  animation: typing 1s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: 0s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0);
  }
}

.markdown-body {
  font-size: 14px;
}

.thinking-process {
  margin-bottom: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
}

.thinking-header {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: #f5f5f5;
  cursor: pointer;
  font-size: 13px;
  color: #666;
}

.thinking-header .el-icon {
  margin-right: 5px;
}

.thinking-content {
  padding: 10px;
  background-color: #fafafa;
  border-top: 1px solid #e0e0e0;
  font-size: 13px;
  color: #666;
}

.rotate-icon {
  transform: rotate(180deg);
  transition: transform 0.3s;
}

.response-content {
  padding: 0;
}

/* 自定义滚动条 */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}
</style>

<script lang="ts">
declare global {
  interface Window {
    apiConfig?: {
      apiUrl: string
      apiKey: string
    }
    selectedModel?: string
  }
}
</script>
