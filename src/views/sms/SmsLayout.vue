<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeMenu = ref(router.currentRoute.value.name)
</script>

<template>
  <div class="sms-layout">
    <el-container>
      <el-aside width="200px">
        <el-menu
          :default-active="activeMenu"
          class="sms-menu"
          router
        >
          <el-menu-item index="SendSMS" :route="{ name: 'SendSMS' }">
            <el-icon><Message /></el-icon>
            <span>发送短信</span>
          </el-menu-item>
          <el-menu-item index="SMSRecords" :route="{ name: 'SMSRecords' }">
            <el-icon><Document /></el-icon>
            <span>发送记录</span>
          </el-menu-item>
          <el-menu-item index="SMSTemplates" :route="{ name: 'SMSTemplates' }">
            <el-icon><Files /></el-icon>
            <span>模板管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.sms-layout {
  height: calc(100vh - 60px);
  
  .el-container {
    height: 100%;
  }
  
  .el-aside {
    background-color: #f5f7fa;
    border-right: 1px solid #e6e6e6;
  }
  
  .sms-menu {
    height: 100%;
    border-right: none;
  }
  
  .el-main {
    padding: 0;
    background-color: #fff;
  }
}
</style>