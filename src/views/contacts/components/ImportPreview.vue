<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Contact } from '@/types/api'

const props = defineProps<{
  data: Array<{
    row: number
    contact: Partial<Contact>
    errors?: string[]
  }>
}>()

const searchQuery = ref('')

const filteredData = computed(() => {
  if (!searchQuery.value) return props.data
  
  const query = searchQuery.value.toLowerCase()
  return props.data.filter(item => 
    item.contact.name?.toLowerCase().includes(query) ||
    item.contact.phone?.includes(query)
  )
})

const validCount = computed(() => 
  props.data.filter(item => !item.errors?.length).length
)

const invalidCount = computed(() => 
  props.data.filter(item => item.errors?.length).length
)
</script>

<template>
  <div class="import-preview">
    <div class="preview-header">
      <el-input
        v-model="searchQuery"
        placeholder="搜索预览数据"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <div class="stats">
        <el-tag type="success">有效: {{ validCount }}</el-tag>
        <el-tag type="danger" v-if="invalidCount > 0">
          无效: {{ invalidCount }}
        </el-tag>
      </div>
    </div>

    <el-table
      :data="filteredData"
      border
      stripe
      height="400"
    >
      <el-table-column prop="row" label="行号" width="80" />
      <el-table-column label="姓名">
        <template #default="{ row }">
          <span :class="{ error: row.errors?.includes('name') }">
            {{ row.contact.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="电话">
        <template #default="{ row }">
          <span :class="{ error: row.errors?.includes('phone') }">
            {{ row.contact.phone }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱">
        <template #default="{ row }">
          <span :class="{ error: row.errors?.includes('email') }">
            {{ row.contact.email }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="row.errors?.length ? 'danger' : 'success'">
            {{ row.errors?.length ? '无效' : '有效' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="错误信息" min-width="200">
        <template #default="{ row }">
          <template v-if="row.errors?.length">
            <el-tooltip
              v-for="error in row.errors"
              :key="error"
              :content="error"
              placement="top"
            >
              <el-tag type="danger" size="small" class="error-tag">
                {{ error }}
              </el-tag>
            </el-tooltip>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="scss" scoped>
.import-preview {
  .preview-header {
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;

    .el-input {
      width: 300px;
    }

    .stats {
      display: flex;
      gap: 8px;
    }
  }

  .error {
    color: #f56c6c;
  }

  .error-tag {
    margin-right: 4px;
    margin-bottom: 4px;
  }
}
</style>