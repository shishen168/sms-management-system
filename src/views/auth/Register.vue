<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'
import type { RegisterRequest } from '@/types/api'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

const form = ref<RegisterRequest>({
  username: '',
  password: '',
  email: '',
  phone: '',
  captcha: ''
})

const captchaImage = ref('')
const loading = ref(false)
const error = ref('')

const refreshCaptcha = async () => {
  try {
    const response = await authStore.getCaptcha()
    captchaImage.value = response
  } catch (err) {
    ElMessage.error('获取验证码失败，请点击刷新')
  }
}

const handleRegister = async () => {
  try {
    loading.value = true
    error.value = ''
    await authStore.register(form.value)
    ElMessage.success('注册成功')
    router.push('/login')
  } catch (err: any) {
    error.value = err.message || '注册失败'
    refreshCaptcha()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  refreshCaptcha()
})
</script>

<template>
  <div class="register-container">
    <el-card class="register-card">
      <template #header>
        <h2>用户注册</h2>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        label-position="top"
        @submit.prevent="handleRegister"
      >
        <el-alert
          v-if="error"
          :title="error"
          type="error"
          show-icon
          class="mb-4"
        />

        <el-form-item label="用户名" required>
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
          />
        </el-form-item>

        <el-form-item label="密码" required>
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>

        <el-form-item label="邮箱" required>
          <el-input
            v-model="form.email"
            type="email"
            placeholder="请输入邮箱"
          />
        </el-form-item>

        <el-form-item label="手机号" required>
          <el-input
            v-model="form.phone"
            placeholder="请输入手机号"
          />
        </el-form-item>

        <el-form-item label="验证码" required>
          <div class="captcha-container">
            <el-input
              v-model="form.captcha"
              placeholder="请输入验证码"
              class="captcha-input"
            />
            <div class="captcha-image" @click="refreshCaptcha">
              <img 
                v-if="captchaImage" 
                :src="captchaImage" 
                alt="验证码"
              />
              <el-icon v-else><Loading /></el-icon>
            </div>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            native-type="submit"
            :loading="loading"
            class="submit-btn"
          >
            注册
          </el-button>
        </el-form-item>

        <div class="text-center">
          已有账号？
          <router-link to="/login">立即登录</router-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
  padding: 20px;

  .register-card {
    width: 100%;
    max-width: 400px;

    .mb-4 {
      margin-bottom: 1rem;
    }

    .captcha-container {
      display: flex;
      gap: 12px;

      .captcha-input {
        flex: 1;
      }

      .captcha-image {
        width: 120px;
        height: 40px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        cursor: pointer;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f7fa;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }

    .submit-btn {
      width: 100%;
      margin-top: 1rem;
    }

    .text-center {
      text-align: center;
      margin-top: 1rem;
    }
  }
}
</style>