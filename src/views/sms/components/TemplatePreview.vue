<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  content: string
  variables: Record<string, string>
}>()

const emit = defineEmits<{
  (e: 'update:content', value: string): void
  (e: 'update:variables', value: Record<string, string>): void
}>()

const previewContent = computed(() => {
  let result = props.content
  Object.entries(props.variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\$\\{${key}\\}`, 'g')
    result = result.replace(regex, value || `[${key}]`)
  })
  return result
})

const validateVariables = () => {
  const missingVariables = Object.entries(props.variables)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missingVariables.length > 0) {
    ElMessage.warning(`以下变量未设置值：${missingVariables.join(', ')}`)
    return false
  }
  return true
}

const extractVariables = (content: string) => {
  const matches = Array.from(content.matchAll(/\$\{(\w+)\}/g))
  const variables: Record<string, string> = {}
  matches.forEach(match => {
    if (!props.variables[match[1]]) {
      variables[match[1]] = ''
    }
  })
  return variables
}

watch(() => props.content, (newContent) => {
  const newVariables = extractVariables(newContent)
  if (Object.keys(newVariables).length > 0) {
    emit('update:variables', { ...props.variables, ...newVariables })
  }
})
</script>

<template>
  <div class="template-preview">
    <div class="preview-header">
      <h4>模板预览</h4>
      <el-tooltip content="预览显示变量替换后的效果">
        <el-icon><InfoFilled /></el-icon>
      </el-tooltip>
    </div>

    <div class="preview-content">
      <el-input
        v-model="previewContent"
        type="textarea"
        :rows="4"
        readonly
        :placeholder="content ? '预览内容将显示在这里' : '请先输入模板内容'"
      />
    </div>

    <div v-if="Object.keys(variables).length > 0" class="variables-editor">
      <h4>变量值设置</h4>
      <el-form label-position="top">
        <el-form-item
          v-for="(value, key) in variables"
          :key="key"
          :label="key"
        >
          <el-input
            v-model="variables[key]"
            :placeholder="`请输入${key}的值`"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.template-preview {
  margin-top: 20px;

  .preview-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;

    h4 {
      margin: 0;
      font-size: 14px;
      color: #606266;
    }

    .el-icon {
      color: #909399;
      cursor: help;
    }
  }

  .preview-content {
    margin-bottom: 20px;
  }

  .variables-editor {
    h4 {
      margin: 0 0 10px;
      font-size: 14px;
      color: #606266;
    }

    .el-form {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }
  }
}
</style>