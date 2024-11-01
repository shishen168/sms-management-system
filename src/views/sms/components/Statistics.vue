<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSmsStore } from '@/store/modules/sms'

const smsStore = useSmsStore()
const timeRange = ref<'today' | 'week' | 'month'>('today')

const fetchStats = async () => {
  await smsStore.fetchStats(timeRange.value)
}

onMounted(() => {
  fetchStats()
})
</script>

<template>
  <div class="statistics">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>发送统计</span>
          <el-radio-group v-model="timeRange" @change="fetchStats">
            <el-radio-button label="today">今日</el-radio-button>
            <el-radio-button label="week">本周</el-radio-button>
            <el-radio-button label="month">本月</el-radio-button>
          </el-radio-group>
        </div>
      </template>

      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-item">
            <div class="label">发送总量</div>
            <div class="value">{{ smsStore.stats.total }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-item">
            <div class="label">发送成功</div>
            <div class="value success">{{ smsStore.stats.sent }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-item">
            <div class="label">发送失败</div>
            <div class="value error">{{ smsStore.stats.failed }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-item">
            <div class="label">成功率</div>
            <div class="value">{{ smsStore.successRate }}%</div>
          </div>
        </el-col>
      </el-row>

      <el-divider />

      <div class="balance-info">
        <span class="label">当前余额:</span>
        <span class="balance">{{ smsStore.balance }}</span>
        <span class="unit">{{ smsStore.unit }}</span>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.statistics {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .stat-item {
    text-align: center;
    padding: 20px 0;

    .label {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
    }

    .value {
      font-size: 24px;
      font-weight: bold;
      color: #333;

      &.success {
        color: #67c23a;
      }

      &.error {
        color: #f56c6c;
      }
    }
  }

  .balance-info {
    text-align: center;
    
    .label {
      font-size: 14px;
      color: #666;
    }

    .balance {
      font-size: 24px;
      font-weight: bold;
      color: #409eff;
      margin: 0 8px;
    }

    .unit {
      font-size: 14px;
      color: #666;
    }
  }
}
</style>