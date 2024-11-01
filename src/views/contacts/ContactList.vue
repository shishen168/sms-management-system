<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useContactStore } from '@/store/modules/contact'
import ContactToolbar from './components/ContactToolbar.vue'
import GroupManagement from './components/GroupManagement.vue'
import ContactTable from './components/ContactTable.vue'

const contactStore = useContactStore()

onMounted(() => {
  contactStore.fetchContacts()
})
</script>

<template>
  <div class="contact-container">
    <el-container>
      <el-aside width="250px">
        <GroupManagement />
      </el-aside>
      
      <el-main>
        <el-card>
          <ContactToolbar />
          <ContactTable />
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.contact-container {
  height: calc(100vh - 60px);
  
  .el-container {
    height: 100%;
  }
  
  .el-aside {
    background-color: #fff;
    border-right: 1px solid #e6e6e6;
  }
  
  .el-main {
    padding: 20px;
    background-color: #f5f7fa;
  }
}
</style>