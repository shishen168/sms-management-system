<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAdminStore } from '@/store/modules/admin'

const adminStore = useAdminStore()
const currentPage = ref(1)
const pageSize = ref(10)
const searchQuery = ref('')
const statusFilter = ref('')

const fetchUsers = async (page: number = 1) => {
  await adminStore.fetchUsers({
    page,
    pageSize: pageSize.value,
    search: searchQuery.value,
    status: statusFilter.value
  })
}

const handleStatusChange = async (userId: number, status: boolean) => {
  try {
    await ElMessageBox.confirm(
      `确定要${status ? '启用' : '禁用'}该用户吗？`,
      '提示',
      {
        type: 'warning'
      }
    )
    await adminStore.updateUserStatus(userId, status)
    ElMessage.success(`${status ? '启用' : '禁用'}成功`)
    await fetchUsers(currentPage.value)
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '操作失败')
    }
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchUsers(1)
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div class="user-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>用户管理</h2>
        </div>
      </template>

      <div class="toolbar">
        <div class="left">
          <el-input
            v-model="searchQuery"
            placeholder="搜索用户名/邮箱/手机号"
            clearable
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <div class="right">
          <el-select
            v-model="statusFilter"
            placeholder="状态筛选"
            clearable
            @change="handleSearch"
          >
            <el-option label="已启用" value="active" />
            <el-option label="已禁用" value="inactive" />
          </el-select>
        </div>
      </div>

      <el-table
        :data="adminStore.users"
        v-loading="adminStore.loading"
        border
        stripe
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="balance" label="余额" width="120">
          <template #default="{ row }">
            {{ row.balance.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="isActive" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.isActive ? 'success' : 'danger'">
              {{ row.isActive ? '已启用' : '已禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="注册时间" width="180">
          <template #default="{ row }">
            {{ new Date(row.createdAt).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button
                size="small"
                :type="row.isActive ? 'danger' : 'success'"
                @click="handleStatusChange(row.id, !row.isActive)"
              >
                {{ row.isActive ? '禁用' : '启用' }}
              </el-button>
              <el-button
                size="small"
                type="primary"
                @click="$router.push(`/admin/users/${row.id}`)"
              >
                详情
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="adminStore.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="fetchUsers"
          @current-change="fetchUsers"
        />
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.user-management {
  .card-header {
    h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
  }

  .toolbar {
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    gap: 16px;

    .left {
      flex: 1;
      max-width: 300px;
    }
  }

  .pagination {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>