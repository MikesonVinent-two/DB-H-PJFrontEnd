<script setup lang="ts">
import LoginForm from '@/components/LoginForm.vue';
</script>

<template>
  <div class="login-view">
    <div class="login-container">
      <h1>欢迎使用</h1>
      <LoginForm />
      <div class="register-link">
        还没有账号？<router-link to="/register">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.login-container {
  width: 100%;
  max-width: 500px;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-weight: 600;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.register-link a {
  color: #4c84ff;
  text-decoration: none;
  font-weight: 500;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
