import { defineStore } from 'pinia'
import { paymentApi, type PaymentPackage, type Transaction } from '@/api/payment'

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    balance: 0,
    frozen: 0,
    currency: 'CNY',
    packages: [] as PaymentPackage[],
    transactions: [] as Transaction[],
    total: 0,
    currentPage: 1,
    pageSize: 10,
    loading: false,
    error: null as string | null,
    currentOrder: null as {
      orderId: string
      paymentUrl: string
      qrcode?: string
    } | null
  }),

  actions: {
    async fetchPackages() {
      try {
        this.loading = true
        const response = await paymentApi.getPackages()
        this.packages = response.packages
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createOrder(data: {
      packageId?: number
      amount: number
      paymentMethod: 'usdt' | 'alipay' | 'wechat'
    }) {
      try {
        this.loading = true
        const response = await paymentApi.createOrder(data)
        this.currentOrder = response
        return response
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async checkOrderStatus(orderId: string) {
      try {
        const response = await paymentApi.getOrderStatus(orderId)
        if (response.status === 'completed') {
          await this.fetchBalance()
          this.currentOrder = null
        }
        return response
      } catch (error: any) {
        this.error = error.message
        throw error
      }
    },

    async fetchTransactions(params: {
      page: number
      pageSize: number
      type?: 'recharge' | 'consume'
      startDate?: string
      endDate?: string
    }) {
      try {
        this.loading = true
        const response = await paymentApi.getTransactions(params)
        this.transactions = response.transactions
        this.total = response.total
        this.currentPage = params.page
        this.pageSize = params.pageSize
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchBalance() {
      try {
        const response = await paymentApi.getBalance()
        this.balance = response.balance
        this.frozen = response.frozen
        this.currency = response.currency
      } catch (error: any) {
        this.error = error.message
        throw error
      }
    }
  }
})