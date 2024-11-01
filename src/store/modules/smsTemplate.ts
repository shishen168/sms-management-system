import { defineStore } from 'pinia'
import { smsTemplateApi } from '@/api/smsTemplate'
import type { SmsTemplate } from '@/types/api'

export const useSmsTemplateStore = defineStore('smsTemplate', {
  state: () => ({
    templates: [] as SmsTemplate[],
    total: 0,
    currentPage: 1,
    pageSize: 10,
    loading: false,
    error: null as string | null,
    currentTemplate: null as SmsTemplate | null
  }),

  actions: {
    async fetchTemplates(params: { page: number; pageSize: number; type?: string }) {
      try {
        this.loading = true
        const response = await smsTemplateApi.getList(params)
        this.templates = response.data.templates
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

    async createTemplate(data: Partial<SmsTemplate>) {
      try {
        this.loading = true
        const response = await smsTemplateApi.create(data)
        await this.fetchTemplates({ page: 1, pageSize: this.pageSize })
        return response.data
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateTemplate(id: number, data: Partial<SmsTemplate>) {
      try {
        this.loading = true
        const response = await smsTemplateApi.update(id, data)
        const index = this.templates.findIndex(t => t.id === id)
        if (index !== -1) {
          this.templates[index] = response.data
        }
        return response.data
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteTemplate(id: number) {
      try {
        this.loading = true
        await smsTemplateApi.delete(id)
        this.templates = this.templates.filter(t => t.id !== id)
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchTemplateById(id: number) {
      try {
        this.loading = true
        const response = await smsTemplateApi.getById(id)
        this.currentTemplate = response.data
        return response.data
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    clearCurrentTemplate() {
      this.currentTemplate = null
    }
  }
})