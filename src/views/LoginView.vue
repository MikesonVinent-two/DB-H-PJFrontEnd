<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { User, Lock } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

// 表单引用
const loginFormRef = ref<FormInstance>()

// 登录表单数据
const loginForm = ref({
  username: '',
  password: '',
})

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, max: 50, message: '用户名长度应在4-50个字符之间', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 100, message: '密码长度应在6-100个字符之间', trigger: 'blur' },
  ],
}

// 状态
const isLoading = ref(false)
const error = ref<string | null>(null)

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    // 表单验证
    await loginFormRef.value.validate()

    isLoading.value = true
    error.value = null

    // 调用登录接口
    const success = await userStore.loginUser({
      username: loginForm.value.username,
      password: loginForm.value.password,
    })

    if (success) {
      // 登录成功，跳转到首页
      router.push('/')
    }
  } catch (err: any) {
    error.value = err.message || '登录失败，请重试'
  } finally {
    isLoading.value = false
  }
}

// 跳转到注册页面
const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-header">
        <img src="@/assets/logo.svg" alt="Logo" class="logo" />
        <h2>欢迎使用 AI 问答系统</h2>
        <p class="subtitle">登录您的账号以开始对话</p>
      </div>

      <el-card class="login-card" shadow="never">
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          label-position="top"
          class="login-form"
          @submit.prevent="handleLogin"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              :prefix-icon="User"
              :disabled="isLoading"
            />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              show-password
              :prefix-icon="Lock"
              :disabled="isLoading"
            />
          </el-form-item>

          <div class="form-footer">
            <el-button
              type="primary"
              native-type="submit"
              :loading="isLoading"
              class="submit-button"
            >
              {{ isLoading ? '登录中...' : '登录' }}
            </el-button>

            <div class="additional-links">
              <el-link type="primary" :underline="false" @click="goToRegister">
                还没有账号？立即注册
              </el-link>
            </div>
          </div>
        </el-form>

        <!-- 错误提示 -->
        <el-alert v-if="error" :title="error" type="error" show-icon closable class="error-alert" />
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: calc(100vh - 60px);
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #e6f7ff 0%, #f0f5ff 100%);
  padding: 20px;
}

.login-content {
  width: 100%;
  max-width: 440px;
}

.login-header {
  text-align: center;
  margin-bottom: 24px;
}

.logo {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
}

.login-header h2 {
  margin: 0 0 8px;
  color: #1f1f1f;
  font-size: 28px;
  font-weight: 600;
}

.subtitle {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.login-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.login-form {
  padding: 24px 0 0;
}

:deep(.el-form-item__label) {
  padding-bottom: 8px;
  font-weight: 500;
}

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #a3a6ad inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff inset !important;
}

.form-footer {
  margin-top: 32px;
}

.submit-button {
  width: 100%;
  height: 40px;
  font-size: 16px;
  font-weight: 500;
  background: linear-gradient(135deg, #1890ff 0%, #1d39c4 100%);
  border: none;
  margin-bottom: 16px;
}

.submit-button:hover {
  opacity: 0.9;
}

.additional-links {
  text-align: center;
}

:deep(.el-link) {
  font-size: 14px;
}

.error-alert {
  margin-top: 16px;
}

@media (max-width: 480px) {
  .login-content {
    max-width: 100%;
  }

  .login-header h2 {
    font-size: 24px;
  }

  .subtitle {
    font-size: 14px;
  }
}
</style>
