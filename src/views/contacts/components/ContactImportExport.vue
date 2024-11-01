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
  tags: [] as string[],
  skipDuplicates: true,
  updateExisting: false
})

const tagInput = ref('')

const handleFileChange = async (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return

  try {
    loading.value = true
    const file = input.files[0]
    
    // 验证文件大小
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('文件大小不能超过2MB')
    }

    // 验证文件类型
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
    if (!validTypes.includes(file.type)) {
      throw new Error('只支持 CSV 或 Excel 文件格式')
    }

    const result = await contactStore.importContacts(file, importOptions.value)
    
    ElMessage.success(`成功导入 ${result.imported} 条联系人`)
    if (result.failed > 0) {
      ElMessage.warning(`${result.failed} 条联系人导入失败`)
      if (result.errors?.length) {
        console.error('Import errors:', result.errors)
      }
    }
    
    // 清空文件选择
    input.value = ''
  } catch (error: any) {
    ElMessage.error(error.message || '导入失败')
  } finally {
    loading.value = false
  }
}

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
  <div class="contact-import-export">
    <el-tabs>
      <el-tab-pane label="导入联系人">
        <el-form label-width="120px">
          <el-form-item label="选择分组">
            <el-select
              v-model="importOptions.groupId"
              placeholder="选择要导入到的分组"
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

          <el-form-item label="导入选项">
            <el-checkbox v-model="importOptions.skipDuplicates">
              跳过重复联系人
            </el-checkbox>
            <el-checkbox v-model="importOptions.updateExisting">
              更新已存在的联系人
            </el-checkbox>
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
                <div class="upload-tip">
                  <p>支持的文件格式：CSV、Excel (xlsx/xls)</p>
                  <p>文件大小限制：2MB</p>
                  <p>
                    下载
                    <el-link type="primary" href="/templates/contacts_template.xlsx">
                      导入模板
                    </el-link>
                  </p>
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="导出联系人">
        <el-form label-width="120px">
          <el-form-item label="导出范围">
            <el-radio-group v-model="contactStore.exportScope">
              <el-radio label="all">全部联系人</el-radio>
              <el-radio label="filtered">当前筛选结果</el-radio>
              <el-radio label="selected">选中的联系人</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="导出格式">
            <el-radio-group v-model="contactStore.exportFormat">
              <el-radio label="csv">CSV</el-radio>
              <el-radio label="xlsx">Excel</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              :loading="loading"
              @click="handleExport"
            >
              导出联系人
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
.contact-import-export {
  .tag-input {
    margin-bottom: 10px;
  }

  .tag-list {
    .el-tag {
      margin-right: 5px;
      margin-bottom: 5px;
    }
  }

  .upload-tip {
    color: #909399;
    font-size: 12px;
    margin-top: 8px;
    
    p {
      margin: 4px 0;
    }
  }

  :deep(.el-checkbox) {
    margin-right: 20px;
  }
}
</style>