<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  total: number
  current: number
  failed: number
  status: 'validating' | 'importing' | 'completed' | 'failed'
}>()

const progress = computed(() => {
  if (props.total === 0) return 0
  return Math.round((props.current / props.total) * 100)
})

const statusInfo = computed(() => {
  switch (props.status) {
    case 'validating':
      return { text: '验证中...', type: 'info' }
    case 'importing':
      return { text: '导入中...', type: 'warning' }
    case 'completed':
      return { text: '导入完成', type: 'success' }
    case 'failed':
      return { text: '导入失败', type: 'danger' }
    default:
      return { text: '未知状态', type: 'info' }
  }
})
</script>

<template>
  <div class="import-progress">
    <el-progress
      :percentage="progress"
      :status="statusInfo.type"
      :stroke-width="10"
      :show-text="false"
    />
    <div class="progress-info">
      <el-tag :type="statusInfo.type" size="small">
        {{ statusInfo.text }}
      </el-tag>
      <div class="stats">
        <span>总数: {{ total }}</span>
        <span>已处理: {{ current }}</span>
        <span v-if="failed > 0" class="error">
          失败: {{ failed }}
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.import-progress {
  margin: 20px 0;

  .progress-info {
    margin-top: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .stats {
      display: flex;
      gap: 16px;
      font-size: 14px;
      color: #606266;

      .error {
        color: #f56c6c;
      }
    }
  }
}
</style>