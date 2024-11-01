<script setup lang="ts">
import { ref, computed } from 'vue'
import { useContactStore } from '@/store/modules/contact'
import { useContactGroupStore } from '@/store/modules/contactGroup'
import type { Contact } from '@/types/api'

const props = defineProps<{
  selected: Contact[]
  multiple?: boolean
}>()

const emit = defineEmits<{
  (e: 'confirm', contacts: Contact[]): void
  (e: 'cancel'): void
}>()

const contactStore = useContactStore()
const groupStore = useContactGroupStore()
const searchQuery = ref('')
const selectedContacts = ref<Contact[]>(props.selected || [])
const currentGroupId = ref<number | null>(null)

const filteredContacts = computed(() => {
  let contacts = contactStore.contacts
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    contacts = contacts.filter(contact => 
      contact.name.toLowerCase().includes(query) ||
      contact.phone.includes(query)
    )
  }
  return contacts
})

const handleSelect = (contact: Contact) => {
  if (!props.multiple) {
    selectedContacts.value = [contact]
    handleConfirm()
    return
  }

  const index = selectedContacts.value.findIndex(c => c.id === contact.id)
  if (index === -1) {
    selectedContacts.value.push(contact)
  } else {
    selectedContacts.value.splice(index, 1)
  }
}

const handleGroupChange = (groupId: number | null) => {
  currentGroupId.value = groupId
  contactStore.setSelectedGroupId(groupId)
}

const handleConfirm = () => {
  emit('confirm', selectedContacts.value)
}

const handleCancel = () => {
  emit('cancel')
}

// 初始化加载联系人和分组
onMounted(async () => {
  await Promise.all([
    contactStore.fetchContacts(),
    groupStore.fetchGroups()
  ])
})
</script>

<template>
  <div class="contact-selector">
    <div class="selector-header">
      <el-input
        v-model="searchQuery"
        placeholder="搜索联系人"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <el-select
        v-model="currentGroupId"
        placeholder="选择分组"
        clearable
        @change="handleGroupChange"
      >
        <el-option
          v-for="group in groupStore.groups"
          :key="group.id"
          :label="`${group.name} (${group.contactCount})`"
          :value="group.id"
        />
      </el-select>
    </div>

    <div class="selector-body">
      <el-scrollbar height="400px">
        <el-checkbox-group
          v-if="multiple"
          v-model="selectedContacts"
          class="contact-list"
        >
          <el-checkbox
            v-for="contact in filteredContacts"
            :key="contact.id"
            :label="contact"
            class="contact-item"
          >
            <div class="contact-info">
              <span class="name">{{ contact.name }}</span>
              <span class="phone">{{ contact.phone }}</span>
            </div>
          </el-checkbox>
        </el-checkbox-group>

        <div v-else class="contact-list">
          <div
            v-for="contact in filteredContacts"
            :key="contact.id"
            class="contact-item"
            :class="{ active: selectedContacts.some(c => c.id === contact.id) }"
            @click="handleSelect(contact)"
          >
            <div class="contact-info">
              <span class="name">{{ contact.name }}</span>
              <span class="phone">{{ contact.phone }}</span>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <div class="selector-footer">
      <div class="selected-count" v-if="multiple">
        已选择: {{ selectedContacts.length }} 个联系人
      </div>
      <div class="actions">
        <el-button @click="handleCancel">取消</el-button>
        <el-button
          type="primary"
          @click="handleConfirm"
          :disabled="selectedContacts.length === 0"
        >
          确定
        </el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.contact-selector {
  display: flex;
  flex-direction: column;
  height: 500px;

  .selector-header {
    padding: 16px;
    display: flex;
    gap: 16px;

    .el-input {
      flex: 1;
    }
  }

  .selector-body {
    flex: 1;
    border-top: 1px solid #e4e7ed;
    border-bottom: 1px solid #e4e7ed;

    .contact-list {
      padding: 8px;

      .contact-item {
        padding: 8px;
        border-radius: 4px;
        cursor: pointer;

        &:hover {
          background-color: #f5f7fa;
        }

        &.active {
          background-color: #ecf5ff;
        }

        .contact-info {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .name {
            font-weight: 500;
          }

          .phone {
            color: #909399;
          }
        }
      }
    }
  }

  .selector-footer {
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .selected-count {
      color: #606266;
    }

    .actions {
      display: flex;
      gap: 8px;
    }
  }
}
</style>