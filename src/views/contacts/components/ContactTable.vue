<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useContactStore } from '@/store/modules/contact'
import type { Contact } from '@/types/api'

const contactStore = useContactStore()
const dialogVisible = ref(false)
const currentContact = ref<Partial<Contact> | null>(null)

const handleEdit = (contact: Contact) => {
  currentContact.value = { ...contact }
  dialogVisible.value = true
}

const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这个联系人吗？', '提示', {
      type: 'warning'
    })
    await contactStore.deleteContact(id)
    ElMessage.success('删除成功')
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

const handleToggleStar = async (id: number) => {
  try {
    await contactStore.toggleStar(id)
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  }
}

const handleSelectionChange = (selection: Contact[]) => {
  contactStore.selectedContacts = selection.map(item => item.id)
}

const handleBatchDelete = async () => {
  if (!contactStore.selectedContacts.length) {
    ElMessage.warning('请选择要删除的联系人')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${contactStore.selectedContacts.length} 个联系人吗？`,
      '提示',
      { type: 'warning' }
    )
    await contactStore.batchDelete()
    ElMessage.success('批量删除成功')
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}
</script>

<template>
  <div class="contact-table">
    <div v-if="contactStore.hasSelected" class="batch-actions">
      <el-button type="danger" @click="handleBatchDelete">
        删除选中 ({{ contactStore.selectedContacts.length }})
      </el-button>
    </div>

    <el-table
      :data="contactStore.contacts"
      v-loading="contactStore.loading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      
      <el-table-column width="50">
        <template #default="{ row }">
          <el-icon
            :class="['star-icon', { active: row.isStarred }]"
            @click="handleToggleStar(row.id)"
          >
            <Star />
          </el-icon>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="phone" label="电话" />
      <el-table-column prop="email" label="邮箱" />
      
      <el-table-column prop="tags" label="标签">
        <template #default="{ row }">
          <el-tag
            v-for="tag in row.tags"
            :key="tag"
            size="small"
            class="mx-1"
          >
            {{ tag }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button-group>
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(row.id)"
            >
              删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="contactStore.currentPage"
        :page-size="contactStore.pageSize"
        :total="contactStore.total"
        layout="total, prev, pager, next"
        @current-change="contactStore.fetchContacts"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.contact-table {
  .batch-actions {
    margin-bottom: 16px;
  }

  .star-icon {
    cursor: pointer;
    color: #909399;

    &.active {
      color: #f7ba2a;
    }
  }

  .pagination {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }

  .el-tag {
    margin-right: 4px;
  }
}
</style>