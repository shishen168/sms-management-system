import { defineStore } from 'pinia'
import { smsApi } from '@/api/sms'
import type { SmsRequest, SmsBatchRequest, SmsRecord } from '@/types/api'

export const useSmsStore = defineStore('sms', {
  state: () => ({
    records: [] as SmsRecord[],
    total: 0,
    currentPage: 1,
    pageSize: 10,
    loading: false,
    error: null as string | null,
    balance: 0,
    unit: '',
    stats: {
      sent: 0,
      failed: 0,
      total: 0,
      cost: 0
    }
  }),

  getters: {
    successRate: (state) => {
      if (state.stats.total === 0) return 0
      return ((state.stats.sent / state.stats.total) * 100).toFixed(2)
    }
  },

  actions: {
    async sendSingle(data: SmsRequest) {
      try {
        this.loading = true
        const response = await smsApi.sendSingle(data)
        await this.fetchRecords({ page: 1, pageSize: this.pageSize })
        await this.fetchBalance()
        return response.data
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async sendBatch(data: SmsBatchRequest) {
      try {
        this.loading = true
        const response = await smsApi.sendBatch(data)
        await this.fetchRecords({ page: 1, pageSize: this.pageSize })
        await this.fetchBalance()
        return response.data
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchRecords(params: { page: number; pageSize: number; status?: string }) {
      try {
        this.loading = true
        const response = await smsApi.getRecords(params)
        this.records = response.data.records
        this.total = response.data.total
        this.currentPage = params.page
        this.pageSize = params.pageSize
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async resend(messageId: string) {
      try {
        this.loading = true
        const response = await smsApi.resend(messageId)
        await this.fetchRecords({ page: this.currentPage, pageSize: this.pageSize })
        return response.data
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchBalance() {
      try {
        const response = await smsApi.getBalance()
        this.balance = response.data.balance
        this.unit = response.data.unit
      } catch (error: any) {
        this.error = error.message
        throw error
      }
    },

    async fetchStats(timeRange: 'today' | 'week' | 'month') {
      try {
        const response = await smsApi.getStats(timeRange)
        this.stats = response.data
      } catch (error: any) {
        this.error = error.message
        throw error
      }
    }
  }
})