<script setup lang="ts">
import { ref, reactive } from 'vue';
import { login } from '@/api/user';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const errorMessage = ref('');

const form = reactive({
  username: '',
  password: '',
});

const handleLogin = async () => {
  if (!form.username || !form.password) {
    errorMessage.value = '用户名和密码不能为空';
    return;
  }

  try {
    loading.value = true;
    errorMessage.value = '';

    const response = await login({
      username: form.username,
      password: form.password,
    });

    // 保存token到本地存储
    localStorage.setItem('token', response.token);

    // 跳转到首页或其他页面
    router.push('/');
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || '登录失败，请检查用户名和密码';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="login-form">
    <h2>用户登录</h2>

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
      <label for="password">密码</label>
      <input
        id="password"
        v-model="form.password"
        type="password"
        placeholder="请输入密码"
        :disabled="loading"
      />
    </div>

    <div class="form-actions">
      <button
        @click="handleLogin"
        :disabled="loading"
        class="login-button"
      >
        {{ loading ? '登录中...' : '登录' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.login-form {
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

.login-button {
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

.login-button:hover {
  background-color: #3a70e3;
}

.login-button:disabled {
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
