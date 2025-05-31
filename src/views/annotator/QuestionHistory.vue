<template>
  <div class="question-history">
    <el-row :gutter="20">
      <el-col :span="8">
        <!-- 左侧标准问题列表 -->
        <el-card class="left-panel">
          <template #header>
            <div class="panel-header">
              <h3>标准问题列表</h3>
              <el-input
                v-model="searchQuery"
                placeholder="搜索问题..."
                prefix-icon="el-icon-search"
                clearable
                style="width: 220px; margin-left: 10px;"
              />
            </div>
          </template>

          <div class="filter-bar">
            <el-select v-model="filterQuestionType" placeholder="题型筛选" style="width: 150px; margin-right: 10px;">
              <el-option label="全部" value="" />
              <el-option label="单选题" value="SINGLE_CHOICE" />
              <el-option label="多选题" value="MULTIPLE_CHOICE" />
              <el-option label="简单事实题" value="SIMPLE_FACT" />
              <el-option label="主观题" value="SUBJECTIVE" />
            </el-select>

            <el-select v-model="sortOrder" placeholder="排序方式" style="width: 150px;">
              <el-option label="创建时间 (新→旧)" value="creationTime,desc" />
              <el-option label="创建时间 (旧→新)" value="creationTime,asc" />
              <el-option label="问题文本 (A→Z)" value="questionText,asc" />
              <el-option label="问题文本 (Z→A)" value="questionText,desc" />
            </el-select>
          </div>

          <el-table
            :data="filteredQuestions"
            style="width: 100%"
            @row-click="handleQuestionClick"
            border
            highlight-current-row
            v-loading="loading.questions"
          >
            <el-table-column label="问题文本" prop="questionText" show-overflow-tooltip />
            <el-table-column label="题型" width="90">
              <template #default="{ row }">
                {{ getQuestionTypeText(row.questionType) }}
              </template>
            </el-table-column>
            <el-table-column label="版本" width="70">
              <template #default="{ row }">
                <el-tag>v{{ row.version || '1.0' }}</el-tag>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination">
            <el-pagination
              layout="prev, pager, next"
              :total="totalQuestions"
              :page-size="pageSize"
              :current-page="currentPage"
              @current-change="handlePageChange"
            />
          </div>
        </el-card>
      </el-col>

      <el-col :span="16">
        <!-- 右侧内容区域 -->
        <div v-if="!selectedQuestion" class="empty-state">
          <el-empty description="请从左侧选择一个标准问题" />
        </div>

        <template v-else>
          <!-- 标准问题详情 -->
          <el-card class="question-card">
            <template #header>
              <div class="panel-header">
                <h3>标准问题详情</h3>
                <div>
                  <el-tag type="success" style="margin-right: 10px;">v{{ selectedQuestion.version || '1.0' }}</el-tag>
                  <el-button type="primary" size="small" @click="showQuestionEditor">编辑问题</el-button>
                </div>
              </div>
            </template>

            <div class="question-details">
              <p><strong>问题：</strong> {{ selectedQuestion.questionText }}</p>
              <p><strong>题型：</strong> {{ getQuestionTypeText(selectedQuestion.questionType) }}</p>
              <p><strong>难度：</strong> {{ getDifficultyText(selectedQuestion.difficulty) }}</p>
              <p><strong>创建时间：</strong> {{ formatDate(selectedQuestion.creationTime) }}</p>
              <p><strong>创建者：</strong> {{ selectedQuestion.createdByUser?.name || '未知' }}</p>
              <p>
                <strong>标签：</strong>
                <el-tag
                  v-for="tag in selectedQuestion.tags"
                  :key="tag"
                  style="margin-right: 5px;"
                  size="small"
                >
                  {{ tag }}
                </el-tag>
              </p>
            </div>
          </el-card>

          <!-- 版本历史列表 -->
          <el-card class="history-card">
            <template #header>
              <div class="panel-header">
                <h3>版本历史</h3>
                <el-radio-group v-model="historyViewMode" size="small">
                  <el-radio-button label="list">列表视图</el-radio-button>
                  <el-radio-button label="tree">树形视图</el-radio-button>
                </el-radio-group>
              </div>
            </template>

            <div v-loading="loading.history">
              <!-- 列表视图 -->
              <div v-if="historyViewMode === 'list'" class="list-view">
                <el-timeline>
                  <el-timeline-item
                    v-for="version in versionHistory"
                    :key="version.id"
                    :timestamp="formatDate(version.creationTime)"
                    :type="version.id === selectedQuestion.id ? 'primary' : ''"
                  >
                    <div class="version-item">
                      <div class="version-header">
                        <h4>版本 {{ version.version || '1.0' }}</h4>
                        <div>
                          <el-button
                            type="text"
                            @click="viewVersionDetail(version)"
                            :disabled="version.id === selectedQuestion.id"
                          >
                            查看
                          </el-button>
                          <el-button
                            type="text"
                            @click="restoreVersion(version)"
                            :disabled="version.id === selectedQuestion.id"
                          >
                            恢复此版本
                          </el-button>
                        </div>
                      </div>

                      <p class="version-message">{{ version.commitMessage || '无提交说明' }}</p>
                      <p class="version-meta">修改者: {{ version.createdByUser?.name || '未知' }}</p>
                    </div>
                  </el-timeline-item>
                </el-timeline>
              </div>

              <!-- 树形视图 -->
              <div v-else class="tree-view">
                <el-tree
                  :data="versionTree"
                  node-key="id"
                  default-expand-all
                  :expand-on-click-node="false"
                  :highlight-current="true"
                  :current-node-key="selectedQuestion.id"
                >
                  <template #default="{ node, data }">
                    <div class="tree-node">
                      <span class="tree-label">
                        版本 {{ data.version || '1.0' }} - {{ formatDate(data.creationTime) }}
                      </span>
                      <span class="tree-message">{{ data.commitMessage || '无提交说明' }}</span>
                      <div class="tree-actions">
                        <el-button
                          type="text"
                          @click="viewVersionDetail(data)"
                          :disabled="data.id === selectedQuestion.id"
                        >
                          查看
                        </el-button>
                        <el-button
                          type="text"
                          @click="restoreVersion(data)"
                          :disabled="data.id === selectedQuestion.id"
                        >
                          恢复
                        </el-button>
                      </div>
                    </div>
                  </template>
                </el-tree>
              </div>
            </div>
          </el-card>
        </template>
      </el-col>
    </el-row>

    <!-- 编辑对话框 -->
    <el-dialog
      title="编辑标准问题"
      v-model="editorDialogVisible"
      width="70%"
    >
      <el-form :model="editorForm" label-width="120px" ref="editorFormRef">
        <el-form-item label="问题文本" prop="questionText" :rules="[{ required: true, message: '请输入标准问题文本', trigger: 'blur' }]">
          <el-input
            v-model="editorForm.questionText"
            type="textarea"
            :rows="3"
            placeholder="请输入标准问题文本"
          />
        </el-form-item>

        <el-form-item label="题型" prop="questionType" :rules="[{ required: true, message: '请选择题型', trigger: 'change' }]">
          <el-select v-model="editorForm.questionType" placeholder="请选择题型">
            <el-option label="单选题" value="SINGLE_CHOICE" />
            <el-option label="多选题" value="MULTIPLE_CHOICE" />
            <el-option label="简单事实题" value="SIMPLE_FACT" />
            <el-option label="主观题" value="SUBJECTIVE" />
          </el-select>
        </el-form-item>

        <el-form-item label="难度" prop="difficulty" :rules="[{ required: true, message: '请选择难度', trigger: 'change' }]">
          <el-select v-model="editorForm.difficulty" placeholder="请选择难度">
            <el-option label="简单" value="EASY" />
            <el-option label="中等" value="MEDIUM" />
            <el-option label="困难" value="HARD" />
          </el-select>
        </el-form-item>

        <el-form-item label="标签" prop="tags" :rules="[{ required: true, message: '请至少添加一个标签', trigger: 'change' }]">
          <el-tag
            v-for="tag in editorForm.tags"
            :key="tag"
            closable
            @close="handleRemoveTag(tag)"
            style="margin-right: 5px; margin-bottom: 5px;"
          >
            {{ tag }}
          </el-tag>

          <el-input
            v-if="tagInputVisible"
            ref="tagInputRef"
            v-model="tagInputValue"
            class="tag-input"
            size="mini"
            @keyup.enter="handleAddTag"
            @blur="handleAddTag"
          />

          <el-button v-else class="button-new-tag" size="small" @click="showTagInput">
            + 新标签
          </el-button>
        </el-form-item>

        <el-form-item label="提交说明" prop="commitMessage" :rules="[{ required: true, message: '请输入提交说明', trigger: 'blur' }]">
          <el-input
            v-model="editorForm.commitMessage"
            placeholder="请简要描述此次修改的原因"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editorDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitQuestionEdit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 版本对比对话框 -->
    <el-dialog
      title="版本对比"
      v-model="compareDialogVisible"
      width="80%"
    >
      <div class="compare-view" v-if="compareVersion">
        <el-tabs type="border-card">
          <el-tab-pane label="问题对比">
            <div class="compare-item">
              <div class="compare-header">
                <h5>问题文本</h5>
              </div>
              <div class="compare-content">
                <div class="compare-old">
                  <div class="compare-title">当前版本</div>
                  <div class="compare-text">{{ selectedQuestion.questionText }}</div>
                </div>
                <div class="compare-new">
                  <div class="compare-title">历史版本 {{ compareVersion.version || '1.0' }}</div>
                  <div class="compare-text">{{ compareVersion.questionText }}</div>
                </div>
              </div>
            </div>

            <div class="compare-item">
              <div class="compare-header">
                <h5>题型</h5>
              </div>
              <div class="compare-content">
                <div class="compare-old">
                  <div class="compare-title">当前版本</div>
                  <div class="compare-text">{{ getQuestionTypeText(selectedQuestion.questionType) }}</div>
                </div>
                <div class="compare-new">
                  <div class="compare-title">历史版本 {{ compareVersion.version || '1.0' }}</div>
                  <div class="compare-text">{{ getQuestionTypeText(compareVersion.questionType) }}</div>
                </div>
              </div>
            </div>

            <div class="compare-item">
              <div class="compare-header">
                <h5>难度</h5>
              </div>
              <div class="compare-content">
                <div class="compare-old">
                  <div class="compare-title">当前版本</div>
                  <div class="compare-text">{{ getDifficultyText(selectedQuestion.difficulty) }}</div>
                </div>
                <div class="compare-new">
                  <div class="compare-title">历史版本 {{ compareVersion.version || '1.0' }}</div>
                  <div class="compare-text">{{ getDifficultyText(compareVersion.difficulty) }}</div>
                </div>
              </div>
            </div>

            <div class="compare-item">
              <div class="compare-header">
                <h5>标签</h5>
              </div>
              <div class="compare-content">
                <div class="compare-old">
                  <div class="compare-title">当前版本</div>
                  <div class="compare-text">
                    <el-tag
                      v-for="tag in selectedQuestion.tags"
                      :key="tag"
                      style="margin-right: 5px; margin-bottom: 5px;"
                      size="small"
                    >
                      {{ tag }}
                    </el-tag>
                  </div>
                </div>
                <div class="compare-new">
                  <div class="compare-title">历史版本 {{ compareVersion.version || '1.0' }}</div>
                  <div class="compare-text">
                    <el-tag
                      v-for="tag in compareVersion.tags"
                      :key="tag"
                      style="margin-right: 5px; margin-bottom: 5px;"
                      size="small"
                    >
                      {{ tag }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="元数据">
            <div class="compare-meta">
              <div class="meta-column">
                <h5>当前版本</h5>
                <p><strong>版本号：</strong> {{ selectedQuestion.version || '1.0' }}</p>
                <p><strong>创建时间：</strong> {{ formatDate(selectedQuestion.creationTime) }}</p>
                <p><strong>创建者：</strong> {{ selectedQuestion.createdByUser?.name || '未知' }}</p>
                <p><strong>提交说明：</strong> {{ selectedQuestion.commitMessage || '无' }}</p>
              </div>

              <div class="meta-column">
                <h5>历史版本</h5>
                <p><strong>版本号：</strong> {{ compareVersion.version || '1.0' }}</p>
                <p><strong>创建时间：</strong> {{ formatDate(compareVersion.creationTime) }}</p>
                <p><strong>创建者：</strong> {{ compareVersion.createdByUser?.name || '未知' }}</p>
                <p><strong>提交说明：</strong> {{ compareVersion.commitMessage || '无' }}</p>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'

// 导入相关API
import {
  getStandardQuestions,
  getQuestionHistory,
  getQuestionVersionTree,
  updateStandardQuestion
} from '@/api/standardData'

// 状态定义
const loading = reactive({
  questions: false,
  history: false,
  updating: false
})
const searchQuery = ref('')
const filterQuestionType = ref('')
const sortOrder = ref('creationTime,desc')
const questions = ref<any[]>([])
const selectedQuestion = ref<any>(null)
const versionHistory = ref<any[]>([])
const versionTree = ref<any[]>([])
const totalQuestions = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const historyViewMode = ref('list')
const editorDialogVisible = ref(false)
const compareDialogVisible = ref(false)
const compareVersion = ref<any>(null)
const editorFormRef = ref<FormInstance>()
const tagInputVisible = ref(false)
const tagInputValue = ref('')
const tagInputRef = ref<any>(null)

// 编辑表单数据
const editorForm = reactive({
  id: 0,
  questionText: '',
  questionType: '',
  difficulty: '',
  tags: [] as string[],
  commitMessage: '',
  userId: 1 // 应该从用户状态获取
})

// 过滤标准问题
const filteredQuestions = computed(() => {
  if (!searchQuery.value && !filterQuestionType.value) return questions.value

  return questions.value.filter(question => {
    const matchesSearch = !searchQuery.value ||
      question.questionText.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesType = !filterQuestionType.value ||
      question.questionType === filterQuestionType.value

    return matchesSearch && matchesType
  })
})

// 生命周期钩子
onMounted(() => {
  fetchStandardQuestions()
})

// 获取标准问题列表
const fetchStandardQuestions = async () => {
  loading.questions = true
  try {
    const params = {
      page: (currentPage.value - 1).toString(),
      size: pageSize.value.toString(),
      sort: sortOrder.value
    }

    const response = await getStandardQuestions(params)

    // 添加适当的空值检查
    if (response && response.data && response.data.content) {
      questions.value = response.data.content || []
      totalQuestions.value = response.data.totalElements || 0
    } else {
      console.warn('标准问题数据格式不符合预期:', response)
      questions.value = []
      totalQuestions.value = 0
      ElMessage.warning('获取标准问题数据格式异常')
    }
  } catch (error) {
    console.error('获取标准问题失败:', error)
    questions.value = []
    totalQuestions.value = 0
    ElMessage.error('获取标准问题失败')
  } finally {
    loading.questions = false
  }
}

// 日期格式化
const formatDate = (dateStr: string) => {
  if (!dateStr) return '未知'
  const date = new Date(dateStr)
  return date.toLocaleString()
}

// 获取题型文本
const getQuestionTypeText = (type: string) => {
  switch (type) {
    case 'SINGLE_CHOICE':
      return '单选题'
    case 'MULTIPLE_CHOICE':
      return '多选题'
    case 'SIMPLE_FACT':
      return '简单事实题'
    case 'SUBJECTIVE':
      return '主观题'
    default:
      return '未知'
  }
}

// 获取难度文本
const getDifficultyText = (difficulty: string) => {
  switch (difficulty) {
    case 'EASY':
      return '简单'
    case 'MEDIUM':
      return '中等'
    case 'HARD':
      return '困难'
    default:
      return '未知'
  }
}

// 处理标准问题点击
const handleQuestionClick = async (row: any) => {
  selectedQuestion.value = row
  await fetchQuestionHistory(row.id)
}

// 获取问题历史
const fetchQuestionHistory = async (questionId: number) => {
  loading.history = true

  try {
    // 获取版本历史
    const historyResponse = await getQuestionHistory(questionId)
    versionHistory.value = Array.isArray(historyResponse?.data) ? historyResponse.data : []

    // 获取版本树
    const treeResponse = await getQuestionVersionTree(questionId)
    versionTree.value = treeResponse?.data ? [treeResponse.data] : []
  } catch (error) {
    console.error('获取问题历史失败:', error)
    versionHistory.value = []
    versionTree.value = []
    ElMessage.error('获取问题历史失败')
  } finally {
    loading.history = false
  }
}

// 处理分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchStandardQuestions()
}

