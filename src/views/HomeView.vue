<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import {
  Setting,
  Files,
  VideoPlay,
  DataAnalysis,
  Collection,
  QuestionFilled,
  ChatDotRound,
  Star,
  StarFilled,
  EditPen,
  Document,
  TopRight,
  Check,
  View,
  Connection,
  List,
  Histogram
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 用户角色和显示名称
const userRole = computed(() => userStore.currentUser?.role || '')
const userRoleDisplay = computed(() => {
  const roleMap: Record<string, string> = {
    'ADMIN': '管理员',
    'CURATOR': '策展人',
    'EXPERT': '专家',
    'ANNOTATOR': '标注员',
    'REFEREE': '审核员',
    'CROWDSOURCE_USER': '众包用户'
  }
  return roleMap[userRole.value] || '未知角色'
})

// 评测员信息
const isEvaluator = computed(() => userStore.currentUser?.isEvaluator || false)
const evaluatorId = computed(() => userStore.currentUser?.evaluatorId || '-')

// 页面导航
const navigateTo = (routeName: string) => {
  router.push({ name: routeName })
}
</script>

<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="welcome-card">
          <template #header>
            <div class="card-header">
              <h2>欢迎使用数据集评测系统</h2>
            </div>
          </template>
          <div class="welcome-content">
            <p>您当前的角色：<strong>{{ userRoleDisplay }}</strong></p>
            <p v-if="isEvaluator" class="evaluator-badge">
              <el-tag type="success">评测员</el-tag>
              <span>评测员ID: {{ evaluatorId }}</span>
            </p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 通用功能卡片 - 所有用户可见 -->
    <el-row :gutter="20" class="function-row">
      <el-col :xs="24" :sm="12" :md="8" :lg="6">
        <el-card class="function-card" @click="navigateTo('chat')">
          <el-icon class="card-icon"><ChatDotRound /></el-icon>
          <h3>AI对话</h3>
          <p>与AI助手进行对话交流</p>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="function-row">
      <!-- 管理员功能卡片 -->
      <template v-if="userRole === 'ADMIN'">
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-card class="function-card" @click="navigateTo('admin')">
            <el-icon class="card-icon"><Setting /></el-icon>
            <h3>管理员控制台</h3>
            <p>系统管理、用户管理、权限设置</p>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-card class="function-card" @click="navigateTo('admin-datasets')">
            <el-icon class="card-icon"><Files /></el-icon>
            <h3>数据集管理</h3>
            <p>创建和更新数据集版本</p>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-card class="function-card" @click="navigateTo('admin-batch-runs')">
            <el-icon class="card-icon"><VideoPlay /></el-icon>
            <h3>批次运行</h3>
            <p>创建和执行批次运行</p>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-card class="function-card" @click="navigateTo('admin-evaluations')">
            <el-icon class="card-icon"><DataAnalysis /></el-icon>
            <h3>评测管理</h3>
            <p>执行和管理评测任务</p>
          </el-card>
        </el-col>
      </template>

      <!-- 策展人功能卡片 -->
      <template v-if="userRole === 'CURATOR' || userRole === 'ADMIN'">
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-card class="function-card" @click="navigateTo('curator')">
            <el-icon class="card-icon"><Collection /></el-icon>
            <h3>策展工作台</h3>
            <p>内容管理和策展工作</p>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-card class="function-card" @click="navigateTo('curator-questions')">
            <el-icon class="card-icon"><QuestionFilled /></el-icon>
            <h3>原始问题管理</h3>
            <p>录入和管理原始问题</p>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-card class="function-card" @click="navigateTo('curator-answers')">
            <el-icon class="card-icon"><ChatDotRound /></el-icon>
            <h3>原始回答管理</h3>
            <p>录入和管理原始回答</p>
          </el-card>
        </el-col>
      </template>

      <!-- 专家功能卡片 -->
      <template v-if="userRole === 'EXPERT' || userRole === 'ADMIN'">
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-card class="function-card" @click="navigateTo('expert')">
            <el-icon class="card-icon"><Star /></el-icon>
            <h3>专家工作台</h3>
            <p>专业知识回答管理</p>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-card class="function-card" @click="navigateTo('expert-questions')">
            <el-icon class="card-icon"><QuestionFilled /></el-icon>
            <h3>标准问题</h3>
            <p>查看标准问题列表</p>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-card class="function-card" @click="navigateTo('expert-answers')">
            <el-icon class="card-icon"><ChatDotRound /></el-icon>
            <h3>专家回答</h3>
            <p>提供专业知识回答</p>
          </el-card>
        </el-col>
      </template>

      <!-- 标注员功能卡片 -->
      <template v-if="userRole === 'ANNOTATOR' || userRole === 'ADMIN'">
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-card class="function-card" @click="navigateTo('annotator')">
            <el-icon class="card-icon"><EditPen /></el-icon>
            <h3>标注工作台</h3>
            <p>数据标注和配置管理</p>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-card class="function-card" @click="navigateTo('annotator-prompts')">
            <el-icon class="card-icon"><Document /></el-icon>
            <h3>Prompt管理</h3>
            <p>编写和管理各类Prompt</p>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-card class="function-card" @click="navigateTo('annotator-standardization')">
            <el-icon class="card-icon"><TopRight /></el-icon>
            <h3>问题标准化</h3>
            <p>标准化原始问题</p>
          </el-card>
        </el-col>
      </template>

      <!-- 审核员功能卡片 -->
      <template v-if="userRole === 'REFEREE' || userRole === 'ADMIN'">
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-card class="function-card" @click="navigateTo('referee')">
            <el-icon class="card-icon"><Check /></el-icon>
            <h3>审核工作台</h3>
            <p>内容审核工作</p>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-card class="function-card" @click="navigateTo('referee-crowdsource-review')">
            <el-icon class="card-icon"><View /></el-icon>
            <h3>众包回答审核</h3>
            <p>审核众包用户的回答</p>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-card class="function-card" @click="navigateTo('referee-expert-rating')">
            <el-icon class="card-icon"><StarFilled /></el-icon>
            <h3>专家回答评分</h3>
            <p>为专家回答评分</p>
          </el-card>
        </el-col>
      </template>

      <!-- 众包用户功能卡片 -->
      <template v-if="userRole === 'CROWDSOURCE_USER' || userRole === 'ADMIN'">
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-card class="function-card" @click="navigateTo('crowdsource')">
            <el-icon class="card-icon"><Connection /></el-icon>
            <h3>众包工作台</h3>
            <p>众包任务参与</p>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-card class="function-card" @click="navigateTo('crowdsource-questions')">
            <el-icon class="card-icon"><QuestionFilled /></el-icon>
            <h3>标准问题</h3>
            <p>查看标准问题列表</p>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-card class="function-card" @click="navigateTo('crowdsource-tasks')">
            <el-icon class="card-icon"><List /></el-icon>
            <h3>众包任务</h3>
            <p>参与众包任务</p>
          </el-card>
        </el-col>
      </template>

      <!-- 评测员功能卡片 -->
      <template v-if="isEvaluator">
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-card class="function-card" @click="navigateTo('evaluator')">
            <el-icon class="card-icon"><DataAnalysis /></el-icon>
            <h3>评测工作台</h3>
            <p>大模型回答评测</p>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-card class="function-card" @click="navigateTo('evaluator-batch-evaluation')">
            <el-icon class="card-icon"><Histogram /></el-icon>
            <h3>批次评测</h3>
            <p>评测批次回答</p>
          </el-card>
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<style scoped>
/* 强制覆盖App.vue中的样式 */
:deep(.main-content) {
  margin-left: 0 !important;
}

.home {
  padding: 20px;
}

.welcome-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-content {
  padding: 20px 0;
}

.evaluator-badge {
  margin-top: 10px;
  display: flex;
  align-items: center;
}

.evaluator-badge span {
  margin-left: 10px;
}

.function-row {
  margin-top: 20px;
}

.function-card {
  height: 180px;
  margin-bottom: 20px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: all 0.3s;
}

.function-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.card-icon {
  font-size: 36px;
  margin-bottom: 10px;
  color: var(--primary-color);
}

.function-card h3 {
  margin: 10px 0;
  font-size: 18px;
}

.function-card p {
  color: var(--light-text);
  font-size: 14px;
}
</style>
