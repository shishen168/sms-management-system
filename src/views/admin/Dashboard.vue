<script setup lang="ts">
import { ref, onMounted } from 'vue'
import StatisticCard from '@/components/StatisticCard.vue'
import TrendChart from '@/components/TrendChart.vue'

const stats = ref({
  userCount: 0,
  smsCount: 0,
  revenue: 0,
  successRate: 0
})

const timeRange = ref<'today' | 'week' | 'month'>('today')

onMounted(async () => {
  // TODO: 获取统计数据
})
</script>

<template>
  <div class="admin-dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <StatisticCard
          title="用户总数"
          :value="stats.userCount"
          icon="User"
        />
      </el-col>
      <el-col :span="6">
        <StatisticCard
          title="短信发送量"
          :value="stats.smsCount"
          icon="Message"
        />
      </el-col>
      <el-col :span="6">
        <StatisticCard
          title="营收金额"
          :value="stats.revenue"
          prefix="￥"
          :precision="2"
          icon="Money"
        />
      </el-col>
      <el-col :span="6">
        <StatisticCard
          title="发送成功率"
          :value="stats.successRate"
          suffix="%"
          :precision="2"
          icon="DataLine"
        />
      </el-col>
    </el-row>

    <el-card class="chart-card">
      <template #header>
        <div class="card-header">
          <span>发送趋势</span>
          <el-radio-group v-model="timeRange">
            <el-radio-button label="today">今日</el-radio-button>
            <el-radio-button label="week">本周</el-radio-button>
            <el-radio-button label="month">本月</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <TrendChart :data="stats" :time-range="timeRange" />
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.admin-dashboard {
  .el-row {
    margin-bottom: 20px;
  }

  .chart-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>