// 显示问题编辑器
const showQuestionEditor = () => {
  if (!selectedQuestion.value) return

  editorForm.id = selectedQuestion.value.id
  editorForm.questionText = selectedQuestion.value.questionText
  editorForm.questionType = selectedQuestion.value.questionType
  editorForm.difficulty = selectedQuestion.value.difficulty
  editorForm.tags = [...selectedQuestion.value.tags]
  editorForm.commitMessage = ''

  editorDialogVisible.value = true
}

// 标签相关方法
const showTagInput = () => {
  tagInputVisible.value = true
  nextTick(() => {
    tagInputRef.value?.focus()
  })
}

const handleAddTag = () => {
  if (tagInputValue.value) {
    if (!editorForm.tags.includes(tagInputValue.value)) {
      editorForm.tags.push(tagInputValue.value)
    }
  }
  tagInputVisible.value = false
  tagInputValue.value = ''
}

const handleRemoveTag = (tag: string) => {
  editorForm.tags = editorForm.tags.filter(t => t !== tag)
}

// 提交问题编辑
const submitQuestionEdit = async () => {
  if (!editorFormRef.value) return

  await editorFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.updating = true
      try {
        await updateStandardQuestion(editorForm.id, editorForm)
        ElMessage.success('标准问题更新成功')

        // 刷新数据
        await fetchStandardQuestions()

        // 更新选中的问题
        const updatedQuestion = questions.value.find(q => q.id === editorForm.id)
        if (updatedQuestion) {
          selectedQuestion.value = updatedQuestion
          await fetchQuestionHistory(updatedQuestion.id)
        }

        editorDialogVisible.value = false
      } catch (error) {
        console.error('更新标准问题失败:', error)
        ElMessage.error('更新标准问题失败')
      } finally {
        loading.updating = false
      }
    }
  })
}

