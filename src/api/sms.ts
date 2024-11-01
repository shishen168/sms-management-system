import api from './index'
import type { SmsRequest, SmsBatchRequest, SmsRecord, ApiResponse } from '../types/api'

export const smsApi = {
  // 发送单条短信
  sendSingle: (data: SmsRequest) =>
    api.post<ApiResponse<{ messageId: string }>>('/sms/send', data),

  // 批量发送短信
  sendBatch: (data: SmsBatchRequest) =>
    api.post<ApiResponse<{ messageIds: string[] }>>('/sms/batch', data),

  // 获取发送记录
  getRecords: (params: { page: number; pageSize: number; status?: string }) =>
    api.get<ApiResponse<{
      records: SmsRecord[]
      total: number
    }>>('/sms/records', { params }),

  // 重新发送失败的短信
  resend: (messageId: string) =>
    api.post<ApiResponse<{ messageId: string }>>(`/sms/resend/${messageId}`),

  // 获取短信余额
  getBalance: () =>
    api.get<ApiResponse<{ balance: number; unit: string }>>('/sms/balance'),

  // 获取发送统计
  getStats: (timeRange: 'today' | 'week' | 'month') =>
    api.get<ApiResponse<{
      sent: number
      failed: number
      total: number
      cost: number
    }>>('/sms/stats', { params: { timeRange } })
}