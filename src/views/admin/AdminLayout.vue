<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'

const router = useRouter()
const authStore = useAuthStore()
const isCollapse = ref(false)

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <el-container class="admin-layout">
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <el-menu
        :collapse="isCollapse"
        :router="true"
        class="admin-menu"
      >
        <div class="menu-header">
          <el-icon 
            class="collapse-icon"
            @click="isCollapse = !isCollapse"
          >
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
        </div>

        <el-menu-item index="/admin">
          <el-icon><DataBoard /></el-icon>
          <template #title>控制台</template>
        </el-menu-item>

        <el-menu-item index="/admin/users">
          <el-icon><User /></el-icon>
          <template #title>用户管理</template>
        </el-menu-item>

        <el-menu-item index="/admin/sms">
          <el-icon><Message /></el-icon>
          <template #title>短信管理</template>
        </el-menu-item>

        <el-menu-item index="/admin/settings">
          <el-icon><Setting /></el-icon>
          <template #title>系统设置</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="admin-header">
        <div class="header-left">
          <h2>后台管理系统</h2>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleLogout">
            <span class="user-info">
              {{ authStore.currentUser?.username }}
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="admin-main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.admin-layout {
  min-height: 100vh;

  .admin-menu {
    height: 100vh;
    border-right: none;

    .menu-header {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid #e6e6e6;

      .collapse-icon {
        font-size: 20px;
        cursor: pointer;
        color: #909399;

        &:hover {
          color: #409EFF;
        }
      }
    }
  }

  .admin-header {
    background-color: #fff;
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;

    .header-left {
      h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }
    }

    .header-right {
      .user-info {
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
  }

  .admin-main {
    background-color: #f5f7fa;
    padding: 20px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>