// 查看版本详情
const viewVersionDetail = (version: any) => {
  compareVersion.value = version
  compareDialogVisible.value = true
}

// 恢复版本
const restoreVersion = (version: any) => {
  ElMessageBox.confirm(
    `确定要将问题恢复到版本 ${version.version || '1.0'} 吗？`,
    '恢复版本',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 打开编辑对话框并填充历史版本的数据
    editorForm.id = selectedQuestion.value.id
    editorForm.questionText = version.questionText
    editorForm.questionType = version.questionType
    editorForm.difficulty = version.difficulty
    editorForm.tags = [...version.tags]
    editorForm.commitMessage = `恢复到版本 ${version.version || '1.0'}`

    editorDialogVisible.value = true
  }).catch(() => {
    // 取消操作
  })
}
</script>

<style scoped>
.question-history {
  padding: 20px;
}

.left-panel {
  height: calc(100vh - 140px);
  overflow-y: auto;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-bar {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.pagination {
  margin-top: 15px;
  text-align: center;
}

.empty-state {
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.question-card, .history-card {
  margin-bottom: 20px;
}

.question-details {
  padding: 10px 0;
}

.version-item {
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
  margin-bottom: 10px;
}

.version-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.version-message {
  color: #606266;
  margin: 10px 0;
}

.version-meta {
  color: #909399;
  font-size: 0.9em;
}

.tree-node {
  display: flex;
  align-items: center;
  width: 100%;
}

.tree-label {
  font-weight: bold;
  margin-right: 10px;
}

.tree-message {
  color: #606266;
  flex-grow: 1;
  margin: 0 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tree-actions {
  margin-left: auto;
}

.tag-input {
  width: 100px;
  margin-right: 5px;
  vertical-align: bottom;
}

.compare-item {
  margin-bottom: 20px;
}

.compare-header {
  margin-bottom: 10px;
}

.compare-content {
  display: flex;
}

.compare-old, .compare-new {
  flex: 1;
  padding: 10px;
}

.compare-old {
  background-color: #f0f9eb;
  margin-right: 5px;
}

.compare-new {
  background-color: #f0f0f5;
  margin-left: 5px;
}

.compare-title {
  font-weight: bold;
  margin-bottom: 10px;
  border-bottom: 1px solid #dcdfe6;
  padding-bottom: 5px;
}

.compare-text {
  min-height: 40px;
}

.compare-meta {
  display: flex;
}

.meta-column {
  flex: 1;
  padding: 20px;
}

.meta-column:first-child {
  border-right: 1px solid #dcdfe6;
}
</style>
