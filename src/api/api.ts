import type { ApiResponse } from '../types/api'

// API 基础配置
export const API_BASE_URL = '/api'
export const API_TIMEOUT = 15000

// API 响应码
export const API_CODE = {
  SUCCESS: 0,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
}

// API 错误消息
export const API_MESSAGE = {
  NETWORK_ERROR: '网络错误，请检查网络连接',
  SERVER_ERROR: '服务器错误，请稍后重试',
  UNAUTHORIZED: '登录已过期，请重新登录',
  FORBIDDEN: '没有权限执行此操作',
  NOT_FOUND: '请求的资源不存在',
  VALIDATION_ERROR: '输入数据验证失败'
}

// API 请求路径
export const API_PATH = {
  // 认证相关
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password'
  },

  // 短信相关
  SMS: {
    SEND: '/sms/send',
    BATCH: '/sms/batch',
    RECORDS: '/sms/records',
    TEMPLATES: '/sms/templates',
    BALANCE: '/sms/balance',
    STATS: '/sms/stats'
  },

  // 联系人相关
  CONTACTS: {
    LIST: '/contacts',
    IMPORT: '/contacts/import',
    EXPORT: '/contacts/export',
    GROUPS: '/contact-groups',
    VALIDATE: '/contacts/validate'
  }
}

// API 响应类型
export interface ApiErrorResponse {
  code: number
  message: string
  errors?: string[]
}

// API 请求配置类型
export interface ApiRequestConfig {
  headers?: Record<string, string>
  params?: Record<string, any>
  timeout?: number
}

// API 错误处理
export class ApiError extends Error {
  code: number
  errors?: string[]

  constructor(message: string, code: number, errors?: string[]) {
    super(message)
    this.code = code
    this.errors = errors
    this.name = 'ApiError'
  }
}