<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  value: number
  prefix?: string
  suffix?: string
  precision?: number
  trend?: 'up' | 'down'
  icon?: string
  color?: 'default' | 'success' | 'warning' | 'danger'
}>()

const formattedValue = computed(() => {
  const num = props.precision !== undefined 
    ? props.value.toFixed(props.precision)
    : props.value.toString()
  return `${props.prefix || ''}${num}${props.suffix || ''}`
})

const cardClass = computed(() => ({
  'statistic-card': true,
  [`is-${props.color}`]: props.color && props.color !== 'default'
}))
</script>

<template>
  <el-card :class="cardClass">
    <div class="card-content">
      <div class="meta">
        <span class="title">{{ title }}</span>
        <el-icon v-if="icon" :size="20">
          <component :is="icon" />
        </el-icon>
      </div>
      <div class="value">
        {{ formattedValue }}
        <el-icon 
          v-if="trend"
          :class="['trend-icon', `is-${trend}`]"
        >
          <CaretTop v-if="trend === 'up'" />
          <CaretBottom v-if="trend === 'down'" />
        </el-icon>
      </div>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.statistic-card {
  .card-content {
    .meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .title {
        color: #909399;
        font-size: 14px;
      }

      .el-icon {
        color: #909399;
      }
    }

    .value {
      font-size: 24px;
      font-weight: bold;
      color: #303133;
      display: flex;
      align-items: center;
      gap: 8px;

      .trend-icon {
        font-size: 16px;

        &.is-up {
          color: #67c23a;
        }

        &.is-down {
          color: #f56c6c;
        }
      }
    }
  }

  &.is-success .value {
    color: #67c23a;
  }

  &.is-warning .value {
    color: #e6a23c;
  }

  &.is-danger .value {
    color: #f56c6c;
  }
}
</style>