<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  total: number
  current: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
}>()

const progress = ref(0)
const timer = ref<number>()

const updateProgress = () => {
  if (props.status === 'processing') {
    progress.value = Math.round((props.current / props.total) * 100)
  } else if (props.status === 'completed') {
    progress.value = 100
  }
}

onMounted(() => {
  timer.value = window.setInterval(updateProgress, 1000)
})

onBeforeUnmount(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})

const statusInfo = computed(() => {
  switch (props.status) {
    case 'pending':
      return { text: '准备发送...', type: 'info' }
    case 'processing':
      return { text: '发送中...', type: 'warning' }
    case 'completed':
      return { text: '发送完成', type: 'success' }
    case 'failed':
      return { text: '发送失败', type: 'danger' }
    default:
      return { text: '未知状态', type: 'info' }
  }
})
</script>

<template>
  <div class="send-progress">
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
      <span class="count">
        {{ current }}/{{ total }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.send-progress {
  margin: 20px 0;

  .progress-info {
    margin-top: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .count {
      font-size: 14px;
      color: #606266;
    }
  }
}
</style>