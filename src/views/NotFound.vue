<content><script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="not-found">
    <el-result
      icon="warning"
      title="404"
      sub-title="抱歉，您访问的页面不存在"
    >
      <template #extra>
        <el-button type="primary" @click="goHome">
          返回首页
        </el-button>
        <el-button @click="goBack">
          返回上一页
        </el-button>
      </template>
    </el-result>
  </div>
</template>

<style lang="scss" scoped>
.not-found {
  height: calc(100vh - 60px);
  display: flex;
  justify-content: center;
  align-items: center;
  
  .el-result {
    padding: 48px 32px;
    
    :deep(.el-result__icon) {
      width: 120px;
      height: 120px;
    }
    
    :deep(.el-result__title) {
      font-size: 48px;
      margin-top: 20px;
    }
    
    :deep(.el-result__subtitle) {
      font-size: 20px;
      margin-top: 10px;
    }
    
    :deep(.el-result__extra) {
      margin-top: 30px;
    }
  }
}
</style></content>