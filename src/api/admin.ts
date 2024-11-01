import api from './index'
import type { ApiResponse } from '../types/api'

export const adminApi = {
  // 获取统计数据
  getStats: (timeRange: 'today' | 'week' | 'month') =>
    api.get<ApiResponse<{
      userCount: number
      smsCount: number
      revenue: number
      successRate: number
      dailyStats: any[]
      weeklyStats: any[]
      monthlyStats: any[]
    }>>('/admin/stats', { params: { timeRange } }),

  // 获取系统设置
  getSystemSettings: () =>
    api.get<ApiResponse<{
      siteTitle: string
      siteDescription: string
      maintenance: boolean
      maintenanceMessage: string
      smsPricing: {
        base: number
        bulk: number
      }
    }>>('/admin/settings'),

  // 更新系统设置
  updateSystemSettings: (settings: any) =>
    api.put<ApiResponse<void>>('/admin/settings', settings),

  // 获取用户列表
  getUsers: (params: {
    page: number
    pageSize: number
    search?: string
    status?: string
  }) =>
    api.get<ApiResponse<{
      users: any[]
      total: number
    }>>('/admin/users', { params }),

  // 更新用户状态
  updateUserStatus: (userId: number, status: boolean) =>
    api.patch<ApiResponse<void>>(`/admin/users/${userId}/status`, { status }),

  // 获取短信统计
  getSmsStats: (params: {
    startDate: string
    endDate: string
    type?: string
  }) =>
    api.get<ApiResponse<{
      total: number
      success: number
      failed: number
      revenue: number
      stats: any[]
    }>>('/admin/sms/stats', { params })
}