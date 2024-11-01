<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useContactGroupStore } from '@/store/modules/contactGroup'
import type { ContactGroup } from '@/types/api'

const groupStore = useContactGroupStore()
const dialogVisible = ref(false)
const currentGroup = ref<Partial<ContactGroup>>({})
const isEdit = ref(false)

const rules = {
  name: [
    { required: true, message: '请输入分组名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ]
}

const handleAdd = () => {
  isEdit.value = false
  currentGroup.value = {}
  dialogVisible.value = true
}

const handleEdit = (group: ContactGroup) => {
  isEdit.value = true
  currentGroup.value = { ...group }
  dialogVisible.value = true
}

const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这个分组吗？', '提示', {
      type: 'warning'
    })
    await groupStore.deleteGroup(id)
    ElMessage.success('删除成功')
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      await groupStore.updateGroup(currentGroup.value.id!, currentGroup.value)
      ElMessage.success('更新成功')
    } else {
      await groupStore.createGroup(currentGroup.value)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  }
}

onMounted(() => {
  groupStore.fetchGroups()
})
</script>

<template>
  <div class="group-management">
    <div class="header">
      <h3>联系人分组</h3>
      <el-button type="primary" size="small" @click="handleAdd">
        新建分组
      </el-button>
    </div>

    <el-menu
      :default-active="groupStore.currentGroup?.id?.toString()"
      class="group-menu"
    >
      <el-menu-item
        index=""
        @click="groupStore.setCurrentGroup(null)"
      >
        <el-icon><List /></el-icon>
        <span>全部联系人</span>
      </el-menu-item>

      <el-menu-item
        v-for="group in groupStore.groups"
        :key="group.id"
        :index="group.id.toString()"
        @click="groupStore.setCurrentGroup(group)"
      >
        <el-icon><Folder /></el-icon>
        <span>{{ group.name }}</span>
        <span class="count">({{ group.contactCount }})</span>
        
        <template #title>
          <div class="group-item">
            <span>{{ group.name }}</span>
            <div class="actions">
              <el-button
                type="primary"
                link
                @click.stop="handleEdit(group)"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                link
                @click.stop="handleDelete(group.id)"
              >
                删除
              </el-button>
            </div>
          </div>
        </template>
      </el-menu-item>
    </el-menu>

    <!-- 分组表单对话框 -->
    <el-dialog
      :title="isEdit ? '编辑分组' : '新建分组'"
      v-model="dialogVisible"
      width="400px"
    >
      <el-form
        :model="currentGroup"
        :rules="rules"
        label-width="80px"
        @submit.prevent="handleSubmit"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="currentGroup.name" />
        </el-form-item>

        <el-form-item label="描述">
          <el-input
            v-model="currentGroup.description"
            type="textarea"
            :rows="3"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            native-type="submit"
            :loading="groupStore.loading"
          >
            {{ isEdit ? '保存' : '创建' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.group-management {
  border-right: 1px solid #e6e6e6;
  height: 100%;

  .header {
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e6e6e6;

    h3 {
      margin: 0;
    }
  }

  .group-menu {
    border-right: none;

    .group-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;

      .actions {
        display: none;
      }
    }

    .el-menu-item {
      &:hover {
        .actions {
          display: flex;
          gap: 8px;
        }
      }
    }

    .count {
      margin-left: 4px;
      color: #909399;
      font-size: 12px;
    }
  }
}
</style>