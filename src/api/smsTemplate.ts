import api from './index'
import type { SmsTemplate, ApiResponse } from '../types/api'

export const smsTemplateApi = {
  // 获取模板列表
  getList: (params: { page: number; pageSize: number; type?: string }) =>
    api.get<ApiResponse<{
      templates: SmsTemplate[];
      total: number;
    }>>('/sms/templates', { params }),

  // 创建模板
  create: (data: Partial<SmsTemplate>) =>
    api.post<ApiResponse<SmsTemplate>>('/sms/templates', data),

  // 更新模板
  update: (id: number, data: Partial<SmsTemplate>) =>
    api.put<ApiResponse<SmsTemplate>>(`/sms/templates/${id}`, data),

  // 删除模板
  delete: (id: number) =>
    api.delete<ApiResponse<void>>(`/sms/templates/${id}`),

  // 获取单个模板
  getById: (id: number) =>
    api.get<ApiResponse<SmsTemplate>>(`/sms/templates/${id}`)
}