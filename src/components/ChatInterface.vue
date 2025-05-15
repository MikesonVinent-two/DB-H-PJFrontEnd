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
  height: calc(100vh - var(--navbar-height, 60px));
  background-color: #f5f7fa;
  padding: 20px;
  margin-top: var(--navbar-height, 60px);
}

.model-selector-bar {
  background: white;
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
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
  margin-bottom: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #d4d4d4 transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #d4d4d4;
  border-radius: 3px;
}

.message-wrapper {
  margin-bottom: 24px;
  opacity: 0;
  transform: translateY(20px);
  animation: messageAppear 0.3s ease forwards;
}

@keyframes messageAppear {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message {
  display: flex;
  gap: 12px;
  max-width: 85%;
}

.user-message {
  margin-left: auto;
  flex-direction: row-reverse;
}

.message-content {
  position: relative;
  background: white;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  min-width: 200px;
  transition: all 0.3s ease;
}

.message-content.with-tail::before {
  content: '';
  position: absolute;
  top: 20px;
  width: 0;
  height: 0;
  border: 8px solid transparent;
}

.ai-message .message-content.with-tail::before {
  left: -15px;
  border-right-color: white;
}

.user-message .message-content.with-tail::before {
  right: -15px;
  border-left-color: var(--el-color-primary);
}

.user-message .message-content {
  background: var(--el-color-primary);
  color: white;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.sender-name {
  font-weight: 600;
  font-size: 14px;
}

.message-time {
  font-size: 12px;
  color: #909399;
}

.user-message .message-time {
  color: rgba(255, 255, 255, 0.9);
}

.message-body {
  font-size: 14px;
  line-height: 1.6;
}

.input-container {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.input-wrapper {
  display: flex;
  gap: 12px;
}

.custom-input {
  flex: 1;
}

.custom-input :deep(.el-textarea__inner) {
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  transition: all 0.3s ease;
  resize: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.custom-input :deep(.el-textarea__inner:focus) {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.send-button {
  align-self: flex-end;
  height: 40px;
  padding: 0 24px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.send-button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(var(--el-color-primary-rgb), 0.3);
}

.input-hint {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
  text-align: right;
}

.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  color: #909399;
}

.typing-indicator {
  display: flex;
  gap: 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--el-color-primary);
  display: inline-block;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  50% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

/* Markdown 样式优化 */
.markdown-body {
  font-size: 14px;
  line-height: 1.6;
}

.markdown-body :deep(pre) {
  background-color: #f6f8fa;
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
  margin: 12px 0;
}

.markdown-body :deep(code) {
  background-color: rgba(175, 184, 193, 0.2);
  border-radius: 4px;
  padding: 0.2em 0.4em;
  font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
}

.markdown-body :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

.user-message .markdown-body {
  color: white;
}

.user-message .markdown-body :deep(pre),
.user-message .markdown-body :deep(code) {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.markdown-body :deep(a) {
  color: #0969da;
  text-decoration: none;
  transition: all 0.3s ease;
}

.markdown-body :deep(a:hover) {
  text-decoration: underline;
  opacity: 0.8;
}

.user-message .markdown-body :deep(a) {
  color: white;
  text-decoration: underline;
}

.markdown-body :deep(table) {
  border-collapse: collapse;
  margin: 16px 0;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid #d0d7de;
  padding: 8px 16px;
}

.markdown-body :deep(th) {
  background-color: #f6f8fa;
  font-weight: 600;
}

.user-message .markdown-body :deep(th),
.user-message .markdown-body :deep(td) {
  border-color: rgba(255, 255, 255, 0.2);
}

.user-message .markdown-body :deep(th) {
  background-color: rgba(255, 255, 255, 0.1);
}

/* 列表样式优化 */
.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 20px;
  margin: 12px 0;
}

.markdown-body :deep(li) {
  margin: 6px 0;
}

/* 引用块样式优化 */
.markdown-body :deep(blockquote) {
  border-left: 4px solid var(--el-color-primary);
  margin: 16px 0;
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.user-message .markdown-body :deep(blockquote) {
  border-left-color: rgba(255, 255, 255, 0.6);
  background-color: rgba(255, 255, 255, 0.1);
}

/* 思考过程样式 */
.thinking-process {
  margin-bottom: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
}

.thinking-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: #f2f6fc;
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  cursor: pointer;
  transition: background-color 0.3s;
}

.thinking-header:hover {
  background-color: #eef5fe;
}

.thinking-content {
  padding: 16px;
  background-color: #f8fafc;
  border-top: 1px solid #e4e7ed;
  font-size: 13px;
  color: #606266;
}

.rotate-icon {
  transition: transform 0.3s;
  transform: rotate(180deg);
}

/* 用户消息中的思考过程样式调整 */
.user-message .thinking-process {
  border-color: rgba(255, 255, 255, 0.2);
}

.user-message .thinking-header {
  background-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
}

.user-message .thinking-content {
  background-color: rgba(255, 255, 255, 0.05);
  border-top-color: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
}

/* 回答内容与思考过程的间距 */
.response-content {
  margin-top: 4px;
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
