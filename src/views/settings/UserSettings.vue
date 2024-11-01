<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/store/modules/auth'
import ProfileForm from './components/ProfileForm.vue'
import PasswordForm from './components/PasswordForm.vue'
import SecuritySettings from './components/SecuritySettings.vue'

const activeTab = ref('profile')
</script>

<template>
  <div class="settings-container">
    <el-card>
      <template #header>
        <h2>用户设置</h2>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="个人信息" name="profile">
          <ProfileForm />
        </el-tab-pane>
        
        <el-tab-pane label="修改密码" name="password">
          <PasswordForm />
        </el-tab-pane>

        <el-tab-pane label="安全设置" name="security">
          <SecuritySettings />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.settings-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}
</style>