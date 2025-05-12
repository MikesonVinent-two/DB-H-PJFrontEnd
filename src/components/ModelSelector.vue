<!-- 模型选择器组件 -->
<template>
  <div class="model-selector">
    <!-- API配置表单 -->
    <el-form :model="apiConfig" label-width="120px" class="api-config-form">
      <el-form-item label="API URL">
        <el-input
          v-model="apiConfig.apiUrl"
          placeholder="请输入API URL"
          :disabled="isLoadingModels"
        />
      </el-form-item>

      <el-form-item label="API Key">
        <el-input
          v-model="apiConfig.apiKey"
          type="password"
          placeholder="请输入API Key"
          show-password
          :disabled="isLoadingModels"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="handleLoadModels"
          :loading="isLoadingModels"
          :disabled="!isFormValid"
        >
          {{ isLoadingModels ? '加载中...' : '加载模型列表' }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 模型选择器 -->
    <div class="model-select" v-if="availableModels.length > 0">
      <el-form :model="modelSelection" label-width="120px">
        <el-form-item label="选择模型">
          <el-select
            v-model="modelSelection.selectedModel"
            placeholder="请选择模型"
            class="model-select-input"
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
        </el-form-item>
      </el-form>

      <!-- 选中模型的详细信息 -->
      <div v-if="selectedModelInfo" class="model-info">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="模型名称">
            {{ selectedModelInfo.name }}
          </el-descriptions-item>
          <el-descriptions-item label="提供商">
            {{ selectedModelInfo.provider }}
          </el-descriptions-item>
          <el-descriptions-item label="最大Token">
            {{ selectedModelInfo.maxTokens || '未指定' }}
          </el-descriptions-item>
          <el-descriptions-item label="描述">
            {{ selectedModelInfo.description || '暂无描述' }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>

    <!-- 错误提示 -->
    <el-alert v-if="error" :title="error" type="error" show-icon closable class="error-alert" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLLMStore } from '@/stores/llm'
import type { ModelInfo } from '@/api/llm'

const store = useLLMStore()

// API配置
const apiConfig = ref({
  apiUrl: 'https://api.openai.com/v1',
  apiKey: '',
})

// 模型选择
const modelSelection = ref({
  selectedModel: '',
})

// 计算属性
const isFormValid = computed(() => {
  return apiConfig.value.apiUrl.trim() !== '' && apiConfig.value.apiKey.trim() !== ''
})

const selectedModelInfo = computed(() => {
  return store.availableModels.find((model) => model.id === modelSelection.value.selectedModel)
})

// 从store获取状态
const availableModels = computed(() => store.availableModels)
const isLoadingModels = computed(() => store.isLoadingModels)
const error = computed(() => store.error)

// 方法
const handleLoadModels = async () => {
  try {
    // 清除之前的选择
    modelSelection.value.selectedModel = ''

    // 加载新的模型列表
    await store.fetchModels(apiConfig.value.apiKey)
  } catch (error) {
    console.error('加载模型列表失败:', error)
  }
}

// 对外暴露的属性和方法
defineExpose({
  selectedModel: computed(() => modelSelection.value.selectedModel),
  apiConfig,
})
</script>

<style scoped>
.model-selector {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.api-config-form {
  margin-bottom: 20px;
}

.model-select {
  margin-top: 20px;
}

.model-select-input {
  width: 100%;
}

.model-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.model-info {
  margin-top: 20px;
}

.error-alert {
  margin-top: 20px;
}
</style>
