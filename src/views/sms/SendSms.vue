<script setup lang="ts">
import { ref } from 'vue'
import SendForm from './components/SendForm.vue'
import RecordList from './components/RecordList.vue'
import Statistics from './components/Statistics.vue'

const mode = ref<'single' | 'batch'>('single')
</script>

<template>
  <div class="sms-container">
    <Statistics class="statistics-section" />

    <el-card class="send-section">
      <template #header>
        <div class="card-header">
          <h2>发送短信</h2>
          <el-radio-group v-model="mode">
            <el-radio-button label="single">单条发送</el-radio-button>
            <el-radio-button label="batch">批量发送</el-radio-button>
          </el-radio-group>
        </div>
      </template>

      <SendForm
        :mode="mode"
        @success="() => {}"
      />
    </el-card>

    <el-card class="records-section">
      <template #header>
        <h2>发送记录</h2>
      </template>

      <RecordList />
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.sms-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  .statistics-section,
  .send-section,
  .records-section {
    margin: 0;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
      margin: 0;
    }
  }
}
</style>