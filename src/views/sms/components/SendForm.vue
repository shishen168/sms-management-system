<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useSmsStore } from '@/store/modules/sms'
import { useSmsTemplateStore } from '@/store/modules/smsTemplate'
import ContactSelector from '@/views/contacts/components/ContactSelector.vue'
import type { Contact } from '@/types/api'

const props = defineProps<{
  mode: 'single' | 'batch'
}>()

const emit = defineEmits<{
  (e: 'success'): void
}>()

const smsStore = useSmsStore()
const templateStore = useSmsTemplateStore()
const loading = ref(false)
const showContactSelector = ref(false)
const selectedContacts = ref<Contact[]>([])

const form = ref({
  phone: '',
  countryCode: '+86',
  content: '',
  templateId: undefined as number | undefined,
  variables: {} as Record<string, string>
})

const batchForm = ref({
  phones: [] as string[],
  content: '',
  templateId: undefined as number | undefined,
  variables: {} as Record<string, string>
})

// 加载短信模板
onMounted(async () => {
  await templateStore.fetchTemplates({
    page: 1,
    pageSize: 100
  })
})

const handleSendSingle = async () => {
  try {
    loading.value = true
    await smsStore.sendSingle({
      phone: form.value.phone,
      countryCode: form.value.countryCode,
      content: form.value.content,
      type: 'single'
    })
    ElMessage.success('发送成功')
    resetForm()
    emit('success')
  } catch (error: any) {
    ElMessage.error(error.message || '发送失败')
  } finally {
    loading.value = false
  }
}

const handleSendBatch = async () => {
  if (batchForm.value.phones.length === 0) {
    ElMessage.warning('请选择至少一个联系人')
    return
  }

  try {
    loading.value = true
    await smsStore.sendBatch({
      phones: batchForm.value.phones,
      content: batchForm.value.content
    })
    ElMessage.success('批量发送成功')
    resetForm()
    emit('success')
  } catch (error: any) {
    ElMessage.error(error.message || '发送失败')
  } finally {
    loading.value = false
  }
}

const handleSelectContacts = (contacts: Contact[]) => {
  selectedContacts.value = contacts
  batchForm.value.phones = contacts.map(c => c.phone)
  showContactSelector.value = false
}

const handleTemplateSelect = async (templateId: number) => {
  if (!templateId) {
    form.value.content = ''
    form.value.variables = {}
    return
  }

  const template = await templateStore.fetchTemplateById(templateId)
  if (template) {
    form.value.content = template.content
    // 提取模板变量
    const variables: Record<string, string> = {}
    const matches = template.content.match(/\${(\w+)}/g) || []
    matches.forEach(match => {
      const variable = match.slice(2, -1)
      variables[variable] = ''
    })
    form.value.variables = variables
  }
}

const handlePreview = () => {
  let content = props.mode === 'single' ? form.value.content : batchForm.value.content
  Object.entries(form.value.variables).forEach(([key, value]) => {
    content = content.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), value || `[${key}]`)
  })
  return content
}

const resetForm = () => {
  if (props.mode === 'single') {
    form.value = {
      phone: '',
      countryCode: '+86',
      content: '',
      templateId: undefined,
      variables: {}
    }
  } else {
    batchForm.value = {
      phones: [],
      content: '',
      templateId: undefined,
      variables: {}
    }
    selectedContacts.value = []
  }
}

const rules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入短信内容', trigger: 'blur' },
    { min: 1, max: 500, message: '短信内容长度在1-500个字符之间', trigger: 'blur' }
  ]
}
</script>

<template>
  <div class="send-form">
    <!-- 单条发送表单 -->
    <el-form
      v-if="mode === 'single'"
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="手机号" prop="phone">
        <div class="phone-input">
          <el-select v-model="form.countryCode" class="country-code">
            <el-option label="中国 +86" value="+86" />
            <el-option label="香港 +852" value="+852" />
            <el-option label="澳门 +853" value="+853" />
            <el-option label="台湾 +886" value="+886" />
          </el-select>
          <el-input 
            v-model="form.phone"
            placeholder="请输入手机号"
          />
        </div>
      </el-form-item>

      <el-form-item label="短信模板">
        <el-select
          v-model="form.templateId"
          placeholder="选择短信模板"
          clearable
          @change="handleTemplateSelect"
        >
          <el-option
            v-for="template in templateStore.templates"
            :key="template.id"
            :label="template.name"
            :value="template.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="短信内容" prop="content">
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="4"
          placeholder="请输入短信内容"
        />
      </el-form-item>

      <template v-if="Object.keys(form.variables).length > 0">
        <el-form-item 
          v-for="(_, key) in form.variables"
          :key="key"
          :label="key"
        >
          <el-input
            v-model="form.variables[key]"
            :placeholder="`请输入${key}的值`"
          />
        </el-form-item>
      </template>

      <el-form-item label="预览">
        <div class="preview-content">
          {{ handlePreview() }}
        </div>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleSendSingle"
        >
          发送
        </el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 批量发送表单 -->
    <el-form
      v-else
      ref="batchFormRef"
      :model="batchForm"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="选择联系人">
        <div class="contact-selector">
          <div class="selected-contacts">
            <el-tag
              v-for="contact in selectedContacts"
              :key="contact.id"
              closable
              @close="selectedContacts = selectedContacts.filter(c => c.id !== contact.id)"
            >
              {{ contact.name }} ({{ contact.phone }})
            </el-tag>
          </div>
          <el-button @click="showContactSelector = true">
            选择联系人
          </el-button>
        </div>
      </el-form-item>

      <el-form-item label="短信模板">
        <el-select
          v-model="batchForm.templateId"
          placeholder="选择短信模板"
          clearable
          @change="handleTemplateSelect"
        >
          <el-option
            v-for="template in templateStore.templates"
            :key="template.id"
            :label="template.name"
            :value="template.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="短信内容" prop="content">
        <el-input
          v-model="batchForm.content"
          type="textarea"
          :rows="4"
          placeholder="请输入短信内容"
        />
      </el-form-item>

      <template v-if="Object.keys(batchForm.variables).length > 0">
        <el-form-item 
          v-for="(_, key) in batchForm.variables"
          :key="key"
          :label="key"
        >
          <el-input
            v-model="batchForm.variables[key]"
            :placeholder="`请输入${key}的值`"
          />
        </el-form-item>
      </template>

      <el-form-item label="预览">
        <div class="preview-content">
          {{ handlePreview() }}
        </div>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleSendBatch"
        >
          批量发送
        </el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 联系人选择器对话框 -->
    <el-dialog
      title="选择联系人"
      v-model="showContactSelector"
      width="800px"
    >
      <ContactSelector
        :selected="selectedContacts"
        :multiple="true"
        @confirm="handleSelectContacts"
        @cancel="showContactSelector = false"
      />
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.send-form {
  .phone-input {
    display: flex;
    gap: 10px;

    .country-code {
      width: 120px;
    }
  }

  .contact-selector {
    .selected-contacts {
      margin-bottom: 10px;
      min-height: 32px;

      .el-tag {
        margin-right: 8px;
        margin-bottom: 8px;
      }
    }
  }

  .preview-content {
    padding: 12px;
    background-color: #f5f7fa;
    border-radius: 4px;
    min-height: 60px;
    white-space: pre-wrap;
    word-break: break-all;
  }
}
</style>