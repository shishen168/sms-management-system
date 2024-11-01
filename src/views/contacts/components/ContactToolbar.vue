<script setup lang="ts">
import { ref } from 'vue'
import { useContactStore } from '@/store/modules/contact'
import ImportContacts from './ImportContacts.vue'
import ExportContacts from './ExportContacts.vue'

const contactStore = useContactStore()
const importDialogVisible = ref(false)

const handleSearch = (value: string) => {
  contactStore.setSearchQuery(value)
}
</script>

<template>
  <div class="contact-toolbar">
    <div class="left">
      <el-input
        v-model="contactStore.searchQuery"
        placeholder="搜索联系人"
        clearable
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <div class="right">
      <el-button
        type="primary"
        @click="importDialogVisible = true"
      >
        导入联系人
      </el-button>
      <ExportContacts />
    </div>

    <el-dialog
      title="导入联系人"
      v-model="importDialogVisible"
      width="500px"
    >
      <ImportContacts @success="importDialogVisible = false" />
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.contact-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  .left {
    flex: 1;
    margin-right: 16px;
  }

  .right {
    display: flex;
    gap: 8px;
  }
}
</style>