<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useContactStore } from '@/store/modules/contact'
import type { Contact } from '@/types/api'

const props = defineProps<{
  contact: Partial<Contact>
  isEdit: boolean
}>()

const emit = defineEmits<{
  (e: 'success'): void
}>()

const contactStore = useContactStore()
const form = ref({
  name: props.contact.name || '',
  phone: props.contact.phone || '',
  email: props.contact.email || '',
  note: props.contact.note || '',
  tags: props.contact.tags || []
})

const loading = ref(false)
const tagInput = ref('')

const rules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入电话号码', trigger: 'blur' },
    { 
      pattern: /^1[3-9]\d{9}$/, 
      message: '请输入正确的手机号码', 
      trigger: 'blur' 
    }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  try {
    loading.value = true
    if (props.isEdit) {
      await contactStore.updateContact(props.contact.id!, form.value)
      ElMessage.success('更新成功')
    } else {
      await contactStore.createContact(form.value)
      ElMessage.success('创建成功')
    }
    emit('success')
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  } finally {
    loading.value = false
  }
}

const addTag = () => {
  if (!tagInput.value) return
  if (!form.value.tags.includes(tagInput.value)) {
    form.value.tags.push(tagInput.value)
  }
  tagInput.value = ''
}

const removeTag = (tag: string) => {
  const index = form.value.tags.indexOf(tag)
  if (index > -1) {
    form.value.tags.splice(index, 1)
  }
}
</script>

<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    label-width="80px"
    @submit.prevent="handleSubmit"
  >
    <el-form-item label="姓名" prop="name">
      <el-input v-model="form.name" />
    </el-form-item>

    <el-form-item label="电话" prop="phone">
      <el-input v-model="form.phone" />
    </el-form-item>

    <el-form-item label="邮箱" prop="email">
      <el-input v-model="form.email" />
    </el-form-item>

    <el-form-item label="备注">
      <el-input
        v-model="form.note"
        type="textarea"
        :rows="3"
      />
    </el-form-item>

    <el-form-item label="标签">
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
          v-for="tag in form.tags"
          :key="tag"
          closable
          @close="removeTag(tag)"
        >
          {{ tag }}
        </el-tag>
      </div>
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        native-type="submit"
        :loading="loading"
      >
        {{ isEdit ? '保存' : '创建' }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>
.tag-input {
  margin-bottom: 10px;
}

.tag-list {
  .el-tag {
    margin-right: 5px;
    margin-bottom: 5px;
  }
}
</style>