<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useSmsTemplateStore } from '@/store/modules/smsTemplate'
import TemplateVariables from './TemplateVariables.vue'
import TemplatePreview from './TemplatePreview.vue'
import type { SmsTemplate } from '@/types/api'

const props = defineProps<{
  template: Partial<SmsTemplate> | null
}>()

const emit = defineEmits<{
  (e: 'success'): void
  (e: 'cancel'): void
}>()

const templateStore = useSmsTemplateStore()
const loading = ref(false)

const form = ref({
  name: props.template?.name || '',
  content: props.template?.content || '',
  type: props.template?.type || 'verification',
  variables: {} as Record<string, string>
})

const rules = {
  name: [
    { required: true, message: '请输入模板名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入模板内容', trigger: 'blur' },
    { min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择模板类型', trigger: 'change' }
  ]
}

const isEdit = computed(() => !!props.template?.id)

const handleSubmit = async () => {
  try {
    loading.value = true
    if (isEdit.value) {
      await templateStore.updateTemplate(props.template!.id!, {
        ...form.value,
        variables: Object.keys(form.value.variables)
      })
      ElMessage.success('更新成功')
    } else {
      await templateStore.createTemplate({
        ...form.value,
        variables: Object.keys(form.value.variables)
      })
      ElMessage.success('创建成功')
    }
    emit('success')
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  } finally {
    loading.value = false
  }
}

const handleContentChange = (content: string) => {
  form.value.content = content
}

const handleVariablesChange = (variables: Record<string, string>) => {
  form.value.variables = variables
}
</script>

<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    label-width="100px"
    @submit.prevent="handleSubmit"
  >
    <el-form-item label="模板名称" prop="name">
      <el-input v-model="form.name" />
    </el-form-item>

    <el-form-item label="模板类型" prop="type">
      <el-select v-model="form.type">
        <el-option label="验证码" value="verification" />
        <el-option label="通知" value="notification" />
        <el-option label="营销" value="marketing" />
      </el-select>
    </el-form-item>

    <el-form-item label="模板内容" prop="content">
      <el-input
        v-model="form.content"
        type="textarea"
        :rows="4"
        placeholder="点击下方变量插入到内容中"
      />
      <TemplateVariables
        :content="form.content"
        @update:content="handleContentChange"
      />
    </el-form-item>

    <el-form-item label="预览效果">
      <TemplatePreview
        :content="form.content"
        :variables="form.variables"
        @update:variables="handleVariablesChange"
      />
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        native-type="submit"
        :loading="loading"
      >
        {{ isEdit ? '保存' : '创建' }}
      </el-button>
      <el-button @click="emit('cancel')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>
.el-form {
  max-width: 800px;
}
</style>