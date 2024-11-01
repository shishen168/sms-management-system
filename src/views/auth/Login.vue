<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'
import type { LoginRequest } from '@/types/api'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

const loginForm = ref<LoginRequest>({
  username: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
    await authStore.login(loginForm.value)
    ElMessage.success('登录成功')
    router.push('/')
  } catch (err: any) {
    error.value = err.message || '登录失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h2>Login</h2>
      </template>

      <el-form @submit.prevent="handleLogin">
        <el-alert
          v-if="error"
          :title="error"
          type="error"
          show-icon
          class="mb-4"
        />

        <el-form-item label="Username">
          <el-input
            v-model="loginForm.username"
            placeholder="Enter your username"
          />
        </el-form-item>

        <el-form-item label="Password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="Enter your password"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            native-type="submit"
            :loading="loading"
            block
          >
            Login
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.login-card {
  width: 100%;
  max-width: 400px;
}

.mb-4 {
  margin-bottom: 1rem;
}
</style>
