<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useSmsTemplateStore } from '@/store/modules/smsTemplate'
import TemplateForm from './TemplateForm.vue'
import type { SmsTemplate } from '@/types/api'

const templateStore = useSmsTemplateStore()
const dialogVisible = ref(false)
const currentTemplate = ref<Partial<SmsTemplate> | null>(null)
const typeFilter = ref('')

const fetchTemplates = async (page: number = 1) => {
  await templateStore.fetchTemplates({
    page,
    pageSize: templateStore.pageSize,
    type: typeFilter.value || undefined
  })
}

const handleCreate = () => {
  currentTemplate.value = null
  dialogVisible.value = true
}

const handleEdit = (template: SmsTemplate) => {
  currentTemplate.value = { ...template }
  dialogVisible.value = true
}

const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这个模板吗？', '提示', {
      type: 'warning'
    })
    await templateStore.deleteTemplate(id)
    ElMessage.success('删除成功')
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

const handleSuccess = () => {
  dialogVisible.value = false
  fetchTemplates(templateStore.currentPage)
}

onMounted(() => {
  fetchTemplates()
})
</script>

<template>
  <div class="template-list">
    <div class="toolbar">
      <el-select
        v-model="typeFilter"
        placeholder="类型筛选"
        clearable
        @change="() => fetchTemplates(1)"
      >
        <el-option label="验证码" value="verification" />
        <el-option label="通知" value="notification" />
        <el-option label="营销" value="marketing" />
      </el-select>

      <el-button type="primary" @click="handleCreate">
        新建模板
      </el-button>
    </div>

    <el-table
      :data="templateStore.templates"
      v-loading="templateStore.loading"
      border
      stripe
    >
      <el-table-column prop="name" label="模板名称" min-width="150" />
      <el-table-column prop="content" label="模板内容" min-width="300" show-overflow-tooltip />
      <el-table-column prop="type" label="类型" width="100">
        <template #default="{ row }">
          <el-tag :type="row.type === 'verification' ? 'primary' : 'info'">
            {{ row.type === 'verification' ? '验证码' : 
               row.type === 'notification' ? '通知' : '营销' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180">
        <template #default="{ row }">
          {{ new Date(row.createdAt).toLocaleString() }}
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
        v-model:current-page="templateStore.currentPage"
        :page-size="templateStore.pageSize"
        :total="templateStore.total"
        layout="total, prev, pager, next"
        @current-change="fetchTemplates"
      />
    </div>

    <el-dialog
      :title="currentTemplate ? '编辑模板' : '新建模板'"
      v-model="dialogVisible"
      width="600px"
    >
      <TemplateForm
        :template="currentTemplate"
        @success="handleSuccess"
        @cancel="dialogVisible = false"
      />
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.template-list {
  .toolbar {
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pagination {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>