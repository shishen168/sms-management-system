<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useSmsStore } from '@/store/modules/sms'

const smsStore = useSmsStore()
const currentPage = ref(1)
const pageSize = ref(10)
const statusFilter = ref('')

const fetchRecords = async (page: number) => {
  try {
    await smsStore.fetchRecords({
      page,
      pageSize: pageSize.value,
      status: statusFilter.value || undefined
    })
  } catch (error: any) {
    ElMessage.error(error.message || '获取记录失败')
  }
}

const handleResend = async (messageId: string) => {
  try {
    await smsStore.resend(messageId)
    ElMessage.success('重新发送成功')
  } catch (error: any) {
    ElMessage.error(error.message || '重新发送失败')
  }
}

const formatStatus = (status: string) => {
  const statusMap: Record<string, { type: string; label: string }> = {
    'pending': { type: 'warning', label: '发送中' },
    'sent': { type: 'success', label: '发送成功' },
    'failed': { type: 'danger', label: '发送失败' }
  }
  return statusMap[status] || { type: 'info', label: status }
}

onMounted(() => {
  fetchRecords(1)
})
</script>

<template>
  <div class="record-list">
    <div class="toolbar">
      <el-select
        v-model="statusFilter"
        placeholder="状态筛选"
        clearable
        @change="() => fetchRecords(1)"
      >
        <el-option label="发送中" value="pending" />
        <el-option label="发送成功" value="sent" />
        <el-option label="发送失败" value="failed" />
      </el-select>
    </div>

    <el-table
      :data="smsStore.records"
      v-loading="smsStore.loading"
      border
      stripe
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="phone" label="手机号" width="120" />
      <el-table-column prop="content" label="短信内容" show-overflow-tooltip />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="formatStatus(row.status).type">
            {{ formatStatus(row.status).label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="发送时间" width="180">
        <template #default="{ row }">
          {{ new Date(row.createdAt).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="{ row }">
          <el-button
            v-if="row.status === 'failed'"
            size="small"
            type="primary"
            @click="handleResend(row.id)"
          >
            重新发送
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="smsStore.total"
        layout="total, prev, pager, next"
        @current-change="fetchRecords"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.record-list {
  .toolbar {
    margin-bottom: 16px;
  }

  .pagination {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>