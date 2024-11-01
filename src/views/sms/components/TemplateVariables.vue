<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  content: string
}>()

const emit = defineEmits<{
  (e: 'update:content', value: string): void
}>()

// 系统预定义变量
const systemVariables = [
  { name: 'code', description: '验证码' },
  { name: 'expireMinutes', description: '有效期（分钟）' },
  { name: 'company', description: '公司名称' },
  { name: 'date', description: '当前日期' },
  { name: 'time', description: '当前时间' }
]

// 自定义变量
const customVariables = ref<string[]>([])
const newVariable = ref('')

const insertVariable = (variable: string) => {
  const content = props.content
  const cursorPosition = document.activeElement instanceof HTMLTextAreaElement 
    ? document.activeElement.selectionStart 
    : content.length
  
  const newContent = content.slice(0, cursorPosition) + 
    `\${${variable}}` + 
    content.slice(cursorPosition)
  
  emit('update:content', newContent)
}

const addCustomVariable = () => {
  if (!newVariable.value) return
  
  if (customVariables.value.includes(newVariable.value)) {
    ElMessage.warning('变量名已存在')
    return
  }
  
  if (systemVariables.some(v => v.name === newVariable.value)) {
    ElMessage.warning('不能使用系统变量名')
    return
  }
  
  customVariables.value.push(newVariable.value)
  newVariable.value = ''
}

const removeCustomVariable = (variable: string) => {
  const index = customVariables.value.indexOf(variable)
  if (index > -1) {
    customVariables.value.splice(index, 1)
  }
}
</script>

<template>
  <div class="template-variables">
    <div class="variables-section">
      <h4>系统变量</h4>
      <el-scrollbar height="120px">
        <div class="variables-list">
          <el-tooltip
            v-for="variable in systemVariables"
            :key="variable.name"
            :content="variable.description"
            placement="top"
          >
            <el-tag
              class="variable-tag"
              @click="insertVariable(variable.name)"
            >
              {{ variable.name }}
            </el-tag>
          </el-tooltip>
        </div>
      </el-scrollbar>
    </div>

    <div class="variables-section">
      <h4>自定义变量</h4>
      <div class="custom-variable-input">
        <el-input
          v-model="newVariable"
          placeholder="输入变量名"
          @keyup.enter="addCustomVariable"
        >
          <template #append>
            <el-button @click="addCustomVariable">
              添加
            </el-button>
          </template>
        </el-input>
      </div>
      
      <el-scrollbar height="120px">
        <div class="variables-list">
          <el-tag
            v-for="variable in customVariables"
            :key="variable"
            closable
            class="variable-tag"
            @click="insertVariable(variable)"
            @close.stop="removeCustomVariable(variable)"
          >
            {{ variable }}
          </el-tag>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.template-variables {
  margin-top: 8px;

  .variables-section {
    margin-bottom: 16px;

    h4 {
      margin: 0 0 8px;
      font-size: 14px;
      color: #606266;
    }

    .custom-variable-input {
      margin-bottom: 8px;
    }

    .variables-list {
      padding: 8px;
      
      .variable-tag {
        margin: 0 8px 8px 0;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          transform: translateY(-1px);
        }
      }
    }
  }
}
</style>