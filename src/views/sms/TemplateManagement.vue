<script setup lang="ts">
import { ref } from 'vue'
import TemplateList from './components/TemplateList.vue'
import Statistics from './components/Statistics.vue'

const activeTab = ref('templates')
</script>

<template>
  <div class="template-container">
    <Statistics class="statistics-section" />

    <el-card class="template-section">
      <template #header>
        <div class="card-header">
          <h2>短信模板管理</h2>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="模板列表" name="templates">
          <TemplateList />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.template-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  .statistics-section,
  .template-section {
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