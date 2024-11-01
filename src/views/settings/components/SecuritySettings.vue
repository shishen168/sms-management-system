<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/store/modules/auth'

const authStore = useAuthStore()
const loading = ref(false)

const handleLogoutAllDevices = async () => {
  try {
    await ElMessageBox.confirm(
      '此操作将会使所有设备退出登录，是否继续？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    loading.value = true
    // TODO: 实现登出所有设备的API
    ElMessage.success('已成功登出所有设备')
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '操作失败')
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="security-settings">
    <el-card class="setting-card">
      <template #header>
        <div class="card-header">
          <span>登录设备管理</span>
          <el-button
            type="danger"
            :loading="loading"
            @click="handleLogoutAllDevices"
          >
            登出所有设备
          </el-button>
        </div>
      </template>

      <div class="setting-content">
        <p class="tip">
          您可以查看当前登录的设备，并可以选择登出所有设备。
          这在发现账号异常时特别有用。
        </p>
      </div>
    </el-card>

    <el-card class="setting-card">
      <template #header>
        <div class="card-header">
          <span>账号安全</span>
        </div>
      </template>

      <div class="setting-content">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="手机验证">
            <el-tag type="success">已绑定</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="邮箱验证">
            <el-tag type="success">已绑定</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="最后登录时间">
            {{ new Date().toLocaleString() }}
          </el-descriptions-item>
          <el-descriptions-item label="最后登录IP">
            127.0.0.1
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.security-settings {
  .setting-card {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .setting-content {
      .tip {
        color: #909399;
        margin: 0;
      }
    }
  }
}
</style>