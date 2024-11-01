<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/store/modules/auth'

const authStore = useAuthStore()
const loading = ref(false)

const form = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const rules = {
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 8, message: '密码长度不能小于8个字符', trigger: 'blur' },
    { 
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      message: '密码必须包含大小写字母、数字和特殊字符',
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value !== form.value.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const handleSubmit = async () => {
  try {
    loading.value = true
    await authStore.changePassword(form.value.oldPassword, form.value.newPassword)
    ElMessage.success('密码修改成功')
    form.value = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (error: any) {
    ElMessage.error(error.message || '密码修改失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    label-width="100px"
    @submit.prevent="handleSubmit"
  >
    <el-form-item label="当前密码" prop="oldPassword">
      <el-input
        v-model="form.oldPassword"
        type="password"
        show-password
      />
    </el-form-item>

    <el-form-item label="新密码" prop="newPassword">
      <el-input
        v-model="form.newPassword"
        type="password"
        show-password
      />
      <div class="password-tips">
        密码要求：
        <ul>
          <li>长度不少于8个字符</li>
          <li>必须包含大写和小写字母</li>
          <li>必须包含数字</li>
          <li>必须包含特殊字符</li>
        </ul>
      </div>
    </el-form-item>

    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input
        v-model="form.confirmPassword"
        type="password"
        show-password
      />
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        native-type="submit"
        :loading="loading"
      >
        修改密码
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>
.password-tips {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;

  ul {
    margin: 4px 0 0;
    padding-left: 20px;
  }
}
</style>