<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useContactStore } from '@/store/modules/contact'

const contactStore = useContactStore()
const loading = ref(false)

const handleExport = async () => {
  try {
    loading.value = true
    await contactStore.exportContacts()
    ElMessage.success('导出成功')
  } catch (error: any) {
    ElMessage.error(error.message || '导出失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="export-contacts">
    <el-button
      type="primary"
      :loading="loading"
      @click="handleExport"
    >
      导出联系人
    </el-button>
    <div class="export-tip">
      导出的文件包含所有筛选条件下的联系人数据
    </div>
  </div>
</template>

<style lang="scss" scoped>
.export-contacts {
  .export-tip {
    color: #909399;
    font-size: 12px;
    margin-top: 8px;
  }
}
</style>