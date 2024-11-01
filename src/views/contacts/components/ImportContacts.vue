<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useContactStore } from '@/store/modules/contact'
import { useContactGroupStore } from '@/store/modules/contactGroup'

const contactStore = useContactStore()
const groupStore = useContactGroupStore()
const loading = ref(false)

const importOptions = ref({
  groupId: undefined as number | undefined,
  tags: [] as string[]
})

const tagInput = ref('')

const handleFileChange = async (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return

  try {
    loading.value = true
    const file = input.files[0]
    const result = await contactStore.importContacts(file, importOptions.value)
    
    ElMessage.success(`导入成功: ${result.success} 条记录`)
    if (result.failed > 0) {
      ElMessage.warning(`导入失败: ${result.failed} 条记录`)
    }
    
    // 清空文件选择
    input.value = ''
  } catch (error: any) {
    ElMessage.error(error.message || '导入失败')
  } finally {
    loading.value = false
  }
}

const addTag = () => {
  if (!tagInput.value) return
  if (!importOptions.value.tags.includes(tagInput.value)) {
    importOptions.value.tags.push(tagInput.value)
  }
  tagInput.value = ''
}

const removeTag = (tag: string) => {
  const index = importOptions.value.tags.indexOf(tag)
  if (index > -1) {
    importOptions.value.tags.splice(index, 1)
  }
}
</script>

<template>
  <div class="import-contacts">
    <el-form label-width="100px">
      <el-form-item label="选择分组">
        <el-select
          v-model="importOptions.groupId"
          placeholder="选择要导入的分组"
          clearable
        >
          <el-option
            v-for="group in groupStore.groups"
            :key="group.id"
            :label="group.name"
            :value="group.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="添加标签">
        <div class="tag-input">
          <el-input
            v-model="tagInput"
            placeholder="输入标签后回车"
            @keyup.enter="addTag"
          >
            <template #append>
              <el-button @click="addTag">添加</el-button>
            </template>
          </el-input>
        </div>
        <div class="tag-list">
          <el-tag
            v-for="tag in importOptions.tags"
            :key="tag"
            closable
            @close="removeTag(tag)"
          >
            {{ tag }}
          </el-tag>
        </div>
      </el-form-item>

      <el-form-item label="选择文件">
        <el-upload
          action=""
          :auto-upload="false"
          :show-file-list="false"
          accept=".csv,.xlsx,.xls"
          :on-change="handleFileChange"
        >
          <el-button type="primary" :loading="loading">
            选择文件并导入
          </el-button>
          <template #tip>
            <div class="el-upload__tip">
              支持 .csv, .xlsx, .xls 格式的文件，文件大小不超过 2MB
            </div>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.import-contacts {
  .tag-input {
    margin-bottom: 10px;
  }

  .tag-list {
    .el-tag {
      margin-right: 5px;
      margin-bottom: 5px;
    }
  }

  .el-upload__tip {
    color: #909399;
    font-size: 12px;
    margin-top: 4px;
  }
}
</style>