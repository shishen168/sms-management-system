import api from './index'
import type { ApiResponse } from '../types/api'

export const paymentApi = {
  // 获取充值套餐列表
  getPackages: () =>
    api.get<ApiResponse<{
      packages: PaymentPackage[]
    }>>('/payment/packages'),

  // 创建充值订单
  createOrder: (data: {
    packageId?: number
    amount: number
    paymentMethod: 'usdt' | 'alipay' | 'wechat'
  }) =>
    api.post<ApiResponse<{
      orderId: string
      paymentUrl: string
      qrcode?: string
    }>>('/payment/orders', data),

  // 查询订单状态
  getOrderStatus: (orderId: string) =>
    api.get<ApiResponse<{
      status: 'pending' | 'processing' | 'completed' | 'failed'
      message?: string
    }>>(`/payment/orders/${orderId}/status`),

  // 获取交易记录
  getTransactions: (params: {
    page: number
    pageSize: number
    type?: 'recharge' | 'consume'
    startDate?: string
    endDate?: string
  }) =>
    api.get<ApiResponse<{
      transactions: Transaction[]
      total: number
    }>>('/payment/transactions', { params }),

  // 获取账户余额
  getBalance: () =>
    api.get<ApiResponse<{
      balance: number
      frozen: number
      currency: string
    }>>('/payment/balance')
}

export interface PaymentPackage {
  id: number
  name: string
  amount: number
  originalPrice: number
  price: number
  description: string
  features: string[]
  popular?: boolean
  validDays: number
}

export interface Transaction {
  id: string
  type: 'recharge' | 'consume'
  amount: number
  balance: number
  status: 'pending' | 'completed' | 'failed'
  description: string
  createdAt: string
  orderId?: string
  packageId?: number
}