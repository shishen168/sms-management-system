<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useSmsStore } from '@/store/modules/sms'

const smsStore = useSmsStore()
const currentPage = ref(1)
const pageSize = ref(10)

const fetchRecords = async (page: number) => {
  currentPage.value = page
  await smsStore.fetchRecords(page)
}

const formatStatus = (status: string) => {
  const statusMap: Record<string, { type: string; label: string }> = {
    'pending': { type: 'warning', label: '发送中' },
    'success': { type: 'success', label: '发送成功' },
    'failed': { type: 'danger', label: '发送失败' }
  }
  return statusMap[status] || { type: 'info', label: status }
}

onMounted(() => {
  fetchRecords(1)
})
</script>

<template>
  <div class="records-container">
    <el-card>
      <template #header>
        <h2>短信发送记录</h2>
      </template>

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
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="smsStore.totalRecords"
          layout="total, prev, pager, next"
          @current-change="fetchRecords"
        />
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.records-container {
  padding: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>