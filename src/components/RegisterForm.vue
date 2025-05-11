<script setup lang="ts">
import { ref, reactive } from 'vue';
import { register } from '@/api/user';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const errorMessage = ref('');

const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
});

const handleRegister = async () => {
  // 表单验证
  if (!form.username || !form.password || !form.confirmPassword || !form.email) {
    errorMessage.value = '所有字段都是必填的';
    return;
  }

  if (form.password !== form.confirmPassword) {
    errorMessage.value = '两次输入的密码不一致';
    return;
  }

  // 简单的邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    errorMessage.value = '请输入有效的邮箱地址';
    return;
  }

  try {
    loading.value = true;
    errorMessage.value = '';

    const response = await register({
      username: form.username,
      password: form.password,
      email: form.email,
    });

    // 保存token到本地存储
    localStorage.setItem('token', response.token);

    // 注册成功后跳转到首页
    router.push('/');
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || '注册失败，请稍后再试';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="register-form">
    <h2>用户注册</h2>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <div class="form-group">
      <label for="username">用户名</label>
      <input
        id="username"
        v-model="form.username"
        type="text"
        placeholder="请输入用户名"
        :disabled="loading"
      />
    </div>

    <div class="form-group">
      <label for="email">邮箱</label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        placeholder="请输入邮箱"
        :disabled="loading"
      />
    </div>

    <div class="form-group">
      <label for="password">密码</label>
      <input
        id="password"
        v-model="form.password"
        type="password"
        placeholder="请输入密码"
        :disabled="loading"
      />
    </div>

    <div class="form-group">
      <label for="confirmPassword">确认密码</label>
      <input
        id="confirmPassword"
        v-model="form.confirmPassword"
        type="password"
        placeholder="请再次输入密码"
        :disabled="loading"
      />
    </div>

    <div class="form-actions">
      <button
        @click="handleRegister"
        :disabled="loading"
        class="register-button"
      >
        {{ loading ? '注册中...' : '注册' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.register-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

input:focus {
  outline: none;
  border-color: #4c84ff;
  box-shadow: 0 0 0 2px rgba(76, 132, 255, 0.2);
}

.form-actions {
  margin-top: 20px;
}

.register-button {
  width: 100%;
  padding: 12px;
  background-color: #4c84ff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.register-button:hover {
  background-color: #3a70e3;
}

.register-button:disabled {
  background-color: #a0b7e9;
  cursor: not-allowed;
}

.error-message {
  padding: 10px;
  background-color: #ffebee;
  color: #d32f2f;
  border-radius: 4px;
  margin-bottom: 15px;
  text-align: center;
}
</style>
