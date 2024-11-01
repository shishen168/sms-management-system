import { defineStore } from 'pinia'
import { adminApi } from '@/api/admin'
import type { User } from '@/types/api'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    stats: {
      userCount: 0,
      smsCount: 0,
      revenue: 0,
      successRate: 0,
      dailyStats: [],
      weeklyStats: [],
      monthlyStats: []
    },
    users: [] as User[],
    total: 0,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchStats(timeRange: 'today' | 'week' | 'month') {
      try {
        this.loading = true
        const response = await adminApi.getStats(timeRange)
        this.stats = response.data
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchUsers(params: {
      page: number
      pageSize: number
      search?: string
      status?: string
    }) {
      try {
        this.loading = true
        const response = await adminApi.getUsers(params)
        this.users = response.data.users
        this.total = response.data.total
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateUserStatus(userId: number, status: boolean) {
      try {
        this.loading = true
        await adminApi.updateUserStatus(userId, status)
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchSystemSettings() {
      try {
        this.loading = true
        const response = await adminApi.getSystemSettings()
        return response.data
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateSystemSettings(settings: any) {
      try {
        this.loading = true
        const response = await adminApi.updateSystemSettings(settings)
        return response.data
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})